# Estado y pruebas — ARIELA AGENTE VIRTUAL 0.3.0

Fecha de preparación: 28 de octubre de 2026.

## Estados

- **PREVISTO:** propuesto, todavía no construido.
- **EN DESARROLLO:** trabajo activo, sin superar la prueba de aceptación.
- **BLOQUEADO:** falta resolver una dependencia, decisión o permiso.
- **IMPLEMENTADO, NO VALIDADO:** existe código o una pantalla, pero faltan pruebas suficientes.
- **APROBADO:** la prueba se ejecutó, pasó y se registró evidencia identificable.

## Inventario de alcance

| Elemento | Estado | Evidencia / límite |
|---|---|---|
| Interfaz web adaptable a móvil | IMPLEMENTADO, NO VALIDADO | `index.html`; falta comprobar visualmente en el Android objetivo. |
| Demostración con respuestas preparadas | IMPLEMENTADO, NO VALIDADO | `demoReply()` en `index.html`; falta prueba manual del flujo completo en navegador Android. |
| Backend Node.js y archivos estáticos permitidos | IMPLEMENTADO, NO VALIDADO | `server.js`; sujeto a los tests automáticos y al despliegue. |
| Endpoint de estado `/api/health` | IMPLEMENTADO, NO VALIDADO | Devuelve modo y versión, no prueba por sí solo la conexión upstream. |
| Conexión a proveedor de IA | IMPLEMENTADO, NO VALIDADO | Código de llamada a Groq; las claves reales no se prueban aquí. |
| Validación de mensajes, acceso y límites básicos | IMPLEMENTADO, NO VALIDADO | Revisado por código; no equivale a una auditoría de seguridad. |
| PWA y caché de archivos estáticos | IMPLEMENTADO, NO VALIDADO | `manifest.webmanifest` y `sw.js`; la API se excluye de la caché. |
| Cuentas individuales, memoria permanente | PREVISTO | Fuera del alcance de esta versión. |
| Voz y avatar animado | PREVISTO | Fuera del alcance de esta versión. |
| Pagos y publicación automatizada | PREVISTO | Fuera del alcance de esta versión. |

## Pruebas automáticas incluidas

El script `smoke-test.mjs` levanta el servidor en un puerto local separado y verifica:

1. `/api/health` responde 200, muestra versión 0.3.0 y detecta modo demo sin secretos.
2. La página principal carga y ya no muestra el mensaje contradictorio de que la IA real aún requiere configurar un servidor seguro.
3. El manifiesto PWA se puede leer como JSON y el service worker se sirve correctamente.
4. El HTML/JavaScript integrado y los archivos de configuración pueden analizarse sintácticamente.
5. Los archivos privados o no permitidos no se sirven públicamente.
6. Una petición al chat desde otro origen se rechaza.
7. El chat devuelve el error esperado cuando faltan las variables del proveedor.
8. Las rutas API desconocidas no se publican como archivos.
9. El archivo de configuración y los nombres de variables esperados están presentes.

**Resultado real en el entorno de preparación:** `npm run check` y `npm test` terminaron sin errores en Node.js v22.16.0. El smoke test aprobó 9/9 comprobaciones y el test de acceso aprobó 6/6. Estas pruebas utilizan un servidor local y credenciales ficticias; no llaman al proveedor de IA con una clave real y no sustituyen las pruebas manuales desde Android.

## Pruebas manuales pendientes de realizar desde Android

| ID | Caso | Resultado esperado | Estado al entregar |
|---|---|---|---|
| A-01 | Abrir la URL de Render en Chrome Android | No hay desbordamientos ni controles fuera de pantalla. | PENDIENTE |
| A-02 | Usar modo demo y enviar “Hola” | Respuesta de demostración y controles vuelven a habilitarse. | PENDIENTE |
| A-03 | En modo conectado, introducir el código correcto y enviar “Hola” | Se recibe una respuesta real del proveedor. | PENDIENTE con variables reales |
| A-04 | Introducir un código incorrecto | Se muestra un error claro; no se muestra información del proveedor. | PENDIENTE con servidor configurado |
| A-05 | Pedir una campaña de pastelería sin nombre ni presupuesto | ARIELA no inventa el nombre o una cifra de presupuesto como hechos; explicita propuestas provisionales. | PENDIENTE con IA real |
| A-06 | Pedir un presupuesto con porcentajes | Las partidas y porcentajes se aclaran y cuadran matemáticamente. | PENDIENTE con IA real |
| A-07 | Enviar una pregunta muy larga o inválida al endpoint | Se rechaza con mensaje controlado. | Parcialmente cubierto por validación de código; falta test específico de límites |
| A-08 | Simular un proveedor que no responde o devuelve error | Se explica el fallo sin exponer secretos y se permite reintentar. | PENDIENTE con prueba de integración |
| A-09 | Pulsar “Nuevo chat” y recargar la página | Se limpia el historial visible; no reaparece una memoria anterior. | PENDIENTE |
| A-10 | Revisar logs tras pruebas | No aparecen claves, códigos ni textos de conversación. | PENDIENTE en el panel de Render |

## Bloqueos y siguiente acción

- **Bloqueo:** no se dispone de la clave de API ni del código privado, y no deben compartirse en el chat. La integración upstream no puede aprobarse sin una prueba hecha en el servidor real.
- **Siguiente acción concreta:** ejecutar los comandos automáticos del paquete, guardar su resultado y hacer las pruebas manuales A-01 a A-10 antes de declarar el prototipo aprobado.
- **Criterio de salida:** todas las pruebas críticas completadas, fallos corregidos o documentados y evidencia sin secretos guardada. Hasta entonces, el estado global es **IMPLEMENTADO, NO VALIDADO**.
