# Ludaria v0.4.2 — sesión y carga

v0.4.1 permanece instalada hasta que el propietario actualice la implementación existente. La prueba manual del propietario confirmó creación, acceso y mejoras. Esta actualización conserva los 16 iframe, las ilustraciones, los personajes, las recompensas y el historial original.

## Cambios

- La sesión firmada se conserva en sessionStorage hasta el vencimiento establecido por el servidor. No se guardan la clave personal, el respaldo ni los cuadernos. Cerrar acceso elimina esta sesión de la pestaña; renovar la clave revoca los accesos anteriores.
- En otra pantalla del mismo origen y pestaña se intenta cargar el personaje automáticamente. Si el navegador bloquea almacenamiento o separa los orígenes de los iframe, se mantiene el acceso manual. No se pasan credenciales en enlaces.
- Inicio recupera perfil y cuaderno en una sola llamada. Las consultas de lectura simultáneas idénticas comparten una solicitud. Los cuadernos idénticos a la última confirmación no se vuelven a enviar.
- Las filas se reutilizan solo dentro de una operación. Nuevos movimientos invalidan la lectura por cambio del número de filas; las vistas editadas invalidan su propia lectura. Los perfiles no se almacenan en caché entre operaciones: las compras y ventajas siempre consultan atributos confirmados.
- Caché de 60 segundos para cabeceras comprobadas e interfaces públicas pequeñas. Una ausencia, error o expulsión de la caché vuelve al flujo habitual. La instalación valida todas las cabeceras, conserva secretos y no elimina datos.
- Se mantienen bloqueo de escrituras, revisión de conflictos, reintentos idempotentes y avisos de guardado pendiente. La optimización del bloqueo global se pospone hasta medir concurrencia real.

## Actualizar la misma implementación

1. Respalda Código.gs actual. Reemplaza su contenido completo por `ludaria/Code-Ludaria-Conectado.gs` v0.4.2.
2. Guarda. Ejecuta `diagnosticarConexionLudaria`; comprueba `puedePreparar:true` y `secretoConservado:true`.
3. Ejecuta `prepararConexionLudaria` con la cuenta propietaria.
4. Implementar → Gestionar implementaciones → implementación actual → lápiz → Nueva versión → Implementar. Conserva ejecución, acceso y `/exec`.
5. Recarga Genially. No cambies los iframe.

## Revisar respuestas en Sheets

Ejecuta `actualizarResumenCuadernosLudaria` desde el editor propietario. Crea o actualiza `CuadernosActuales`, con nombre, misión, índice de página, fecha, revisión y respuestas del último cuaderno confirmado. Una fila por personaje y misión; no se modifica `Aventuras`. Vuelve a ejecutarla cuando quieras refrescar la vista. No agrega consultas al guardado de los participantes. Misión 0 sigue en su receptor independiente. Esta vista no constituye entrega ni evaluación.

## Pruebas finales reales

- Carga tu personaje, entra a Mochi y a dos misiones: comprueba si recupera tu sesión sin pedir nuevamente la clave.
- Compra una mejora; verifica STAT en Mochi y el umbral correspondiente al entrar a la misión.
- Guarda una nota, espera confirmación, recarga: recupera nota y página.
- Cierra acceso y entra con otro personaje: comprueba aislamiento.
- Repite en teléfono y en Genially. Si el navegador separa almacenamiento entre iframe, el formulario manual debe seguir funcionando.
- Ejecuta el resumen docente y contrasta una respuesta con su cuaderno.

Las pruebas automáticas utilizan servicios simulados. La prueba de rendimiento comprueba 3 lecturas de datos para la carga conjunta con cabeceras ya comprobadas. No equivale a un tiempo garantizado en Google. Falta medir tiempos reales después de instalar v0.4.2.
