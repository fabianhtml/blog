+++
title = 'No es la misma calidad que un profesional. Pero para muchos proyectos, es suficiente.'
date = 2026-02-11
draft = false
tags = ["inteligencia artificial", "automatizacion", "claude", "whatsapp", "openclaw"]
categories = ["tecnología"]
description = 'Cómo estoy delegando más de 30 horas de entrevistas a un bot de WhatsApp usando Claude, y por qué la IA rompe el trade-off entre calidad y costo.'
[cover]
image = "/images/og/bot-entrevistas-ia.png"
hidden = true
+++

Tenemos un programa con unos 30 emprendedores de comunas de la región de Los Ríos, en Chile. El grupo es de todo, menos homogéneo: hay desde una artesana que hace unos amigurumis increíbles, hasta una dentista de mascotas con años en el mercado. Desarrolladores de software, kinesiología, fonoaudiología, salones de belleza, un café al paso, tienda de accesorios y reparación de teléfonos.

Entre las clases hemos visto cómo desarrollar su propuesta de valor, modelo de negocio y plan de marketing.

La primera vez que hice algo parecido fue en 2013, cuando traje First Tuesday a la región de Los Lagos, y desde ahí que veo un problema: el gap entre la clase y aplicar el conocimiento. En buena medida las personas entienden los conceptos, ven ejemplos, usan frameworks en las sesiones. Pero después cada emprendedor tiene que aterrizar con más detalle esto a su negocio.

Ese paso, de la teoría al "esto es lo mío" es donde la gente se estanca.

## El dilema clásico

Lo que suele faltar en estos programas es **acompañamiento personalizado**. Alguien que se siente contigo, te haga las preguntas correctas, y te ayude a ordenar y formalizar tus ideas.

Pero es caro y ahí es donde aparece el trade-off de siempre:

Quizá puedes conseguir un practicante (que cabe en el presupuesto), para que siga un guión de preguntas. Pero cuando reciba una respuesta vaga como "mi diferenciador es la calidad", no sabe cómo profundizar. No insiste. Anota lo que le dijeron y sigue adelante.

En cambio un profesional con experiencia sabe cuándo una respuesta no está lista. Sabe profundizar, reformular, sacar lo que la otra persona tiene en la cabeza pero no sabe articular. Y eso cuesta plata. Y para un programa con 30 personas y presupuesto acotado, no siempre es viable.

Y eso sin contar las horas de gestión: buscar a la persona, entrenarla, supervisar su trabajo, revisar entrevistas, corregir errores. Fácilmente otras 5-10 horas.

En la práctica, lo que pasa es que **simplemente no se hace**. El acompañamiento personalizado se cae porque no hay presupuesto, no hay tiempo, o las dos cosas. Y esto no es solo un problema de programas de emprendimiento: pasa en colegios, universidades, capacitaciones corporativas. Siempre sabemos que la atención uno a uno haría la diferencia, y casi nunca hay recursos para darla. **La alternativa real no es un practicante ni un profesional. Es nada.**

## Lo que hice

Investigué y diseñé un sistema como si estuviera delegando esto a una persona.

Escribí un proceso claro: cuál es el objetivo de la conversación, qué información se necesita extraer, cómo debería ser la conversación. Definí preguntas específicas para cada bloque: propuesta de valor, modelo de negocio, plan de marketing. Puse reglas de cuándo profundizar como: si la respuesta es muy corta, o si usa palabras genéricas como "calidad" o "servicio", pide que explique más.

El sistema se adapta a perfiles muy distintos. Detecta si es un producto físico, un servicio de salud, una consultora B2B, comercio, servicios personales, etc. Y ajusta las preguntas y recomendaciones según eso.

Pero en vez de entregar esto a una persona, lo delegué a Claude Opus 4.5, orquestado con OpenClaw (un sistema que entre otras cosas, conecta agentes de IA con canales de mensajería como WhatsApp).

Creé un bot que corre por WhatsApp 24/7. Transcribe audios automáticamente usando Whisper en Groq (absurdamente rápido, US$0.04 por hora de audio). Corre en un servidor en Hetzner por US$4.09 al mes.

## Por qué funciona

La IA hace cosas que un practicante no haría:

Profundiza tres veces si la respuesta queda corta, reformulando, dando más contexto, entregando ejemplos. No le complica insistir y lo hace con tino. Sigue el framework (confía en el proceso).

Y está disponible en la noche cuando un emprendedor por fin tiene tiempo de sentarse a pensar en su negocio y simplemente mandar audios por WhatsApp.

## Los números

Treinta emprendedores, 40-50 minutos de entrevista más 10 minutos mínimo para preparar informes. Son 30 horas de conversaciones que yo no tuve que hacer.

