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
- Puppeteer v22.8.2 o superior (se instala automáticamente con `npm install`)

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

- Genera imágenes de 2400x1260 pixels (optimizadas para redes sociales)
- Diseño minimalista con fondo negro y tipografía clara
- Alineación a la izquierda para mejor legibilidad
- Sistema de caché para evitar regeneraciones innecesarias
- Soporte para tanto posts en formato YAML como TOML

### Personalización

Las plantillas de las imágenes OG se pueden personalizar editando:
- La lógica de generación en `scripts/generate-og-images.ts`
- El estilo está integrado en el script TypeScript

## Despliegue

El blog se despliega automáticamente en Azure Static Web Apps cuando se hace push a la rama main.

## Licencia

MIT 