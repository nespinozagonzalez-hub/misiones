/** Ludaria · catálogo compartido. Apoyos pedagógicos; conserva evaluación y recompensas. */
(function(root){
'use strict';
const attributes={sabiduria:'Sabiduría',maestria:'Maestría',creacion:'Creación',evaluacion:'Evaluación',camaraderia:'Camaradería'};
// Cada registro: misión, guardián, encargo, atributo principal/secundario, tres apoyos específicos.
const rows=[
['pergaminos-dispersos','Los Pergaminos Dispersos','Iria, custodio del archivo','Reconstruye las diferencias entre gamificación, ABJ, juegos serios y edutainment.','sabiduria','evaluacion',
 ['Brújula de conceptos','Compara propósito educativo, función del juego y relación con la actividad. Busca una evidencia de cada dimensión en el caso antes de clasificarlo.'],
 ['Dos lecturas del pergamino','Relee un caso desde dos hipótesis de clasificación. Escribe qué evidencia sostiene cada una y qué dato te haría cambiar de opinión.'],
 ['La excepción del archivo','Propón un caso fronterizo. Comprueba si tu criterio sigue siendo útil y señala el límite de tu explicación.']],
['senda-ejemplos','La Senda de los Ejemplos','Elian, rastreador de huellas','Contrasta dos experiencias documentadas con sus evidencias.','sabiduria','camaraderia',
 ['Lupa de huellas','Distingue lo que describe la fuente de lo que tú interpretas. Vincula elemento, función pedagógica y evidencia; una imagen decorativa no demuestra un efecto.'],
 ['Expediente paralelo','Escoge una experiencia y construye dos explicaciones posibles de una decisión de diseño. Contrástalas con la fuente sin añadir resultados que no aparecen.'],
 ['Entrevista del sendero','Invita a un par real a cuestionar tu interpretación. Registra su pregunta, la evidencia contrastada y el ajuste que decidiste; si trabajas a solas, prepara las preguntas para el encuentro.']],
['claro-debate','El Claro del Debate','Liora, guardiana de las voces','Revisa tu postura sobre la gamificación mediante argumentos y fuentes.','camaraderia','sabiduria',
 ['Turnos del claro','Distribuyan los papeles de quien argumenta, quien pregunta por evidencia y quien sintetiza. Rótenlos; la pausa para escuchar también forma parte del diálogo.'],
 ['La silla del contrapunto','Elige defender provisionalmente una postura diferente de la tuya o reconstruir el argumento de un compañero antes de responder. Anota qué cambió y qué sostuviste.'],
 ['Puente entre fuentes','Contrasta dos fuentes con conclusiones distintas. Examina contextos, indicadores y límites antes de decidir si existe una contradicción.']],
['vetas-diseno','Las Vetas del Diseño','Brina, centinela de la cantera','Justifica dinámicas, mecánicas y componentes según su función en el contexto.','maestria','creacion',
 ['Lente de la cantera','Busca la unidad de análisis: experiencia global, regla o proceso, representación concreta. Explica qué hace ese elemento en el diseño antes de nombrar su nivel.'],
 ['Ojo del Artesano','Dinámicas: experiencia global y relaciones. Mecánicas: reglas y procesos que hacen actuar. Componentes: representaciones concretas. Identifica la unidad de análisis y justifica según el contexto. Esta pauta no resuelve la actividad ni cambia su evaluación.'],
 ['Una veta, dos formas','Elige un propósito pedagógico y propone dos combinaciones de componentes que puedan servirlo. Explica qué mecánica conservas y qué experiencia esperas favorecer.']],
['tallado-mecanicas','El Tallado de Mecánicas','Rokan, tallador de rutas','Relaciona reglas, acciones del jugador y experiencia en un juego.','maestria','evaluacion',
 ['Mapa del bucle','Describe estado inicial, acción permitida, respuesta del sistema y nueva decisión. Separa la regla de la sensación que podría producir.'],
 ['Banco de variaciones','Elige cambiar una regla de turno o una condición de información. Antes de jugar, predice una consecuencia; después registra lo que observaste y el límite del ensayo.'],
 ['Prueba de tensión','Somete la mecánica a dos escenarios: un jugador que se rezaga y otro que domina. Señala evidencias de exclusión o participación y una mejora posible.']],
['gema-motivacional','La Gema Motivacional','Savia, guardiana de las facetas','Rediseña una decisión atendiendo a autonomía, competencia y relación.','sabiduria','evaluacion',
 ['Tres facetas','Pregunta si existe una elección significativa, un desafío con apoyo y una relación respetuosa. Distingue necesidad psicológica de una recompensa material.'],
 ['Contraluz de la gema','Revisa el mismo dilema desde dos necesidades psicológicas. Elige cuál atender primero y justifica qué tensión permanece.'],
 ['Ensayo del cuidado','Revisa el rediseño para alguien que no quiera competir o exponerse. Identifica una alternativa equivalente y comprueba que la participación siga siendo voluntaria.']],
['planos-arquitecto','Los Planos del Arquitecto','Daren, custodio de los planos','Construye el canvas y comprueba la coherencia de sus decisiones.','creacion','maestria',
 ['Regla del arquitecto','Une objetivo, conducta observable y evidencia de aprendizaje. Después revisa si la actividad y el componente elegidos ayudan a producir esa evidencia.'],
 ['Taller de bifurcaciones','Conserva tu objetivo y crea dos variantes: una con elección de ruta y otra con colaboración. Elige una y explica su adecuación a tus participantes.'],
 ['Circuito del plano','Recorre el diseño como jugador: qué hago, qué respuesta recibo y qué decisión tomo después. Señala un tramo sin información útil y rediseña su feedback.']],
['yunque','El Yunque','Ferna, guardiana de las chispas','Construye una versión del prototipo con narrativa, misiones y progresión coherentes.','creacion','camaraderia',
 ['Molde de la primera pieza','Para cada misión anota propósito, acción, evidencia y feedback. Vincula la narrativa con una decisión del jugador, no solo con un título.'],
 ['Forja de alternativas','Ensaya dos versiones de una misión: una con recurso limitado y otra con cooperación. Describe qué decisión permite cada versión y elige la que sirve mejor al objetivo.'],
 ['Mesa de artesanos','Invita a otra persona a recorrer una pieza del prototipo sin explicaciones adicionales. Registra su pregunta o dificultad real y decide un ajuste; si no hay par disponible, prepara el ensayo.']],
['templado-pares','El Templado entre Pares','Neris, mediadora del taller','Usa las dos revisiones previstas para ajustar el canvas.','camaraderia','evaluacion',
 ['Acuerdo entre pares','Antes de revisar, acuerden evidencia, pregunta y sugerencia. Comenten una decisión del diseño y su efecto posible, evitando juicios sobre la persona.'],
 ['Diálogo del templado','Elige pedir aclaración a un revisor o comparar dos sugerencias divergentes. Registra lo que comprendes, lo que decides aplicar y tu motivo.'],
 ['Contraste de recomendaciones','Clasifica las sugerencias según evidencia disponible y efecto sobre el objetivo. Prioriza una; conserva la pauta original y explica por qué pospones otra.']],
['reflejo-diseno','El Reflejo del Diseño','Eira, custodio de los criterios','Aplica la rúbrica a evidencias concretas sin cambiar sus criterios.','evaluacion','sabiduria',
 ['Espejo de evidencias','Elige un criterio de la rúbrica y cita una evidencia observable del caso. Explica cómo se relaciona con el descriptor y qué información te falta.'],
 ['Dos interpretaciones','Compara dos niveles posibles para un mismo criterio. Justifica cada lectura con el descriptor y decide cuál sostienes; no se calcula una nota automática.'],
 ['Límite del reflejo','Busca una conclusión sobre calidad que no puedas sostener con los datos. Reformúlala e indica qué evidencia adicional necesitarías.']],
['pulido-prototipo','El Pulido del Prototipo','Mael, pulidor del santuario','Prioriza una mejora y comprueba su efecto en el prototipo.','evaluacion','creacion',
 ['Piedra de prioridad','Relaciona cada mejora con un criterio, una evidencia y una acción posible. Diferencia lo urgente para aprender de lo meramente ornamental.'],
 ['Pulido con contraste','Elige una mejora por impacto pedagógico o por facilidad de implementación. Compara ambas opciones y registra por qué priorizas una.'],
 ['Prototipo alternativo','Mantén objetivo y evidencia, pero sustituye un componente tecnológico por una alternativa sencilla. Explica qué conservas y qué tendrás que comprobar.']],
['espejo-compartido','El Espejo Compartido','Arel, guardiana del encuentro','Expón tu diseño y transforma el feedback recibido en un próximo ajuste.','camaraderia','evaluacion',
 ['Escucha del espejo','Durante el feedback registra una fortaleza respaldada, una pregunta y una sugerencia concreta. Comprueba que entendiste antes de decidir.'],
 ['La réplica razonada','Elige profundizar una pregunta de un par o explicar por qué conservarás una decisión cuestionada. Anota el argumento y la evidencia utilizada.'],
 ['Huella del ajuste','Selecciona una sugerencia y define qué cambio harás y qué evidencia te permitiría valorar su efecto. Conserva la pauta de revisión prevista.']],
['defensa-orbe','La Defensa del Orbe','Oria, guardiana de la bóveda','Presenta el prototipo, reflexiona sobre el recorrido y completa los instrumentos de cierre.','evaluacion','creacion',
 ['Hilo de la defensa','Prepara una secuencia: necesidad, decisión, evidencia y límite. Sustenta una fortaleza y una mejora de tu diseño sin confundir narrativa con resultado.'],
 ['Contrapunto de la bóveda','Elige una decisión difícil de tu prototipo y ensaya una objeción. Responde con evidencia o reconoce qué falta comprobar.'],
 ['La siguiente aventura','Diseña una adaptación del prototipo para otro contexto. Explica qué mantendrías, qué cambiarías y cómo comprobarías su pertinencia.']]
];
const routes5=[['Sostener la primera hipótesis','Revisar la segunda hipótesis'],['Explicar la decisión desde el objetivo','Explicar la decisión desde el contexto'],['Defender otra postura','Reconstruir el argumento de un par'],[],['Cambiar la regla de turno','Cambiar la información disponible'],['Priorizar autonomía','Priorizar competencia o relación'],['Elegir una ruta','Elegir colaboración'],['Ensayar recurso limitado','Ensayar cooperación'],['Pedir aclaración','Contrastar sugerencias divergentes'],['Sostener el primer nivel','Sostener el segundo nivel'],['Priorizar impacto pedagógico','Priorizar facilidad de implementación'],['Profundizar la pregunta de un par','Fundamentar una decisión cuestionada'],['Responder a la objeción con evidencia','Reconocer lo que falta comprobar']];
const missions=rows.map((r,i)=>({slug:r[0],name:r[1],guardian:r[2],purpose:r[3],entry:'index.html',perks:r.slice(6).map((p,j)=>({id:r[0]==='vetas-diseno'&&j===1?'ojo_artesano':r[0]+'_'+j,mission:r[0],attribute:j===2?r[5]:r[4],minimum:[3,5,8][j],name:p[0],text:p[1],kind:j===0||r[0]==='vetas-diseno'&&j===1?'apoyo':'accion',options:j===1?routes5[i]:j===2?['Ensayar el desafío','Preparar el ensayo para después']:[],prompt:'¿Qué decisión tomaste y qué te llevó a elegirla?'})),egg:[0,5,7,12].includes(i)?{id:'sello_'+i,name:['El margen del archivista','La faceta silenciosa','La chispa de Mochi','El eco de la bóveda'][[0,5,7,12].indexOf(i)],text:['En un margen del archivo: «Un buen concepto también explica cuándo deja de servir». Prueba a escribir un contraejemplo.','La gema devuelve un reflejo: «A veces elegir no competir también es participar». Busca una decisión que respete esa elección.','Una pequeña marca de pata: «Mochi no vende respuestas; vende ocasiones para probar». Imagina un prototipo hecho solo con papel y lápiz.','Dentro del Orbe hay un espacio vacío: «El aprendizaje continúa donde dejas una pregunta». Conserva una pregunta para tu próxima experiencia.'][[0,5,7,12].indexOf(i)]}:null}));
const forja={slug:'forja',name:'La Forja del Buscador',guardian:'Nara, guardiana de los nombres',purpose:'Forja tu identidad y conserva las decisiones de tu camino.',perks:[],egg:{id:'mochi_pata',name:'Una huella junto al yunque',text:'Mochi dejó una marca: «Todo atributo empieza en uno. Toda buena aventura, con una pregunta». ¿Qué quisieras comprender durante tu recorrido?'}};
const all=missions.flatMap(m=>m.perks);
const find=slug=>slug==='forja'?forja:missions.find(m=>m.slug===slug);
const available=skills=>all.filter(p=>Number.isInteger(skills?.[p.attribute])&&skills[p.attribute]>=p.minimum);
const catalog={version:'0.3.0',attributes,missions,forja,all,find,available};
root.LudariaRPG=catalog;
if(typeof module==='object'&&module.exports)module.exports=catalog;
})(typeof globalThis!=='undefined'?globalThis:this);
