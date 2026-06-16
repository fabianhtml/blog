# AGENTS.md - FabLab Blog

Blog personal construido con Hugo + tema PaperMod, con generación de imágenes Open Graph vía Bun/TypeScript. Desplegado en Cloudflare Pages. Ver `README.md` para el detalle de comandos y flujo de OG images.

## Cursor Cloud specific instructions

Toda la setup de dependencias (Bun, Hugo extended, submódulo del tema, `bun install`) ya corre en el arranque del VM mediante el update script. Notas no obvias para trabajar aquí:

- **Versión de Hugo**: usar Hugo **extended >= 0.158.0** (el entorno trae `v0.163.2`). El tema PaperMod exige Hugo >= 0.125.7. Nota histórica: `hugo.yaml` antes definía el cache `getjson` (eliminado en Hugo 0.156.0); ya fue removido, así que el build corre con Hugo actual.
- **Warning conocido de RSS**: el tema PaperMod (submódulo) aún usa `site.Language.LanguageCode` en `rss.xml`, deprecado en Hugo 0.158.0. Es solo un warning no bloqueante de upstream; no editar el submódulo.
- **Tema PaperMod**: vive en `themes/PaperMod` como **submódulo git**. Si `themes/PaperMod` está vacío, el build falla; reinicializar con `git submodule update --init --recursive`.
- **Servidor de desarrollo**: `bun run blog:dev` (= `hugo server -D`, incluye drafts) sirve en `http://localhost:1313`. Tiene live reload: crear o editar un `.md` en `content/posts/` se refleja sin reiniciar.
- **OG images**: `bun run generate-og` regenera solo las imágenes faltantes/modificadas en `static/images/og/` (ignoradas por git). El build completo `bun run blog:build` corre OG + `hugo --minify`. No edita el frontmatter de los posts.
- **PATH de Bun**: Bun se instala en `~/.bun/bin`. Si `bun` no está en el PATH de una shell nueva, usar `export PATH="$HOME/.bun/bin:$PATH"` o la ruta completa `~/.bun/bin/bun`.
