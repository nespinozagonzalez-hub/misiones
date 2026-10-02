'use strict';
window.PULIDO = {
  pages: [
    {title:'El Pulido del Prototipo',time:4,prompt:'Presenta el encargo: mirar el propio diseño con honestidad, elegir ajustes viables y preparar su implementación.',product:'Un propósito personal para la sesión.'},
    {title:'Reunir las huellas',time:7,prompt:'Cada docente localiza la evidencia que trajo de su prototipo antes de elegir niveles.',product:'Cinco evidencias localizadas o vacíos identificados.'},
    {title:'Cómo autoevaluar sin castigarse',time:6,prompt:'Modela el ciclo descriptor → evidencia → argumento → ajuste. La rúbrica orienta decisiones, no asigna puntos.',product:'Un acuerdo de trabajo para la autoevaluación.'},
    {title:'El espejo del prototipo',time:25,prompt:'Aplica los cinco criterios del Anexo E. Elige un nivel, cita evidencia y explica la decisión.',product:'Autoevaluación argumentada de los cinco criterios.'},
    {title:'Elegir qué pulir primero',time:12,prompt:'Prioriza uno o dos criterios considerando impacto pedagógico, viabilidad y riesgo.',product:'Prioridad de mejora y razón explícita.'},
    {title:'Tallado de la nueva versión',time:15,prompt:'Describe la decisión anterior, el ajuste, la evidencia esperada y el riesgo que debes vigilar.',product:'Cambio concreto incorporable al prototipo.'},
    {title:'Plan de implementación · contexto',time:7,prompt:'Define curso destinatario, propósito y momento de aplicación.',product:'Contexto de implementación delimitado.'},
    {title:'Plan de implementación · condiciones',time:8,prompt:'Precisa tiempos, recursos, evidencia y alternativa ante una dificultad previsible.',product:'Plan breve aplicable en aula.'},
    {title:'Una versión lista para conversar',time:6,prompt:'Formula una consulta para el facilitador, conserva el registro y organiza los 60 minutos autónomos.',product:'Autoevaluación, ajuste y plan reunidos en un registro.'}
  ],
  rubric: [
    {id:'coherencia',name:'Coherencia pedagógica',question:'¿Qué objetivos se explicitan y cómo se relacionan con misiones y mecánicas?',levels:{
      inicial:'El diseño no explicita objetivos de aprendizaje o estos no se relacionan con el sistema de juego.',
      desarrollo:'Los objetivos existen, pero la relación con misiones y mecánicas es parcial o difusa.',
      logrado:'Objetivos claros y cada elemento del sistema se justifica en función de ellos.'},evidence:'Objetivos, misiones y justificación de mecánicas.'},
    {id:'narrativa',name:'Dinámicas y narrativa',question:'¿Cómo sostienen narrativa y progresión la experiencia completa?',levels:{
      inicial:'No hay narrativa o esta es decorativa, sin conexión con la progresión.',
      desarrollo:'La narrativa existe y acompaña algunos tramos, con vacíos de continuidad.',
      logrado:'Narrativa y progresión sostienen toda la experiencia y le dan sentido.'},evidence:'Continuidad, progresión y sentido de las acciones.'},
    {id:'mecanicas',name:'Mecánicas',question:'¿Las reglas anticipan las acciones y traducen las dinámicas previstas?',levels:{
      inicial:'Las reglas son confusas o inexistentes; no se anticipan los comportamientos esperados.',
      desarrollo:'Las mecánicas están definidas, pero algunas no traducen las dinámicas previstas.',
      logrado:'Mecánicas claras, coherentes entre sí y alineadas con las dinámicas del diseño.'},evidence:'Reglas, comportamientos esperados y alineación.'},
    {id:'componentes',name:'Componentes',question:'¿Qué función reconocible cumple cada componente en el sistema?',levels:{
      inicial:'Componentes sueltos (puntos, insignias) sin función dentro del sistema.',
      desarrollo:'Los componentes cumplen funciones, aunque con redundancias o vacíos.',
      logrado:'Cada componente tiene una función reconocible dentro de un sistema integrado.'},evidence:'Función, relación con reglas y posibles redundancias.'},
    {id:'motivacion',name:'Motivación y ética',question:'¿Qué decisiones apoyan necesidades y qué riesgos éticos se anticipan?',levels:{
      inicial:'El diseño descansa en recompensas externas o incluye mecánicas potencialmente dañinas.',
      desarrollo:'Se consideran las necesidades de los participantes, con riesgos parcialmente atendidos.',
      logrado:'El diseño apoya autonomía, competencia y vinculación, y anticipa sus riesgos éticos.'},evidence:'Autonomía, competencia, vinculación y riesgos previstos.'}
  ],
  fields: {
    purpose:{label:'Mi propósito para este taller',placeholder:'¿Qué decisión del prototipo necesitas comprender o mejorar hoy?'},
    priorityReason:{label:'Razón de la prioridad',placeholder:'¿Por qué este ajuste tendría impacto pedagógico y es viable ahora?'},
    before:{label:'1 · Decisión actual',placeholder:'Describe lo que hace hoy el prototipo.'},
    change:{label:'2 · Ajuste concreto',placeholder:'Escribe el cambio en una regla, secuencia, recurso o condición.'},
    expected:{label:'3 · Evidencia esperada',placeholder:'¿Qué actuación o producto permitiría observar el efecto del ajuste?'},
    risk:{label:'4 · Riesgo a vigilar',placeholder:'¿Qué podría excluir, confundir o desviar el propósito?'},
    course:{label:'Curso destinatario',placeholder:'Nivel, asignatura o grupo; evita datos personales.'},
    learning:{label:'Propósito de aprendizaje',placeholder:'Aprendizaje que orientará la implementación.'},
    moment:{label:'Momento de aplicación',placeholder:'Unidad, clase o tramo del proceso.'},
    timing:{label:'Tiempos',placeholder:'Duración y secuencia realista de la experiencia.'},
    resources:{label:'Recursos',placeholder:'Materiales, espacios, herramientas y apoyos necesarios.'},
    evidencePlan:{label:'Evidencia para revisar la implementación',placeholder:'Actuación o producto que observarás; no inventes resultados.'},
    contingency:{label:'Alternativa ante una dificultad',placeholder:'¿Cómo mantendrás el aprendizaje si falla un recurso o surge una barrera?'},
    consultation:{label:'Consulta para el facilitador',placeholder:'Formula una pregunta específica sobre tu autoevaluación, ajuste o plan.'},
    asyncNote:{label:'Próximo paso autónomo',placeholder:'¿Qué completarás o comprobarás durante los 60 minutos autónomos?'}
  },
  sources: [
    {title:'Ficha e instrumento del proyecto',apa:'Espinoza González, N. (2026). Buscadores de la Gamificación Perdida. Sesión 12 y Anexo E.',use:'La sesión, la carga de trabajo, los cinco criterios y todos los descriptores proceden de la tesis. No se añaden puntuaciones ni pesos.'},
    {title:'Pirámide de diseño',apa:'Werbach, K., & Hunter, D. (2012). For the win: How game thinking can revolutionize your business. Wharton Digital Press.',url:'https://knowledge.wharton.upenn.edu/article/for-the-win-how-gamification-can-transform-your-business/',use:'Referencia conceptual declarada por el Anexo E. El enlace es una entrevista oficial a los autores, no el texto íntegro del libro; el marco no demuestra eficacia educativa.'},
    {title:'Necesidades psicológicas',apa:'Ryan, R. M., & Deci, E. L. (2020). Intrinsic and extrinsic motivation from a self-determination theory perspective: Definitions, theory, practices, and future directions. Contemporary Educational Psychology, 61, Article 101860. https://doi.org/10.1016/j.cedpsych.2020.101860',url:'https://doi.org/10.1016/j.cedpsych.2020.101860',use:'Sustenta autonomía, competencia y vinculación en el criterio motivacional. Una intención de diseño no permite afirmar motivación experimentada.'}
  ]
};
