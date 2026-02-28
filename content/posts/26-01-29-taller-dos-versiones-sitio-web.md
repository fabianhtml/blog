+++
title = 'Un taller, dos versiones y un sitio web de regalo'
date = 2026-01-29
draft = false
tags = ["inteligencia artificial", "productividad", "claude", "taller", "diseño"]
categories = ["tecnología"]
description = '¿Se puede diseñar un taller completo pensando en voz alta? Sí.'
aliases = ["/posts/taller-dos-versiones-sitio-web/"]
[cover]
image = "/images/og/disenar-taller-ia.png"
hidden = true
+++

> TL;DR: En unas horas pasé de un briefing a un taller completo con materiales listos para producir. Investigación, dos versiones, decisiones de diseño. La IA no diseñó el taller, pero sin ella no habría explorado todo eso en una sesión.

Me invitaron a facilitar un taller para un programa de mujeres en ciencia y tecnología en el sur de Chile.

Tenía un briefing, un informe de caracterización del grupo, y muchas ideas sueltas. Lo que no tenía era una estructura clara, materiales definidos ni la investigación metodológica para respaldar las decisiones de diseño.

Usé la IA como suelo usarla: como compañía para diseñar, pensar y explorar. No para generar texto ni para tomar decisiones, sino para facilitar y acelerar las mías.

## Lo primero: entender al grupo

Antes de diseñar nada, le pedí a la IA que leyera el informe de caracterización de las participantes. 36 mujeres, 72% con posgrado, trabajando en biotecnología, inteligencia artificial, análisis de datos.

El primer insight: el enfoque original del taller era "enseñar qué puede hacer la tecnología". Pero este grupo ya trabaja con tecnología. Un 25% comenta que ya usa IA, un 30% trabaja con biotecnología, un 20% con Big Data e IoT. Seguro saben más que yo en varios de estos campos.

Enseñarles qué es la IA sería no entender la audiencia. Lo que necesitaban era impulso para pensar en soluciones y herramientas para generar ideas rápidamente.

Ese cambio de enfoque definió todo el diseño del taller.

## Investigar antes de diseñar

Le pedí a la IA que buscara en mi vault de Obsidian (donde tengo años de notas sobre diseño, innovación, talleres) y también en internet. Quería saber qué metodologías existían para ideación, diseño especulativo y facilitación con IA.

Encontramos The Thing From The Future, un juego de ideación creado por Stuart Candy y Jeff Watson, usado por la ONU, NASA e IDEO. También Futurish Cards, los toolkits de Futurice, y un artículo de NN/g sobre cómo facilitar workshops con IA (spoiler: las actividades toman más tiempo porque escribir prompts no es inmediato).

Con esa investigación, diseñé dos versiones del taller para comparar.

## Dos versiones, una decisión

**Versión 1:** tarjetas propias. Cada participante recibe superpoderes tecnológicos (IA generativa, IoT, biotecnología, etc.), una restricción del 2030 (crisis climática, envejecimiento poblacional, todo es remoto) y un usuario extremo (adulta mayor rural, niña neurodivergente, emprendedor de feria). Todo esto como base para pensar desde otra mirada en los problemas que les interesa resolver e imagina soluciones menos obvias.

**Versión 2:** usa The Thing From The Future. Cada participante recibe una combinación aleatoria ("dentro de una generación, en un futuro de transformación, existe un dispositivo relacionado con la educación que evoca asombro") y primero imagina ese artefacto. Después conecta la idea especulativa con su problema real.

La versión 2 era más lúdica. Pero este grupo ya había hecho un ejercicio creativo en el taller anterior. Lo que necesitaban ahora era aterrizar, no seguir especulando.

Ahora con estas herramientas es realmente muy rápido y barato explorar distintas alternativas (en este caso de taller) y ver cual te gusta más o tienen más sentido.

## El nivel de detalle que importa

Aquí es donde la IA brilla como compañero de diseño. No en las decisiones grandes, sino en la ejecución.

Le pedí que creara de todo, incluso los materiales imprimibles. No un listado genérico. Creó:

- 8 diseños de tarjetas de superpoder tecnológico, cada una con nombre, descripción y un ejemplo concreto
- 6 restricciones del 2030, cada una con una pregunta provocadora
- 6 usuarios extremos con edad, contexto y limitaciones específicas
- Un canvas de concepto con 4 cuadrantes para llenar
- Una hoja de aterrizaje que conecta el ejercicio con el siguiente taller

