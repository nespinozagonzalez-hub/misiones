> **Solicitud vigente adicional:** v0.4.0 incorpora retratos, clave elegida y recuperación pública mediante respaldo privado. Este cambio SÍ requiere reemplazar el Código.gs anterior y actualizar la MISMA implementación. Detalle: BIENVENIDA_Y_CLAVES_20261011.md. Las pruebas reales anteriores acreditan la entrada de v0.3.0; la nueva versión se comprobará tras instalarla. El gateway permanece activo y los iframe no cambian.

# Conexión central · estado vigente del 11 de octubre de 2026

## Estado vigente

- Solicitud actual: corregir Forja sin código y misiones sin guardián mientras el propietario actualiza el mismo Apps Script. Mantener sus iframe originales.
- PR #9 y CI completo 38158661315 aprobados; Pages 38158920841 publicado sobre 200a5bf8e4fc94adce7f5aed29a0bd19aa529500.
- Comprobado dentro del Genially real del propietario: Forja con Nara, Mochi y los 13 guardianes, todos con nombre y clave. Los src originales GitHub se conservaron. Evidencia: AUDITORIA_IDENTIDAD_ENTRADAS_20261011.md.
- La revisión concurrente 6fcef08 desactivó el gateway por una instrucción anterior. Se restaura la conexión activa, conserva su contrato de los 16 bloques originales y se actualiza la revisión programada para evitar devolver esas entradas al modo local.
- Gateway enabled:true/verified:true verifica navegación y guardianes en Genially. El guardado autenticado se comprueba por separado; no inferir escritura confirmada a partir de la carga del formulario.
- El propietario está actualizando el proyecto Apps Script original con el archivo entregado. Código.gs no se cambia por este arreglo; la misma URL /exec y planilla siguen vigentes.
- Registro/recuperación, compras/redistribución y análisis autenticados reales: pendientes de la prueba manual del propietario. Las pruebas simuladas y gráficas del CI no sustituyen esa comprobación.
- Misión 0 mantiene su receptor independiente. Se conservan instrumentos, runas, puntos, XP y todas las actividades existentes.

## Próxima revisión

1. Leer main fresco y esta evidencia antes de editar. No restaurar indicadores false ni instrucciones anteriores por carecer de la prueba manual de guardado.
2. Conservar los 16 iframe originales y verificar que el gateway mantiene su destino central sin pasar claves en enlaces.
3. Continuar los ensayos autenticados cuando exista acceso legítimo. No introducir credenciales por métodos alternos ni simular confirmaciones de Google.
4. Corregir fallos reproducidos con PR y CI. Genially sigue a cargo del propietario. La comprobación de carga se hizo en el contenedor real, sin editarlo.

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
