# Conexión central · estado vigente del 11 de octubre de 2026, hora Chile

## Estado vigente

- HEAD de código comprobado antes del cambio concurrente: `60dbe24702b09ed2066a3a5ec1a75e77d3650fab` (PR #7). PR #5 y #6 también están integrados.
- GitHub Pages `38157644174` aprobado sobre ese HEAD; CI completo del PR #7 `38157429488` aprobado sobre `9045dd97aa7ad5d269a9835416f57475f611b9cb`.
- Regresión pública: las 16 entradas GitHub originales y seis recursos RPG compartidos responden HTTP 200, mantienen el origen y coinciden byte a byte con main. Esto comprueba publicación, no interacciones gráficas ni guardado.
- Última instalación Google documentada: el mismo Apps Script original, versión 2, publicada el 11 de octubre a las 10:09 de Chile. Las mejoras posteriores (omisiones, avisos de guardado y recuperación de clave) están preparadas en `ludaria/Code-Ludaria-Conectado.gs`; no existe evidencia de una nueva instalación. La versión 2 no expone la capacidad de omisión y el cliente oculta el botón incompatible.
- Carga visual anterior comprobada de 13 guardianes y Forja/Mochi en Google. Guardado/recuperación autenticados, compras/redistribución y análisis real siguen pendientes. No confundir una entrada visible con una escritura confirmada.
- Genially conserva sus 16 iframe originales, su origen GitHub Pages y slugs. `RESUMEN_PARA_INCRUSTAR.md` vuelve a describir esas URL exactas. Los enlaces centrales directos de `ludaria/LEEME.md` sirven para ensayo independiente; no son instrucciones de reemplazo.
- PR #9 integrado durante la revisión como `200a5bf8e4fc94adce7f5aed29a0bd19aa529500`; Pages `38158920841` aprobado. Se conservan sus 23 entradas y caché, y se restablece el requisito de ensayo real previo.
- Gateway `enabled:false`, `verified:false`. No activarlo hasta confirmar identidad, guardado y continuidad de un personaje ficticio autorizado dentro de un Genially real con los iframe originales.
- Misión 0 mantiene su receptor de diagnóstico independiente. Conservar el proyecto original, planilla, secretos, personajes, instrumentos, runas, XP y las 14 sesiones.
- Evidencia actual: `AUDITORIA_CONTINUIDAD_20261011.md`. Los documentos y paquetes anteriores son históricos y no prueban la instalación de las correcciones posteriores.

## Antecedentes del piloto (lectura histórica)

Los apartados siguientes conservan las primeras comprobaciones. Sus resultados de CI corresponden al piloto anterior, no a la ampliación RPG actual.

## Primera pasada · servidor

`node ludaria/test-server.cjs`: OK. Comprueba registro repetible, claves no almacenadas en texto, alias equivalentes, firmas de sesión, saldo insuficiente, reintentos y códigos duplicados, revisión del perfil, redistribución con XP/historial conservados, apoyo condicionado al atributo actual, borradores separados por persona y rechazo de conflictos, protección de la preparación administrativa.

Las pruebas usan dobles en memoria. No escriben en la planilla real. También pasó la regresión del instalador original con sus nueve comprobaciones.

## Segunda pasada · interfaz

`node --check` pasa para Forja, cliente compartido y aplicación de Vetas. Se preparó `ludaria/test-browser.cjs` para comprobar acceso, compras, cuaderno en otra sesión sin localStorage, móvil 390px, foco e iframe de 720px.

El entorno local no dispone de Chromium; la prueba se ejecutó en GitHub. La última versión pasó el workflow 38105192674, commit de código f3dd79008a85b08ecd2382b84f15dc2ad2109d47. Verifica creación y recuperación entre sesiones con localStorage bloqueado, compra con Mochi, demostración previa, cuaderno central, retirada del apoyo al bajar el atributo, móvil de 390px, foco de acceso e iframe local de 720px. Las capturas están en los artefactos del workflow. Esto no valida todavía Apps Script, la sesión pública de Google ni Genially real.

## Siguiente ejecución de la revisión cada tres horas

1. Leer esta sección vigente y la auditoría de publicación; comprobar el último main antes de modificar. Distinguir Pages, CI y la versión 2 anterior de las correcciones posteriores pendientes de instalar.
2. Continuar las pruebas autenticadas reales cuando haya un personaje de prueba accesible. No repetir altas ficticias innecesarias ni modificar personajes reales. No pedir el /exec ni otra instalación.
3. Genially lo edita el propietario. Conservar sus iframe originales y ensayarlos en una copia publicada; distinguir marcos locales de contenedor real.
4. Conservar actividades, instrumentos, códigos, XP, secreto, proyecto original y receptor independiente de Misión 0. No activar gateway sin evidencia real por ruta.
5. Corregir solo fallos reproducidos, ejecutar la comprobación pertinente y actualizar guías/estado con hechos observados. Informar únicamente novedades concretas.

## Avance independiente · 11 de octubre

Preparada entrada estable, desactivada, para Forja/Mochi y las dos entradas de Vetas. `ludaria/gateway-config.js` permitiría configurar una sola URL /exec ya validada y conservar las URLs GitHub incrustadas. No hay conexión nueva activada. Pruebas y pendientes: `AUDITORIA_ENTRADA_20261011.md`. Inventario de las aplicaciones realmente cargadas por las 14 sesiones: `ADAPTADORES_MISIONES.md`. Se conserva el receptor independiente de Misión 0.

La regresión del piloto y las pruebas de entrada en navegador con dobles pasaron en el workflow 38114295394 (commit dba677d0f68bec079ee7bbc5ea2a806dfc52651d). PR #2 preparado, sin fusionar y con redirección desactivada. Google/Genially real permanece pendiente.

## Adaptador siguiente preparado

`pergaminos-dispersos` reconoce el cliente central, espera la identidad, recupera la bitácora antes del primer render y guarda sin `localStorage`. La ruta continúa bloqueada en el servidor hasta validar el piloto real. Evidencia: `AUDITORIA_PERGAMINOS_20261011.md`.

El código completo incorpora `diagnosticarConexionLudaria`, una comprobación de solo lectura para distinguir el proyecto original de uno nuevo. Debe ejecutarse antes de `prepararConexionLudaria` cuando exista duda; no muestra el secreto ni altera la planilla.
