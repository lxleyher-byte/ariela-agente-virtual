# ARIELA AGENTE VIRTUAL · Prototipo 0.3.0

Primera versión web de ARIELA para probar conversación por texto. Está pensada para funcionar en móvil, con una ruta de trabajo sencilla y sin dependencias de código externas. La interfaz puede funcionar como demostración local; la IA real requiere configurar el servidor.

## Alcance de esta versión

**Incluido en el código:** interfaz responsive; modo demostración; backend Node.js; endpoint `/api/health`; endpoint `/api/chat`; conexión compatible con la API de chat de Groq; instrucciones del agente; validación básica de entrada; código privado compartido; límite de solicitudes en memoria; errores sin exponer respuestas crudas del proveedor; PWA y caché de archivos estáticos sin cachear la API; comprobaciones automáticas de humo.

**No incluido:** cuentas individuales, base de datos, memoria permanente, aplicación nativa, voz, avatar animado, pagos, publicación automática ni herramientas para operar cuentas externas. No presentar estas funciones como disponibles.

## Requisitos y ejecución local

- Node.js 20 o superior.
- No necesita paquetes npm de terceros.

En la carpeta del proyecto:

```bash
npm start
```

Abre `http://localhost:3000`. Si faltan las variables del proveedor, funcionará en modo demo. Para comprobar sintaxis y rutas básicas:

```bash
npm run check
npm test
```

Las pruebas de humo no verifican la disponibilidad real del proveedor ni sustituyen una prueba manual desde Android.

## Configuración privada de la IA

Variables que deben ponerse en la configuración privada del servicio de alojamiento:

- `GROQ_API_KEY`: clave privada de API del proveedor.
- `ARIELA_ACCESS_CODE`: código largo y privado para la prueba compartida.
- `ARIELA_MODEL`: nombre del modelo que está habilitado en la cuenta. Por defecto: `openai/gpt-oss-20b`.
- `PORT`: se define normalmente desde el alojamiento; localmente usa `3000`.

`GROQ_API_KEY` y `ARIELA_ACCESS_CODE` **no se escriben en archivos públicos, `index.html`, issues, capturas ni mensajes de chat**. El archivo `.env.example` solo contiene nombres de variables vacías. `.env` está excluido mediante `.gitignore`.

La pantalla `IA configurada` confirma únicamente que el servidor detecta las variables necesarias; no garantiza por sí sola que la clave, el modelo o el proveedor estén respondiendo. La conexión real se valida al enviar un mensaje.

## Despliegue de prueba en Render

`render.yaml` contiene la configuración para un servicio Node. Si lo conectas a un servicio existente, revisa el nombre y la configuración antes de aplicar cambios. En las variables privadas del servicio, configura `GROQ_API_KEY` y `ARIELA_ACCESS_CODE`. No las incluyas en GitHub.

Tras desplegar, comprueba `/api/health` y prueba el chat con preguntas no sensibles. Los servicios gratuitos pueden tener límites, suspensiones por inactividad o demoras; los precios, modelos y disponibilidad del proveedor deben verificarse en el propio panel antes de depender de ellos.

## Seguridad y privacidad: límites de esta prueba

- El código de acceso es compartido y no representa cuentas ni autentica usuarios de forma individual. No es suficiente para un lanzamiento público.
- El limitador está en memoria y es una defensa básica; se reinicia al reiniciar el servicio y no es un limitador de producción.
- Los mensajes de la conversación se envían al proveedor de IA al usar el modo conectado. No introduzcas datos personales sensibles.
- No se guarda historial permanente ni se configura una base de datos.
- El servidor evita registrar el texto de las conversaciones y no devuelve claves ni errores crudos del proveedor al navegador.
- La configuración CSP permite estilos y scripts dentro del HTML porque esta versión los integra en un archivo. Si se divide la página en archivos, conviene endurecerla.
- Antes de abrir al público: revisar autenticación real, privacidad y retención, límites de costo, controles de abuso, accesibilidad, actualización de dependencias/plataformas y requisitos legales aplicables.

## Decisión técnica registrada

El Manual Maestro recomienda evaluar Python/FastAPI y considera Node.js una alternativa; la elección de tecnología no debe asumirse resuelta por defecto. Para esta entrega se conserva **provisionalmente Node.js** porque el prototipo existente ya está publicado en esa tecnología y el objetivo inmediato es corregirlo sin una migración grande desde Android. Este motivo queda registrado para revisión: no significa que Node.js sea universalmente mejor ni que la arquitectura haya sido aprobada para producción.

## Estado real del proyecto

Consulta `ESTADO_Y_PRUEBAS.md` para ver qué se construyó en esta entrega, qué comprobaciones automatizadas se ejecutaron y qué pruebas siguen pendientes. Las capacidades solo se marcarán como aprobadas cuando exista una prueba observable y un registro del resultado.
