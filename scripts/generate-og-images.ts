import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface FrontMatter {
  title: string;
  description: string;
  date?: string;
  draft?: boolean;
  tags?: string[];
  categories?: string[];
}

interface Cache {
  [key: string]: string;
}

// Función para generar hash
function generateHash(title: string, description: string): string {
  const content = `${title}${description}`;
  return crypto.createHash('md5').update(content).digest('hex');
}

// Función para cargar el caché
function loadCache(): Cache {
  try {
    const cachePath = path.join(__dirname, '.og-cache.json');
    if (fs.existsSync(cachePath)) {
      return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    }
  } catch (error) {
    console.error('Error al cargar el caché:', error);
  }
  return {};
}

// Función para guardar el caché
function saveCache(cache: Cache): void {
  try {
    const cachePath = path.join(__dirname, '.og-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error al guardar el caché:', error);
  }
}

// Función para extraer el frontmatter
function extractFrontMatter(content: string): FrontMatter | null {
  const tomlMatch = content.match(/^\+\+\+([\s\S]*?)\+\+\+/);
  const yamlMatch = content.match(/^---([\s\S]*?)---/);

  if (tomlMatch) {
    const frontMatter: FrontMatter = {
      title: '',
      description: ''
    };
    const lines = tomlMatch[1].split('\n');
    
    for (const line of lines) {
      if (line.trim() === '' || line.startsWith('#')) continue;
      
      const equalIndex = line.indexOf('=');
      if (equalIndex === -1) continue;
      
      const key = line.slice(0, equalIndex).trim();
      let value = line.slice(equalIndex + 1).trim();
      
      // Manejar valores entre comillas
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      if (key in frontMatter) {
        (frontMatter as any)[key] = value;
      }
    }
    return frontMatter;
  }

  if (yamlMatch) {
    const frontMatter: FrontMatter = {
      title: '',
      description: ''
    };
    const lines = yamlMatch[1].split('\n');
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Manejar valores entre comillas
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      if (key in frontMatter) {
        (frontMatter as any)[key] = value;
      }
    }
    return frontMatter;
  }

  return null;
}

// Función para generar imagen OG con reintentos
async function generateOGImage(title: string, description: string, outputPath: string): Promise<boolean> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=2400,1260',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        timeout: 30000,
        ignoreHTTPSErrors: true
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 2400, height: 1260 });

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                margin: 0;
                padding: 120px;
                width: 2400px;
                height: 1260px;
                background: #000000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                box-sizing: border-box;
                color: white;
              }
              .container {
                max-width: 2200px;
              }
              h1 {
                font-size: 140px;
                line-height: 1.1;
                margin: 0 0 60px;
                font-weight: 800;
                letter-spacing: -0.02em;
                color: #ffffff;
                text-align: left;
                max-width: 2100px;
              }
              p {
                font-size: 84px;
                line-height: 1.25;
                margin: 0;
                font-weight: 400;
                letter-spacing: -0.01em;
                color: #ffffff;
                max-width: 2100px;
                opacity: 1;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${title}</h1>
              <p>${description}</p>
            </div>
          </body>
        </html>
      `;

      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.screenshot({ path: outputPath, type: 'png' });
      return true;
    } catch (error) {
      retryCount++;
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      console.error(`❌ Error en intento ${retryCount}:`, errorMessage);
      if (retryCount < maxRetries) {
        console.log(`⚠️ Intento ${retryCount} fallido, reintentando en ${retryCount} segundos...`);
        await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
      } else {
        console.error(`❌ Error generando imagen después de ${maxRetries} intentos para: ${outputPath}`);
        return false;
      }
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (error) {
          console.error('Error al cerrar el navegador:', error instanceof Error ? error.message : String(error));
        }
      }
    }
  }
  return false;
}

async function main(): Promise<void> {
  const postsDir = path.join(__dirname, '../content/posts');
  const outputDir = path.join(__dirname, '../static/images/og');
  const cache = loadCache();

  // Asegurar que el directorio de salida existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(postsDir);
  let hasChanges = false;

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const frontMatter = extractFrontMatter(content);

    if (!frontMatter || !frontMatter.title || !frontMatter.description) {
      console.log(`⚠️ Saltando ${file}: Falta título o descripción`);
      continue;
    }

    const slug = file.replace('.md', '');
    const currentHash = generateHash(frontMatter.title, frontMatter.description);
    const outputPath = path.join(outputDir, `${slug}.png`);

    // Forzar regeneración de imágenes
    console.log(`🔄 Generando OG image para: ${frontMatter.title}`);
    const success = await generateOGImage(frontMatter.title, frontMatter.description, outputPath);
    if (success) {
      cache[slug] = currentHash;
      hasChanges = true;
    }
  }

  if (hasChanges) {
    saveCache(cache);
    console.log('✅ Caché actualizado con nuevos cambios');
  } else {
    console.log('ℹ️ No se detectaron cambios');
  }
}

main().catch(error => {
  console.error('Error en el programa principal:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 