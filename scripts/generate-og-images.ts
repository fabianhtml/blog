import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import puppeteer, { Browser, Page } from 'puppeteer';
import { fileURLToPath } from 'url';
import os from 'os';

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

interface PostToProcess {
  slug: string;
  title: string;
  description: string;
  outputPath: string;
  filePath: string;
  content: string;
  hash: string;
}

// Configuración
const PARALLEL_LIMIT = 5; // Número de imágenes a generar en paralelo

// Función para generar hash
function generateHash(title: string, description: string): string {
  const content = `${title}${description}`;
  return crypto.createHash('md5').update(content).digest('hex');
}

// Función para cargar el caché
function loadCache(): Cache {
  try {
    const projectRoot = path.dirname(__dirname);
    const cachePath = path.join(projectRoot, '.og-cache.json');
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
    const projectRoot = path.dirname(__dirname);
    const cachePath = path.join(projectRoot, '.og-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error al guardar el caché:', error);
  }
}

// Función para detectar Chrome/Chromium (solo se llama una vez)
function findChrome(): string | undefined {
  const platform = os.platform();
  
  const possiblePaths = {
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
    ],
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
    ]
  };
  
  const paths = possiblePaths[platform as keyof typeof possiblePaths] || [];
  
  for (const chromePath of paths) {
    if (chromePath && fs.existsSync(chromePath)) {
      return chromePath;
    }
  }
  
  return undefined;
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

// Genera el HTML para la imagen OG
function generateHTML(title: string, description: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 120px;
            width: 2400px;
            height: 1260px;
            background: #000000;
            font-family: 'Atkinson Hyperlegible', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
}

// Genera una imagen OG usando una página existente del navegador
async function generateOGImage(page: Page, post: PostToProcess): Promise<boolean> {
  try {
    const html = generateHTML(post.title, post.description);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({ 
      path: post.outputPath, 
      type: 'png',
      omitBackground: true
    });
    return true;
  } catch (error) {
    console.error(`❌ Error generando imagen para ${post.slug}:`, error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Procesa un batch de posts en paralelo
async function processBatch(browser: Browser, posts: PostToProcess[], cache: Cache): Promise<number> {
  const results = await Promise.all(
    posts.map(async (post) => {
      const page = await browser.newPage();
      await page.setViewport({ width: 2400, height: 1260 });
      
      try {
        const success = await generateOGImage(page, post);
        if (success) {
          cache[post.slug] = post.hash;
          
          // Actualizar frontmatter si no tiene cover.image
          if (!post.content.includes('[cover]') && !post.content.includes('cover.image')) {
            const updatedContent = post.content.replace(/(\+\+\+[\s\S]*?)(\+\+\+)/, (match, frontmatter, closing) => {
              return frontmatter.trimEnd() + '\n[cover]\nimage = "/images/og/' + post.slug + '.png"\nhidden = true\n' + closing;
            });
            fs.writeFileSync(post.filePath, updatedContent);
          }
          return 1;
        }
        return 0;
      } finally {
        await page.close();
      }
    })
  );
  
  return results.reduce((sum: number, val: number) => sum + val, 0);
}

async function main(): Promise<void> {
  const startTime = Date.now();
  const postsDir = path.join(__dirname, '../content/posts');
  const outputDir = path.join(__dirname, '../static/images/og');
  const cache = loadCache();

  // Asegurar que el directorio de salida existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Fase 1: Recopilar todos los posts que necesitan procesarse
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const postsToProcess: PostToProcess[] = [];
  let skippedCount = 0;
  let unchangedCount = 0;

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const frontMatter = extractFrontMatter(content);

    if (!frontMatter || !frontMatter.title || !frontMatter.description) {
      skippedCount++;
      continue;
    }

    const slug = file.replace('.md', '');
    const currentHash = generateHash(frontMatter.title, frontMatter.description);
    const outputPath = path.join(outputDir, `${slug}.png`);
    
    const isNew = !cache[slug];
    const hasChanged = cache[slug] !== currentHash;
    const outputFileExists = fs.existsSync(outputPath);
    
    if (isNew || hasChanged || !outputFileExists) {
      postsToProcess.push({
        slug,
        title: frontMatter.title,
        description: frontMatter.description,
        outputPath,
        filePath,
        content,
        hash: currentHash
      });
    } else {
      unchangedCount++;
    }
  }

  // Resumen rápido
  console.log(`📊 ${files.length} posts | ${postsToProcess.length} a generar | ${unchangedCount} sin cambios | ${skippedCount} sin metadata`);

  if (postsToProcess.length === 0) {
    console.log('✅ No hay imágenes que generar');
    return;
  }

  // Fase 2: Iniciar navegador y procesar en batches
  const chromePath = findChrome();
  console.log(`🚀 Iniciando generación de ${postsToProcess.length} imágenes...`);
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
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

  try {
    let generatedCount = 0;
    
    // Procesar en batches
    for (let i = 0; i < postsToProcess.length; i += PARALLEL_LIMIT) {
      const batch = postsToProcess.slice(i, i + PARALLEL_LIMIT);
      const batchNum = Math.floor(i / PARALLEL_LIMIT) + 1;
      const totalBatches = Math.ceil(postsToProcess.length / PARALLEL_LIMIT);
      
      process.stdout.write(`\r⏳ Batch ${batchNum}/${totalBatches}...`);
      
      const count = await processBatch(browser, batch, cache);
      generatedCount += count;
    }
    
    console.log(`\n✅ ${generatedCount} imágenes generadas en ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    
    if (generatedCount > 0) {
      saveCache(cache);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error('Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
