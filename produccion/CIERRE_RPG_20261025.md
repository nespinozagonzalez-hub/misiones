# Ludaria · cierre RPG y revisión de integridad

25 de octubre de 2026. Encargo: revisar funcionamiento, imágenes y encuadres, incorporar el cierre RPG y conservar los datos. Base: `a31fb38e0f318d636f13a70aca75fc68501fe17c`.

## Qué cambia

- La última pantalla de La Defensa del Orbe abre un encuentro con Lethon: cuatro fragmentos y cinco maneras de contribuir. Se puede cerrar y repetir sin penalización.
- Las imágenes del buscador y de Lethon conservan su encuadre; sus nombres permanecen junto a cada personaje. Los comandos y el progreso aparecen en la misma ventana.
- El encuentro llega después de la recogida de los instrumentos; sigue siendo una ceremonia narrativa, sin preguntas evaluativas, derrota, nuevas recompensas o cambios de duración.
- El paso final invoca el botón de restauración que ya existía. La aplicación original continúa siendo la única que guarda `open` dentro del cuaderno existente. No se crea una clave, tabla o esquema de progreso.
- Ajustes compartidos de diálogos: desplazamiento natural, campos a 16 px, nombres largos, encuadre en horizontal y mensajes durante la identificación. No se sustituyen formularios ni manejadores de acceso.
- `defensa-orbe/revision.html` permite revisar el encuentro con datos ficticios. No carga el cliente de cuentas, no llama a Google y no escribe almacenamiento.

## Protección de datos y alcance

No se accedió a la planilla del curso ni se crearon personajes reales. No se cambiaron API, Apps Script, secretos, configuración de conexión, claves de almacenamiento, adaptadores, catálogo RPG, códigos, XP, costes, rúbricas ni los guiones de evaluación. La comparación con la base mantiene esos archivos sin diferencias.

Se conservan las 16 direcciones originales de iframe y el receptor independiente del diagnóstico. No hace falta reinstalar Apps Script para esta edición visual: la implementación existente carga las entradas y recursos del repositorio. No se instaló el mantenimiento v0.4.4 pendiente, ni se lo presenta como instalado.

La ausencia de una escritura real en esta revisión protege el curso, pero no equivale a una nueva certificación del despliegue autenticado de Google Sheets. Las pruebas de cuentas y guardado descritas abajo usan servicios simulados.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Contrato de iframe | Las 16 rutas, queries, fragmentos, títulos y alturas originales se conservan |
| Recursos y sintaxis | Inventario original de 26 entradas; 52 scripts activos y 352 referencias locales válidas |
| Imágenes | 32 WebP decodificados y verificados, incluido el arte nuevo |
| Regresión funcional | 19 programas de prueba existentes aprobados: reglas, cuentas, recuperación, sesiones, servidor, ventajas, resiliencia, acceso visual, Misión 0, efectos y recursos |
| Cierre RPG | Seis encuadres: 1280×900, 768×1024, 1024×768, 390×844, 320×568 y 844×390; imágenes cargadas; sin desborde horizontal; teclado y cancelación |
| Integridad del cierre | Perfil y movimientos antes/después idénticos; campos y reflexiones conservados; solo se activa la restauración existente. Repetir no genera otro guardado |
| Red de la prueba del cierre | Solicitudes reales externas bloqueadas; servidor de prueba en memoria |
| Regresión gráfica completa | Se ejecuta mediante los cuatro programas de navegador anteriores y el nuevo `test-orbe-browser.cjs`; consultar el resultado del workflow de esta edición |

Las dimensiones son pruebas de navegador, no pruebas físicas de todos los modelos de teléfono. La estética del Genially no se editó: conserva sus recursos y enlaces.

## Reproducción

```sh
python ludaria/build.py
python ludaria/adapt-rpg.py
node ludaria/test-stable-embeds.cjs
node ludaria/test-all-entries.cjs
npm install --no-save playwright@1.62.1 jsdom@26.1.0
npx playwright install --with-deps chromium
node ludaria/test-browser.cjs
node ludaria/test-gateway-browser.cjs
node ludaria/test-pergaminos-adapter.cjs
node ludaria/test-rpg-browser.cjs
node ludaria/test-orbe-browser.cjs
```

El workflow conserva la suite funcional anterior y añade el cierre. La vista de revisión no prueba cuentas ni concede progreso. Para la experiencia real se conservan los enlaces actuales de Genially y de la sesión 14.
