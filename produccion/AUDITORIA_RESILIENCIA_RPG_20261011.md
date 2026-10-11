# Ventanas RPG: respuestas pendientes y foco · 11 de octubre de 2026

Nota de vigencia: esta auditoría conserva la revisión anterior. La publicación, CI completo y actualización de Google ya se completaron después; consultar AUDITORIA_PUBLICACION_RPG_20261011.md.
## Problemas reproducidos y corregidos

La prueba de fallos encontró pérdida del ensayo y del motivo al cerrar una ayuda sin confirmación. Reabrir generaba otro identificador de solicitud; si Google había guardado la decisión pero se perdía la respuesta, el reintento podía añadir otro acontecimiento al historial. Al sustituir el contenido de la ventana tras una consulta, el foco también salía de ella.

El cliente conserva el borrador y su solicitud en memoria mientras permanece abierta la página, incluso al cerrar y reabrir la ayuda. Un reintento del mismo envío conserva su identificador; una edición posterior obtiene otro. Los cambios escritos durante la espera siguen pendientes después de confirmar el texto anterior. Sin cambios locales, reabrir recupera la revisión vigente del servidor.

Los ensayos pendientes participan en la advertencia de salida y de cierre de acceso. Si baja el atributo, la ayuda queda bloqueada pero el borrador se puede consultar en modo lectura y descargar como TXT, sin clave ni token. Una consulta que termina después de cerrar su ventana ya no modifica su contenido ni mueve el foco. Cada ventana devuelve el foco a su propio invocador; después de cargar se enfoca su título. Se ajustó también el cálculo del ancho de la ventana con `box-sizing:border-box`; el resultado visual sigue sin verificar.

La memoria de esta página no acredita guardado en Google, no comunica iframes y se pierde si se abandona la página después de aceptar la advertencia. El ensayo solo se declara confirmado tras la respuesta del servidor.

## Pasada funcional y DOM

`test-rpg-resilience.cjs` usa el servidor ficticio existente e inyecta dos fallos distintos: interrupción antes del guardado y guardado confirmado con respuesta perdida. `localStorage` está bloqueado.

| Caso | Resultado |
| --- | --- |
| Foco dentro de la ayuda cargada y retorno al invocador | OK en DOM |
| Advertencia al salir o cerrar acceso con ensayo pendiente | OK en DOM |
| Reapertura conserva ruta, ensayo y motivo | OK en DOM |
| Reintento tras reapertura conserva ID | OK; sin otra decisión |
| Respuesta perdida después del guardado | OK; reintento sin duplicado |
| Edición posterior usa otra solicitud | OK |
| Cierre mientras se consulta el apoyo | OK; sin ventana ni foco tardíos |
| Escritura adicional durante el envío | OK; cambios posteriores pendientes |
| Recuperación de revisión confirmada desde otra sesión | OK en DOM/servidor ficticio |
| Bajada de atributo con borrador pendiente | OK; lectura disponible, ayuda bloqueada |

Regresión después de los cambios: `test-server.cjs`, `test-rpg-server.cjs`, los 24 escenarios de `test-gateway.cjs` y `test-rpg-dom.cjs` aprobados. La prueba DOM recorre las 13 misiones y 39 ventajas. Las comprobaciones de sintaxis del cliente, ventanas y prueba nueva pasan. El workflow incorpora la nueva regresión, pero no se ejecutó en GitHub.

Reproducción:

```sh
python3 ludaria/build.py
node ludaria/test-server.cjs
node ludaria/test-rpg-server.cjs
node ludaria/test-gateway.cjs
# jsdom 26.1.0 instalado fuera del repositorio o disponible para Node
node ludaria/test-rpg-resilience.cjs
node ludaria/test-rpg-dom.cjs
```

## Segunda pasada gráfica: pendiente

Se intentó `test-rpg-browser.cjs` con el Playwright del entorno. No pudo iniciar Chromium: falta `chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`. No se descargó de nuevo ni se dio por aprobada la prueba. Faltan motor gráfico, escritorio, móvil y marco local para esta ampliación, además de Google y Genially reales.

La prueba gráfica quedó ampliada para recorrer las 13 entradas también en escritorio y en un iframe local de 720px, comprobar foco después de cargar y después de Escape, y capturar Yunque en su marco. Su sintaxis pasa; estos escenarios nuevos no se ejecutaron. El CI deberá comprobarlos cuando se autorice publicar.

## Publicación y continuidad

Rama local: `codex/ludaria-rpg-guardianes-20261011`. Main remoto sigue en `353d3cc5ff3d138762c99c20142fa57047a9fe11`, verificado mediante consulta de solo lectura. No hubo push, PR nuevo, fusión, actualización de Apps Script, altas ficticias ni cambios en Genially en esta revisión. El gateway permanece desactivado.

El rechazo automático previo exige autorización explícita posterior para publicar esta ampliación. Se conserva ese bloqueo; ninguna ruta alternativa de publicación fue usada. Una vez autorizada, publicar la rama sin force-push, preparar el PR apilado sobre #3, ejecutar CI gráfico y corregir sus resultados antes de fusionar. Después el propietario actualiza la misma implementación de Apps Script y se comprueba el recorrido real, conservando el `/exec` ya suministrado.

Checklist continuo: [CHECKLIST_CONEXION_RPG.md](CHECKLIST_CONEXION_RPG.md). No recrear las misiones ya preparadas.
