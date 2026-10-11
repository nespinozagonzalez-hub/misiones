# Entrada estable · 11 de octubre de 2026

Base revisada: main 353d3cc5ff3d138762c99c20142fa57047a9fe11. Rama de trabajo: codex/ludaria-entrada-estable-20261011.

## Cambios y checklist

- [x] Leer instrucciones, estado y conexión actuales antes de editar.
- [x] Preparar entrada común en Forja y ambas entradas de Vetas, manteniendo las URLs del catálogo.
- [x] Configuración central desactivada: `enabled:false`, `verified:false`, despliegue vacío.
- [x] Excluir Misión 0, rutas no adaptadas, datos de identidad y parámetros arbitrarios.
- [x] Evitar bucles al ejecutar dentro de HtmlService; no usar fetch/no-cors para operaciones.
- [x] Inventariar las aplicaciones cargadas en las 14 sesiones para preparar adaptadores.
- [ ] Activar únicamente después de validar el piloto real y la navegación en Genially.

## Pasada funcional

`node ludaria/test-gateway.cjs`: 24 escenarios con dobles OK. Conserva Mochi, misión y fragmentos de pantalla válidos; excluye claves/nombres/tokens, destinos externos o /dev, rutas desconocidas y activación incompleta. `node ludaria/test-server.cjs`: regresión del piloto OK, sin cambios al servidor ni al instalador.

## Pasada de regresión e integración

Pages: Forja y `vetas-diseno/presentacion.html` respondieron HTTP 200 el 11 de octubre, cerca de las 05:12 UTC. Vetas carga `app.central-d10b770f97.js?v=20261011-cloud2`. Esto comprueba disponibilidad de Pages, no conexión a Sheets.

La ejecución local de `node ludaria/test-browser.cjs` no pudo iniciar Chromium: falta el ejecutable. No es una prueba aprobada. El workflow del PR ejecutó la regresión y `test-gateway-browser.cjs`: configuración desactivada, Mochi y navegación dentro de un iframe de 720px en móvil 390px, con destino Google interceptado. Ambas pruebas pasaron en GitHub; sigue pendiente Google/Genially real.

## Activación y reversión

En `ludaria/gateway-config.js` se configuraría el /exec validado y se marcarían ambos flags verdaderos. No requiere cambiar cada iframe de Genially para las rutas preparadas. La redirección reemplaza solo el documento del iframe actual; no abre otra pestaña ni transfiere el estado local. Reversión: `enabled:false`. Primero comprobar una copia de Genially, cuenta ficticia y sesión ajena al propietario; si el contenedor bloquea la navegación a Google, conservar desactivado y usar el iframe /exec directo comprobado.

No publicar secretos ni el ID de la planilla. No modificar Apps Script en esta ejecución: el propietario está resolviendo qué proyecto conserva las propiedades originales. La aplicación y sus datos no se declaran recuperados ni conectados.

## Resultado final en GitHub

Workflow 38114295394, commit de código dba677d0f68bec079ee7bbc5ea2a806dfc52651d: **success**. Pasaron las pruebas funcionales, la regresión completa del piloto y la navegación de Mochi/iframe móvil con destino interceptado. Las capturas se conservaron como artefactos. El primer workflow 38114225503 aprobó el piloto pero falló en la nueva prueba por ausencia de UTF-8 en la página simulada; se corrigió ese fixture y se repitió la comprobación. No hubo cambios al servidor.

Evidencia: https://github.com/nespinozagonzalez-hub/misiones/actions/runs/38114295394

PR revisable: https://github.com/nespinozagonzalez-hub/misiones/pull/2. No fusionado; entrada estable desactivada. La auditoría real de Google/Genially y el enlace /exec siguen pendientes.
