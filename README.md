# FabLab Blog

Blog personal construido con Hugo y el tema PaperMod, desplegado en Cloudflare Pages.

## Características

- Tema PaperMod personalizado
- Generación automática de imágenes Open Graph para compartir en redes sociales
- Soporte para CSS personalizado
- Optimizado para SEO
- Build rápido con **Bun** (~20s en CI)

## Setup Inicial

Ejecuta este comando una sola vez después de clonar el repositorio:
```bash
bun run setup
```

Este comando:
- Instala todas las dependencias
- Configura los git hooks
- Genera las imágenes Open Graph

> **Nota**: El proyecto usa Bun para ejecución directa de TypeScript (sin paso de compilación).

## Desarrollo Local

Para desarrollo diario:
```bash
bun run blog:dev
```

Para construir el sitio (genera OG images + Hugo build):
```bash
bun run blog:build
```

Para generar solo las imágenes Open Graph:
```bash
bun run generate-og
```

Para build de CI (usado por Cloudflare Pages):
```bash
bun run ci:build
```

## Generación de Imágenes Open Graph

El sistema genera automáticamente imágenes Open Graph (OG) para compartir en redes sociales usando **Puppeteer** (Chrome headless).

### Cómo Funciona

1. **Automático con commits**: Las imágenes se generan automáticamente al hacer commit gracias al pre-commit hook
2. **Manual**: Ejecuta `npm run generate-og` para generar solo las imágenes nuevas o modificadas
3. **Detección inteligente**: Solo regenera imágenes cuando cambia el título o descripción del post

### Requisitos en Posts

Cada post debe incluir en su frontmatter:
```toml
+++
title = "Título del Post"
description = "Descripción para redes sociales"
+++
```

### Características

- Imágenes de 2400x1260px con fondo negro
- Fuente Atkinson Hyperlegible para máxima legibilidad
- Detección automática de Chrome/Chromium
- Sistema de caché inteligente (`.og-cache.json`)
- Procesamiento en paralelo (batches de 5 imágenes)
- Reutiliza el navegador para todas las imágenes (no abre/cierra por cada una)
- Se agregan automáticamente al frontmatter como `cover.image`

### Personalización

Las plantillas de las imágenes OG se pueden personalizar editando:
- La lógica de generación en `scripts/generate-og-images.ts`
- El estilo está integrado en el script TypeScript

## Despliegue

El blog se despliega automáticamente en **Cloudflare Pages** cuando se hace push a la rama `main`.

### Configuración en Cloudflare Pages

- **Build command**: `bun run ci:build`
- **Build output directory**: `public`

### Optimizaciones de Build

- **Bun** ejecuta TypeScript directamente (sin paso de compilación `tsc`)
- El archivo `.og-cache.json` se commitea al repo para evitar regenerar imágenes existentes
- Las imágenes OG se procesan en paralelo (batches de 5)

## Licencia

MIT 