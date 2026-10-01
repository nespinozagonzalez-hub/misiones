'use strict';
window.TALLADO = {
  pages: [
    {title:'El Tallado de Mecánicas',time:3,prompt:'Abre el taller de Bryn y anuncia el objetivo: deconstruir un juego conocido para explicar cómo funciona.',product:'Una pregunta sobre lo que hace funcionar un juego.',guide:'Comprueba el marco, el índice y la navegación. La misión secundaria es optativa; sus contenidos siguen disponibles para todos.'},
    {title:'El encargo de Bryn',time:5,prompt:'Forma parejas. Una persona describe una jugada; la otra pide una regla y una evidencia. Intercambien los roles.',product:'Un acuerdo para analizar y justificar en pareja.',guide:'Presenta los tres candados como práctica con pautas complementarias. No acreditan por sí solos el aprendizaje.'},
    {title:'La piedra que elegimos',time:8,prompt:'Elijan un juego o experiencia que ambos conozcan bien. Escriban su versión, meta, reglas relevantes y una fuente o una situación observada.',product:'Un objeto de análisis delimitado y verificable.',guide:'Si no comparten un juego conocido, pueden usar el modelo de cuatro en línea. Distingan reglas de la edición elegida y reglas de casa.'},
    {title:'Bajo la lupa del tallador',time:12,prompt:'Realicen unas jugadas en el tablero de demostración. Deténganse para describir regla, acción y cambio del estado. Abran las tres lentes.',product:'Una relación entre una regla y un comportamiento posible.',guide:'El tablero es un recurso de observación para dos personas en un mismo dispositivo. No es una sala multijugador. Las interpretaciones sobre experiencia no son resultados medidos.'},
    {title:'Candado de las Relaciones',time:8,prompt:'Clasifiquen tres descripciones según la escala DMC y expliquen cómo se relacionan.',product:'Diferenciación entre experiencia global, proceso y realización concreta.',guide:'Pregunte qué unidad se clasifica y por qué. No convierta DMC en una lista de palabras con una categoría invariable.'},
    {title:'Candado del Bucle',time:10,prompt:'Ordenen el ciclo propuesto desde observar la situación. Describan qué información permite revisar la próxima decisión.',product:'Un bucle de acción y respuesta que pueda repetirse.',guide:'La secuencia de cinco pasos es una herramienta didáctica propia, no una taxonomía literal de Werbach y Hunter. En otros juegos puede cambiar.'},
    {title:'La plantilla de deconstrucción',time:20,prompt:'Completen los tres niveles para su juego, una relación justificada y el bucle. Describan una jugada específica.',product:'Plantilla DMC, relación entre niveles y bucle del juego elegido.',guide:'Pida acciones expresadas con verbos y reglas concretas. Distinga lo observado de lo inferido. La lista de campos registra avances, no valora su calidad.'},
    {title:'Candado de la Coherencia',time:8,prompt:'Analicen el caso ficticio del taller cooperativo. Elijan un ajuste que alinee la regla de reconocimiento con el propósito.',product:'Una tensión identificada y una propuesta razonada.',guide:'Abra la conversación más allá de la respuesta cerrada: ¿qué conducta invita la regla y qué observarían para comprobarlo? No garantice efectos.'},
    {title:'El intercambio de tallados',time:10,prompt:'Cambien de pareja interlocutora. Presenten una relación, hagan una pregunta y registren un ajuste a su análisis.',product:'Hallazgo compartido, pregunta recibida y revisión.',guide:'Distribución sugerida: cuatro minutos para cada pareja y dos para ajustes. El facilitador entrega los códigos reales por colaboración usando el sistema existente.'},
    {title:'La huella que conservamos',time:6,prompt:'Sinteticen una idea y una pregunta pendiente. Conserven el registro y trasládenlo a la bitácora del buscador.',product:'Deconstrucción revisada y reflexión de salida.',guide:'Trabajo autónomo previsto: 45 minutos para ampliar y afinar el análisis. No corresponde recuperar el Fragmento II; ocurre en La Gema Motivacional.'}
  ],
  fields: {
    game:{label:'Juego y versión que analizamos',placeholder:'Nombre, edición o reglas de casa…',short:true},
    team:{label:'Integrantes de la pareja (opcional)',placeholder:'Nombres o apodos…',short:true},
    goal:{label:'Meta del juego',placeholder:'¿Qué intenta conseguir quien juega?'},
    rules:{label:'Reglas que delimitan las acciones',placeholder:'Elige dos o tres reglas que permitan explicar una jugada.'},
    evidence:{label:'Fuente o situación que observamos',placeholder:'Manual, enlace, versión o una jugada específica. Separa recuerdo y observación.'},
    dynamics:{label:'Dinámicas · experiencia global',placeholder:'Restricciones, relaciones, emociones, progresión o narrativa. ¿Cuáles están presentes y cómo lo sostienen?'},
    mechanics:{label:'Mecánicas · acciones y condiciones',placeholder:'¿Qué puede hacer quien juega, cuándo y con qué consecuencia? Usa verbos y reglas.'},
    components:{label:'Componentes · realizaciones concretas',placeholder:'¿Cómo se materializan o representan las mecánicas? Indica un ejemplo y su función.'},
    link:{label:'Una relación entre los tres niveles',placeholder:'Esta realización concreta permite esta acción; bajo esta regla podría sostener esta experiencia. Lo vemos en…'},
    loop:{label:'Bucle del juego elegido',placeholder:'Situación → decisión → acción → información → siguiente decisión. Adapten el ciclo a su juego.'},
    tension:{label:'Una tensión en el sistema',placeholder:'¿Qué regla podría producir una conducta distinta del propósito? ¿Qué observan y qué infieren?'},
    change:{label:'Un ajuste y cómo lo comprobaríamos',placeholder:'Qué cambiaríamos, qué esperamos y qué observaríamos para revisarlo.'},
    shared:{label:'Hallazgo que compartimos',placeholder:'Una regla, la acción que permite y la evidencia de nuestra lectura.'},
    peer:{label:'Pregunta recibida y ajuste realizado',placeholder:'La otra pareja preguntó… Eso nos llevó a precisar…'},
    transfer:{label:'Una idea que merece explorar en mi aula',placeholder:'Qué propósito pedagógico podría apoyar, qué adaptaría y qué evidencia recogería.'},
    exit:{label:'Una idea comprendida y una pregunta pendiente',placeholder:'Ahora veo… Todavía necesito contrastar…'}
  },
  lenses:[
    {id:'dynamics',title:'Dinámicas',tag:'EL SENTIDO GLOBAL',body:'Las restricciones y la relación de oposición enmarcan la experiencia. Anticipación o tensión son interpretaciones posibles; pregúntenles a quienes juegan cómo la viven.',example:'Dos personas buscan una misma meta bajo restricciones compartidas.',limit:'No toda experiencia contiene narrativa, niveles o todas las dinámicas del marco.'},
    {id:'mechanics',title:'Mecánicas',tag:'LAS ACCIONES Y SUS REGLAS',body:'Los turnos, la competición y la condición de victoria organizan la interacción. Colocar una ficha cambia el tablero y las opciones disponibles para la otra persona.',example:'Alternar turnos para colocar una ficha y tratar de formar una línea de cuatro.',limit:'Bloquear una amenaza es una estrategia posible; la regla permite la acción, pero no obliga a elegir esa estrategia.'},
    {id:'components',title:'Realizaciones concretas',tag:'LOS SOPORTES DEL JUEGO',body:'La cuadrícula y las fichas representan las jugadas y hacen visible el estado. Aquí se describen soportes específicos del juego, no nuevas categorías canónicas del catálogo DMC.',example:'Cada ficha permite ver quién ocupó una posición y qué líneas se están formando.',limit:'Aplicamos las tres escalas de DMC como lente de análisis de un juego completo; el marco original se refiere al diseño gamificado.'}
  ],
  levels:[
    {text:'Relaciones entre participantes y restricciones que enmarcan la experiencia.',answer:'d',why:'La descripción se refiere a la experiencia en su conjunto: corresponde a las dinámicas.'},
    {text:'Alternar turnos para realizar una acción que modifica el estado del juego.',answer:'m',why:'Describe un proceso que organiza acciones e interacción: corresponde a las mecánicas.'},
    {text:'Una insignia concreta que representa la consecución de una meta.',answer:'c',why:'La insignia es una realización específica del reconocimiento: corresponde a los componentes.'}
  ],
  loopSteps:[
    {id:'observe',label:'Observar la situación',detail:'Reconocer el estado actual y las opciones disponibles.'},
    {id:'decide',label:'Decidir qué hacer',detail:'Elegir una acción permitida con una intención.'},
    {id:'act',label:'Realizar la acción',detail:'Ejecutar la elección bajo las reglas del juego.'},
    {id:'response',label:'Leer la respuesta',detail:'Reconocer qué cambió y qué información recibimos.'},
    {id:'adjust',label:'Ajustar la próxima decisión',detail:'Usar esa información para volver a jugar.'}
  ],
  coherence:{
    case:'Una misión propone construir una solución en equipo. Sin embargo, el único reconocimiento se entrega a quien responde primero, aunque no escuche a sus compañeros.',
    question:'¿Qué ajuste alinea mejor la regla con el propósito cooperativo?',
    options:[
      {text:'Conservar el premio individual y decorar la actividad con un emblema de equipo.',why:'La apariencia cambia, pero la regla sigue reconociendo la rapidez individual. La cooperación necesita una función dentro de la actividad.'},
      {text:'Reconocer una solución conjunta cuando el equipo explica los aportes y las razones de su decisión.',why:'Relaciona el reconocimiento con una acción conjunta y una explicación. Después habría que observar si participan y cómo justifican sus aportes.'},
      {text:'Dar más puntos a la misma respuesta individual rápida.',why:'Amplía el incentivo original. No resuelve la tensión entre construir juntos y reconocer solo al más rápido.'}
    ],correct:1
  },
  rewards:[
    {title:'La lupa de las relaciones',items:['Nombra la unidad que analizas.','Describe la acción que organiza.','Relaciona su realización concreta con la experiencia global.','Sostén la relación con una regla o una jugada.']},
    {title:'El mapa del bucle',items:['Delimita una situación que pueda repetirse.','Identifica la decisión y la acción permitida.','Describe la respuesta del sistema o de otras personas.','Explica cómo esa información cambia la siguiente elección.']},
    {title:'El calibre de la coherencia',items:['¿Qué propósito declara el juego o la actividad?','¿Qué conducta hace posible o reconoce cada regla?','¿Dónde aparecen tensiones entre propósito y regla?','¿Qué cambiarías y qué observarías para revisar el ajuste?']}
  ],
  sources:{
    thesis:{short:'Tesis · ficha de sesión 6',apa:'Espinoza González, N. (s. f.). Buscadores de la Gamificación Perdida: Propuesta de innovación educativa gamificada para la formación docente en gamificación educativa [Trabajo de fin de máster, versión proporcionada por el autor]. Tabla 7, p. 42.',use:'Define el juego conocido elegido en parejas, la plantilla de tres niveles, los bucles, la coherencia, la bitácora, la colaboración y los tiempos de 90 minutos sincrónicos más 45 autónomos.',limit:'La secuencia de diez pantallas, el tablero de práctica y los candados son decisiones de producción para esta presentación.'},
    wh2012:{short:'Werbach y Hunter, 2012',apa:'Werbach, K., & Hunter, D. (2012). For the win: How game thinking can revolutionize your business. Wharton Digital Press.',use:'Marco DMC para distinguir escalas de diseño y conectar elementos, acciones y propósito.',url:'https://knowledge.wharton.upenn.edu/article/for-the-win-how-gamification-can-transform-your-business/',link:'Entrevista original a los autores',limit:'El enlace es una entrevista, no el libro íntegro. DMC es un marco de diseño; no demuestra eficacia educativa.'},
    wh2015:{short:'Werbach y Hunter, 2015',apa:'Werbach, K., & Hunter, D. (2015). The gamification toolkit: Dynamics, mechanics, and components for the win. Wharton Digital Press.',use:'Apoya el análisis de los elementos como un sistema relacionado con los objetivos.',url:'https://knowledge.wharton.upenn.edu/article/how-gamification-taps-into-what-makes-us-human/',link:'Entrevista a Kevin Werbach',limit:'Se utiliza como orientación de diseño. Las relaciones de los casos de esta misión son interpretaciones didácticas propias.'},
    sicart:{short:'Sicart, 2008',apa:'Sicart, M. (2008). Defining game mechanics. Game Studies, 8(2). https://gamestudies.org/0802/articles/sicart',use:'Complementa el análisis de mecánicas como acciones disponibles para interactuar con el estado del juego bajo reglas.',url:'https://gamestudies.org/0802/articles/sicart',link:'Artículo completo',limit:'Su definición pertenece a los estudios de juegos. No reemplaza la terminología DMC ni implica una equivalencia exacta entre marcos.'},
    hasbro:{short:'Hasbro · reglas del modelo',apa:'Hasbro. (s. f.). Connect 4 Game (A5640) [Instrucciones del juego]. https://instructions.hasbro.com/en-us/instruction/Connect-4-Game',use:'Referencia de reglas para la demostración de cuatro en línea: dos participantes, fichas por turnos y victoria al formar una línea de cuatro.',url:'https://instructions.hasbro.com/en-us/instruction/Connect-4-Game',link:'Consultar instrucciones oficiales',limit:'Interfaz, fichas visuales y explicaciones de esta demostración son propias. No se utilizan imágenes, logotipos ni textos del producto. El tablero sirve para observar, sin ranking ni premio por ganar.'}
  }
};
