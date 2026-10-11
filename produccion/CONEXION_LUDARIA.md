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

La ejecución local de navegador está pendiente: el entorno no tiene Chromium y su descarga no produjo un archivo válido. No se considera una auditoría visual aprobada. El workflow `.github/workflows/ludaria-central.yml` ejecutará esa prueba en GitHub y conservará capturas. Corregir cualquier fallo antes de fusionar el piloto.

## Siguiente ejecución de la revisión cada tres horas

1. Leer estado y PR del piloto. Revisar resultado de CI y corregir hasta aprobar ambas pasadas disponibles.
2. Verificar el despliegue `/exec` si el propietario lo proporciona. Probar con cuenta ficticia, sin datos de participantes reales, y luego desde Genially en móvil/escritorio y fuera de la sesión propietaria.
3. Con el piloto real validado, conectar el resto de las 14 sesiones una por una, empezando por identidad y borradores separados por participante. Mantener navegación y contenido esenciales accesibles.
4. Para cada misión definir, justificar, mostrar y probar sus ventajas sin inventar evaluación, códigos ni XP. No anunciar ventajas integradas donde solo hay talentos narrativos.
5. Actualizar los iframes y el documento de incrustación únicamente con URLs realmente comprobadas. Conservar el receptor independiente del diagnóstico de Misión 0.

No pedir otra instalación completa. Se sustituye el único Código.gs en el mismo proyecto, se ejecuta `prepararConexionLudaria` y se publica una aplicación web. Las propiedades y el secreto del paso 1 deben conservarse.
