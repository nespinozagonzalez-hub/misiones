# Primera comprobación de Google real · 11 de octubre de 2026

El propietario ejecutó prepararConexionLudaria sin errores y proporcionó el despliegue:
https://script.google.com/macros/s/AKfycbyvVPZisRWGT0q3olj4E5vFQTxRokE6jd7seoMDV5hPPBV8S2srHuFlwjkpqk8P1-Fh/exec

## Evidencia observada en navegador
- Forja carga mediante HtmlService y muestra identidad central.
- Se creó un personaje ficticio de prueba; se generó una clave personal. No se reproduce la clave en esta auditoría.
- ECO101 acreditó 30 XP y 3 puntos. Tras repetir la runa, Actualizar perfil recuperó 30 XP y 3 puntos desde servidor: no aumentó el saldo.
- Maestría muestra Ojo del Artesano, umbral 5 y demostración previa.
- Entrada ?entrada=mochi carga identidad central y mercadito.
- Se creó un segundo personaje ficticio para verificar Mochi. NEX451 acreditó 60 XP y 5 puntos.
- Seleccionar cuatro mejoras de Maestría mostró una vista previa; confirmar la compra registró Maestría 5 y saldo 1. El historial mostró Creación, NEX451 y Compra con Mochi (−4).
- La entrada ?mision=vetas-diseno carga y solicita la misma identidad central.

Estos son personajes ficticios creados por esta prueba, no participantes existentes. Sus registros se conservan; no se borraron filas ni se alteraron otros personajes.

## Regresión con dobles
node ludaria/test-server.cjs: PASS en el workspace existente. Es una prueba simulada y no sustituye las comprobaciones reales anteriores.

## Pendiente
- Recuperación con clave en otra sesión/dispositivo: todavía no ejecutada.
- Cuaderno de Vetas y continuidad de borradores: todavía no ejecutados contra Google real.
- Ojo del Artesano en Vetas y retirada tras redistribución: pendiente.
- Integración en Genially real, móvil y accesibilidad del iframe: pendiente.
- Las rutas de GitHub no se redirigieron; gateway sigue desactivado.
- El resto de las sesiones todavía necesita adaptadores y habilitación del servidor.

La publicación elimina el bloqueo por falta de /exec. No pedir otra instalación.
La automatización existente recibió el enlace y esta evidencia, conservando su cadencia de tres horas.
