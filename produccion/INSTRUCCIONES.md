# Continuidad de producción · Ludaria

Encargo de Nicolás: crear en serie los elementos restantes de su tesis, siguiendo las presentaciones HTML aprobadas, publicar en el GitHub existente y entregar un resumen individual e iframe para incrustar en Genially. La revisión solicitada es cada cinco horas. Este archivo define trabajo ejecutable, no un recordatorio.

## Al comenzar una ejecución

1. Lee el head y el árbol actuales de `nespinozagonzalez-hub/misiones`, rama `main`, y `produccion/ESTADO.json`.
2. Lee este archivo y el resumen; descarga los borradores de la primera sesión no terminada. Un directorio local de una ejecución anterior puede no existir.
3. Incorpora las correcciones posteriores del usuario. Conserva las misiones anteriores y el `index.html` global.
4. Lee en la tesis la ficha de la sesión actual y los anexos pertinentes. La matriz es una propuesta de producción; sus decisiones no son requisitos literales de la tesis.
5. Retoma el próximo paso registrado, completa y comprueba la misión actual antes de avanzar a otra. Evita duplicar trabajo ya publicado y verificado.
6. Si una ejecución realmente sigue activa, no hagas escrituras simultáneas; registra el seguimiento. Un estado viejo «en creación» no basta para suponer que alguien sigue trabajando: comprueba y retoma su checkpoint.

## Fuentes

Tesis: Library `libfile_268097aa09648191a2a106e4d5902679`, «TFM Nicolás Espinoza Entrega Deposito .pdf», 66 páginas, versión del autor de septiembre de 2026. Fichas de sesiones 7–14: pp.42–49; bibliografía: pp.54–56; anexos: pp.57–66.

Matriz aprobada: Library `libfile_45dfc60b34008191b5316f853bb1de77`, «Matriz_y_prompt_Genially_14_sesiones.md». Copia de referencia en `produccion/MATRIZ_14_SESIONES.md`. La elección posterior del usuario establece HTML y GitHub: las antiguas indicaciones de generación nativa en Genially son antecedentes, no el formato actual.

Usa la habilidad `openai-library:library` para leer fuentes y guardar entregables. Revisa fuentes primarias para las afirmaciones teóricas. Anexo E antes de crear la rúbrica; H antes de crear coevaluación; F y G antes de evaluación/valoración final. Mantén los enunciados, niveles y relaciones del instrumento; no inventes ponderaciones.

## Formato y estética

Cada sesión es una presentación independiente, sin otro portal. HTML, CSS y JavaScript con assets locales, funcionamiento sin dependencias externas de ejecución, navegación anterior/siguiente, índice de pantallas y progreso de recorrido.

Referencias visuales: `senda-ejemplos/`, `claro-debate/` y `tallado-mecanicas/` para secundarias; `vetas-diseno/` para principales. Lee los archivos actuales de GitHub; algunas copias locales antiguas contenían otra marca. Cabecera LUDARIA / BUSCADORES DE LA GAMIFICACIÓN PERDIDA. No incluir GamiAula en la presentación, portada, metadatos ni imágenes.

Paleta: #07120D, #59C36A, #F2EBDD y #C9A66B. Títulos serif, cuerpo claro, alto contraste y fantasía sobria para docentes adultos. Ilustraciones inmersivas con espacio para lectura. Usa la herramienta integrada de imágenes para arte nuevo cuando sea necesario; diagramas y esquemas exactos con código.

La clase es sincrónica: el facilitador anuncia los cambios de pantalla y cada participante navega. No hay avance automático ni sincronización simulada. Principales: teoría y mini prácticas formativas. Secundarias: aplicación, conversación y producción. Toda actividad muestra consigna, tiempo y producto. Los tiempos sincrónicos suman 90 minutos; carga autónoma solo según la ficha.

Candados: recursos complementarios, pistas, reintentos y apertura acompañada claramente identificada. Nunca bloquear instrucciones, navegación, contenidos esenciales o evaluaciones. Progreso local no equivale a aprendizaje. Respuestas abiertas: revisión humana, sin juzgar calidad por palabras clave o extensión. Sin ranking público ni penalizaciones.

## Fidelidad narrativa

Ruta y mentores: Cantera/Bryn (7); Forja/Ondal (8–10); Santuario/Mira (11–13); Bóveda (14). Atributos: Maestría, Creación, Evaluación y cierre con todos, respectivamente.

