# Conexión central · avance del 10 de octubre de 2026, hora Chile

## Estado comprobado

- El propietario ejecutó el paso 1; las nueve pruebas aparecen OK en la planilla privada.
- Preparado el piloto v0.2.0: identidad por nombre y clave generada, Forja, Mochi y cuaderno de Las Vetas del Diseño.
- La publicación de Apps Script y su URL `/exec` siguen pendientes. Las páginas públicas de GitHub continúan en modo local hasta sustituir sus iframes por el despliegue.

## Primera pasada · servidor

`node ludaria/test-server.cjs`: OK. Comprueba registro repetible, claves no almacenadas en texto, alias equivalentes, firmas de sesión, saldo insuficiente, reintentos y códigos duplicados, revisión del perfil, redistribución con XP/historial conservados, apoyo condicionado al atributo actual, borradores separados por persona y rechazo de conflictos, protección de la preparación administrativa.

Las pruebas usan dobles en memoria. No escriben en la planilla real. También pasó la regresión del instalador original con sus nueve comprobaciones.

## Segunda pasada · interfaz

`node --check` pasa para Forja, cliente compartido y aplicación de Vetas. Se preparó `ludaria/test-browser.cjs` para comprobar acceso, compras, cuaderno en otra sesión sin localStorage, móvil 390px, foco e iframe de 720px.

El entorno local no dispone de Chromium; la prueba se ejecutó en GitHub. La última versión pasó el workflow 38105192674, commit de código f3dd79008a85b08ecd2382b84f15dc2ad2109d47. Verifica creación y recuperación entre sesiones con localStorage bloqueado, compra con Mochi, demostración previa, cuaderno central, retirada del apoyo al bajar el atributo, móvil de 390px, foco de acceso e iframe local de 720px. Las capturas están en los artefactos del workflow. Esto no valida todavía Apps Script, la sesión pública de Google ni Genially real.

## Siguiente ejecución de la revisión cada tres horas

1. Leer estado del piloto y comprobar Pages después de la fusión. Las dos pasadas disponibles (servidor y navegador con dobles) están aprobadas; la integración real sigue pendiente.
2. Verificar el despliegue `/exec` si el propietario lo proporciona. Probar con cuenta ficticia, sin datos de participantes reales, y luego desde Genially en móvil/escritorio y fuera de la sesión propietaria.
3. Con el piloto real validado, conectar el resto de las 14 sesiones una por una, empezando por identidad y borradores separados por participante. Mantener navegación y contenido esenciales accesibles.
4. Para cada misión definir, justificar, mostrar y probar sus ventajas sin inventar evaluación, códigos ni XP. No anunciar ventajas integradas donde solo hay talentos narrativos.
5. Actualizar los iframes y el documento de incrustación únicamente con URLs realmente comprobadas. Conservar el receptor independiente del diagnóstico de Misión 0.

No pedir otra instalación completa. Se sustituye el único Código.gs en el mismo proyecto, se ejecuta `prepararConexionLudaria` y se publica una aplicación web. Las propiedades y el secreto del paso 1 deben conservarse.

## Avance independiente · 11 de octubre

Preparada entrada estable, desactivada, para Forja/Mochi y las dos entradas de Vetas. `ludaria/gateway-config.js` permitiría configurar una sola URL /exec ya validada y conservar las URLs GitHub incrustadas. No hay conexión nueva activada. Pruebas y pendientes: `AUDITORIA_ENTRADA_20261011.md`. Inventario de las aplicaciones realmente cargadas por las 14 sesiones: `ADAPTADORES_MISIONES.md`. Se conserva el receptor independiente de Misión 0.
