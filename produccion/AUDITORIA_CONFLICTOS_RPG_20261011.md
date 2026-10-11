# Revisión adicional · 11 de octubre de 2026

## Cambios comprobados

- La interfaz de decisiones envía la revisión que consultó. Si otra sesión confirmó un ensayo después, el servidor rechaza el reemplazo y no agrega una nueva decisión.
- El borrador propio se conserva. «Comparar con la decisión confirmada» permite consultar ruta, ensayo y motivo actuales. Solo «Retomar mi ensayo tras comparar» cambia la revisión de referencia; todavía exige confirmar el guardado.
- Un reintento de una decisión ya guardada recupera su evento sin duplicarlo, incluso si hubo otro cambio posterior.
- Un fallo inmediato del canal Apps Script limpia el temporizador de espera y devuelve el error.

## Evidencia

Primera pasada: servidor general, servidor RPG y gateway (24 escenarios) aprobados. Segunda pasada DOM: 13 misiones y 39 ventajas aprobadas, más doce escenarios de resiliencia, incluidos conflicto de sesiones con comparación y fallo inmediato de comunicación. Servicios ficticios; sin escrituras en Google real.

La nueva protección se aplica a las interfaces actualizadas que envían `expectedEventId`; las llamadas antiguas sin este campo mantienen compatibilidad. Por eso la actualización conjunta de interfaz/Apps Script y la comprobación real siguen pendientes. El historial anterior no se borra.

La prueba gráfica no pudo ejecutarse: el intento de instalar Chromium recibió descargas inválidas; no hay motor gráfico utilizable. Se comprobó la sintaxis de la prueba, pero esto no acredita escritorio, móvil, foco real ni iframe.

## Publicación y responsabilidades

No hubo push, PR nuevo, fusión ni actualización de Apps Script. No se cambió Genially, a cargo del propietario según su última indicación. El rechazo automático anterior exige autorización explícita posterior para publicar código/documentación en nespinozagonzalez-hub/misiones. El último mensaje autoriza continuar pruebas y correcciones; no expresa explícitamente esa publicación. No se reintentó por otro medio.

Después de publicar la rama y completar el CI, revisar/fusionar dependencias antes de actualizar el mismo proyecto Apps Script. No cambiar el secreto, no crear otra planilla y conservar el /exec. Comprobar Google real; gateway continúa desactivado.
