# ARIELA AGENTE VIRTUAL · v0.2

Prototipo web móvil con interfaz en español, modo de demostración local y backend opcional para conectar un modelo de IA. Este proyecto todavía no es un producto listo para público ni sustituye las revisiones de seguridad, privacidad o asesoría legal.

## Qué incluye

- Interfaz adaptable a Android y computadora.
- PWA: puede instalarse desde el navegador después de publicarla en HTTPS compatible.
- Modo demo cuando no hay IA configurada. Las respuestas demo son ejemplos preparados.
- Servidor Node.js sin dependencias externas.
- Ruta `/api/chat` que envía las conversaciones al proveedor desde el servidor, no desde el navegador.
- Clave de proveedor y código de acceso como variables privadas del servidor.
- Límites básicos de tamaño y frecuencia de solicitudes.
- Sin cuentas ni memoria persistente; el historial está solo en la sesión abierta.

## Ejecutar en una computadora

Necesitas Node.js 20 o superior.

```bash
npm start
```

Después visita `http://localhost:3000`. Si no has configurado variables, la aplicación se abrirá en modo demo.

## Activar una IA real

El servidor está preparado para el endpoint de chat compatible con OpenAI de Groq. Necesitas una cuenta y una clave de API de ese proveedor. La disponibilidad, modelos y límites del plan gratuito pueden cambiar; la clave no debe compartirse ni escribirse en `index.html`.

Configura estas variables en el entorno privado del servidor:

- `GROQ_API_KEY`: clave de API privada.
- `ARIELA_MODEL`: modelo compatible habilitado en tu cuenta (el valor inicial es `openai/gpt-oss-20b`).
- `ARIELA_ACCESS_CODE`: frase de acceso privada, larga y difícil de adivinar. La aplicación la solicitará en el navegador.
- `PORT`: lo configura normalmente el alojamiento.

La clave de API se guarda únicamente como variable del servidor. No se mete en archivos públicos ni se solicita al usuario final. Nunca publiques el prototipo con IA habilitada sin configurar `ARIELA_ACCESS_CODE`.

## Publicación de prueba en Render

El archivo `render.yaml` contiene una configuración inicial para un servicio web gratuito. Render puede suspender servicios gratuitos cuando están inactivos, y la primera petición posterior puede tardar en responder. El plan gratuito es para pruebas, no para garantizar un servicio de producción.

Ruta general de publicación:

1. Crea un repositorio **privado** en GitHub.
2. Sube los archivos de este paquete a la raíz del repositorio: `server.js`, `package.json`, `render.yaml`, `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `.gitignore` y `README.md`.
3. En Render, crea un servicio a partir del repositorio o usa su función Blueprint para leer `render.yaml`.
4. En las variables privadas del servicio configura `GROQ_API_KEY` y `ARIELA_ACCESS_CODE`. No las pongas en el repositorio.
5. Espera a que Render indique que el despliegue terminó y abre la URL HTTPS que te asigne.
6. Prueba primero con mensajes no sensibles. Verifica los registros del servicio sin registrar contenido de conversaciones.

Si lo haces desde Android, el panel web del proveedor puede ser más cómodo en el navegador; no hace falta programar a mano. Tendrás que crear y autorizar las cuentas de GitHub, el proveedor de IA y Render tú misma porque son cuentas personales y no puedo entrar ni aceptar condiciones en tu nombre desde este chat.

## Límites conocidos

- No contiene autenticación por usuario, base de datos, historial permanente, panel de administración ni copias de seguridad.
- El código de acceso compartido protege solo una prueba privada; no equivale a un sistema de cuentas. No lo anuncies públicamente ni uses datos reales de otras personas.
- El límite de solicitudes es básico y en memoria; puede reiniciarse al reiniciar el servicio. No es suficiente para un lanzamiento público.
- El chat envía los mensajes de la sesión al proveedor de IA cuando está conectado. Revisa las condiciones y la privacidad del proveedor antes de usar datos personales.
- El service worker solo cachea los archivos de interfaz; nunca cachea las rutas de IA.
- No se afirma que la aplicación esté registrada legalmente o publicada en una tienda.

## Estados del proyecto

- **Construido en este paquete:** interfaz v0.2, PWA básica, servidor, endpoint de IA y guía.
- **Probado localmente:** se comprobarán sintaxis, carga de interfaz y endpoint de estado antes de entregar.
- **Pendiente fuera de este entorno:** crear las cuentas, guardar la clave privada en el alojamiento, publicar, probar con la clave real y revisar seguridad/privacidad.
