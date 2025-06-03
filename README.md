# FabLab Blog

Blog personal construido con Hugo y el tema PaperMod, desplegado en Azure Static Web Apps.

## Características

- Tema PaperMod personalizado
- Generación automática de imágenes Open Graph para compartir en redes sociales
- Soporte para CSS personalizado
- Optimizado para SEO

## Setup Inicial

Ejecuta este comando una sola vez después de clonar el repositorio:
```bash
npm run setup
```

Este comando:
- Instala todas las dependencias
- Compila los scripts TypeScript
- Configura los git hooks
- Genera las imágenes Open Graph

## Desarrollo Local

Para desarrollo diario:
```bash
npm run blog:dev
```

Para construir el sitio (genera OG images + Hugo build):
```bash
npm run blog:build
```

Para generar solo las imágenes Open Graph:
```bash
npm run generate-og
```

## Generación de Imágenes Open Graph

El sistema genera automáticamente imágenes Open Graph (OG) para compartir en redes sociales.

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
- Sistema de caché inteligente
- Se agregan automáticamente al frontmatter como `cover.image`

### Personalización

Las plantillas de las imágenes OG se pueden personalizar editando:
- La lógica de generación en `scripts/generate-og-images.ts`
- El estilo está integrado en el script TypeScript

## Despliegue

El blog se despliega automáticamente en Azure Static Web Apps cuando se hace push a la rama main.

## Licencia

MIT 