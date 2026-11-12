/** Contenido de los objetos y momentos de uso. Los umbrales y las acciones se validan con el catálogo RPG. */
((root) => {
  'use strict';

  const at = (page, label, {tab, field} = {}) => ({page, label, tab, field});
  const item = (art, type, guide, ...moments) => {
    const folder = ['pocion', 'prisma', 'corazon'].includes(art) ? 'gema-motivacional' : 'ludaria';
    return {art, image:`../${folder}/assets/objeto-${art}.svg`, type, ...guide, moments};
  };
  const missions = {
    'mision-0': {
      phases: [[1, 'Inicio'], [4, 'Explora'], [9, 'Diagnóstico'], [12, 'Entrada']]
    },
    'pergaminos-dispersos': {
      phases: [[1, 'Explora'], [4, 'Distingue'], [8, 'Clasifica'], [12, 'Transfiere']],
      gear: {
        'pergaminos-dispersos_0': item('brujula', 'Pista', {
          effect: 'Tres señales para clasificar un caso',
          benefit: 'Encuentra qué dato mirar cuando dos categorías te parecen posibles.',
          steps: ['Nombra el aprendizaje que busca el caso. Luego identifica qué hace la persona con el elemento lúdico.', 'Imagina que quitas ese elemento. ¿Cambia la manera de practicar el aprendizaje o solo cambia el reconocimiento?'],
          template: 'El propósito es ___. El elemento cambia ___. Si lo quitamos, ___. Nuestra clasificación provisional es ___.'
        }, at(9, 'Mesa de clasificación')),
        'pergaminos-dispersos_1': item('pergamino', 'Comodín', {
          routes: [
            ["Sostener mi primera lectura", "Busca un detalle del caso que apoye tu primera clasificación. Anota qué pregunta ayudaría a ponerla a prueba.", 0],
            ["Probar otra clasificación", "Elige otra categoría y busca el dato que haría razonable usarla en este mismo caso.", 1],
          ],
          effect: 'Una segunda lectura para desempatar',
          benefit: 'Prueba una clasificación alternativa antes de defender la primera.',
          steps: ['Toma el caso que causó desacuerdo y ponle dos etiquetas posibles.', 'Busca un detalle que favorezca cada lectura. Si ambas siguen abiertas, pregunta por el dato que resolvería el desacuerdo.'],
          template: 'Lectura A: ___, porque veo ___.\nLectura B: ___, porque veo ___.\nPara decidir, preguntaría ___.'
        }, at(10, 'Las fronteras también se discuten')),
        'pergaminos-dispersos_2': item('prisma', 'Plantilla', {
          effect: 'Una prueba rápida para tu criterio',
          benefit: 'Lleva a la puesta en común un contraejemplo que el grupo pueda discutir.',
          steps: ['Cambia un solo detalle del caso discutido, como la posibilidad de revisar tras recibir feedback.', 'Prueba tu clasificación con ese cambio. Anota qué parte de tu criterio conservas o precisas.'],
          template: 'Clasificamos ___ como ___. Si cambiamos solo ___, nuestro criterio diría ___. Lo precisaríamos así: ___.'
        }, at(11, 'Puesta en común con Théol', {field:'acuerdo'}))
      }
    },
    'senda-ejemplos': {
      phases: [[1, 'Explora'], [5, 'Examina'], [8, 'Contrasta'], [11, 'Registra']],
      gear: {
        'senda-ejemplos_0': item('lupa', 'Pista', {
          effect: 'Un filtro para revisar lo que sí consta',
          benefit: 'Reduce las opciones del expediente a las que puedes respaldar con la fuente.',
          steps: ['Busca el elemento por su nombre o por una descripción inequívoca de cómo se usa.', 'Si solo lo deduces por el tema, déjalo como hipótesis. Vuelve a la fuente antes de marcarlo como documentado.'],
          template: 'Elemento que busco: ___.\nFragmento de la fuente: ___.\nEstado: consta / necesito comprobarlo.'
        }, at(6, 'Las huellas del diseño')),
        'senda-ejemplos_1': item('pergamino', 'Comodín', {
          routes: [
            ["Mirar el objetivo", "Vuelve a la fuente y localiza la parte que relaciona la decisión con el aprendizaje que se quería practicar.", 0],
            ["Mirar el contexto", "Busca un detalle del grupo, del tiempo o de los recursos que también pueda explicar la decisión.", 1],
          ],
          effect: 'Dos lecturas para revisar una conclusión',
          benefit: 'Detecta si una explicación se apoya mejor en el objetivo o en el contexto.',
          steps: ['Lee la afirmación desde el objetivo. ¿La fuente muestra que la decisión ayuda a practicar ese aprendizaje?', 'Vuelve a leerla desde el contexto. ¿La decisión también podría explicarse por el grupo, los recursos o el tiempo?'],
          template: 'La fuente muestra ___. Desde el objetivo, podría significar ___. Desde el contexto, podría significar ___. Para distinguirlas falta ___.'
        }, at(8, 'La niebla de las conclusiones')),
        'senda-ejemplos_2': item('corazon', 'Plantilla', {
          effect: 'Una pregunta lista para otra pareja',
          benefit: 'Consigue una revisión concreta de tu interpretación durante el intercambio.',
          steps: ['Muestra tu lectura y el pasaje exacto en que te apoyas.', 'Pídele a la otra pareja que señale qué parte de tu frase va más allá de ese pasaje.'],
          template: 'Leímos ___ porque la fuente dice ___. ¿Qué parte de nuestra interpretación necesitaría otra evidencia?\nDespués de escucharlos, cambiaríamos ___.'
        }, at(10, 'Una segunda mirada puede cambiar tu lectura', {field:'peer'}))
      }
    },
    'claro-debate': {
      phases: [[1, 'Explora'], [4, 'Lee'], [9, 'Argumenta'], [11, 'Sintetiza']],
      gear: {
        'claro-debate_0': item('brujula', 'Plantilla', {
          effect: 'Un guion para repartir tres turnos',
          benefit: 'Abre la discusión con una postura, una pregunta de evidencia y una síntesis.',
          steps: ['Una persona explica su postura en una frase. Otra pregunta qué caso o fuente la respalda.', 'Una tercera resume el acuerdo y deja abierta la duda. En la siguiente ronda roten los papeles.'],
          template: 'Postura: pienso ___ porque ___.\nPregunta: ¿en qué caso lo viste?\nSíntesis: coincidimos en ___ y falta aclarar ___.'
        }, at(3, '¿Dónde se sitúa tu primera mirada?')),
        'claro-debate_1': item('escudo', 'Comodín', {
          routes: [
            ["Defender la postura contraria", "Ensaya la razón más fuerte que darías si tuvieras que defender esa postura.", 0],
            ["Reconstruir la idea de un par", "Resume su argumento en una frase y pregúntale si esa frase recoge lo que quiso decir.", 1],
          ],
          effect: 'Un ensayo desde la silla contraria',
          benefit: 'Refuerza tu argumento al probar la objeción más difícil antes de responder.',
          steps: ['Si ensayas otra postura, escribe su mejor razón. Si reconstruyes la de un par, pregúntale si la representaste bien.', 'Identifica qué evidencia te haría conceder un punto o acotar tu afirmación.'],
          template: 'La mejor razón de esa postura es ___. Le concedo ___. Mantengo o ajusto mi postura sobre ___ por esta evidencia: ___.'
        }, at(9, 'Escucha una objeción')),
        'claro-debate_2': item('pergamino', 'Plantilla', {
          effect: 'Una ficha para comparar dos fuentes',
          benefit: 'Encuentra qué conclusión puedes trasladar al aula y dónde tiene un límite.',
          steps: ['Anota en cada fuente qué se midió y en qué grupo o tipo de estudios.', 'Compara ambos indicadores. Si son distintos, formula qué aporta cada uno al argumento por separado.'],
          template: 'Fuente A — qué midió y dónde: ___.\nFuente B — qué midió y dónde: ___.\nPara mi aula puedo plantear ___. Me falta comprobar ___.'
        }, at(4, 'Tres fuentes. Preguntas más precisas'))
      }
    },
    'vetas-diseno': {
      phases: [[1, 'Explora'], [4, 'Distingue'], [8, 'Clasifica'], [12, 'Aplica']],
      gear: {
        'vetas-diseno_0': item('lupa', 'Pista', {
          effect: 'Un ejemplo para separar regla, objeto y experiencia',
          benefit: 'Ubica qué nivel estás mirando antes de completar la cadena del Observatorio.',
          steps: ['Prueba con este ejemplo aparte: una ficha de préstamo es el objeto, cederla siguiendo un turno es la regla y la cooperación sostenida es la experiencia.', 'En el Observatorio, empieza por el verbo de la acción y busca qué objeto permite realizarla.'],
          template: 'Objetivo: ___. La persona hace ___ según esta regla: ___. Usa ___ para hacerlo.'
        }, at(8, 'El Observatorio del Agua')),
        ojo_artesano: item('brujula', 'Pista', {
          effect: 'Un desempate para las tarjetas dudosas',
          benefit: 'Decide si la tarjeta describe una dinámica, una mecánica o un componente.',
          steps: ['Subraya lo que la tarjeta describe. Pregunta si es lo que se vive, la regla que organiza la acción o el objeto que la representa.', 'Si una palabra puede cumplir dos funciones, defiende la que cumple en ese caso con una frase de la tarjeta.'],
          template: 'Aquí ___ funciona como ___ porque la tarjeta describe ___. En otro contexto podría funcionar como ___.'
        }, at(9, 'Clasificar las vetas')),
        'vetas-diseno_2': item('prisma', 'Comodín', {
          routes: [
            ["Cambiar el soporte", "Sustituye el componente por otro soporte, por ejemplo un registro en papel. Mantén la regla y simula una jugada.", 0],
            ["Cambiar lo que muestra el objeto", "Conserva la regla y prueba un componente que haga visible otra evidencia del mismo aprendizaje.", 0],
          ],
          effect: 'Una segunda versión con la misma regla',
          benefit: 'Cambia el objeto del desafío y comprueba si todavía provoca la experiencia que buscas.',
          steps: ['Conserva el objetivo y la regla. Sustituye solo el componente, por ejemplo una insignia por una tarjeta de registro.', 'Haz una jugada con cada versión y anota qué cambia en la participación o en la evidencia que queda.'],
          template: 'Regla que conservamos: ___.\nVersión A: ___. Versión B: ___.\nElegimos ___ porque en la jugada observamos ___.'
        }, at(13, 'La prueba de Maestría'))
      }
    },
    'tallado-mecanicas': {
      phases: [[1, 'Elige'], [4, 'Observa'], [6, 'Analiza'], [9, 'Contrasta']],
      gear: {
        'tallado-mecanicas_0': item('pergamino', 'Plantilla', {
          effect: 'Un mapa de cuatro casillas para el bucle',
          benefit: 'Reconstruye una jugada y encuentra qué información permite volver a decidir.',
          steps: ['Recuerda una jugada concreta. Anota cómo estaba el tablero antes de actuar, qué hiciste y qué cambió.', 'Explica qué decisión nueva permitió ese cambio. Si no encuentras una, señala qué aviso o feedback faltaría.'],
          template: 'Estado inicial: ___.\nAcción: ___.\nRespuesta que pude ver: ___.\nGracias a esa respuesta, después puedo ___.'
        }, at(6, 'Una acción vuelve a comenzar')),
        'tallado-mecanicas_1': item('martillo', 'Comodín', {
          routes: [
            ["Cambiar el orden de turnos", "Repite la jugada con otro orden. Observa quién puede decidir antes y qué cambia en su elección.", 0],
            ["Mostrar información antes", "Repite la jugada dando un dato antes de elegir. Mira si ese dato cambia la decisión.", 1],
          ],
          effect: 'Una jugada de prueba con una regla distinta',
          benefit: 'Aísla qué comportamiento podría cambiar al ajustar el turno o la información.',
          steps: ['Repite la misma situación del tablero en un ensayo de mesa. Alterna el orden de turnos o revela un dato antes de decidir.', 'Conserva todo lo demás y compara qué decisión tomó la persona en cada versión.'],
          template: 'Situación inicial: ___. Cambiamos solo ___.\nAntes la persona eligió ___. En el ensayo eligió ___.\nLa diferencia que queremos volver a observar es ___.'
        }, at(4, 'Bajo la lupa del tallador')),
        'tallado-mecanicas_2': item('escudo', 'Plantilla', {
          effect: 'Una prueba de tensión desde dos roles',
          benefit: 'Detecta a quién deja fuera una regla y qué cambio vale la pena probar.',
          steps: ['Simula una ronda desde quien se rezaga y otra desde quien suele tomar todas las decisiones.', 'Cuenta quién pudo decidir o aportar. Cambia una condición del reconocimiento y repite la comparación.'],
          template: 'Con la regla inicial, ___ pudo aportar ___ veces. Con el ajuste ___, observamos ___. Conservaremos el cambio si ___.'
        }, at(8, 'Cuando la regla desvía el propósito'))
      }
    },
    'gema-motivacional': {
      gear: {
        'gema-motivacional_0': {
          ...item('pocion', 'Pista', {
            effect: 'Tres preguntas para diagnosticar el dilema',
            benefit: 'Encuentra una señal de autonomía, competencia o vinculación para justificar tu hipótesis.',
            steps: ['Mira qué decisión puede tomar la persona, qué feedback le permite avanzar y en qué situación puede pedir ayuda sin exponerse.', 'Elige la pregunta con la señal más clara. Anota qué regla viste y qué preguntarías para comprobar cómo se vivió.'],
            template: 'La regla ___ podría afectar ___. Vimos esta señal: ___. Para comprobarlo, le preguntaría al grupo ___.'
          }, at(4, 'La clasificación pública', {field:'initial'}), at(8, 'Diagnóstico', {tab:'tab-0', field:'diagnosis'})),
          title: 'Poción de enfoque'
        },
        'gema-motivacional_1': {
          ...item('prisma', 'Comodín', {
            routes: [
              ["Dar una elección real", "Esboza dos maneras de participar que permitan mostrar el mismo aprendizaje. Escribe qué podría elegir el grupo.", 0],
              ["Dar un apoyo concreto", "Prueba anunciar el criterio antes de empezar o dar una vía de consulta entre pares. Escribe en qué momento usarían ese apoyo.", 1],
            ],
            effect: 'Dos caminos para reescribir una regla',
            benefit: 'Compara ofrecer una elección real con dar más apoyo para avanzar.',
            steps: ['Ruta de elección: ofrece dos maneras de mostrar el mismo aprendizaje. Ruta de apoyo: muestra el criterio antes de empezar o habilita orientación entre pares.', 'Elige una sola modificación. Mantén el propósito y define una señal que mostraría si el cambio ayudó.'],
            template: 'Antes: ___.\nAhora: ___.\nEsto podría mejorar ___ porque ___. Lo pondríamos a prueba observando ___.'
          }, at(6, 'Los puntos arbitrarios'), at(8, 'Rediseño', {tab:'tab-1', field:'rule'})),
          title: 'Prisma de contraste'
        },
        'gema-motivacional_2': {
          ...item('corazon', 'Plantilla', {
            effect: 'Una prueba para encontrar quién queda fuera',
            benefit: 'Comprueba si se puede aportar sin competir ni exponer los errores.',
            steps: ['Pídele a otro equipo que simule ser una persona que prefiere no hablar en público o que necesita más tiempo.', 'Observen dónde se frena su aporte. Prueben una vía equivalente, como escribir primero y compartir por turnos.'],
            template: 'Probamos el diseño con el rol ___. Su aporte se frenó cuando ___. Probamos ___ y observamos ___.'
          }, at(8, 'Contraste', {tab:'tab-2', field:'evidence'}), at(9, 'Contrastar el nuevo diseño', {field:'revision'})),
          title: 'Corazón del cuidado'
        }
      }
    },
    'planos-arquitecto': {
      phases: [[1, 'Explora'], [4, 'Define'], [7, 'Conecta'], [12, 'Diseña']],
      gear: {
        'planos-arquitecto_0': item('brujula', 'Plantilla', {
          effect: 'Un molde para unir objetivo, acción y evidencia',
          benefit: 'Escribe una tarea que deje una huella observable de lo que quieres enseñar.',
          steps: ['Pasa del objetivo a un verbo que puedas ver, como comparar o justificar.', 'Decide qué quedará a la vista. Si tu objetivo es justificar, busca el criterio que la persona usó, además de la elección final.'],
          template: 'Quiero que aprendan a ___. Les pediré que ___. Buscaré esta evidencia en su trabajo: ___.'
        }, at(5, 'D2 · Acciones que dejan huella')),
        'planos-arquitecto_1': item('prisma', 'Comodín', {
          routes: [
            ["Ofrecer dos rutas", "Dibuja dos maneras de llegar a la misma evidencia. Decide qué podrá elegir la persona al empezar.", 0],
            ["Diseñar roles que se necesiten", "Reparte aportes complementarios. Decide qué evidencia quedará de la contribución de cada integrante.", 1],
          ],
          effect: 'Dos versiones del mismo reto',
          benefit: 'Elige entre dar opciones o repartir roles sin perder el objetivo de aprendizaje.',
          steps: ['Boceta una ruta con dos maneras de entregar la misma evidencia y otra con roles que necesiten aportes de todos.', 'Imagina al grupo en ambas rutas. Elige la que probarías primero y explica qué esperarías observar.'],
          template: 'Objetivo y evidencia que se mantienen: ___.\nCon elección podrían ___. Con roles podrían ___.\nProbaría ___ y observaría ___.'
        }, at(8, 'D5 · La experiencia lúdica')),
        'planos-arquitecto_2': item('pergamino', 'Pista', {
          effect: 'Un detector de feedback que llega tarde',
          benefit: 'Encuentra el punto en que una persona se queda sin información para mejorar.',
          steps: ['Haz una pasada como jugador y detente al recibir la respuesta a tu primera acción.', 'Intenta decir qué cambiarías en el próximo intento. Si no puedes, escribe el mensaje mínimo que te permitiría decidir.'],
          template: 'Después de ___ solo supe ___. Para el siguiente intento necesito saber ___. Daré ese feedback antes de ___.'
        }, at(7, 'D4 · Probar, recibir y volver'))
      }
    },
    'yunque': {
      phases: [[1, 'Prepara'], [4, 'Construye'], [8, 'Comprueba'], [9, 'Registra']],
      gear: {
        'yunque_0': item('martillo', 'Plantilla', {
          effect: 'Una misión en cuatro casillas',
          benefit: 'Pasa del lienzo a un primer desafío que otra persona pueda intentar.',
          steps: ['Escribe un encargo con un verbo y un producto. Comprueba que una persona pueda empezar con esa sola frase.', 'Añade la señal de logro y el mensaje que recibirá si necesita otro intento.'],
          template: 'Encargo: ___.\nAcción de quien juega: ___.\nEvidencia que deja: ___.\nFeedback para revisar: ___.'
        }, at(5, 'Dar forma a una misión')),
        'yunque_1': item('prisma', 'Comodín', {
          routes: [
            ["Usar un recurso limitado", "Define un recurso que el grupo pueda distribuir entre dos hitos y cómo podrá volver a intentar.", 0],
            ["Avanzar con aportes del grupo", "Define qué debe aportar cada integrante para abrir el segundo hito y cómo se reincorpora quien se atasque.", 1],
          ],
          effect: 'Dos rutas para ensayar cómo se avanza',
          benefit: 'Prueba un avance con recursos limitados o con aportes del equipo.',
          steps: ['Dibuja dos hitos con el mismo objetivo. En una versión, el grupo elige dónde usar un recurso limitado. En la otra, debe reunir aportes distintos.', 'Ensaya cómo reingresa alguien tras un intento fallido y conserva la ruta con un próximo paso más claro.'],
          template: 'Para pasar de ___ a ___ se necesita ___. Si la persona se atasca, puede ___. Elegimos esta ruta porque ___.'
        }, at(6, 'Diseñar cómo se avanza')),
        'yunque_2': item('corazon', 'Plantilla', {
          effect: 'Una microprueba con otra persona',
          benefit: 'Encuentra el primer atasco de tu prototipo antes de seguir construyendo.',
          steps: ['Muestra la primera misión a un par y pídele que haga el primer paso en voz alta con la consigna a la vista.', 'Antes de explicar, registra dónde dudó y qué esperaba que pasara. Reescribe solo ese paso o su feedback.'],
          template: 'La persona entendió que debía ___. Dudó cuando ___. Cambiaré ___ y volveré a pedirle que ___.'
        }, at(8, 'Una prueba de coherencia'))
      }
    },
    'templado-pares': {
      phases: [[1, 'Acuerda'], [4, 'Revisa'], [6, 'Ajusta'], [8, 'Cierra']],
      gear: {
        'templado-pares_0': item('pergamino', 'Plantilla', {
          effect: 'Un guion de feedback en tres frases',
          benefit: 'Convierte un criterio de la pauta en una observación útil para un par.',
          steps: ['Elijan un criterio de la pauta y acuerden qué detalle del canvas serviría como evidencia.', 'Ensayen una devolución que señale ese detalle, plantee una pregunta y sugiera un cambio pequeño.'],
          template: 'En el canvas vi ___. Según el criterio ___, me pregunto ___. Podrías probar ___ para que ___.'
        }, at(3, 'La pauta que compartimos')),
        'templado-pares_1': item('corazon', 'Comodín', {
          routes: [
            ["Pedir un ejemplo concreto", "Pide al par que señale dónde vio el problema en el canvas y qué cambiaría en ese punto.", 0],
            ["Comparar dos sugerencias", "Anota qué criterio prioriza cada par y qué ajuste serviría para probar la sugerencia con más evidencia.", 1],
          ],
          effect: 'Una pregunta para destrabar el feedback',
          benefit: 'Aclara una sugerencia vaga o encuentra qué buscan dos sugerencias opuestas.',
          steps: ['Si una sugerencia es vaga, pide que te muestren el punto exacto del canvas. Si hay dos opiniones, pregunta qué criterio prioriza cada una.', 'Repite lo que entendiste y confirma con el par antes de elegir un ajuste.'],
          template: 'Entendí que viste ___ y que quieres mejorar ___. ¿Es así?\nProbaría ___ para responder a ese criterio.'
        }, at(6, 'Escuchar las dos miradas')),
        'templado-pares_2': item('escudo', 'Pista', {
          effect: 'Un filtro para elegir qué feedback aplicar',
          benefit: 'Prioriza el cambio con evidencia más clara y mejor conexión con tu objetivo.',
          steps: ['Busca en cada sugerencia un detalle observable de tu canvas y la parte del objetivo a la que aporta.', 'Si dos cambios tienen un aporte parecido, empieza por el que puedas probar en un intento corto.'],
          template: 'Primero probaré ___ porque la evidencia es ___ y afecta a ___. Dejaré ___ para después de comprobar ___.'
        }, at(7, 'Volver al canvas'))
      }
    },
    'reflejo-diseno': {
      phases: [[1, 'Explora'], [4, 'Lee'], [10, 'Aplica'], [11, 'Acuerda']],
      gear: {
        'reflejo-diseno_0': item('espejo', 'Plantilla', {
          effect: 'Una frase para justificar un nivel',
          benefit: 'Une el descriptor de la rúbrica con un detalle que el grupo pueda localizar.',
          steps: ['Copia la parte del descriptor que separa tu nivel del nivel contiguo.', 'Busca una acción o un producto del caso que respalde esa parte. Escribe qué información pedirías si sigue habiendo dudas.'],
          template: 'En el criterio ___, proponemos el nivel ___ por este fragmento: ___. El caso lo muestra cuando ___. Falta saber ___.'
        }, at(10, 'Un caso ante el espejo')),
        'reflejo-diseno_1': item('prisma', 'Comodín', {
          routes: [
            ["Ensayar el primer nivel", "Ubica una evidencia para el primer descriptor y escribe qué tendrías que ver para subir al siguiente.", 0],
            ["Ensayar el segundo nivel", "Señala la evidencia adicional que exige el descriptor más alto. Decide si aparece en el caso.", 1],
          ],
          effect: 'Una prueba entre dos niveles vecinos',
          benefit: 'Desempata dos lecturas de la rúbrica con una evidencia verificable.',
          steps: ['Anota qué requisito se agrega al pasar del primer nivel al siguiente.', 'Busquen una huella de ese requisito en el mismo caso. Si hay duda, dejen escrito qué evidencia aceptarían la próxima vez.'],
          template: 'La diferencia entre los niveles ___ y ___ es ___. En el caso vemos ___. Acordamos usar ___ como evidencia para decidir.'
        }, at(11, 'Acuerdos de interpretación', {field:'agreement2'})),
        'reflejo-diseno_2': item('lupa', 'Pista', {
          effect: 'Un detector de afirmaciones sobre motivación',
          benefit: 'Separa lo que el diseño permite de cómo lo vivió realmente el grupo.',
          steps: ['Subraya la frase que atribuye una emoción o intención al grupo. Busca el hecho que sí está descrito.', 'Reescribe la frase como hipótesis y señala una observación o una pregunta que ayudaría a comprobarla.'],
          template: 'El diseño permite ___. Eso podría apoyar ___. Para saber cómo se vivió, preguntaría u observaría ___.'
        }, at(9, 'Motivación y ética'))
      }
    },
    'pulido-prototipo': {
      phases: [[1, 'Reúne'], [3, 'Autoevalúa'], [5, 'Ajusta'], [7, 'Planifica']],
      gear: {
        'pulido-prototipo_0': item('brujula', 'Pista', {
          effect: 'Un desempate para ordenar tus mejoras',
          benefit: 'Elige por dónde empezar cuando hay varios cambios pendientes.',
          steps: ['En cada ajuste, marca qué atasco observado resolvería y a quién le permitiría avanzar.', 'Si dos ajustes resuelven un atasco parecido, elige el que puedas comprobar antes con los recursos que tienes.'],
          template: 'Empiezo con ___ porque observé ___. Para comprobar que el cambio sirvió, buscaré ___.'
        }, at(5, 'Elegir qué pulir primero')),
        'pulido-prototipo_1': item('prisma', 'Comodín', {
          routes: [
            ["Priorizar lo que aporta al aprendizaje", "Describe el ajuste más completo y la evidencia que recogerías para saber si funcionó.", 0],
            ["Hacer una prueba pequeña ahora", "Elige la versión mínima del ajuste que puedes ensayar con tus recursos y qué señal mirarás.", 1],
          ],
          effect: 'Dos versiones del próximo ajuste',
          benefit: 'Elige qué mejora hacer ahora y cuál requiere otra prueba o más recursos.',
          steps: ['Esboza el ajuste con mayor aporte al aprendizaje y su versión mínima que puedas probar pronto.', 'Para ambas versiones, fija qué evidencia recogerías y qué riesgo vigilarías. Elige la que ensayarás primero.'],
          template: 'Versión completa: ___. Versión mínima: ___.\nPrimero probaré ___ con ___. Buscaré ___ y vigilaré ___.'
        }, at(6, 'Tallado de la nueva versión')),
        'pulido-prototipo_2': item('martillo', 'Comodín', {
          routes: [
            ["Preparar una versión sin conexión", "Cambia el soporte digital por uno que permita realizar la misma acción y conservar la evidencia.", 0],
            ["Preparar una versión con pocos dispositivos", "Reorganiza turnos y materiales para que cada persona pueda mostrar la misma evidencia.", 0],
          ],
          effect: 'Un plan B ante una falla técnica',
          benefit: 'Prepara una alternativa que conserve el aprendizaje si falla un recurso.',
          steps: ['Elige qué puede faltar, por ejemplo conexión, dispositivos o tiempo. Cambia solo el medio de una acción clave.', 'Simula la primera acción con la alternativa. Comprueba que se pueda recoger la misma evidencia del aprendizaje.'],
          template: 'Si falla ___, usaremos ___. Las personas seguirán haciendo ___. Recogeremos ___ para comprobar el mismo objetivo.'
        }, at(8, 'Plan de implementación · condiciones'))
      }
    },
    'espejo-compartido': {
      phases: [[1, 'Prepara'], [4, 'Presenta'], [5, 'Escucha'], [6, 'Ajusta']],
      gear: {
        'espejo-compartido_0': item('corazon', 'Plantilla', {
          effect: 'Una tarjeta para devolver feedback concreto',
          benefit: 'Entrega a un par una fortaleza y un próximo paso respaldados por su presentación.',
          steps: ['Anota una evidencia que puedas ubicar en un minuto, una diapositiva o una parte del prototipo.', 'Conecta esa evidencia con un criterio de la pauta y propone algo que el par pueda probar.'],
          template: 'Vi ___ en ___. Eso fortalece ___ según la pauta. ¿Qué pasaría si probaras ___ en el próximo intento?'
        }, at(5, 'Retroalimentación cruzada')),
        'espejo-compartido_1': item('espejo', 'Comodín', {
          routes: [
            ["Precisar la duda que recibí", "Pide a tu par que muestre el momento del prototipo que originó su pregunta.", 0],
            ["Sostener mi decisión con evidencia", "Señala en qué parte del prototipo se ve el aporte de esa decisión al objetivo.", 1],
          ],
          effect: 'Dos formas de responder al feedback',
          benefit: 'Puedes profundizar una duda o sostener una decisión con evidencia.',
          steps: ['Si algo sigue abierto, pide a tu par el ejemplo que le hizo dudar. Si conservas una decisión, muestra dónde se ve su aporte al objetivo.', 'Cierra con una acción que puedas ensayar y una condición para revisarla.'],
          template: 'Escuché que te preocupa ___. Mi razón para mantener o revisar ___ es ___. Lo volveré a mirar si observo ___.'
        }, at(6, 'Lo que defiendo y lo que reviso')),
        'espejo-compartido_2': item('martillo', 'Plantilla', {
          effect: 'Una tarjeta para convertir feedback en una prueba',
          benefit: 'Sal del intercambio con un cambio, una fecha y una señal para evaluar su efecto.',
          steps: ['Elige una sugerencia y conviértela en una tarea concreta que puedas terminar antes del próximo ensayo.', 'Define qué señal compararás antes y después, como la cantidad de personas que empiezan sin pedir otra explicación.'],
          template: 'Antes del ___ cambiaré ___. En el próximo ensayo registraré ___. Sabré que el cambio ayudó si ___.'
        }, at(7, 'El cuarto fragmento'))
      }
    },
    'defensa-orbe': {
      phases: [[1, 'Retoma'], [5, 'Entrega'], [7, 'Reflexiona'], [12, 'Restaura']],
      gear: {
        'defensa-orbe_0': item('pergamino', 'Plantilla', {
          effect: 'Un guion de cuatro frases para tu defensa',
          benefit: 'Presenta tu prototipo con una evidencia localizable y un límite explícito.',
          steps: ['Elige una decisión de diseño que responda a una necesidad del aula.', 'Ubica la evidencia en el prototipo o en un ensayo. Termina con una pregunta que aún tengas que resolver.'],
          template: 'El grupo necesitaba ___.\nPor eso diseñé ___.\nLa evidencia está en ___.\nMe falta comprobar ___.'
        }, at(5, 'Entrega final del prototipo')),
        'defensa-orbe_1': item('escudo', 'Comodín', {
          routes: [
            ["Responder con la evidencia que tengo", "Ensaya una respuesta breve que ubique la evidencia en el prototipo o en un ensayo.", 0],
            ["Definir lo que me falta probar", "Identifica qué dato respondería la objeción y cuándo podrías recogerlo.", 1],
          ],
          effect: 'Un ensayo para responder una objeción',
          benefit: 'Prepara una respuesta breve y deja lista una prueba si falta evidencia.',
          steps: ['Escribe una objeción concreta, como «¿cómo sabrás quién aprendió si el reto es en grupo?».', 'Ensaya la respuesta con la evidencia que tienes. Para lo pendiente, di qué dato recogerías y cuándo.'],
          template: 'Objeción: ___.\nPuedo sostener ___ con ___.\nPara responder lo que falta, recogeré ___ en ___.'
        }, at(6, 'La mirada del facilitador')),
        'defensa-orbe_2': item('orbe', 'Comodín', {
          routes: [
            ["Adaptar a una clase más corta", "Elige qué fase puedes acortar o reunir con otra. Conserva la meta y la evidencia clave.", 0],
            ["Adaptar a otros recursos", "Cambia un recurso que el nuevo grupo no tenga. Decide cómo recogerás evidencia equivalente.", 0],
          ],
          effect: 'Una versión para llevar a otra aula',
          benefit: 'Adapta una pieza del diseño al nuevo contexto y decide cómo probarla.',
          steps: ['Elige un contexto que cambie una condición, como el tiempo disponible o el acceso a dispositivos.', 'Conserva la meta y cambia una regla o componente. Decide qué compararás en un ensayo breve.'],
          template: 'En el nuevo contexto cambia ___. Conservaré ___ y adaptaré ___. Comprobaré la adaptación observando ___.'
        }, at(12, 'La restauración del Orbe'))
      }
    }
  };

  if (typeof module === 'object' && module.exports) module.exports = missions;
  else root.LudariaMissionJourney = missions;
})(globalThis);
