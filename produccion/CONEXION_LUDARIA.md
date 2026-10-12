# Conexión central · estado vigente del 12 de octubre de 2026

## Solicitud vigente

Actualizar y revisar todas las misiones, la Forja y Mochi; continuar hasta dejarlo armado y revisar/mejorar cada cinco horas. El propietario conserva la edición de Genially y la actualización de su mismo proyecto Apps Script. Mantener exactamente los 16 iframe originales, incluyendo sus rutas, queries, fragmentos, alturas y títulos.

## Versión actual de código: v0.4.1

- v0.4.0 fue publicada por PR #11 como 704d6d92f21e221287a57ed4c2a4b4857aca21ea, CI 38176763248 y Pages 38176965235 aprobados. Incorpora retratos, clave elegida de seis dígitos y recuperación mediante respaldo RES.
- v0.4.1 actualiza los 13 adaptadores y sus entradas HTML para recuperar la pantalla guardada aunque el iframe siga incluyendo #pantalla-1. Conserva la ruta central y los enlaces profundos de una práctica nueva.
- PR #16 quedó integrado como `227053d8d7d96c67f885bbee314de98d769e8a36`. El acceso secundario de la Forja contiene únicamente «Cargar mi personaje» y «Volver a la Forja»; las 13 misiones muestran su paisaje, el retrato del guardián y los campos para el mismo nombre/código. No altera actividades, recompensas ni el contrato de los iframe.
- El cliente compartido espera la confirmación de guardados simultáneos, conserva ediciones posteriores y permite consultar nombre/clave desde Forja y Mochi. Copiar códigos tiene alternativa si el portapapeles está bloqueado. El formulario de recuperación es más compacto.
- Misión 0 avisa si no puede conservar el borrador al cerrar. Instrumento, receptor y transporte originales conservados por huellas SHA-256 y prueba de ocho preguntas/recibo interceptado.
- El gateway permanece activo. La identificación de Forja, Mochi y los 13 guardianes se comprobó en el Genially original; la nueva bienvenida v0.4.1 requiere instalar su Código.gs en la implementación existente.

## Límites de la comprobación real

El /exec original respondió durante la revisión real anterior y mostró Nara con la bienvenida anterior, sin los nuevos retratos/clave elegida. El repositorio y Apps Script tienen ciclos de publicación distintos: publicar GitHub Pages no reemplaza el cliente incrustado en Apps Script. El Código.gs vigente de PR #16 tiene SHA-256 `600fc8e1cae58f0de69f9bb4be9c99ab26f33cc22fee71ac2f9e8c47c2704d49`.

La auditoría de código usa servicios simulados y no escribe en la planilla real. Registro, recuperación, compras, XP, cuadernos y diagnóstico pasan con esos servicios; la escritura autenticada real de la nueva versión se comprueba después de actualizar la implementación. Los recursos externos opcionales de las sesiones requieren sus enlaces institucionales; las alternativas locales no acreditan una recepción externa.

## Actualización del mismo Apps Script

1. Reemplazar TODO Código.gs por ludaria/Code-Ludaria-Conectado.gs v0.4.1 en el MISMO proyecto vinculado a la planilla.
2. Guardar y ejecutar prepararConexionLudaria con la cuenta propietaria; conserva propiedades, personajes, secreto y estructura de hojas.
3. Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar. Conservar el /exec existente.
4. Recargar Genially. Verificar la bienvenida, nombre/clave elegidos, copia del respaldo y recuperación del mismo personaje.

Misión 0 conserva su receptor independiente. No crear otro proyecto ni reemplazar los iframe.

## Revisión periódica

Activa cada cinco horas, sin límite de ciclos hasta que el propietario pida detenerla. Leer primero main, PR, CI y Pages reales. Conservar las entradas activas; una operación autenticada pendiente no justifica devolverlas al modo local. Si se pausa el trabajo por límite de contexto o recursos, retomar el estado publicado, no reiniciar ni revertir avances.

Detalle de pruebas y correcciones: AUDITORIA_ACTUAL.md. Identificación real anterior: AUDITORIA_IDENTIDAD_ENTRADAS_20261011.md. Diseño y recuperación: BIENVENIDA_Y_CLAVES_20261011.md.
