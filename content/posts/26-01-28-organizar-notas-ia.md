+++
title = 'Cómo organicé 1,920 notas con IA en 5 días'
date = 2026-01-28
draft = false
tags = ["inteligencia artificial", "productividad", "obsidian", "cursor", "claude code"]
categories = ["tecnología"]
description = 'Rescaté notas que había dado por perdidas, pero lo valioso no fue la migración. Fue implementar un sistema donde la IA gestiona el conocimiento: decide dónde organizar, qué conectar, qué patrones emergen.'
aliases = ["/posts/organizar-notas-ia/"]
[cover]
image = "/images/og/organizar-notas-ia.png"
hidden = true
+++



> TL;DR: Rescaté notas que había dado por perdidas, pero lo valioso no fue la migración. Fue implementar un sistema donde la IA gestiona el conocimiento: me ayuda a organizar, a ver conexiones y patrones emergentes para ir actualizando el sistema.

He usado muchos sistemas de notas a lo largo de los años. Evernote, Notion, Bear, iA Writer, Ulysses, Roam Research, Tana, Obsidian. Y a lo largo del tiempo he ido perdiendo notas. Abandonas un sistema, las notas quedan ahí, eventualmente desaparecen.

Ulysses es de los que más usé. Años de ideas, borradores, fragmentos de conversaciones.

## Lo que pasó con Ulysses

Yo tenía un sistema de organización. Carpetas y subcarpetas con nombres descriptivos. Pero con el tiempo, Ulysses fue degradando esa estructura. Los nombres de las carpetas se perdieron y el sistema los reemplazó por *hashes* incomprensibles.

Cuando me di cuenta, dije: "Ya, esto está abandonado, filo." Me cambié a iA Writer y dejé las notas de Ulysses sepultadas.

Información acumulada por años, dada por perdida.

## La recuperación

Decidí intentar rescatarlas. Convertí los archivos a Markdown y los traje a Obsidian.

El problema no era la conversión técnica (la IA me ayudó a escribir un script en Python para migrar desde Ulysses a Obsidian). El problema era que tenía casi 2,000 archivos sin estructura, con nombres que no decían nada, y el 90% era caos.

Aquí entró la IA. Usé Cursor y Claude Code con agentes que leían carpetas, proponían nombres, agregaban metadata.

Lo que habría sido semanas de trabajo manual se convirtió en días de supervisión.

## Lo que cambió todo

**Agentes paralelos.** No un asistente haciendo una tarea a la vez. Ocho agentes procesando simultáneamente. Eso es lo que hace viable trabajar con volúmenes grandes.

## Resultado

Un vault (así se llama la carpeta de notas en Obsidian) que puedo navegar. Contenido rescatado a las carpetas correctas. Conexiones entre notas que antes no existían.

## Para qué sirve

Pero lo más valioso no fue la migración. Fue implementar un sistema que evoluciona.

La IA organiza cada nota nueva según reglas que definí, encuentra conexiones entre cientos de archivos, y propone cambios a la estructura cuando los patrones que emergen ya no calzan con las carpetas actuales.

Cuando quiero escribir algo nuevo, busca en mi vault y me muestra notas relacionadas que había olvidado. Y cuando necesito investigar un tema, puedo consultar años de ideas, recursos y documentos acumulados en segundos.

Es como tener un asistente que conoce todo lo que he guardado y puede traerlo de vuelta cuando es relevante.

El conocimiento se compone. Cada nota nueva se conecta con las anteriores. Y cuando necesito escribir sobre un tema, no parto de cero: parto de años de ideas y notas acumuladas.

## Si quieres hacer algo similar

**Herramientas que usé:**

- **Claude Code** y **Cursor** usando Opus 4.5 (probé el modelo Composer 1 de Cursor, que es súper rápido, pero no hacía un buen trabajo, y Cursor no lanzaba agentes en paralelo con ese modelo)
- **[QMD](https://github.com/tobi/qmd)** para búsqueda semántica local. Corre modelos de inteligencia artificial localmente en tu máquina (~3 GB en total): Gemma para generar embeddings (vectores que representan el significado del texto) y Qwen3 para re-ranking y expansión de consultas. Crea índices que permiten buscar por concepto, no solo por palabras. Tiene tres modos: búsqueda por keywords (BM25), búsqueda semántica por vectores, y búsqueda híbrida que combina ambas. Todo corre local, sin enviar datos a ningún lado. Si busco "cómo decidir qué construir primero", encuentra notas sobre "MVP" o "criterios de priorización" aunque no usen las mismas palabras.
- **Obsidian** con estructura PARA extendida:

```
  0-inbox/        → captura rápida
  └── daily/      → notas diarias por fecha
  1-projects/     → proyectos con objetivo y fecha
  2-areas/        → responsabilidades continuas
  3-resources/    → referencias
  4-archive/      → items inactivos
  templates/      → plantillas
  ```

**Principios que apliqué:**

1. **Filenames como afirmaciones.** "El contexto destruye la productividad más que las interrupciones" en vez de "Notas de productividad". Cuando linkeas la nota, el título se inserta naturalmente en la oración.

2. **Frontmatter YAML en cada nota.** Un bloque de metadata al inicio del archivo con tipo, descripción, idioma y tags. Permite filtrar y buscar sin leer el contenido. Y si algún día migras a otro sistema, la información estructurada viaja contigo.

   ```yaml
   ---
   type: reference
   description: Técnicas para organizar grandes volúmenes de notas con agentes de IA.
   lang: es
   tags:
     - productividad
   ---
   ```

3. **Notas atómicas.** Incluso 2-3 líneas pueden ser una nota válida. Una idea = una nota. Los fragmentos cortos bien conectados son más útiles que documentos largos difíciles de linkear.

4. **Búsqueda por capas (para la IA).** Cuando le pido a la IA que organice algo nuevo o escriba una nota, usa este proceso:
   - Primero ve los títulos (que son claims)
   - Luego lee las descriptions sin abrir archivos
   - Solo abre lo que pasa esos filtros

   La IA toma la mayoría de decisiones sin leer el contenido completo. Esto cuida de no "inundar la ventana de contexto" y es lo que hace viable gestionar cientos de notas.

5. **Las relaciones importan más que las notas.** Una nota con muchos links entrantes es más valiosa que una nota aislada. La red es el conocimiento.
