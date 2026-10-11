# Continuidad de las incrustaciones y estado real de Ludaria

11 de octubre de 2026, revisión posterior a PR #7. No se modificaron Genially, Apps Script ni registros de participantes.

## Fuentes comprobadas

- HEAD real de main: `60dbe24702b09ed2066a3a5ec1a75e77d3650fab`, correspondiente a PR #7 integrado.
- Pages [38157644174](https://github.com/nespinozagonzalez-hub/misiones/actions/runs/38157644174): success sobre ese HEAD.
- CI [38157429488](https://github.com/nespinozagonzalez-hub/misiones/actions/runs/38157429488): success sobre la fuente del PR #7, `9045dd97aa7ad5d269a9835416f57475f611b9cb`. Todos los pasos, incluidas las cuatro pruebas Chromium, aprobados.
- Leídos `CONEXION_LUDARIA.md`, `IMPLEMENTACION_ESTABLE_20261011.md`, `CHECKLIST_CONEXION_RPG.md`, catálogo de 14 sesiones e instrucciones de producción.

## Regresión pública y pruebas locales

Se solicitaron las 14 URL originales del catálogo y las dos entradas de Forja/Mochi. Las 16 respondieron HTTP 200, conservaron el origen GitHub Pages y su HTML coincidió byte a byte con main. También coincidieron los seis recursos compartidos: configuración del gateway, experiencia JS/CSS, cliente, interfaz RPG y catálogo. Esto acredita publicación de archivos, no interacción gráfica ni sincronización de participantes.

Pasaron nuevamente servidor general (incluida recuperación de acceso), servidor RPG, los 24 escenarios de gateway, DOM de las 13 misiones y 39 ventajas, y los 14 casos de resiliencia. Se conservaron las cinco huellas narrativas, el orden de 14 sesiones, los instrumentos, runas y recompensas. Los ensayos de operaciones emplean servicios ficticios y no escriben en Google.

## Fallo documental reproducido y corrección

La guía mezclaba un aviso de conservar Genially con 15 bloques que apuntaban directamente a Google; además, una auditoría anterior seguía indicando sustituir los 16 bloques. La prueba nueva falló con la URL de Los Pergaminos Dispersos antes de corregirla.

`RESUMEN_PARA_INCRUSTAR.md` conserva ahora los 16 bloques exactos de la edición original del commit `f37b9b71483c4019fe7aa0bf4e14bd2b495e0b0f`: URL, parámetros, fragmentos, títulos, alturas y permisos. Se compararon íntegramente los bloques con aquella fuente. No se editaron incrustaciones en Genially.

`node ludaria/test-stable-embeds.cjs` pasa y se incorpora a CI. Protege las 14 sesiones y dos complementos, el origen/ruta del catálogo, la existencia de cada entrada, atributos del iframe, gateway desactivado y exclusión de Misión 0. Las modificaciones de la guía o catálogo también disparan ese workflow.

Se corrigieron las instrucciones contradictorias y se actualizaron conexión, checklist y estado para separar código, publicación, instalación y validación real. Los enlaces centrales directos siguen siendo una opción de ensayo independiente en `ludaria/LEEME.md`.

## Instalación y verificación pendientes

| Capa | Evidencia y límite |
| --- | --- |
| Código | Las mejoras de PR #5/#6/#7 están integradas en main; archivo completo preparado. |
| GitHub Pages | Última publicación comprobada de PR #7; las 16 entradas originales están disponibles. |
| Apps Script original | Última instalación documentada: versión 2 a las 10:09 de Chile. Sin evidencia de instalación de las correcciones posteriores. |
| Google autenticado | Guardado/recuperación, omisiones, compras/redistribución, XP y análisis pendientes con personaje ficticio autorizado. |
| Genially real | Las 16 incrustaciones originales aún requieren ensayo de identidad, continuidad y guardado en escritorio/móvil. Un iframe local no demuestra ese resultado. |
| Gateway | `enabled:false`, `verified:false`; conserva modo local y no redirige el diagnóstico. |

El contexto más reciente registra falta de acceso al editor Google y una entrega de pasos al propietario. No se instalaron cambios por otros métodos ni se introdujeron credenciales. Continuar la actualización exclusivamente en el proyecto original cuando exista acceso legítimo; editar la implementación existente con Nueva versión conserva su URL. No crear otro proyecto, hojas o secreto.

No dar por terminada la conexión ni detener la revisión por el solo éxito de CI. El siguiente ensayo real debe utilizar los iframe originales de GitHub Pages en un Genially de prueba, sin sustituir bloques en masa ni modificar el Genially del propietario.
