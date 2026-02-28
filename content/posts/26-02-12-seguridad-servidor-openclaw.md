+++
title = '5 minutos de seguridad que no son opcionales'
date = 2026-02-12
draft = false
tags = ["seguridad", "servidor", "openclaw", "hetzner", "vps"]
categories = ["tecnología"]
description = 'Un servidor nuevo viene sin protección. Arréglalo en 5 minutos.'
aliases = ["/posts/seguridad-servidor-openclaw/"]
[cover]
image = "/images/og/seguridad-servidor-openclaw.png"
hidden = true
+++

[OpenClaw](https://openclaw.ai/) se convirtió en tendencia en las últimas semanas por lo simple que es montar agentes de IA que funcionen 24/7 conectados a WhatsApp, Telegram y a una gran variedad de servicios, facilitando realizar o automatizar tareas de tu día a día.

Puedes correrlo en tu computador para proyectos personales. Pero si necesitas alta disponibilidad, lo mejor es montarlo en un servidor (VPS). Yo [aprendí eso por las malas](/posts/26-02-11-bot-entrevistas-ia/) cuando un camión cortó un cable y mi bot de entrevistas se cayó por días.

Así que lo migré a un VPS de Hetzner. US$4.09/mes. Funciona increíble.

Pero cuando revisé la configuración, me di cuenta de que el servidor venía abierto como una puerta sin llave. Así es la configuración por defecto.

---

## Lo que trae un VPS nuevo por defecto

Si nunca has arrendado un servidor, esto te puede sorprender. Es muy normal que los proveedores te entreguen un servidor limpio y tú decides cómo configurarlo. Esto es lo que viene de fábrica:

- **Sin firewall**: cualquiera en internet puede intentar conectarse a cualquier puerto de tu servidor. Es como tener todas las puertas de tu casa abiertas.
- **SSH acepta passwords**: SSH es la forma de conectarte remotamente a tu servidor. Alguien puede probar miles de combinaciones hasta adivinar cómo entrar.
- **Sin fail2ban**: fail2ban es un programa que detecta cuando alguien intenta adivinar tu password muchas veces y lo bloquea. Sin él, pueden intentar sin límite.
- **Todo corre como root**: root es el usuario con acceso total al servidor. Si alguien entra, tiene control de todo.

Si no cambias esto, así se queda. Y probablemente nadie te avise.

Usé Hetzner, que es uno de los proveedores de VPS más respetados de la industria, así que no es un problema de Hetzner, simplemente así es como funcionan prácticamente todos los proveedores.

## Por qué importa

Si solo estás probando cosas, quizás da lo mismo. Pero cuando tu servidor maneja datos de otras personas, o sensibles tuyos, la cosa cambia.

El [bot de entrevistas](/posts/26-02-11-bot-entrevistas-ia/) que mencioné guarda nombres, teléfonos, información de negocios. Si alguien compromete el servidor, expongo datos que no son míos. De gente que confió en el sistema.

Además, en Chile la [Ley 21.719](https://www.bcn.cl/leychile/Navegar?idNorma=1209272) de protección de datos personales entra en vigencia en diciembre de 2026. Con multas de hasta 20.000 UTM para infracciones gravísimas. Si manejas datos de otras personas, la seguridad del servidor donde los guardas ya no es solo buena práctica mínima, es una obligación legal.

## Lo que hice en menos de 5 minutos

Si estás usando OpenClaw en un VPS, esto es lo mínimo que deberías hacer tú también.

### 1. Activar el firewall

El firewall decide qué conexiones entran y cuáles no. Por defecto está apagado.

```bash
ufw allow 22/tcp      # Permite SSH (tu control remoto)
ufw allow 22000/tcp   # Otros puertos que necesites
ufw enable
```

Con esto solo quedan abiertos los puertos que necesitas. Todo lo demás queda bloqueado.

### 2. Deshabilitar passwords en SSH

En vez de passwords (que se pueden adivinar), usas una llave SSH. Es un archivo en tu computador que funciona como una llave única, y sin ella, nadie puede entrar.

```bash
# En /etc/ssh/sshd_config cambiar a:
PasswordAuthentication no
```

```bash
systemctl restart sshd
```

### 3. Instalar fail2ban

Fail2ban vigila los intentos de acceso. Si alguien prueba muchas veces, lo bloquea automáticamente.

```bash
apt install fail2ban -y
systemctl enable fail2ban
```

## El truco para no quedarte afuera

El orden importa y esto es clave.

Primero agregas la regla que permite SSH, después activas el firewall. Si lo haces al revés, te bloqueas a ti mismo y no puedes volver a entrar.

Lo mismo con los passwords: antes de deshabilitarlos, asegúrate de que tu llave SSH funciona. De lo contrario, te quedas afuera y te toca reiniciar en modo rescate desde el panel de Hetzner.

## Siguientes pasos

Con firewall, SSH por llaves y fail2ban, el servidor ya no está expuesto. Pero hay cosas que mejorar:

- Crear un usuario no-root para los servicios (limitar el daño si algo falla)
- Backups automáticos (resiliencia, no seguridad)

## El punto

Cada vez más gente que no viene del mundo técnico está montando agentes de IA en servidores. OpenClaw hace que sea fácil. Pero fácil de instalar no significa que venga seguro.

Si tu servidor maneja datos sensibles, de otras personas, o en realidad para cualquier caso, estos 5 minutos de configuración nunca son opcionales.