# Subir el paquete final a GitHub desde Android

Este paquete reúne los archivos en la raíz del proyecto para facilitar una sola carga desde el teléfono. **No subas el ZIP como si fuera el código del proyecto**: primero debes extraerlo y después subir los archivos que contiene.

## Antes de subir

1. Descarga `ARIELA_AGENTE_VIRTUAL_v0.3.0.zip` y extráelo en la aplicación Archivos del teléfono. Abre la carpeta `ariela_final` que aparece dentro.
2. Si tu gestor de archivos oculta archivos que comienzan por punto, activa la opción de mostrar archivos ocultos para incluir `.gitignore` y `.env.example`. Comprueba que veas `server.js`, `index.html`, `package.json`, `render.yaml`, `README.md`, los archivos `.md`, los iconos y los archivos de prueba.
3. No agregues una clave real de API, el código privado, un archivo `.env` ni capturas que contengan credenciales.
4. La Guía Coordinada recomienda un repositorio privado. Para seguir esa recomendación antes de la carga completa, cambia el repositorio a privado o prepara una copia privada. No publiques claves ni códigos privados, aunque el repositorio sea privado.

## Carga en una sola actualización

1. Abre GitHub en Chrome e inicia sesión.
2. Abre el repositorio destino y asegúrate de estar en la rama correcta.
3. Usa **Add file / Agregar archivo → Upload files / Subir archivos**.
4. Selecciona todos los archivos extraídos de la carpeta del proyecto. Como esta versión mantiene los documentos y las pruebas en la raíz, no tienes que crear subcarpetas para ellos.
5. Comprueba que se ven `server.js`, `index.html`, `package.json`, `package-lock.json`, `render.yaml`, `.env.example`, `.gitignore`, los iconos y todos los archivos `.md` y `*-test.mjs`.
6. Escribe un mensaje de commit, por ejemplo `Preparar prototipo ARIELA v0.3.0`, y confirma la carga una sola vez.
7. Antes de tocar Render, revisa la lista de archivos de GitHub y asegúrate de que no se haya subido ningún secreto.

La interfaz de GitHub puede variar en móvil. Si el navegador no permite seleccionar todos los archivos o no conserva sus nombres, cancela la carga y no hagas commits parciales; prueba Chrome en modo escritorio o usa otro método de subida. No subas solamente el ZIP porque Render necesita los archivos del proyecto descomprimidos.

## Después de la carga

- Si Render despliega automáticamente desde ese repositorio, revisa los registros del despliegue y luego abre `/api/health`.
- Comprueba que las variables `GROQ_API_KEY` y `ARIELA_ACCESS_CODE` sigan configuradas en el servicio privado de Render. No las pegues en GitHub ni en este chat.
- Si el despliegue falla, guarda el error sin secretos y corrige primero el bloqueo; no lo declares aprobado hasta repetir la prueba.
- Ejecuta `npm run check` y `npm test` en un entorno con Node.js 20 o superior cuando tengas acceso a uno. Los resultados locales incluidos en `ESTADO_Y_PRUEBAS.md` corresponden a la preparación de este paquete.
