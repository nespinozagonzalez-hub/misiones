# Conexión central · cierre de revisión del 16 de octubre de 2026

## Solicitud vigente

El propietario pidió una última revisión, un informe de mejoras y el cierre de la revisión periódica el 16 de octubre. El encargo anterior de repetir cada cinco horas queda cerrado. El propietario conserva la edición de Genially y la actualización de su mismo proyecto Apps Script. Mantener exactamente los 16 iframe originales, incluyendo sus rutas, queries, fragmentos, alturas y títulos.

## Código preparado: v0.4.4 · cliente Apps Script instalado: v0.4.3

v0.4.4 retira únicamente la rutina histórica `probarLudaria_`: guardaba un PIN DEMO en una propiedad en texto y sus comprobaciones ya no correspondían al catálogo actual. Ahora devuelve una explicación sin crear personajes, escribir hojas o modificar propiedades. Las pruebas vigentes se ejecutan con servicios aislados en CI. El cliente, API de participantes, catálogo y gateway no cambian.

La corrección modifica el Código.gs completo, SHA-256 `35583c8482761b60fbb9c448a524aa19702a8c0963dd318f287c8cda5882c7c1`. Su instalación en Google queda pendiente del propietario: reemplazar `ludaria/Code-Ludaria-Conectado.gs` en el proyecto original y actualizar la MISMA implementación `/exec`. No ejecutar de nuevo la preparación ni la rutina antigua. Si existe la propiedad histórica `LUDARIA_DEMO_PIN`, retirar solo esa propiedad desde la configuración del proyecto, sin mostrar/copiar su valor; conservar el secreto original, los verificadores, respaldos, personajes y demás propiedades. No se hizo esa limpieza en Google durante la revisión.

- v0.4.0 fue publicada por PR #11 como 704d6d92f21e221287a57ed4c2a4b4857aca21ea, CI 38176763248 y Pages 38176965235 aprobados. Incorpora retratos, clave elegida de seis dígitos y recuperación mediante respaldo RES.
- v0.4.1 actualiza los 13 adaptadores y sus entradas HTML para recuperar la pantalla guardada aunque el iframe siga incluyendo #pantalla-1. Conserva la ruta central y los enlaces profundos de una práctica nueva.
- v0.4.2 conserva la sesión firmada en la misma pestaña, recupera perfil y cuaderno en una llamada, evita guardados sin cambios y reduce lecturas repetidas sin cachear atributos entre operaciones.
- v0.4.3 muestra de inmediato la explicación y el catálogo de ventajas a partir del perfil ya cargado, pero espera la validación de Google antes de habilitar decisiones. La consulta confirmada devuelve también la revisión guardada. Forja y Mochi muestran una ventana de carga durante la recuperación de sesión.
- PR #16 quedó integrado como `227053d8d7d96c67f885bbee314de98d769e8a36`. El acceso secundario de la Forja contiene únicamente «Cargar mi personaje» y «Volver a la Forja»; las 13 misiones muestran su paisaje, el retrato del guardián y los campos para el mismo nombre/código. No altera actividades, recompensas ni el contrato de los iframe.
- El cliente compartido espera la confirmación de guardados simultáneos, conserva ediciones posteriores y permite consultar nombre/clave desde Forja y Mochi. Copiar códigos tiene alternativa si el portapapeles está bloqueado. El formulario de recuperación es más compacto.
- Misión 0 avisa si no puede conservar el borrador al cerrar. Instrumento, receptor y transporte originales conservados por huellas SHA-256 y prueba de ocho preguntas/recibo interceptado.
- El gateway permanece activo. La identificación de Forja, Mochi y los 13 guardianes se comprobó en el Genially original. El 13 de octubre el mismo /exec comenzó a servir v0.4.3: continuidad de sesión, ventajas inmediatas y ventana de carga, además del atlas, clave elegida y recuperación ya presentes.

## Límites de la comprobación real

El /exec original respondió HTTP 200 con v0.4.3 en Forja, Mochi y las 13 rutas de misión. En las 15 respuestas aparecen la sesión de pestaña, la ventana de carga y la explicación provisional protegida de ventajas, además del atlas y la recuperación. Esta comprobación pública acredita que el cliente nuevo está instalado en la misma URL, no que una operación autenticada haya escrito correctamente en la planilla. El Código.gs vigente tiene SHA-256 `00438e9601b9432fcb53ae8d4d583c0c67e1c7dd248adebf95ead99183a81ea0`.

La auditoría de código usa servicios simulados y no escribe en la planilla real. Registro, recuperación, compras, XP, cuadernos y diagnóstico pasan con esos servicios; la escritura autenticada real de la nueva versión aún debe comprobarse con un personaje autorizado. Los recursos externos opcionales de las sesiones requieren sus enlaces institucionales; las alternativas locales no acreditan una recepción externa.

## Estado del mismo Apps Script

v0.4.3 ya está instalada en el /exec original. La corrección posterior v0.4.4 está preparada para retirar la utilidad de editor, pero no consta instalada. No es necesaria para seguir usando los formularios actuales: no hay nuevas funciones del cliente ni cambios del contrato. Conservar el mismo proyecto, planilla, propiedades, secreto y `/exec`.

Siguiente verificación autorizada: con un personaje de prueba, comprobar continuidad de sesión entre dos misiones, explicación inmediata de una ventaja, compra de STAT, guardado/recuperación de cuaderno y recuperación mediante RES; después contrastar los movimientos en la planilla. CI usa servicios simulados y no acredita estas escrituras reales.

Misión 0 conserva su receptor independiente. No crear otro proyecto ni reemplazar los iframe.

## Revisión periódica cerrada

El propietario pidió cerrarla el 16 de octubre. No reactivarla sin una nueva solicitud. El gateway sigue activo: cerrar la revisión no desactiva Ludaria. Una operación autenticada pendiente no justifica devolver las entradas al modo local. Informe final y prioridades: `CIERRE_REVISION_20261016.md`.

Detalle de pruebas y correcciones: AUDITORIA_ACTUAL.md. Identificación real anterior: AUDITORIA_IDENTIDAD_ENTRADAS_20261011.md. Diseño y recuperación: BIENVENIDA_Y_CLAVES_20261011.md.
