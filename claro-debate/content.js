'use strict';
window.CLARO_CONFIG = {closingFormUrl:null};
window.CLARO_CONTENT = {
  sources:{
    sailer:{
      short:'Sailer y Homner (2020)',
      kind:'Metaanálisis · tres tipos de resultados',
      title:'Mirar más allá de la participación',
      summary:'La síntesis distingue resultados cognitivos, motivacionales y conductuales. Sus estimaciones medias son positivas en las tres categorías; las de motivación y conducta fueron menos estables al considerar estudios con mayor rigor metodológico.',
      limit:'Un resultado medio entre estudios no describe a cada persona ni garantiza el mismo efecto en una nueva aula.',
      url:'https://doi.org/10.1007/s10648-019-09498-w',
      citation:'Sailer, M., & Homner, L. (2020). The gamification of learning: A meta-analysis. Educational Psychology Review, 32, 77–112. https://doi.org/10.1007/s10648-019-09498-w',
      metrics:[{label:'Cognitivos',g:'0,49',interval:'0,30–0,69',studies:19,participants:1686},{label:'Motivacionales',g:'0,36',interval:'0,18–0,54',studies:16,participants:2246},{label:'Conductuales',g:'0,25',interval:'0,04–0,46',studies:9,participants:951}]
    },
    bai:{
      short:'Bai, Hew y Huang (2020)',
      kind:'Metaanálisis y síntesis cualitativa',
      title:'Un promedio favorable, experiencias diversas',
      summary:'El metaanálisis de 30 intervenciones, con 3.202 participantes, encontró una diferencia media favorable en rendimiento académico (g = 0,504). La síntesis cualitativa también recogió experiencias de ansiedad o celos, junto con razones para disfrutar la gamificación.',
      limit:'El promedio no es un porcentaje de mejora. Las experiencias descritas tampoco indican cuántas personas sentirán ansiedad en tu curso.',
      url:'https://doi.org/10.1016/j.edurev.2020.100322',
      citation:'Bai, S., Hew, K. F., & Huang, B. (2020). Does gamification improve student learning outcome? Evidence from a meta-analysis and synthesis of qualitative data in educational contexts. Educational Research Review, 30, 100322. https://doi.org/10.1016/j.edurev.2020.100322'
    },
    zainuddin:{
      short:'Zainuddin et al. (2020)',
      kind:'Revisión sistemática · 46 investigaciones',
      title:'Preguntar por el diseño y sus fundamentos',
      summary:'La revisión examinó 46 trabajos empíricos de 2016 a 2019. Identificó tendencias positivas y contradicciones, además de señalar que muchos estudios no explicitan una base teórica para sus diseños.',
      limit:'Una revisión describe la literatura seleccionada. No certifica que cualquier conjunto de puntos, insignias o reglas resulte eficaz.',
      url:'https://doi.org/10.1016/j.edurev.2020.100326',
      citation:'Zainuddin, Z., Chu, S. K. W., Shujahat, M., & Perera, C. J. (2020). The impact of gamification on learning and instruction: A systematic review of empirical evidence. Educational Research Review, 30, 100326. https://doi.org/10.1016/j.edurev.2020.100326'
    }
  },
  statements:[
    {id:'a',title:'La promesa absoluta',claim:'La gamificación siempre mejora el aprendizaje de todas las personas.',source:'bai',lens:'Busca la diferencia entre una tendencia media y una promesa universal.',question:'¿Cómo reformularías «siempre» y «todas» para construir una afirmación defendible?',feedback:'«Puede contribuir» deja espacio para revisar el diseño y el contexto. Una promesa universal excede lo que permite una síntesis.'},
    {id:'b',title:'La huella y el aprendizaje',claim:'Si aumenta la participación, ya está demostrado que aumentó el aprendizaje.',source:'sailer',lens:'Distingue qué resultado se midió: conducta, motivación o desempeño cognitivo.',question:'¿Qué evidencia adicional necesitarías para hablar de aprendizaje?',feedback:'Más intervenciones o tareas completadas describen conducta. Para valorar el aprendizaje, necesitamos una evidencia vinculada al objetivo.'},
    {id:'c',title:'Los adornos del juego',claim:'Incluir puntos e insignias basta para que un diseño educativo sea eficaz.',source:'zainuddin',lens:'Pregunta por la relación entre objetivo, actividad, elemento y fundamento.',question:'¿Qué tendrías que explicar antes de defender la eficacia de ese diseño?',feedback:'Nombrar componentes no justifica su función. Explica qué acción organizan, con qué propósito y cómo revisarás lo que ocurre.'},
    {id:'d',title:'Una misma regla, distintas miradas',claim:'Las recompensas y la comparación se viven de la misma manera en todo el grupo.',source:'bai',lens:'Busca experiencias diferentes; un promedio puede ocultar matices.',question:'¿Qué escucharías y observarías para reconocer experiencias distintas en tu aula?',feedback:'Una regla compartida puede vivirse de modos distintos. Revisa su pertinencia con el grupo y escucha a quienes experimentan dificultades.'}
  ],
  scope:{question:'¿Qué conclusión respeta el alcance de la lectura?',options:[
    'La gamificación asegura que cada estudiante aprenderá más.',
    'Hay evidencia media favorable, que debemos interpretar y contrastar en cada diseño y contexto.',
    'Una experiencia desfavorable prueba que ninguna gamificación sirve.'
  ],correct:1},
  classifications:[
    {text:'El registro muestra que 12 de 16 equipos entregaron la tarea.',answer:'fact'},
    {text:'La pauta de avance podría haber ayudado a organizar el trabajo.',answer:'interpretation'},
    {text:'La pauta causó todo el aprendizaje observado.',answer:'unsupported'}
  ],
  argumentSteps:[
    {id:'claim',label:'Formular una afirmación precisa'},
    {id:'evidence',label:'Sostenerla con evidencia pertinente'},
    {id:'limit',label:'Reconocer un límite o alternativa'},
    {id:'decision',label:'Proponer una decisión revisable'}
  ]
};
