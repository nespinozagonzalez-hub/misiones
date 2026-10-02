'use strict';
window.REFLEJO = {
  pages: [
    {title:'El Santuario del Espejo',time:4,prompt:'Presenta el encargo: mirar un diseño con criterios comunes para poder argumentar una valoración.',product:'Una pregunta inicial sobre qué cuenta como evidencia de calidad.'},
    {title:'El umbral de una evaluación justa',time:5,prompt:'Acordad qué diferencia una impresión de una valoración apoyada en evidencia observable.',product:'Tres condiciones compartidas: criterio, evidencia y argumento.'},
    {title:'La pirámide frente al espejo',time:8,prompt:'Relaciona el propósito, las dinámicas, las mecánicas y los componentes antes de abrir la rúbrica.',product:'Una lectura del diseño como sistema, no como suma de adornos.'},
    {title:'Cinco caras, una sola mirada',time:8,prompt:'Recorre los cinco criterios y sus tres niveles. No asignes puntos ni promedios.',product:'Una pregunta de evidencia para cada criterio.'},
    {title:'Coherencia pedagógica',time:7,prompt:'Localizad objetivos y comprobad si misiones y mecánicas pueden justificarse desde ellos.',product:'Una evidencia y una cautela interpretativa.'},
    {title:'Dinámicas y narrativa',time:7,prompt:'Comprobad si narrativa y progresión sostienen la experiencia o aparecen solo como decoración.',product:'Una evidencia y una cautela interpretativa.'},
    {title:'Mecánicas',time:7,prompt:'Observad reglas, comportamientos esperados y relación con las dinámicas previstas.',product:'Una evidencia y una cautela interpretativa.'},
    {title:'Componentes',time:7,prompt:'Preguntad qué función cumple cada componente dentro del sistema.',product:'Una evidencia y una cautela interpretativa.'},
    {title:'Motivación y ética',time:7,prompt:'Revisad autonomía, competencia, vinculación y riesgos éticos sin inferir motivación real.',product:'Una evidencia y una cautela interpretativa.'},
    {title:'Un caso ante el espejo',time:14,prompt:'Aplicad conjuntamente la rúbrica al caso ficticio. Elegid un nivel y justificadlo con evidencia.',product:'Cinco valoraciones argumentadas del caso modelo.'},
    {title:'Acuerdos de interpretación',time:12,prompt:'Comparad discrepancias y escribid acuerdos para aplicar los descriptores de forma consistente.',product:'Tres acuerdos compartidos de interpretación.'},
    {title:'Preparar el reflejo propio',time:4,prompt:'Cierra la clase y explica el trabajo autónomo que prepara la autoevaluación de la sesión 12.',product:'Un registro descargable y una lista de evidencias por reunir.'}
  ],
  rubric: [
    {id:'coherencia',name:'Coherencia pedagógica',question:'¿Qué objetivos se explicitan y cómo se justifican desde ellos las misiones y mecánicas?',levels:{
      inicial:'El diseño no explicita objetivos de aprendizaje o estos no se relacionan con el sistema de juego.',
      desarrollo:'Los objetivos existen, pero la relación con misiones y mecánicas es parcial o difusa.',
      logrado:'Objetivos claros y cada elemento del sistema se justifica en función de ellos.'},
      evidence:['Objetivos formulados','Misiones vinculadas','Justificación de las mecánicas'],caution:'No basta con que objetivo y elemento aparezcan en el mismo documento: hay que explicar la relación.'},
    {id:'narrativa',name:'Dinámicas y narrativa',question:'¿Cómo sostienen narrativa y progresión la experiencia completa?',levels:{
      inicial:'No hay narrativa o esta es decorativa, sin conexión con la progresión.',
      desarrollo:'La narrativa existe y acompaña algunos tramos, con vacíos de continuidad.',
      logrado:'Narrativa y progresión sostienen toda la experiencia y le dan sentido.'},
      evidence:['Continuidad entre tramos','Progresión reconocible','Sentido de las acciones'],caution:'Una ambientación atractiva no demuestra continuidad narrativa ni progresión.'},
    {id:'mecanicas',name:'Mecánicas',question:'¿Qué reglas anticipan las acciones y traducen las dinámicas previstas?',levels:{
      inicial:'Las reglas son confusas o inexistentes; no se anticipan los comportamientos esperados.',
      desarrollo:'Las mecánicas están definidas, pero algunas no traducen las dinámicas previstas.',
      logrado:'Mecánicas claras, coherentes entre sí y alineadas con las dinámicas del diseño.'},
      evidence:['Reglas comprensibles','Acciones anticipadas','Alineación con dinámicas'],caution:'Nombrar puntos, retos o cooperación no sustituye describir la regla que organiza la actuación.'},
    {id:'componentes',name:'Componentes',question:'¿Qué función reconocible cumple cada componente en el sistema?',levels:{
      inicial:'Componentes sueltos (puntos, insignias) sin función dentro del sistema.',
      desarrollo:'Los componentes cumplen funciones, aunque con redundancias o vacíos.',
      logrado:'Cada componente tiene una función reconocible dentro de un sistema integrado.'},
      evidence:['Función declarada','Relación con una mecánica','Ausencia de redundancias o vacíos'],caution:'La presencia de muchos componentes no implica integración ni calidad.'},
    {id:'motivacion',name:'Motivación y ética',question:'¿Qué decisiones apoyan autonomía, competencia y vinculación, y qué riesgos se anticipan?',levels:{
      inicial:'El diseño descansa en recompensas externas o incluye mecánicas potencialmente dañinas.',
      desarrollo:'Se consideran las necesidades de los participantes, con riesgos parcialmente atendidos.',
      logrado:'El diseño apoya autonomía, competencia y vinculación, y anticipa sus riesgos éticos.'},
      evidence:['Opciones significativas','Feedback y reto ajustable','Vínculos y riesgos previstos'],caution:'El análisis valora decisiones de diseño; no permite afirmar cómo se sentirá cada participante.'}
  ],
  caseModel: {
    title:'El Archivo de las Mareas',
    note:'Caso ficticio para aprender a aplicar la rúbrica. No documenta una intervención ni resultados reales.',
    summary:'En Ciencias, el grupo debe explicar cambios de una costa usando cuatro fuentes. El objetivo está visible y cada misión pide producir una parte de la explicación. La expedición aparece en la apertura y el cierre, pero desaparece durante dos tramos. Las reglas de cooperación y revisión están descritas; un premio por rapidez compite con la revisión cuidadosa. El mapa de avance y las fichas de fuente cumplen funciones claras, aunque una insignia repite el mismo reconocimiento. Se ofrecen dos rutas de fuentes y feedback para revisar; no se explica cómo evitar presión social al comparar públicamente los tiempos.',
    proposed:{coherencia:'logrado',narrativa:'desarrollo',mecanicas:'desarrollo',componentes:'desarrollo',motivacion:'desarrollo'},
    reasons:{
      coherencia:'El objetivo es explícito y las misiones producen partes de la explicación; el caso permite justificar los elementos desde ese propósito.',
      narrativa:'La expedición acompaña solo algunos tramos y presenta vacíos de continuidad.',
      mecanicas:'Las reglas están definidas, pero el premio por rapidez no traduce bien la revisión cuidadosa que la experiencia pretende promover.',
      componentes:'Mapa y fichas tienen función, pero la insignia introduce una redundancia de reconocimiento.',
      motivacion:'Hay opciones y feedback, pero el riesgo de presión social asociado a la comparación pública está solo parcialmente atendido.'
    }
  },
  sources: [
    {title:'Instrumento de la tesis',apa:'Espinoza González, N. (2026). Buscadores de la Gamificación Perdida. Anexo E: Rúbrica de evaluación del proyecto.',use:'Los cinco criterios y sus descriptores se reproducen sin añadir puntuaciones, pesos ni criterios.'},
    {title:'Pirámide de elementos',apa:'Werbach, K., & Hunter, D. (2012). For the win: How game thinking can revolutionize your business. Wharton Digital Press.',url:'https://knowledge.wharton.upenn.edu/article/for-the-win-how-gamification-can-transform-your-business/',use:'Marco para leer dinámicas, mecánicas y componentes como partes relacionadas. La entrevista enlazada es una fuente oficial de los autores, no el texto completo del libro.'},
    {title:'Teoría de la autodeterminación',apa:'Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist, 55(1), 68–78. https://doi.org/10.1037/0003-066X.55.1.68',url:'https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf',use:'Sustenta la atención a autonomía, competencia y vinculación. No permite afirmar que un diseño produzca motivación por sí solo.'}
  ]
};
