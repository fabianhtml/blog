import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
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
const WIDTH = 1200;
const HEIGHT = 630;

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

// Cargar fuentes locales (Atkinson Hyperlegible)
function loadFonts(): { regular: ArrayBuffer; bold: ArrayBuffer } {
  const regularPath = path.join(__dirname, 'fonts', 'AtkinsonHyperlegible-Regular.ttf');
  const boldPath = path.join(__dirname, 'fonts', 'AtkinsonHyperlegible-Bold.ttf');
  
  const regularBuffer = fs.readFileSync(regularPath);
  const boldBuffer = fs.readFileSync(boldPath);
  
  return {
    regular: regularBuffer.buffer.slice(regularBuffer.byteOffset, regularBuffer.byteOffset + regularBuffer.byteLength),
    bold: boldBuffer.buffer.slice(boldBuffer.byteOffset, boldBuffer.byteOffset + boldBuffer.byteLength),
  };
}

// Genera una imagen OG usando Satori
async function generateOGImage(post: PostToProcess, fonts: { regular: ArrayBuffer; bold: ArrayBuffer }): Promise<boolean> {
  try {
    // Crear el elemento visual (similar a JSX pero como objeto)
    const element = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#000000',
          padding: '60px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: '70px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: '30px',
                maxWidth: '1080px',
              },
              children: post.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '36px',
                fontWeight: 400,
                color: '#cccccc',
                lineHeight: 1.3,
                maxWidth: '1080px',
              },
              children: post.description,
            },
          },
        ],
      },
    };

    // Generar SVG con Satori
    const svg = await satori(element as any, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Atkinson',
          data: fonts.regular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Atkinson',
          data: fonts.bold,
          weight: 700,
          style: 'normal',
        },
      ],
    });

    // Convertir SVG a PNG con resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: WIDTH,
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Guardar archivo
    fs.writeFileSync(post.outputPath, pngBuffer);
    return true;
  } catch (error) {
    console.error(`❌ Error generando imagen para ${post.slug}:`, error instanceof Error ? error.message : String(error));
    return false;
  }
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

  // Fase 2: Cargar fuentes y procesar
  console.log(`🚀 Generando ${postsToProcess.length} imágenes con Satori...`);
  const fonts = loadFonts();
  
  let generatedCount = 0;
  
  // Procesar todas las imágenes (Satori es muy rápido, no necesita batches)
  for (const post of postsToProcess) {
    const success = await generateOGImage(post, fonts);
    if (success) {
      cache[post.slug] = post.hash;
      generatedCount++;
      
      // Actualizar frontmatter si no tiene cover.image
      if (!post.content.includes('[cover]') && !post.content.includes('cover.image')) {
        const updatedContent = post.content.replace(/(\+\+\+[\s\S]*?)(\+\+\+)/, (match, frontmatter, closing) => {
          return frontmatter.trimEnd() + '\n[cover]\nimage = "/images/og/' + post.slug + '.png"\nhidden = true\n' + closing;
        });
        fs.writeFileSync(post.filePath, updatedContent);
      }
    }
  }
  
  console.log(`✅ ${generatedCount} imágenes generadas en ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  
  if (generatedCount > 0) {
    saveCache(cache);
  }
}

main().catch(error => {
  console.error('Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
