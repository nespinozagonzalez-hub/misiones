# Conexión central · estado vigente del 11 de octubre de 2026, hora Chile

## Estado vigente

- El propietario instaló la base privada, ejecutó prepararConexionLudaria y entregó el /exec. No solicitar otro enlace ni reinstalar.
- El piloto Google real comprobó alta ficticia, clave personal, runas sin duplicado, compra Maestría 5 y redistribución con saldo/XP/historial conservados. Evidencia: AUDITORIA_GOOGLE_REAL_20261011.md. La continuidad entre sesiones y el cuaderno real siguen pendientes.
- Main remoto conserva el piloto en `353d3cc5ff3d138762c99c20142fa57047a9fe11`. PR #2 y #3 siguen revisables.
- Ampliación v0.3.0 preparada localmente: 13 guardianes, 39 ventajas, motivos y decisiones, cinco secretos. El rechazo automático previo requiere autorización explícita posterior para publicar esta rama; no hubo push ni PR nuevo.
- Corregidos borradores RPG al cerrar, reintentos tras respuesta perdida y foco. Diez casos nuevos y la regresión de las 13 misiones pasan en DOM. No son pruebas gráficas ni Google real.
- La Forja incrustada en Genially fue observada en modo local. Gateway permanece desactivado. No declarar conectadas las nuevas misiones.
- Checklist: CHECKLIST_CONEXION_RPG.md. Evidencia nueva: AUDITORIA_RESILIENCIA_RPG_20261011.md.

## Antecedentes del piloto (lectura histórica)

Los apartados siguientes conservan las primeras comprobaciones. Sus resultados de CI corresponden al piloto anterior, no a la ampliación RPG actual.

## Primera pasada · servidor

`node ludaria/test-server.cjs`: OK. Comprueba registro repetible, claves no almacenadas en texto, alias equivalentes, firmas de sesión, saldo insuficiente, reintentos y códigos duplicados, revisión del perfil, redistribución con XP/historial conservados, apoyo condicionado al atributo actual, borradores separados por persona y rechazo de conflictos, protección de la preparación administrativa.

Las pruebas usan dobles en memoria. No escriben en la planilla real. También pasó la regresión del instalador original con sus nueve comprobaciones.

## Segunda pasada · interfaz

`node --check` pasa para Forja, cliente compartido y aplicación de Vetas. Se preparó `ludaria/test-browser.cjs` para comprobar acceso, compras, cuaderno en otra sesión sin localStorage, móvil 390px, foco e iframe de 720px.

El entorno local no dispone de Chromium; la prueba se ejecutó en GitHub. La última versión pasó el workflow 38105192674, commit de código f3dd79008a85b08ecd2382b84f15dc2ad2109d47. Verifica creación y recuperación entre sesiones con localStorage bloqueado, compra con Mochi, demostración previa, cuaderno central, retirada del apoyo al bajar el atributo, móvil de 390px, foco de acceso e iframe local de 720px. Las capturas están en los artefactos del workflow. Esto no valida todavía Apps Script, la sesión pública de Google ni Genially real.

## Siguiente ejecución de la revisión cada tres horas

1. Leer estado del piloto y comprobar Pages después de la fusión. Las dos pasadas disponibles (servidor y navegador con dobles) están aprobadas; la integración real sigue pendiente.
2. El despliegue `/exec` ya está disponible. Tras publicar y actualizar la ampliación autorizada, continuar las comprobaciones reales pendientes sin repetir altas ficticias innecesarias.
3. Con el piloto real validado, conectar el resto de las 14 sesiones una por una, empezando por identidad y borradores separados por participante. Mantener navegación y contenido esenciales accesibles.
4. Para cada misión definir, justificar, mostrar y probar sus ventajas sin inventar evaluación, códigos ni XP. No anunciar ventajas integradas donde solo hay talentos narrativos.
5. Actualizar los iframes y el documento de incrustación únicamente con URLs realmente comprobadas. Conservar el receptor independiente del diagnóstico de Misión 0.

No pedir otra instalación completa. Se sustituye el único Código.gs en el mismo proyecto, se ejecuta `prepararConexionLudaria` y se publica una aplicación web. Las propiedades y el secreto del paso 1 deben conservarse.

## Avance independiente · 11 de octubre

Preparada entrada estable, desactivada, para Forja/Mochi y las dos entradas de Vetas. `ludaria/gateway-config.js` permitiría configurar una sola URL /exec ya validada y conservar las URLs GitHub incrustadas. No hay conexión nueva activada. Pruebas y pendientes: `AUDITORIA_ENTRADA_20261011.md`. Inventario de las aplicaciones realmente cargadas por las 14 sesiones: `ADAPTADORES_MISIONES.md`. Se conserva el receptor independiente de Misión 0.

La regresión del piloto y las pruebas de entrada en navegador con dobles pasaron en el workflow 38114295394 (commit dba677d0f68bec079ee7bbc5ea2a806dfc52651d). PR #2 preparado, sin fusionar y con redirección desactivada. Google/Genially real permanece pendiente.

## Adaptador siguiente preparado

`pergaminos-dispersos` reconoce el cliente central, espera la identidad, recupera la bitácora antes del primer render y guarda sin `localStorage`. La ruta continúa bloqueada en el servidor hasta validar el piloto real. Evidencia: `AUDITORIA_PERGAMINOS_20261011.md`.

El código completo incorpora `diagnosticarConexionLudaria`, una comprobación de solo lectura para distinguir el proyecto original de uno nuevo. Debe ejecutarse antes de `prepararConexionLudaria` cuando exista duda; no muestra el secreto ni altera la planilla.
