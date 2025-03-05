# FabLab Blog

Blog personal construido con Hugo y el tema PaperMod, desplegado en Azure Static Web Apps.

## Características

- Tema PaperMod personalizado
- Generación automática de imágenes Open Graph para compartir en redes sociales
- Soporte para CSS personalizado
- Optimizado para SEO

## Desarrollo Local

1. Clona el repositorio:
```bash
git clone https://github.com/fabianhtml/blog.git
cd blog
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
hugo server -D
```

## Generación de Imágenes Open Graph

El blog incluye un sistema automático para generar imágenes Open Graph para cada post. Estas imágenes se usan cuando compartes tus posts en redes sociales.

### Requisitos

- Node.js 18 o superior
- NPM
- Puppeteer (se instala automáticamente con `npm install`)

### Cómo Funciona

1. Cada post debe incluir en su front matter:
```yaml
---
title: "Título del Post"
description: "Descripción del post que aparecerá en redes sociales"
---
```

2. Después de crear o actualizar un post, genera las imágenes OG:
```bash
npm run generate-og
```

3. Las imágenes se generarán automáticamente en `static/images/og/[nombre-del-post].png`

### Características del Sistema OG

- Genera imágenes de 1200x630 pixels (tamaño recomendado para redes sociales)
- Usa el título y descripción del post para crear la imagen
- Incluye una imagen por defecto para páginas que no son posts
- Soporta tanto posts en formato YAML como TOML

### Personalización

Las plantillas de las imágenes OG se pueden personalizar editando:
- El estilo en `layouts/partials/og-image.html`
- La lógica de generación en `scripts/generate-og-images.js`

## Despliegue

El blog se despliega automáticamente en Azure Static Web Apps cuando se hace push a la rama main.

## Licencia

MIT 