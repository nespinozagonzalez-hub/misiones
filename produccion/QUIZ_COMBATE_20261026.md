# Ludaria · preguntas y ataques animados

> Corrección posterior del encuadre: la animación de cuadrícula se reemplaza por recortes independientes para evitar mostrar partes de la pose vecina. Se conservan el quiz y el arte. Fuente vigente: [ENCUADRE_SPRITES_20261026.md](ENCUADRE_SPRITES_20261026.md).

26 de octubre de 2026. Ampliación autorizada del encuentro con Lethon, sobre `d5e66cbc58c8c02dce6cebe812fe15cc198645e6`.

## Flujo

1. Elegir una de las cinco habilidades disponibles.
2. Responder una pregunta breve de gamificación, con cuatro opciones y una respuesta defendible.
3. Leer la explicación. Un error revela una pista, permite reintentar y no consume un turno ni escudo. También se puede cambiar de habilidad.
4. Tras acertar, pulsar «Ejecutar» para lanzar el ataque o la defensa.
5. Ver la secuencia del personaje, la respuesta de Lethon y el resultado del turno.

El banco tiene diez preguntas, dos por ámbito: propósito y coherencia, reglas y componentes, prototipo y narrativa, evidencias y retroalimentación, autonomía y convivencia. Prioriza preguntas no utilizadas en el encuentro y permite continuar si el banco se agota. Cada opción tiene explicación propia; cada pregunta contiene una pista y la ruta del contenido del curso que respalda su enfoque. Las preguntas se muestran dentro de la ventana de batalla, con la escena y los personajes visibles arriba.

## Alcance pedagógico y datos

Es un repaso formativo posterior a la recogida de los instrumentos. Su duración depende de las respuestas y reintentos; se acompaña dentro del bloque de cierre, sin desplazar la recogida de evidencias. Las preguntas son nuevas y no reemplazan ni reproducen los ítems comparables del diagnóstico/postest. No constituyen una nueva medida de aprendizaje, calificación o evaluación del prototipo.

Las respuestas y los intentos viven en la memoria del encuentro y no se guardan en el cuaderno ni se envían a Google. No hay nuevas recompensas, costes o atributos. La restauración final conserva el circuito anterior y los campos existentes. Salir durante una pregunta o animación no restaura el Orbe ni escribe un resultado del quiz. Las imágenes se solicitan al sitio como recursos estáticos; no existe una solicitud de respuestas del quiz.

## Arte y accesibilidad

- Tres atlas transparentes de seis poses: Kael, Kira y Lethon, 18 poses en total. Identidades y retratos anteriores conservados.
- Anticipación, preparación, lanzamiento, extensión y recuperación; proyectil y contraataque separados.
- Son secuencias ilustradas de seis fotogramas, no animación esquelética continua. La capa de movimiento usa las mismas posiciones de cada celda del atlas.
- Sonido opcional, foco dentro del diálogo, explicaciones anunciadas, preguntas navegables con teclado y retorno de foco a los controles.
- Movimiento reducido y pausa conservan los retratos estáticos. Un atlas que falla tampoco bloquea la batalla.
- La vista de revisión permite escoger Kael o Kira sin iniciar sesión o modificar un personaje real.

Prompts exactos, método integrado y recursos en [ARTE_SPRITES_20261026.md](../defensa-orbe/assets/ARTE_SPRITES_20261026.md).

## Checklist de comprobación

- [x] Banco: diez preguntas, cuatro opciones distintas, explicación de cada opción, pista, fuentes locales y rotación.
- [x] Activación: elegir una habilidad o una respuesta equivocada no ejecuta el movimiento. Acertar muestra la devolución antes del botón de ejecución.
- [x] Ataque y defensa, pista, reintento, cambio de habilidad, cancelación y recuperación.
- [x] Seis encuadres: 1280×900, 768×1024, 1024×768, 390×844, 320×568 y 844×390; sin desborde horizontal.
- [x] Los tres atlas cargan; poses de Kael, Kira y Lethon activadas en navegador. Se comprueba el cambio de fotograma, contraataque, retorno al retrato, movimiento reducido y respaldo si falta un atlas.
- [x] Victoria, epílogo y repetición; respuestas y reflexiones anteriores, identidad, XP y saldo conservados en servicios simulados.
- [x] 170 fuentes JS/CJS/GS pasan sintaxis; 26 entradas activas, 54 scripts y 358 referencias locales válidas. Los 16 iframe conservan sus direcciones.
- [x] Apps Script, cliente de cuentas, adaptadores, contenidos, instrumentos, catálogo RPG y reglas de recompensa sin cambios.

Regresión completa aprobada: 21 programas funcionales y 5 de navegador en [CI 40248387437](https://github.com/nespinozagonzalez-hub/misiones/actions/runs/40248387437), sobre `7bc68913a637ae8b72948913389212acf4471b9d`. [PR #30](https://github.com/nespinozagonzalez-hub/misiones/pull/30) integrado como `ada9645869fb86c13ff78154de1abaa9d6b2ab96`. Publicación del código aprobada en [Pages 40248659889](https://github.com/nespinozagonzalez-hub/misiones/actions/runs/40248659889). En la vista pública se comprobó pregunta, error con pista, explicación y ejecución; los atlas de Kira y Lethon se decodificaron correctamente, sin iniciar sesión ni consultar datos reales. La prueba autenticada de escrituras reales, los formularios externos configurables y la comprobación física de dispositivos siguen siendo los pendientes documentados en el [checklist general](CHECKLIST_FINAL_LUDARIA_20261025.md). No se accedió ni escribió la planilla real para estas pruebas.