Fragmento II al cerrar 7; III al cerrar 10; IV al cerrar 13; restauración del Orbe en 14. Sesión 14 es cierre sin misión formal asociada. No inventar personajes, códigos reales, puntos, canjes o requisitos numéricos del sistema central. Los ejemplos de diseño de participantes pueden definir propuestas propias, claramente separadas de las reglas reales de Ludaria.

## Funcionamiento y formularios

Cada misión tiene clave exclusiva de almacenamiento local y manejo honesto de fallos de almacenamiento. El usuario puede guardar, revisar, copiar o descargar su registro. No simules envío al docente, verificación en Sheets, Forja o Libro de Stats.

El receptor de Misión 0 recibe el diagnóstico original: no reutilizarlo para otros cuestionarios o payloads. No modificar aplicaciones de Google ni crear backend adicional como parte de esta automatización. Si faltan enlaces reales de formularios/recursos, deja configuración documentada y una alternativa local; marca la dependencia en la guía y resumen. Un marcador no debe parecer un botón de envío operativo. La falta de un enlace no impide terminar la presentación, pero su integración permanece pendiente y visible.

La reaplicación inicial–final de la sesión 14 es una ampliación solicitada por el usuario, no una exigencia de la tesis. Distingue ítems comparables, reformulaciones, rúbrica del prototipo, autoevaluación y valoración. No enseñar respuestas modelo antes del postest. No confundir el diagnóstico con una prueba amplia de todos los objetivos.

## Checkpoints y publicación

Guarda prompt, guion, código en desarrollo, fuentes verificadas y próximo paso en `produccion/borradores/<slug>/` con estado honesto. Nunca anunciar ese borrador como entrega lista. Después de implementación, revisión pedagógica y pruebas, publica solo la nueva carpeta de misión. Usa head/tree actuales y actualiza main sin force push. Ante cambios simultáneos, rebasea únicamente los archivos propios sobre el nuevo head.

Haz checkpoints al concluir contenido, implementación y verificación, y antes de agotar el contexto. `ESTADO.json` registra qué existe, qué falta, errores reales y cómo retomar. No guardar secretos, credenciales o respuestas de participantes en el repositorio público.

Verifica navegación, actividades correctas/incorrectas, explicación del feedback, pistas, reintentos, apertura acompañada, modales y foco, escritura/relectura de borradores, registro completo, teclado y movimiento reducido. Usa navegador real para pruebas de escritorio, móvil (375px o equivalente) y iframe 1280×720. Comprueba que no haya desbordamiento horizontal, controles cortados o pantallas inaccesibles. En móvil se admite desplazamiento vertical legible. Revisa todas las pantallas de escritorio.

Comprueba la publicación y GitHub Pages. Los assets con hash evitan mezcla de versiones; usa una query nueva para comprobar el HTML publicado. Un workflow exitoso solo acredita despliegue, no funcionamiento de la interfaz. Si no está disponible el navegador, conserva el trabajo como pendiente de revisión, sin fingir pruebas.

## Definición de entrega

Una misión «terminada» incluye: HTML publicado comprobado, actividades verificadas, contenido respaldado, guía docente, HTML portátil, ZIP con código/assets y una captura real. Guarda los archivos de entrega con la habilidad Library y conserva IDs/rutas en el estado. El código respaldado en Git no requiere una duplicación extra.

Por cada entrega, actualiza `produccion/RESUMEN_PARA_INCRUSTAR.md` con título, módulo, tipo, propósito, interacción destacada, producto, fuentes, dependencias reales, URL verificada, iframe y archivos. No fabricar enlaces para sesiones pendientes.

Si se interrumpe una ejecución, la siguiente retoma el checkpoint; la programación no restablece límites de uso. Si una herramienta pierde autorización, registra el bloqueo y comunica exactamente lo necesario para resolverlo. No asumir conexiones futuras.

Cuando estén terminadas las ocho sesiones y el resumen consolidado, entrega todos los iframes individuales y pausa únicamente «Continuar misiones de Ludaria», mediante el ID guardado o una búsqueda por título exacto. No modificar otras tareas programadas.

## Estado inicial

La creación de la automatización fue intentada y no se completó porque ya se alcanzó el límite del plan. Antes de activarla es necesario disponer de un espacio. No hay una nueva tarea ejecutándose. El prompt listo para crearla está en `produccion/AUTOMATIZACION.md`.
