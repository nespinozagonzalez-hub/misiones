/** Repaso formativo del cierre. No son ítems de los instrumentos ni se guardan resultados. */
(function(root){
 'use strict';
 const bank=[
  {id:'proposito',skill:'sabiduria',source:'reflejo-diseno/content.participantes-88d011fd6c.js',question:'Quieres gamificar una unidad. ¿Qué decisión permite justificar después las misiones y recompensas?',hint:'Busca el referente que permite decidir qué aprendizaje debe hacer visible cada misión.',correct:2,options:[
   ['Elegir primero el aspecto de las insignias.','La apariencia puede apoyar la experiencia, pero no define qué se aprende.'],
   ['Escoger primero la plataforma más popular.','La plataforma debe responder al diseño; su popularidad no establece el propósito.'],
   ['Definir los objetivos de aprendizaje.','Los objetivos permiten justificar las misiones, las mecánicas y las evidencias esperadas.'],
   ['Fijar primero una clasificación por rapidez.','Una clasificación necesita una función pedagógica; la rapidez por sí sola no define el aprendizaje.']]},
  {id:'coherencia',skill:'sabiduria',source:'reflejo-diseno/content.participantes-88d011fd6c.js',question:'El objetivo es argumentar con evidencias. ¿Qué misión se alinea mejor con ese propósito?',hint:'La acción central de la misión debería hacer observable la argumentación.',correct:0,options:[
   ['Defender una decisión usando fuentes y razones.','Defender una decisión con fuentes hace observable el uso de evidencias para argumentar.'],
   ['Acumular clics para desbloquear un retrato.','La cantidad de clics no muestra la calidad de una argumentación.'],
   ['Ganar puntos por terminar antes que el resto.','La rapidez de término no demuestra que se haya argumentado con evidencias.'],
   ['Descubrir una clave sin explicar cómo se obtuvo.','Encontrar la clave sin explicar el razonamiento no hace visible la argumentación.']]},
  {id:'reglas',skill:'maestria',source:'reflejo-diseno/content.participantes-88d011fd6c.js',question:'Tu misión busca cooperación. ¿Qué regla la apoya de forma más directa?',hint:'Observa qué regla crea una necesidad de trabajar con otras personas.',correct:3,options:[
   ['Publicar solo la puntuación de quien termine antes.','Premiar solo a la persona más rápida no exige cooperar con el equipo.'],
   ['Dar un premio individual por ocultar las pistas.','Ocultar las pistas dificulta el intercambio necesario para cooperar.'],
   ['Usar un fondo con un grupo de aventureros.','La imagen puede comunicar un tema cooperativo, pero no establece una regla de interacción.'],
   ['Repartir pistas complementarias para una solución conjunta.','Las pistas complementarias crean interdependencia y una tarea compartida.']]},
  {id:'componentes',skill:'maestria',source:'reflejo-diseno/content.participantes-88d011fd6c.js',question:'Una insignia nueva se ve muy bien, pero nadie sabe qué representa. ¿Qué conviene aclarar?',hint:'Piensa qué tendría que comprender una persona para interpretar lo que la insignia reconoce.',correct:1,options:[
   ['Cuántos colores diferentes puede mostrar.','La variedad visual no aclara qué logro representa ni para qué sirve.'],
   ['Qué evidencia reconoce y qué función cumple.','Relacionar la insignia con una evidencia y una función evita que sea un componente suelto.'],
   ['Qué nombre la hará parecer más difícil.','El nombre no define las condiciones ni el sentido de obtenerla.'],
   ['Cuántas insignias usan otras plataformas.','La cantidad utilizada por otros sistemas no justifica la función de esta insignia.']]},
  {id:'prototipo',skill:'creacion',source:'defensa-orbe/content.participantes-1d8b95f419.js',question:'Antes de ampliar tu experiencia, pruebas un prototipo con un grupo pequeño. ¿Qué observación ayuda más a mejorarlo?',hint:'Busca información sobre cómo las personas usan realmente las reglas.',correct:2,options:[
   ['La cantidad de ilustraciones que contiene.','El número de ilustraciones no muestra cómo se comprende o usa el sistema.'],
   ['El tiempo que tardaste en escoger la tipografía.','El tiempo de diseño gráfico no explica la experiencia de los participantes.'],
   ['Dónde se confunden y cómo toman decisiones.','Observar confusiones y decisiones aporta evidencia para revisar las reglas y los apoyos.'],
   ['La cantidad de pantallas del prototipo.','Contar pantallas no permite saber si las reglas y decisiones funcionan.']]},
  {id:'narrativa',skill:'creacion',source:'reflejo-diseno/content.participantes-88d011fd6c.js',question:'¿Qué cambio conecta mejor la narrativa con el aprendizaje de la misión?',hint:'La historia puede dar un motivo a las acciones que producen aprendizaje.',correct:0,options:[
   ['Dar sentido narrativo al desafío y a las decisiones.','Cuando la historia da sentido al desafío y a la progresión, acompaña la actividad de aprendizaje.'],
   ['Añadir un párrafo fantástico sin relación con la tarea.','Un texto sin relación con la tarea deja la narrativa como decoración.'],
   ['Cambiar el nombre de los puntos y mantener todo igual.','Cambiar el nombre de los puntos no vincula por sí solo historia, decisiones y aprendizaje.'],
   ['Interrumpir cada paso con una escena sin propósito.','Las escenas necesitan una función dentro del recorrido; interrumpirlo no crea esa relación.']]},
  {id:'evidencia',skill:'evaluacion',source:'defensa-orbe/content.participantes-1d8b95f419.js',question:'Una persona termina la aventura y reúne todos los fragmentos. ¿Qué permite valorar su aprendizaje?',hint:'Distingue el avance dentro del juego de la evidencia que responde a los criterios.',correct:1,options:[
   ['Tomar los fragmentos como prueba suficiente de dominio.','Los fragmentos muestran progreso en el juego, pero no bastan para valorar la calidad del aprendizaje.'],
   ['Revisar su producto y sus razones con criterios explícitos.','El producto y su justificación permiten contrastar el aprendizaje con los criterios previstos.'],
   ['Dar por logrado el aprendizaje por terminar la historia.','Terminar la historia no demuestra por sí solo que se hayan alcanzado los objetivos.'],
   ['Usar únicamente la cantidad de puntos obtenida.','Los puntos necesitan evidencias y criterios para aportar información sobre el aprendizaje.']]},
  {id:'feedback',skill:'evaluacion',source:'reflejo-diseno/content.participantes-88d011fd6c.js',question:'Un prototipo tiene reglas poco claras. ¿Qué devolución ayuda mejor a revisarlo?',hint:'Busca una devolución que señale qué se observó y cómo se puede mejorar.',correct:3,options:[
   ['«Está mal; vuelve a intentarlo».','La devolución no señala qué regla necesita revisión ni ofrece una orientación concreta.'],
   ['«Tu equipo quedó detrás del otro».','Comparar posiciones no explica el problema de las reglas ni cómo revisarlas.'],
   ['«Agrega más puntos para que se entienda».','Añadir puntos sin examinar la confusión no aclara las reglas.'],
   ['«Aclara cuándo se gana la pista y prueba esa instrucción».','La devolución identifica una condición confusa y propone una revisión que se puede probar.']]},
  {id:'autonomia',skill:'camaraderia',source:'gema-motivacional/content.participantes-81d9efa1fb.js',question:'Quieres apoyar la autonomía sin perder el objetivo común. ¿Qué opción es más coherente?',hint:'Autonomía supone decisiones con sentido dentro de una estructura comprensible.',correct:2,options:[
   ['Permitir cualquier actividad sin un propósito compartido.','La ausencia de propósito o estructura no garantiza una elección con sentido.'],
   ['Hacer obligatoria una única ruta sin explicar el motivo.','Una ruta impuesta sin explicación ofrece poco espacio para decidir con sentido.'],
   ['Ofrecer rutas equivalentes y explicar qué se busca aprender.','Las rutas con sentido y un propósito claro ofrecen elección dentro de una estructura.'],
   ['Asignar la ruta según una clasificación pública de rapidez.','La asignación por clasificación no ofrece una elección informada sobre cómo avanzar.']]},
  {id:'clasificacion',skill:'camaraderia',source:'gema-motivacional/content.participantes-81d9efa1fb.js',question:'Tras mostrar un ranking, algunas personas dejan de preguntar. ¿Qué conviene hacer antes de concluir que están desmotivadas?',hint:'Un comportamiento observable puede tener más de una explicación.',correct:0,options:[
   ['Escuchar su experiencia y contrastar las señales observadas.','Escuchar y contrastar ayuda a comprender cómo viven la regla sin atribuir una motivación a partir de una sola señal.'],
   ['Concluir que no se interesan por el aprendizaje.','Una sola señal no permite afirmar por qué han dejado de preguntar.'],
   ['Aumentar el premio sin consultar a los participantes.','Cambiar el premio sin escuchar no aclara qué está ocurriendo.'],
   ['Retirarles los puntos para que vuelvan a participar.','Penalizar la conducta no explica su causa y puede agravar el problema.']]}
 ];
 function choose(skill,seen=[]){const available=bank.filter(q=>!seen.includes(q.id));return available.find(q=>q.skill===skill)||available[0]||bank.find(q=>q.skill===skill)||bank[0];}
 function answer(question,index){if(!Number.isInteger(index)||!question.options[index])return null;return {correct:index===question.correct,feedback:question.options[index][1]};}
 const api={bank,choose,answer};root.LudariaQuiz=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