Todo con el nivel de detalle necesario para que otra persona pueda producirlo sin preguntar nada.

## De paso, un sitio web

La versión 2 del taller necesitaba generar combinaciones aleatorias de The Thing From The Future: cinco dimensiones (tiempo, arco, terreno, objeto, emoción) que producen frases como "dentro de una generación, en un futuro de transformación, existe un dispositivo relacionado con la educación que evoca asombro". El juego original está en inglés, así que había que traducirlo.

Tradujimos todas las opciones al español y revisamos el vocabulario. Algunas palabras del original no funcionaban naturalmente en la frase "evoca una sensación de X": "hilaridad" pasó a "risa", "patetismo" a "lástima", "zen" a "tranquilidad".

Con los datos listos, construimos un sitio estático — HTML, CSS y JavaScript en un solo archivo, más un TSV con los datos — y lo publicamos en GitHub con Cloudflare Pages y subdominio propio. El resultado: [talleres.fablab.blog/the-thing-from-the-future/](https://talleres.fablab.blog/the-thing-from-the-future/).

Lo hice de fondo, mientras diseñaba el taller, casi por el gusto de hacerlo. Cuando algo se puede construir así de rápido, no necesitas justificarlo con un proyecto. Ahora existe como herramienta pública en español, y el costo de crearlo fue prácticamente cero. Un subproducto natural de explorar alternativas.

## La IA como participante del taller

Una decisión que tomé durante el diseño: las participantes no solo van a ver demos de IA. Van a usarla.

En la ronda relámpago después de las demos, cada una abre ChatGPT y le pide: "Dame 5 formas de resolver mi problema usando esta tecnología que me llamó la atención." De lo que devuelve la IA, elige una idea y la anota.

Durante el trabajo individual, pueden usar la IA como compañero de brainstorming: "Tengo este problema + esta tecnología + esta restricción + este usuario. Dame ideas." Pero la idea final se escribe a mano en el canvas.

La IA es un insumo, no la respuesta. Esa distinción es clave para un taller de innovación.

## Lo que aprendí del proceso

**La IA no diseña talleres.** Investiga rápido, ejecuta detalle, y te ayuda a pensar en voz alta. Pero las decisiones de diseño (qué enfoque usar, cómo manejar la transición emocional de "por fin puedo pensar en soluciones", cómo servir a dos perfiles muy distintos de participantes) son humanas.

**Revisa lo que la IA calcula, sobre todo en sesiones largas.** La IA hizo cálculos de cantidades y generó nombres para los materiales. Pero en una conversación larga, donde el foco de atención va cambiando, se equivocó: los números de materiales no daban y había inconsistencias entre secciones del mismo documento. Lo bueno es que pedirle que verifique es instantáneo. Lo importante es no asumir que lo hizo bien la primera vez.

**Buscar en tu propio conocimiento es poderoso.** Tengo notas sobre Design Thinking, enfoque de género en STEM, metodologías de innovación, que llevaban meses sin mirar. La búsqueda semántica en mi vault encontró conexiones que yo había olvidado.

## Herramientas que usé

- **Claude Code y Cursor** (Opus 4.5) para diseñar, investigar, escribir, editar, prototipar.
- **Obsidian** para organizar todo el proyecto
- **QMD** para búsqueda semántica en mi vault de Obsidian (encontrar notas relacionadas que no recordaba)
- **The Thing From The Future** como referencia metodológica (al final no lo usé como motor principal, pero influyó en el diseño de las tarjetas de restricción)

## Si quieres hacer algo similar

1. **No le pidas a la IA que diseñe por ti.** Dale contexto, pídele que investigue, y usa lo que encuentre para tomar tus propias decisiones.
2. **Pide output que otro pueda ejecutar.** Si el resultado va a pasar por más manos, tiene que ser autoexplicativo.
3. **Explora alternativas, no te cases con la primera.** Con estas herramientas es muy rápido y barato crear versiones distintas y compararlas. Es más fácil elegir entre dos opciones que diseñar la perfecta de entrada.
4. **Busca en lo que ya tienes.** Si llevas años acumulando notas, la búsqueda semántica puede encontrar conexiones que no sabías que existían.
