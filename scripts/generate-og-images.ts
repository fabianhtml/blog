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
  hash: string;
}

interface FontData {
  regular: ArrayBuffer;
  bold: ArrayBuffer;
}

// Configuración
const WIDTH = 1200;
const HEIGHT = 630;
const TEMPLATE_VERSION = '9';

// Función para generar hash
function generateHash(title: string, description: string): string {
  const content = `${TEMPLATE_VERSION}:${title}${description}`;
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

function cleanFrontMatterValue(value: string): string | boolean {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function assignFrontMatterValue(frontMatter: FrontMatter, key: string, value: string): void {
  if (!['title', 'description', 'draft'].includes(key)) return;

  const cleanValue = cleanFrontMatterValue(value);
  (frontMatter as any)[key] = cleanValue;
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
      if (line.trim() === '' || line.trim().startsWith('#')) continue;
      
      const equalIndex = line.indexOf('=');
      if (equalIndex === -1) continue;
      
      const key = line.slice(0, equalIndex).trim();
      const value = line.slice(equalIndex + 1).trim();
      assignFrontMatterValue(frontMatter, key, value);
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
      const value = line.slice(colonIndex + 1).trim();
      assignFrontMatterValue(frontMatter, key, value);
    }
    return frontMatter;
  }

  return null;
}

function loadFonts(): FontData {
  const fontDir = path.join(
    __dirname,
    '../node_modules/@fontsource/atkinson-hyperlegible/files'
  );
  const regularBuffer = fs.readFileSync(
    path.join(fontDir, 'atkinson-hyperlegible-latin-400-normal.woff')
  );
  const boldBuffer = fs.readFileSync(
    path.join(fontDir, 'atkinson-hyperlegible-latin-700-normal.woff')
  );

  return {
    regular: regularBuffer.buffer.slice(
      regularBuffer.byteOffset,
      regularBuffer.byteOffset + regularBuffer.byteLength
    ),
    bold: boldBuffer.buffer.slice(
      boldBuffer.byteOffset,
      boldBuffer.byteOffset + boldBuffer.byteLength
    ),
  };
}

// Genera una imagen OG desde SVG y la rasteriza a PNG.
async function generateOGImage(post: PostToProcess, fonts: FontData): Promise<boolean> {
  try {
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
          fontFamily: 'Atkinson',
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

    if (!frontMatter || frontMatter.draft || !frontMatter.title || !frontMatter.description) {
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

  // Fase 2: Generar imágenes pendientes
  console.log(`🚀 Generando ${postsToProcess.length} imágenes OG...`);
  const fonts = loadFonts();
  
  let generatedCount = 0;
  
  for (const post of postsToProcess) {
    const success = await generateOGImage(post, fonts);
    if (success) {
      cache[post.slug] = post.hash;
      generatedCount++;
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
