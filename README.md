# FabLab Blog

Blog personal construido con Hugo y el tema PaperMod, desplegado en Cloudflare Pages.

## Características

- Tema PaperMod personalizado
- Generación automática de imágenes Open Graph con **resvg** (sin Chrome)
- Soporte para CSS personalizado
- Optimizado para SEO
- Build ultrarrápido con **Bun** (~28s en CI)

## Setup Inicial

Ejecuta este comando una sola vez después de clonar el repositorio:
```bash
bun run setup
```

Este comando:
- Instala todas las dependencias

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

## Imágenes

El blog usa dos tipos de imágenes:

- **Imágenes editoriales**: van en `assets/img` y se referencian como `/img/nombre.webp` desde los posts.
- **Imágenes Open Graph**: se generan en `static/images/og` durante el build y se publican como `/images/og/slug-del-post.png`.

### Generación de Open Graph

El sistema genera automáticamente imágenes Open Graph (OG) para compartir en redes sociales usando **resvg**.

### Cómo Funciona

1. **Build local y CI**: `bun run blog:build` y `bun run ci:build` generan las imágenes antes de ejecutar Hugo.
2. **Manual**: `bun run generate-og` genera solo las imágenes faltantes o modificadas.
3. **Sin mutar posts**: el generador no edita frontmatter; solo lee `title` y `description`.
4. **Fallback automático**: si un post no define `cover.image`, los metadatos sociales usan `/images/og/<nombre-del-archivo>.png`.

### Requisitos en Posts

Cada post debe incluir en su frontmatter:
```toml
+++
title = "Título del Post"
description = "Descripción para redes sociales"
+++
```

### Características

- Imágenes de 1200x630px con fondo negro
- **No requiere Chrome/Chromium**
- Caché local ignorado por git (`.og-cache.json`)
- No agrega ni modifica `cover.image`

### Portadas custom

Usa `cover.image` solo cuando quieras una imagen social o portada específica:

```toml
[cover]
image = "/img/mi-portada.webp"
hidden = true
```

### Personalización

Las plantillas de las imágenes OG se pueden personalizar editando:
- La lógica de generación en `scripts/generate-og-images.ts`

## Despliegue

El blog se despliega automáticamente en **Cloudflare Pages** cuando se hace push a la rama `main`.

### Configuración en Cloudflare Pages

- **Build command**: `bun install && bun run ci:build`
- **Build output directory**: `public`
- **Variable**: `SKIP_DEPENDENCY_INSTALL` = `true`

### Optimizaciones de Build

- **Bun** ejecuta TypeScript directamente (sin paso de compilación `tsc`)
- **resvg** genera imágenes sin necesidad de navegador
- `.og-cache.json` queda local para evitar trabajo repetido durante desarrollo

## Licencia

MIT