**Invertí unas 12 horas diseñando el sistema**: las preguntas, la lógica, los criterios para adaptar el plan de marketing según el tipo de negocio y su etapa de madurez.

Pero además, era la primera vez que montaba algo así: configurar un servidor en Hetzner, usar SSH, crear un bot de WhatsApp desde cero, armar un sistema multi-agente que separa la entrevista en etapas para no abrumar al emprendedor entrevistado. También diseñar capas de seguridad: que el agente no entregue información de otros participantes, y que no revele rutas ni configuración interna si alguien intenta manipularlo.

Igualmente tendría que haber invertido tiempo, al menos unas 6 horas, en crear el proceso de entrevista completo.

El costo de operación es unos US$5: US$4.09 de servidor al mes y menos de US$1 en transcripción de audio para los 30 emprendedores. Pero esto (una versión modificada) además, podría atender 100, 500, 1000 emprendedores a un costo marginal.

### ¿Y el costo del modelo?

No es como lo tengo implementado hoy, pero si alguien quisiera replicar esto pagando por uso vía API, el costo depende del modelo.

Una entrevista de 50 minutos genera unos 20 intercambios por WhatsApp. Como cada llamada a la API envía el historial completo, el consumo de tokens crece con cada turno. Para 30 entrevistas serían unos 5.5 millones de tokens de entrada y 240 mil de salida. El costo podría ser algo como:

| Modelo | Costo estimado (30 entrevistas) |
|--------|-------------------------------|
| Kimi K2.5 | ~US$4 |
| Gemini 2.5 Pro | ~US$9 |
| GPT-5 | ~US$9 |
| Claude Sonnet 4.5 | ~US$20 |
| Claude Opus 4.5 | ~US$34 |

Hay una optimización llamada prompt caching (que reutiliza tokens ya enviados para gastar menos), pero para este caso el caché podría expirar entre mensajes si pasa mucho tiempo entre preguntas y respuestas, así que probablemente no funcione para esto.

Para este tipo de tarea lo crítico es que el modelo sepa cuándo una respuesta es vaga y profundice con criterio. Todos los de la tabla podrían funcionar, es cosa de probar. Modelos más baratos que estos probablemente fallen en lo mismo que un practicante: seguir el guión sin saber cuándo insistir.

## Lo que puede salir mal

El costo oculto es el monitoreo. El sistema va a fallar: bugs, errores de transcripción, emprendedores que hacen cosas inesperadas. Hay que revisar periódicamente que todo siga funcionando.

De hecho, el bot partió corriendo en mi computador. Funcionaba, pero dependía de que mi Mac estuviera encendido y conectado. Un día un camión cortó un cable en la calle y me quedé sin internet por horas. Ahí lo migré a un servidor en Hetzner: US$4.09 al mes por confiabilidad operacional 24/7.

## Para quién más sirve esto

El patrón aplica para cualquier situación donde necesitas conversaciones uno a uno que sigan una estructura:

- Consultores que hacen llamadas de discovery
- ONGs que necesitan recoger información estructurada
- Programas de capacitación que quieren dar seguimiento personalizado
- Coaches que necesitan conocer al cliente antes de la primera sesión

Y una larga lista.

## La comparación

|                                    | Hacerlo tú mismo                 | Practicante                               | Bot IA                       |
| ---------------------------------- | -------------------------------- | ----------------------------------------- | ---------------------------- |
| **Costo**                          | Tu tiempo (alto)                 | $300-500/mes                              | ~$5/mes                      |
| **Tiempo de setup**                | 0 horas                          | 5-10 horas (buscar, entrenar, supervisar) | 12 horas (primera vez)       |
| **Calidad de profundización**      | Profesional                      | Limitada                                  | Consistente                  |
| **Escalabilidad**                  | No escala                        | Lineal (1 persona = 1 practicante)        | Ilimitada                    |
| **Disponibilidad**                 | Tu horario                       | Horario laboral                           | 24/7                         |
| **Adaptación al contexto**         | Excelente (si sabes entrevistar) | Depende del guión                         | Buena (si está en el diseño) |
| **Supervisión requerida**          | Ninguna                          | Continua                                  | Continua                     |
| **Costo marginal por emprendedor** | Alto                             | Medio                                     | Casi cero                    |

El bot no reemplaza la conversación con un profesional experimentado. Pero hace económicamente viable entregar acompañamiento personalizado donde antes no lo era.

## El cambio

Mi trabajo real fue diseñar el sistema. Definir qué preguntas hacer, cuándo profundizar, cómo adaptar las respuestas al contexto.

La IA ejecuta ese diseño a escala, sin degradar la calidad, sin aumentar el costo.

No reemplaza al profesional. Pero hace viable lo que antes no lo era.
