+++
title = 'La alternativa real es nada'
date = 2026-02-11
draft = false
tags = ["inteligencia artificial", "automatizacion", "claude", "whatsapp", "openclaw"]
categories = ["tecnología"]
description = 'Delegué 30 horas de acompañamiento personalizado a un bot. No es perfecto, pero hace viable lo que antes simplemente no iba a pasar.'
[cover]
image = "/images/og/bot-entrevistas-ia.png"
hidden = true
aliases = ["/posts/bot-entrevistas-ia/"]
+++

> Todos sabemos que la atención uno a uno es de las cosas que más mueve la aguja en formación. Un mentor, un tutor, alguien que se siente contigo y te ayude a pensar. Y casi nunca hay recursos para darla. La alternativa real, en la mayoría de programas, no es un profesional, ni un ayudante, ni un practicante. Es nada.

Armé un bot que hace ese trabajo. No es perfecto, pero existe. Y eso ya es más de lo que había antes.

---

Tenemos un programa con unos 30 emprendedores de comunas de la región de Los Ríos, en Chile. El grupo es de todo, menos homogéneo: hay desde una artesana que hace unos amigurumis increíbles, hasta una dentista de mascotas con años en el mercado. Desarrolladores de software, kinesiología, fonoaudiología, salones de belleza, un café al paso, tienda de accesorios y reparación de teléfonos.

Son once sesiones donde vemos, entre otras cosas, propuesta de valor, modelo de negocio, números y plan de marketing.

La primera vez que hice algo parecido fue en 2013, cuando traje First Tuesday a la región de Los Lagos, y desde ahí que veo un problema: el gap entre la clase y aplicar el conocimiento. En buena medida las personas entienden los conceptos, ven ejemplos, usan frameworks en las sesiones. Pero después cada emprendedor tiene que aterrizar con más detalle esto a su negocio.

Ese paso, de la teoría al "esto es lo mío" es donde la gente se estanca.

## El dilema clásico

Lo que suele faltar en estos programas es **acompañamiento personalizado**. Alguien que se siente contigo, te haga las preguntas correctas, y te ayude a ordenar y formalizar tus ideas.

Pero es caro y ahí es donde aparece el trade-off de siempre:

Quizá puedes conseguir un practicante (que cabe en el presupuesto), para que siga un guión de preguntas. Pero cuando reciba una respuesta vaga como "mi diferenciador es la calidad", no sabe cómo profundizar. No insiste. Anota lo que le dijeron y sigue adelante.

En cambio un profesional con experiencia sabe cuándo una respuesta no está lista. Sabe profundizar, reformular, sacar lo que la otra persona tiene en la cabeza pero no sabe articular. Y eso cuesta plata. Y para un programa con 30 personas y presupuesto acotado, no siempre es viable.

Y eso sin contar las horas de gestión: buscar a la persona, entrenarla, supervisar su trabajo, revisar entrevistas, corregir errores. Fácilmente otras 5-10 horas.

En la práctica, lo que pasa es que **simplemente no se hace**. El acompañamiento personalizado se cae porque no hay presupuesto, no hay tiempo, o las dos cosas. Y esto no es solo un problema de programas de emprendimiento: pasa en colegios, universidades, capacitaciones corporativas. Siempre sabemos que la atención uno a uno haría la diferencia, y casi nunca hay recursos para darla. **La alternativa real no es un practicante, un ayudante, o un profesional. Es nada.**

## Lo que hice

Investigué y diseñé un sistema como si estuviera delegando esto a una persona.

Escribí un proceso claro: cuál es el objetivo de la conversación, qué información se necesita extraer, cómo debería ser la conversación. Definí preguntas específicas para cada bloque: propuesta de valor, modelo de negocio, plan de marketing. Puse reglas de cuándo profundizar como: si la respuesta es muy corta, o si usa palabras genéricas como "calidad" o "servicio", pide que explique más.

El sistema se adapta a perfiles muy distintos. Detecta si es un producto físico, un servicio de salud, una consultora B2B, comercio, servicios personales, etc. Y ajusta las preguntas y recomendaciones según eso.

Pero en vez de entregar esto a una persona, lo delegué a Claude Opus 4.5, orquestado con **OpenClaw** (un sistema que, entre otras cosas, conecta agentes de IA con canales de mensajería como WhatsApp).

