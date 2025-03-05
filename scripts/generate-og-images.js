const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function generateOGImage(post) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to OG image size
    await page.setViewport({
        width: 1200,
        height: 630,
        deviceScaleFactor: 1,
    });

    // Generate HTML content
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    width: 1200px;
                    height: 630px;
                    background: #000000;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    padding: 80px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    box-sizing: border-box;
                }
                .title {
                    color: #ffffff;
                    font-size: 72px;
                    font-weight: 600;
                    text-align: left;
                    margin-bottom: 40px;
                    line-height: 1.1;
                    max-width: 900px;
                }
                .description {
                    color: #ffffff;
                    font-size: 36px;
                    text-align: left;
                    max-width: 900px;
                    opacity: 0.8;
                    line-height: 1.3;
                    font-weight: 400;
                }
            </style>
        </head>
        <body>
            <div class="title">${post.title}</div>
            <div class="description">${post.description}</div>
        </body>
        </html>
    `;

    await page.setContent(html);

    // Ensure the output directory exists
    const outputDir = path.join(__dirname, '../static/images/og');
    await fs.mkdir(outputDir, { recursive: true });

    // Generate image
    const outputPath = path.join(outputDir, `${post.slug}.png`);
    await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1200, height: 630 }
    });

    await browser.close();
}

function extractFrontMatter(content) {
    let frontMatter = {};
    
    // Try YAML front matter (---)
    let match = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (match) {
        // YAML format
        const fmContent = match[1];
        const lines = fmContent.split('\n');
        lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
                const value = valueParts.join(':').trim();
                // Remove quotes if they exist
                frontMatter[key.trim()] = value.replace(/^["']|["']$/g, '');
            }
        });
    } else {
        // Try TOML front matter (+++)
        match = content.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
        if (match) {
            const fmContent = match[1];
            const lines = fmContent.split('\n');
            lines.forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length) {
                    const value = valueParts.join('=').trim();
                    // Remove quotes if they exist
                    frontMatter[key.trim()] = value.replace(/^["']|["']$/g, '');
                }
            });
        }
    }
    
    return frontMatter;
}

async function main() {
    const contentDir = path.join(__dirname, '../content/posts');
    const files = await fs.readdir(contentDir);

    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
            const frontMatter = extractFrontMatter(content);
            
            if (!frontMatter.title || !frontMatter.description) {
                console.warn(`Skipping ${file}: Missing title or description`);
                continue;
            }

            const slug = file.replace('.md', '');

            try {
                await generateOGImage({
                    title: frontMatter.title,
                    description: frontMatter.description,
                    slug
                });

                console.log(`Generated OG image for: ${frontMatter.title}`);
            } catch (error) {
                console.error(`Error generating image for ${file}:`, error);
            }
        }
    }
}

main().catch(console.error); 