# Conexión central · estado vigente del 11 de octubre de 2026, hora Chile

## Estado vigente

- Ampliación v0.3 publicada en main mediante PR #4; commit 0c52ecd4c2aec7a42ce8df0cb00ea4db156ef5d8. #2/#3 cerrados como sustituidos.
- GitHub Pages 38142041656 aprobado. CI completo 38141839213 aprobado: servidor, gateway, 13 misiones/39 ventajas, 13 escenarios de resiliencia, móvil, escritorio, foco y marcos locales.
- Apps Script original actualizado: fuente completa v0.3 guardada y verificada, preparación terminada, diagnóstico de planilla/vínculo/secreto correcto. Misma implementación, versión 2 publicada el 11 de octubre a las 10:09 de Chile.
- 13 entradas de misión y Forja/Mochi comprobadas visualmente en Google real con sus guardianes. Misión 0 conserva su presentación y receptor de diagnóstico.
- Guardado/recuperación autenticados reales todavía pendientes: el formulario anidado no pudo validarse por el broker seguro. No se escribieron claves por otro mecanismo ni se alteraron personajes en esta revisión.
- Genially a cargo del propietario. Iframes centrales directos en RESUMEN_PARA_INCRUSTAR.md y guías Word/PDF actualizadas; TXT con 16 bloques completos.
- Gateway sigue desactivado y no verificado. Las URLs GitHub anteriores continúan locales hasta completar el contenedor real.
- Evidencia vigente: AUDITORIA_PUBLICACION_RPG_20261011.md. Las auditorías anteriores y paquetes de revisión son históricos.

## Antecedentes del piloto (lectura histórica)

Los apartados siguientes conservan las primeras comprobaciones. Sus resultados de CI corresponden al piloto anterior, no a la ampliación RPG actual.

## Primera pasada · servidor

`node ludaria/test-server.cjs`: OK. Comprueba registro repetible, claves no almacenadas en texto, alias equivalentes, firmas de sesión, saldo insuficiente, reintentos y códigos duplicados, revisión del perfil, redistribución con XP/historial conservados, apoyo condicionado al atributo actual, borradores separados por persona y rechazo de conflictos, protección de la preparación administrativa.

Las pruebas usan dobles en memoria. No escriben en la planilla real. También pasó la regresión del instalador original con sus nueve comprobaciones.

## Segunda pasada · interfaz

`node --check` pasa para Forja, cliente compartido y aplicación de Vetas. Se preparó `ludaria/test-browser.cjs` para comprobar acceso, compras, cuaderno en otra sesión sin localStorage, móvil 390px, foco e iframe de 720px.

El entorno local no dispone de Chromium; la prueba se ejecutó en GitHub. La última versión pasó el workflow 38105192674, commit de código f3dd79008a85b08ecd2382b84f15dc2ad2109d47. Verifica creación y recuperación entre sesiones con localStorage bloqueado, compra con Mochi, demostración previa, cuaderno central, retirada del apoyo al bajar el atributo, móvil de 390px, foco de acceso e iframe local de 720px. Las capturas están en los artefactos del workflow. Esto no valida todavía Apps Script, la sesión pública de Google ni Genially real.

## Siguiente ejecución de la revisión cada tres horas

1. Leer esta sección vigente y la auditoría de publicación; comprobar el último main antes de modificar. La publicación, CI y versión 2 ya están resueltos.
2. Continuar las pruebas autenticadas reales cuando haya un personaje de prueba accesible. No repetir altas ficticias innecesarias ni modificar personajes reales. No pedir el /exec ni otra instalación.
3. Genially lo edita el propietario. Comprobar su versión publicada después del cambio; distinguir marcos locales de contenedor real.
4. Conservar actividades, instrumentos, códigos, XP, secreto, proyecto original y receptor independiente de Misión 0. No activar gateway sin evidencia real por ruta.
5. Corregir solo fallos reproducidos, ejecutar la comprobación pertinente y actualizar guías/estado con hechos observados. Informar únicamente novedades concretas.

## Avance independiente · 11 de octubre

Preparada entrada estable, desactivada, para Forja/Mochi y las dos entradas de Vetas. `ludaria/gateway-config.js` permitiría configurar una sola URL /exec ya validada y conservar las URLs GitHub incrustadas. No hay conexión nueva activada. Pruebas y pendientes: `AUDITORIA_ENTRADA_20261011.md`. Inventario de las aplicaciones realmente cargadas por las 14 sesiones: `ADAPTADORES_MISIONES.md`. Se conserva el receptor independiente de Misión 0.

La regresión del piloto y las pruebas de entrada en navegador con dobles pasaron en el workflow 38114295394 (commit dba677d0f68bec079ee7bbc5ea2a806dfc52651d). PR #2 preparado, sin fusionar y con redirección desactivada. Google/Genially real permanece pendiente.

## Adaptador siguiente preparado

`pergaminos-dispersos` reconoce el cliente central, espera la identidad, recupera la bitácora antes del primer render y guarda sin `localStorage`. La ruta continúa bloqueada en el servidor hasta validar el piloto real. Evidencia: `AUDITORIA_PERGAMINOS_20261011.md`.

El código completo incorpora `diagnosticarConexionLudaria`, una comprobación de solo lectura para distinguir el proyecto original de uno nuevo. Debe ejecutarse antes de `prepararConexionLudaria` cuando exista duda; no muestra el secreto ni altera la planilla.
