# Auditoría inicial · Ludaria

Fecha: 4 de octubre de 2026. Revisión iniciada inmediatamente por encargo del usuario. Esta revisión no sustituye las cinco revisiones programadas cada 3 horas durante 15 horas.

## Resultado y alcance

Publicación de efectos y correcciones: commit f3b3272051099051ef9555d798d3c5bf7b05e5d4; GitHub Pages: despliegue correcto. Marco de prueba aislado: commit 1c046276488e7a743c7eab1b7c8832211d0fcdcd; despliegue correcto.

La revisión inicial combina análisis estático, pruebas unitarias/simuladas y acciones reales en el navegador. No equivale a certificar exhaustivamente todas las actividades pedagógicas, todos los navegadores ni la sincronización central.

| Área | Comprobación realizada | Resultado |
| --- | --- | --- |
| Portal | 14 enlaces de misión, acceso a Forja/Mochi y marca Ludaria | Corregido y publicado |
| 14 sesiones | Apertura pública y avance al siguiente contenido | 14/14 responden a la navegación |
| Fuentes activas | Sintaxis de 52 archivos/bloques JS; 248 referencias locales contra inventario del repositorio | Sin errores ni referencias locales ausentes en ese conjunto |
| Fondos S11–13 | Referencias a forja.webp inexistente | Sustituidas por santuario.webp existente |
| Misión 0 | Configuración de acceso a la Forja | Enlazada; receptor de diagnóstico intacto, sin envío de prueba |
| Forja/Mochi local | Crear Kira ficticia, activar ECO101, comprar dos mejoras, historial y recarga | +3 puntos / +30 XP; gasto 2; saldo 1; Sabiduría 3/10; persistencia correcta |
| Duplicados | Repetir ECO101 en navegador | Rechazado sin recompensa adicional |
| Saldo insuficiente | Seleccionar el último punto en marco móvil | Otras mejoras quedan deshabilitadas; vista previa sin gasto |
| Diseño adaptable | Forja/Mochi en iframe 375×720 y 1280×720 | Sin desbordamiento horizontal; imágenes cargadas en la vista comprobada |
| Efectos | Transiciones, énfasis de tarjetas, destellos de acciones confirmadas, pausa persistente | Publicados; pausa y recarga verificadas en navegador |
| Movimiento reducido | Preferencia del dispositivo, límites y limpieza de partículas | Prueba automatizada aprobada; no emulación de preferencia en navegador |
| Dominio + servidor | Diez grupos: códigos, compra, cap 10, XP, alias antiguos, acceso, idempotencia, manipulación, migración y API privada | Aprobados con SpreadsheetApp simulado; no Google Sheets real |

## Mejoras visuales

Capa compartida ludaria-epic.css / ludaria-epic.js. Decoración sin interacción propia ni cambios en códigos, XP, puntos, respuestas, instrumentos o reglas. Destellos solo después de confirmar y guardar acciones válidas de Forja; no al previsualizar una compra. Máximo 8 partículas en móvil, 14 en escritorio, retirada a los 1,4 segundos. Sin sonido automático ni destellos de pantalla completa.

Control «Animaciones» al pie de las presentaciones. Respeta prefers-reduced-motion y permite pausar. Las animaciones originales también se detienen al pausar. El estado de pausa se conserva; el contenido permanece accesible.

Enlaces de catálogo, portal y guía actualizados con v=20261004-epic1 para evitar HTML antiguo en caché. Los enlaces anteriores siguen existiendo.

## Pruebas reproducibles

Desde un clon del repositorio, sin despliegue ni escritura real en Google:

```sh
node forja/tests.cjs
node produccion/pruebas-efectos.cjs
```

Vista adaptable aislada: https://nespinozagonzalez-hub.github.io/misiones/forja/prueba.html?v=20261004-epic1

El modo ?prueba=1 de la Forja pública usa almacenamiento separado, no carga el personaje real y no envía datos a Sheets. No habilita una prueba del servidor desplegado. Las pruebas de esta revisión usaron únicamente una ficha ficticia; no se borraron perfiles ni se enviaron respuestas al diagnóstico.

## Pendientes antes de declarar 100 %

1. **Alta: conexión central Forja/Mochi.** Existe un solo Apps Script compartido por ambos, con el diseño integrado, pero aún no se ha desplegado y validado con una planilla privada real. Misión 0 tiene otro receptor independiente. No se debe reutilizar ese receptor ni publicar claves/planillas personales.
2. **Media: canales externos de las sesiones.** Formularios, canvas, rúbricas y entrega dependen de las URLs institucionales indicadas en el catálogo; las alternativas locales no prueban recepción externa.
3. **Media: cobertura exhaustiva.** Esta auditoría hizo comprobación de navegación de las 14 sesiones y flujo completo de compra local. Quedan por contrastar todos los candados, casos, temporizadores, exportaciones, recuperación de copias y guardados de cada actividad en varios navegadores/Genially real. No se modificaron instrumentos E, F ni G.
4. **Media: respaldo descargable anterior.** La entrega portátil de la Forja anterior no se recompiló en esta revisión. El código publicado y el HTML preparado para Apps Script sí incluyen los cambios; usar el repositorio como fuente actual.

## Seguimiento programado

Cinco revisiones: 4 de octubre 16:58, 19:58 y 22:58; 5 de octubre 01:58 y 04:58, hora de Chile (America/Santiago). La tarea termina tras cinco ejecuciones. Son revisiones de solo lectura con informes de hallazgos; no despliegan Apps Script, cambian permisos, alteran perfiles ni publican correcciones automáticamente. La automatización anterior de producción de misiones permanece pausada.
