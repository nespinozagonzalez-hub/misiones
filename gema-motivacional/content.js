'use strict';
window.GEMA={
 pages:[
 {title:'La Gema Motivacional',time:3,prompt:'Abrir la Cantera. ¿Qué sostiene el deseo de aprender?',product:'Una pregunta sobre una decisión de diseño.'},
 {title:'El encargo de Bryn',time:5,prompt:'Formen equipos. Una persona identifica una tensión y otra pide evidencia; intercambien roles.',product:'Acuerdo de análisis y objetivo compartido.'},
 {title:'Las tres facetas',time:8,prompt:'Exploren las tres lentes y relacionen una con una situación de aula.',product:'Una relación justificada entre diseño y necesidad.'},
 {title:'La clasificación pública',time:7,prompt:'Lean el dilema y registren una primera interpretación, citando una regla y una señal.',product:'Hipótesis y pregunta para contrastarla.'},
 {title:'Candado de las Señales',time:8,prompt:'Elijan qué información necesitan antes de diagnosticar el caso.',product:'Decisión explicada; otras lecturas discutidas.'},
 {title:'Los puntos arbitrarios',time:10,prompt:'Analicen qué cambia cuando los criterios no se explican. Elijan un ajuste y justifíquenlo.',product:'Una regla revisada y una razón.'},
 {title:'La lente ética',time:8,prompt:'Examinen quién decide, quién se beneficia y quién soporta el costo.',product:'Un riesgo concreto y una alternativa.'},
 {title:'El taller del rediseño',time:15,prompt:'Elijan un dilema o una situación propia y completen diagnóstico, rediseño y contraste.',product:'Propuesta argumentada del equipo.'},
 {title:'Contrastar el nuevo diseño',time:10,prompt:'Intercambien con otro equipo. Pidan una evidencia y registren un ajuste.',product:'Pregunta recibida y revisión posterior.'},
 {title:'Candado del Cuidado',time:6,prompt:'Comparen tres ajustes; expliquen cuál conserva el propósito y cuida la participación.',product:'Elección razonada y una precaución.'},
 {title:'La huella que conservamos',time:6,prompt:'Conserven el registro y realicen el cierre del módulo por el canal indicado en clase.',product:'Registro y reflexión de cierre.'},
 {title:'El Fragmento II',time:4,prompt:'Con el facilitador, realicen el cierre narrativo y anticipen la Forja.',product:'Síntesis compartida y pregunta para el próximo módulo.'}
 ],
 fields:{
 initial:{label:'Nuestra primera interpretación',placeholder:'Observamos esta regla y esta señal… Queremos preguntar…'},
 points:{label:'Una regla que revisaríamos',placeholder:'Cambiaríamos… porque… Para contrastarlo preguntaríamos…'},
 situation:{label:'Situación que rediseñamos',placeholder:'Dilema I, dilema II o una situación propia. Delimiten el contexto.'},
 purpose:{label:'Propósito pedagógico',placeholder:'¿Qué aprendizaje y qué participación buscamos?'},
 diagnosis:{label:'Necesidades y señales',placeholder:'Nuestra hipótesis es… La sostienen estas señales… Necesitamos comprobar…'},
 risk:{label:'Riesgo ético concreto',placeholder:'¿Quién podría verse perjudicado, cómo y bajo qué regla?'},
 rule:{label:'Regla rediseñada',placeholder:'Antes… Ahora… La decisión se relaciona con el propósito porque…'},
 participation:{label:'Opciones y apoyos para participar',placeholder:'¿Qué se puede elegir? ¿Qué apoyos y criterios serán claros para todos?'},
 evidence:{label:'Cómo contrastaremos el ajuste',placeholder:'Qué observaremos o preguntaremos, a quién y en qué momento.'},
 peer:{label:'Pregunta recibida de otro equipo',placeholder:'Nos preguntaron… Eso revela esta tensión…'},
 revision:{label:'Ajuste posterior al intercambio',placeholder:'Revisamos… La razón fue…'},
 exit:{label:'Reflexión de cierre',placeholder:'Una decisión que ahora veo distinta y una pregunta que llevo a la Forja.'}
 },
 lenses:[
 {id:'autonomy',title:'Autonomía',body:'Sentir iniciativa y apropiación de las propias acciones. No significa trabajar sin estructura.',question:'¿Hay una elección con sentido y una razón comprensible para actuar?'},
 {id:'competence',title:'Competencia',body:'Sentirse capaz de avanzar. Los desafíos ajustados, la orientación y la retroalimentación pueden apoyarla.',question:'¿Se comprende cómo progresar y se puede revisar un intento?'},
 {id:'relatedness',title:'Vinculación',body:'Sentir pertenencia y conexión con otras personas, con respeto y cuidado.',question:'¿La interacción permite contribuir y sentirse reconocido?'}
 ],
 cases:[
 {title:'Dilema I · La clasificación pública',text:'Una clase trabaja una misión cooperativa. Al final se proyecta una clasificación individual por rapidez. Algunas personas dejan de preguntar para no mostrar errores; otra evita participar porque siempre aparece al final. El objetivo declarado era construir explicaciones juntos.'},
 {title:'Dilema II · Los puntos arbitrarios',text:'Un taller reconoce avances con puntos. Los criterios no se anuncian y cambian durante la actividad. Aportes similares reciben reconocimientos distintos sin explicación. Un equipo dedica más tiempo a adivinar qué agrada al facilitador que a revisar su propuesta.'}
 ],
 quizzes:[
 {name:'Señales',question:'¿Qué conviene hacer antes de concluir cómo viven la clasificación?',options:[
 {text:'Preguntar cómo la viven y contrastar esas respuestas con la participación observada.',why:'Relaciona una señal con la voz de quienes participan. El caso permite plantear hipótesis sobre varias necesidades; la posición en la lista no las diagnostica por sí sola.'},
 {text:'Afirmar que todas las personas sienten exactamente lo mismo.',why:'Una señal no describe a todas las personas. Pregunten y contrasten interpretaciones antes de generalizar.'},
 {text:'Subir los puntos sin revisar la regla de comparación.',why:'Mantiene la misma regla. No recoge información sobre la experiencia de quienes participan.'}
 ],correct:0,hint:'Busquen la opción que recoge evidencia y escucha a los participantes.',reward:['Nombren la regla concreta.','Citen una señal, sin convertirla en diagnóstico universal.','Escuchen otras interpretaciones.','Digan qué necesitan contrastar.']},
 {name:'Transparencia',question:'¿Qué ajuste ayuda a revisar el reconocimiento del segundo dilema?',options:[
 {text:'Ocultar los criterios para que la misión resulte más misteriosa.',why:'El misterio narrativo puede mantenerse, pero los criterios de participación y reconocimiento necesitan ser comprensibles.'},
 {text:'Explicar criterios vinculados al propósito, dar feedback y permitir revisar el trabajo.',why:'Hace explícita la relación entre trabajo y reconocimiento. Sigue siendo necesario preguntar cómo se vive y observar si el ajuste funciona.'},
 {text:'Entregar un premio mayor bajo los mismos criterios arbitrarios.',why:'El tamaño del premio no aclara por qué aportes similares reciben reconocimientos distintos.'}
 ],correct:1,hint:'Revisen la regla y la información para progresar, además del premio.',reward:['Expliquen el criterio antes de aplicarlo.','Relacionen reconocimiento y propósito.','Ofrezcan información para revisar.','Hagan visible cómo consultar una decisión.']},
 {name:'Cuidado',question:'Queremos construir explicaciones juntos. ¿Qué ajuste es más coherente?',options:[
 {text:'Cambiar el nombre del ranking individual por “equipo legendario”.',why:'La decoración conserva la misma regla de reconocimiento individual. Pregunten qué acciones se valoran realmente.'},
 {text:'Obligar a compartir toda dificultad personal en público.',why:'No hace falta exponer información personal para colaborar. La propuesta debe cuidar opciones y condiciones de participación.'},
 {text:'Permitir roles y formatos equivalentes, apoyar los intentos y reconocer una explicación conjunta.',why:'Propone condiciones concretas para colaborar sin convertir rapidez o exposición personal en requisito. Es una propuesta de diseño que debe contrastarse en el aula.'}
 ],correct:2,hint:'Busquen condiciones de participación conectadas con una explicación conjunta.',reward:['Conserven el objetivo de aprendizaje.','Ofrezcan opciones equivalentes y apoyos.','Revisen quién puede quedar fuera.','Recojan evidencia del ajuste, sin prometer resultados.']}
 ],
 ethics:[
 {title:'Aprovechamiento injusto',question:'¿La regla obtiene un beneficio a costa de una vulnerabilidad o un costo desproporcionado?'},
 {title:'Manipulación',question:'¿El sistema orienta decisiones sin una posibilidad comprensible de elegir?'},
 {title:'Daño',question:'¿Podría perjudicar a participantes u otras personas, incluso sin intención?'},
 {title:'Carácter moral',question:'¿Qué hábitos y maneras de tratar a otros invita a repetir?'}
 ],
 sources:[
 {title:'Tesis · ficha de sesión 7',apa:'Espinoza González, N. (s. f.). Buscadores de la Gamificación Perdida: Propuesta de innovación educativa gamificada para la formación docente en gamificación educativa [Trabajo de fin de máster proporcionado por el autor]. Tabla 8, pp. 42–43.',use:'Define objetivo, dilemas, trabajo en equipos, cierre y 90 minutos sincrónicos. Pantallas y actividades son elaboración didáctica propia.'},
 {title:'Ryan y Deci, 2020',apa:'Ryan, R. M., & Deci, E. L. (2020). Intrinsic and extrinsic motivation from a self-determination theory perspective: Definitions, theory, practices, and future directions. Contemporary Educational Psychology, 61, 101860. https://doi.org/10.1016/j.cedpsych.2020.101860',url:'https://selfdeterminationtheory.org/wp-content/uploads/2020/06/2020_RyanDeci_IntrinsicandExtrinsic.pdf',use:'Necesidades psicológicas y distinción entre formas autónomas y controladas de motivación. La motivación extrínseca puede internalizarse; los efectos dependen de las condiciones. Las aplicaciones a estos casos son interpretaciones didácticas, no resultados del artículo.'},
 {title:'Kim y Werbach, 2016',apa:'Kim, T. W., & Werbach, K. (2016). More than just a game: Ethical issues in gamification. Ethics and Information Technology, 18, 157–173. https://doi.org/10.1007/s10676-016-9401-5',url:'https://link.springer.com/article/10.1007/s10676-016-9401-5',use:'Marco de cuestiones éticas: aprovechamiento injusto, manipulación, daño y carácter moral. Consultados resumen público y datos bibliográficos; no lectura íntegra del artículo de pago. Adaptación al aula elaborada para esta misión.'}
 ]
};