El bot transcribe audios automáticamente usando Whisper en Groq (absurdamente rápido, US$0.04 por hora de audio), corre en un servidor en Hetzner por US$4.09 al mes, y no tiene horario de oficina, está ahí cuando alguien por fin se sienta a pensar en su negocio.

## Los números

Treinta emprendedores, alrededor de una hora por cada uno entre entrevista e informe. Son unas 30 horas de trabajo que yo no tuve que hacer.

**Invertí unas 12 horas diseñando el sistema**: las preguntas, la lógica, los criterios para adaptar el plan de marketing según el tipo de negocio y su etapa de madurez.

Pero además, era la primera vez que montaba algo así: configurar un servidor en Hetzner, usar SSH, crear un bot de WhatsApp desde cero, armar un sistema multi-agente que separa la entrevista en etapas para no abrumar al emprendedor entrevistado. También diseñar capas de seguridad: que el agente no entregue información de otros participantes, y que no revele rutas ni configuración interna si alguien intenta manipularlo. Y una versión modificada podría atender 100, 500, 1000 emprendedores a un costo marginal.

### ¿Y el costo del modelo?

No es como lo tengo implementado hoy, pero si alguien quisiera replicar esto pagando por uso vía API, el costo depende del modelo.

Una entrevista de 50 minutos genera unos 20 intercambios por WhatsApp. Como cada llamada a la API envía el historial completo, el consumo de tokens crece con cada turno. Para 30 entrevistas serían unos 5.5 millones de tokens de entrada y 240 mil de salida. El costo podría ser algo como:

| Modelo | Costo estimado (30 entrevistas) |
|--------|-------------------------------|
| Kimi K2.5 | ~US$4 |
| Gemini 2.5 Pro | ~US$9 |
| GPT-5.1 | ~US$9 |
| Claude Sonnet 4.5 | ~US$20 |
| Claude Opus 4.5 | ~US$34 |

Para este tipo de tarea lo crítico es que el modelo sepa cuándo una respuesta es vaga y profundice con criterio. Todos los de la tabla podrían funcionar, es cosa de probar. Modelos más baratos que estos probablemente fallen en lo mismo que un practicante: seguir el guión sin saber cuándo insistir.

## Lo que puede salir mal

El costo oculto es el monitoreo. El sistema va a fallar: bugs, errores de transcripción, emprendedores que hacen cosas inesperadas. Hay que revisar periódicamente que todo siga funcionando.

De hecho, el bot partió corriendo en mi computador. Funcionaba, pero dependía de que mi Mac estuviera encendido y conectado. Un día un camión cortó un cable en la calle y me quedé sin internet por varios días, dependiendo de compartir internet desde el teléfono, que era inestable. Ahí lo migré a un servidor en Hetzner: US$4.09 al mes por confiabilidad operacional 24/7. Y después descubrí que había dejado ese servidor [abierto como una puerta sin llave](/posts/26-02-12-seguridad-servidor-openclaw/).

## Para quién más sirve esto

El patrón aplica para cualquier situación donde necesitas conversaciones uno a uno que sigan una estructura: llamadas de discovery, levantamiento de información en terreno, seguimiento personalizado en programas de capacitación, onboarding de clientes. Cualquier caso donde hoy no se hace porque no hay tiempo o presupuesto para hacerlo bien.

## La comparación

|                    | Tú              | Practicante                  | Bot IA               |
| ------------------ | --------------- | ---------------------------- | -------------------- |
| **Costo**          | Tu tiempo       | $300-500/mes                 | $10-40/mes           |
| **Profundización** | Profesional     | Limitada                     | Consistente          |
| **Disponibilidad** | Tu horario      | Horario laboral              | 24/7                 |
| **Escalabilidad**  | No escala       | Lineal                       | Ilimitada            |
| **Setup**          | 0 horas         | 5-10 horas                   | ~12 horas              |

El bot no reemplaza la conversación con un profesional experimentado. Pero [hace viable](/posts/26-02-13-paradoja-jevons-ia/) entregar acompañamiento personalizado donde antes no lo era.

## El cambio

Mi trabajo real fue diseñar e implementar el sistema. Definir qué preguntas hacer, cuándo profundizar, cómo adaptar las respuestas al contexto.

La IA ejecuta ese diseño a escala. No es perfecto. Pero la alternativa era nada.
