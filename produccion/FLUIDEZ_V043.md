# Ludaria v0.4.3 — ventajas inmediatas y ventana de carga

El propietario confirmó que v0.4.2 conserva la sesión entre las misiones. Esta actualización conserva los iframe, los datos y la estética existente.

- Al abrir una ayuda disponible según el perfil cargado, su explicación aparece inmediatamente, desde el catálogo público que ya forma parte de la misión. Se comprueba el acceso en segundo plano. La explicación provisional se retira si Google rechaza el acceso.
- El catálogo muestra las posibilidades del perfil cargado sin esperar. Un aviso indica la comprobación de atributos actuales; la respuesta del servidor actualiza los candados. El servidor siempre comprueba el umbral antes de permitir una acción.
- La consulta de ventaja devuelve también la decisión guardada y su revisión: una llamada en lugar de dos llamadas consecutivas. El formulario de decisión se habilita solo después de recuperar la revisión confirmada. Se conserva compatibilidad con la respuesta del servidor anterior.
- Forja y Mochi muestran una ventana de carga con el nombre del personaje, su retrato cuando ya se conoce y una barra animada sin porcentaje ficticio. Desaparece al confirmar la sesión o vuelve al acceso manual si falla. Respeta movimiento reducido.

Para activar: reemplaza Código.gs por el archivo completo v0.4.3, guarda, ejecuta diagnosticarConexionLudaria y prepararConexionLudaria, y publica Nueva versión de la implementación existente. No cambies los iframe ni el /exec.

Validación nueva: explicación y catálogo visibles antes de responder el servicio simulado; una solicitud por ventaja; los formularios esperan la revisión confirmada; ventanas de Forja/Mochi y cierre tras confirmación. Las confirmaciones reales de Google pueden seguir tardando varios segundos; no se garantiza guardado instantáneo. Las imágenes de Genially quedan a cargo del propietario.
