# Conexión central · estado vigente del 13 de octubre de 2026

## Solicitud vigente

Actualizar y revisar todas las misiones, la Forja y Mochi; continuar hasta dejarlo armado y revisar/mejorar cada cinco horas. El propietario conserva la edición de Genially y la actualización de su mismo proyecto Apps Script. Mantener exactamente los 16 iframe originales, incluyendo sus rutas, queries, fragmentos, alturas y títulos.

## Código actual: v0.4.3 · Apps Script instalada: v0.4.3

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

v0.4.3 ya está instalada en el /exec original. No volver a reemplazar Código.gs ni publicar otra versión mientras no exista una corrección posterior. Conservar el mismo proyecto, planilla, propiedades, secreto y `/exec`.

Siguiente verificación autorizada: con un personaje de prueba, comprobar continuidad de sesión entre dos misiones, explicación inmediata de una ventaja, compra de STAT, guardado/recuperación de cuaderno y recuperación mediante RES; después contrastar los movimientos en la planilla. CI usa servicios simulados y no acredita estas escrituras reales.

Misión 0 conserva su receptor independiente. No crear otro proyecto ni reemplazar los iframe.

## Revisión periódica

Activa cada cinco horas, sin límite de ciclos hasta que el propietario pida detenerla. Leer primero main, PR, CI y Pages reales. Conservar las entradas activas; una operación autenticada pendiente no justifica devolverlas al modo local. Si se pausa el trabajo por límite de contexto o recursos, retomar el estado publicado, no reiniciar ni revertir avances.

Detalle de pruebas y correcciones: AUDITORIA_ACTUAL.md. Identificación real anterior: AUDITORIA_IDENTIDAD_ENTRADAS_20261011.md. Diseño y recuperación: BIENVENIDA_Y_CLAVES_20261011.md.
