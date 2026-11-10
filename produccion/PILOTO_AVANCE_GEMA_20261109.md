# Avance de juego en La Gema Motivacional

El piloto separa las huellas de la práctica en la sesión 7 de las etapas registradas en el personaje. La franja de la Gema indica dónde está el jugador y qué acciones ya dejó en el cuaderno. La Forja muestra el progreso de la aventura a partir de sus runas.

| Hito | Pantallas | Huella visible |
|---|---|---|
| Explora | 1 a 3 | Cuántas facetas se han abierto. |
| Interpreta | 4 a 7 | La lectura se ilumina al anotar una interpretación. |
| Rediseña | 8 a 10 | La marca se ilumina cuando hay una regla propuesta y una forma de contrastarla. |
| Cierra | 11 y 12 | La reflexión anotada se distingue de la activación del cierre narrativo. |

## Checklist aplicado

- [x] Ruta de cuatro hitos con el tramo actual en dorado y las huellas anotadas en verde. La navegación sigue disponible en las doce pantallas.
- [x] Etiqueta «Ahora» junto a la consigna del paso y señal «Tú eliges» junto a decisiones reales en las facetas, la lectura y el rediseño.
- [x] Feedback de los candados con explicación y acción siguiente. Las pistas, los reintentos y la apertura acompañada siguen disponibles.
- [x] Confirmación del cuaderno junto a la decisión, el rediseño y el cierre. Modo local, guardado pendiente, confirmación y error se distinguen.
- [x] Cierre de Bryn con una secuencia de tres acciones. Compartir el trabajo, recibir la runa del docente y activarla con el mismo personaje. Enlace a la Forja y siguiente parada en Los Planos del Arquitecto.
- [x] «Mi viaje» con barra de etapas registradas y marcas por territorio. El recibo de canje lleva a ese panel, donde se abre el territorio de la última runa registrada.
- [x] Continuidad al reabrir el enlace original de la misión. Los hitos se reconstruyen desde el cuaderno de versión 1, con los mismos campos y duración de 90 minutos.

## Comprobación

La prueba de navegador en `ludaria/test-rpg-browser.cjs` recorre la Gema y la Forja con un personaje ficticio. Comprueba la reanudación local y conectada, la elección y el feedback, un fallo de guardado seguido de confirmación, el cierre en un marco de 720 px y el encuadre móvil. Visitar el cierre y activar la ceremonia dejan el contador de la aventura en 0 de 14. Canjear la runa de la Gema lleva a 1 de 14 e ilumina una de las tres marcas de la Cantera. Los valores de XP y puntos corresponden al catálogo existente.

La prueba de incrustaciones compara los 16 iframe originales. Las pruebas conectadas usan servicios simulados. La validación con docentes y el canje en cuentas reales son comprobaciones separadas.

## Siguiente ronda

- [ ] Probar en clase si los jugadores se ubican, encuentran una decisión propia y explican cómo registrar su logro sin ayuda adicional.
- [ ] Adaptar los hitos y las consignas de las demás misiones a sus actividades reales.
- [ ] Evaluar la visualización del avance autenticado directamente en el mapa y la revisión específica de Genially. La consulta vigente del mapa independiente abre «Mi viaje» en la Forja.

## Preparación de la sesión sincrónica

- [x] La portada permite preparar la mochila y entrar con o sin ventajas equipadas.
- [x] El icono superior indica cuántas ventajas de la misión están desbloqueadas por los atributos del personaje.
- [x] Las fichas de la poción, el prisma y el corazón muestran qué aporta cada objeto, cuándo usarlo y qué atributo pide aunque todavía esté bloqueado. La [tabla de beneficios](ATRIBUTOS_GUARDIANES_DECISIONES.md#la-gema-motivacional) relaciona los objetos con las ayudas del catálogo.
- [x] Equipar y quitar organiza los objetos durante la visita. El botón «Usar» abre la ayuda correspondiente durante la sesión. El contador y la acción para entrar quedan visibles mientras se revisan los objetos.
- [x] Cada objeto equipado se anuncia junto a la actividad donde ayuda. La poción aparece en el primer dilema y en Diagnóstico, el prisma en Los puntos arbitrarios y en Rediseño, y el corazón en Contraste y en el intercambio entre equipos. Su icono da un pulso breve la primera vez que aparece en cada actividad.
- [x] La «Pista del candado» se distingue de los objetos equipados. La navegación y los controles de sesión usan franjas compactas, con el ajuste de animaciones integrado al pie.
- [x] En escritorio, la ruta, la mochila y los botones de navegación quedan fijos. El panel de actividades se desplaza cuando necesita espacio. En pantallas pequeñas, la página conserva el desplazamiento habitual.

El piloto de la Gema dio origen al recorrido común de Ludaria. La preparación se valida con personajes de prueba, incluido un personaje sin ventajas desbloqueadas. [Recorrido y mochila en las misiones](RESUMEN_PARA_INCRUSTAR.md#recorrido-y-mochila--10-de-noviembre-de-2026)
