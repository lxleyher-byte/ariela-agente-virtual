# Registro de decisiones — ARIELA AGENTE VIRTUAL

## D-001 · Alcance de la primera entrega
- **Fecha:** 28 de octubre de 2026
- **Estado:** Adoptado para el paquete de prototipo; sujeto a pruebas de aceptación.
- **Decisión:** priorizar chat web por texto, servidor de prueba, conexión de IA con límites, documentación y tests básicos.
- **Queda fuera por ahora:** cuentas individuales, base de datos, memoria permanente, voz, avatar animado, pagos y automatizaciones externas.
- **Motivo:** mantener una primera versión pequeña que se pueda probar desde Android y sin presupuesto inicial para desarrollo.

## D-002 · Tecnología del backend
- **Fecha:** 28 de octubre de 2026
- **Estado:** Provisional; no es una decisión de producción.
- **Decisión de esta entrega:** conservar Node.js para no migrar de tecnología durante la corrección del prototipo existente.
- **Contexto del manual:** la Guía Coordinada v2.1 indica que el Manual Maestro propone evaluar Python + FastAPI y deja la elección técnica sujeta a revisar entorno y requisitos.
- **Motivo práctico:** ya existe una implementación Node publicada y conectada; mantenerla permite validar la primera versión con menos cambios desde el teléfono. Se registra explícitamente para no presentar la elección como requisito del manual.
- **Revisión necesaria:** si la siguiente fase o los requisitos favorecen FastAPI, evaluar la migración mediante una decisión documentada y pruebas equivalentes.

## D-003 · Proveedor de IA
- **Estado:** Configuración heredada que requiere prueba periódica.
- **Decisión de esta entrega:** mantener el endpoint compatible con chat de Groq y una variable `ARIELA_MODEL` configurable.
- **Límite:** disponibilidad del modelo, precio, límites de cuota y política del proveedor deben verificarse en su panel antes de una nueva publicación o de uso público.

## D-004 · Memoria e historial
- **Estado:** Confirmado para el prototipo.
- **Decisión:** historial de conversación solo en la memoria temporal de la página y enviado al proveedor cuando se usa modo conectado. No hay base de datos ni recuperación tras cerrar o recargar la página. El código de acceso se conserva únicamente en `sessionStorage` durante la sesión de la pestaña.
