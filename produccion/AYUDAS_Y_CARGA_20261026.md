# Carga y pistas del guardián · 26 de octubre de 2026

El propietario reportó dos detalles mediante capturas: el personaje quedaba cortado dentro del círculo de carga y la ayuda contextual se sentía como una tarjeta informativa. Esta edición conserva las ilustraciones de Kael/Kira, muestra el personaje completo en un marco vertical y presenta las ayudas como pistas y rutas del guardián.

## Cambios

- Carga de Forja y Mochi: proporción vertical, `object-fit:contain`, cabeza y pies visibles, nombre largo adaptable, barra indeterminada sin porcentaje ficticio y movimiento reducido.
- Pistas contextuales de las 13 misiones: emblema PNG transparente, guardián identificado, estados disponibles/por desbloquear, narrativa breve y botón «Invocar pista». Las rutas conservan «Explorar otra ruta».
- Cuaderno y diálogos: emblema compartido, estados legibles, controles originales conservados y foco/Escape sin reemplazar formularios ni manejadores.
- Vista de revisión: `ludaria/ayudas-revision.html`, con personaje ficticio, selección de guardián y atributos de muestra. No inicia sesión, no consulta Google ni guarda decisiones.

Los cambios se cargan desde los recursos públicos compartidos sobre el cliente v0.4.3 ya instalado. No requieren reinstalar Apps Script. El paquete v0.4.4 continúa sin instalar.

## Checklist de revisión

- [x] 13 guardianes y sus 39 posibilidades: texto de la ayuda y requisitos conservados.
- [x] Ayudas disponibles y por desbloquear; sin habilitar contenido por debajo del requisito.
- [x] La pista abre desde la tarjeta y desde el cuaderno. La decoración no duplica cabeceras al actualizar el diálogo.
- [x] Escape cierra y devuelve el foco al control de origen.
- [x] Imagen decorativa ausente: texto y controles permanecen utilizables.
- [x] Carga de Kael y Kira, en Forja y Mochi, con peticiones retenidas en servicios simulados.
- [x] Escritorio 1280×900, tableta 768×1024 y 1024×768, móvil 390×844 y 320×568, horizontal 844×390.
- [x] Marco local de 720 px; no se presenta como comprobación de Genially real.
- [x] Movimiento reducido y pausa de animaciones respetados.
- [x] 16 contratos de iframe originales y sus URLs conservados.
- [x] Apps Script, API, sesiones, cuadernos, decisiones, atributos, XP, saldo, preguntas del combate e instrumentos sin cambios de lógica.
- [x] Ninguna consulta o escritura en datos reales de participantes; todas las pruebas autenticadas usan servicios simulados.

## Validación y publicación

Prueba gráfica específica: `node ludaria/test-aid-browser.cjs`. Se integra en la regresión completa de 28 programas (22 funcionales y 6 de navegador). La validación específica y la regresión completa pasaron. PR #32 integrado como `417dd785f5624574863812383a4b386ff43ab266`, tras comprobar el head `1413b0acedb5a78a561f37f63c20b7f46e4770c7`. CI 40326213936, job 121583462584: **success**. Sintaxis de 176 fuentes, 26 entradas y 360 referencias locales válidas. Pages 40327088620: build/deploy aprobados para ese commit. La vista pública se comprobó en Chrome: Kael completo en el marco vertical, PNG cargado, pista consultada y cierre con retorno del foco. No se inició sesión ni se consultaron datos reales.

El PNG y su prompt están documentados en `ludaria/assets/ARTE_AYUDAS_20261026.md`. Evidencia de la publicación: `produccion/evidencias/ayudas_publicadas_20261026.jpg` y `produccion/evidencias/carga_publicada_20261026.jpg`.

Las capturas de prueba se generan como `ludaria/preview-ayuda-*`, `preview-cuaderno-guardian.png` y `preview-carga-*`.
