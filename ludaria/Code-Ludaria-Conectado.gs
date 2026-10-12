/** LUDARIA v0.4.1. Sustituye Código.gs en el MISMO proyecto del paso 1.
 * Conserva propiedades, secretos y registros. No crear un proyecto nuevo.
 * Ejecuta prepararConexionLudaria y luego implementa como aplicación web. */

(function(root){
'use strict';
const SK='buscadores_gamiaula_v1';
const SKS=[
 {key:'sabiduria',label:'Sabiduría',color:'#80cbbf',desc:'Comprender qué es y qué no es gamificación.'},
 {key:'maestria',label:'Maestría',color:'#dcc27e',desc:'Relacionar dinámicas, mecánicas y componentes.'},
 {key:'creacion',label:'Creación',color:'#bd9de7',desc:'Convertir ideas en experiencias y prototipos.'},
 {key:'evaluacion',label:'Evaluación',color:'#8aa8e3',desc:'Revisar diseños con criterios pedagógicos.'},
 {key:'camaraderia',label:'Camaradería',color:'#a3cc73',desc:'Colaborar y compartir saberes con el grupo.'}
];
const CLS=[{id:'Kael',icon:'🧙‍♂️',desc:'Un buscador entre los senderos de Ludaria.'},{id:'Kira',icon:'🧙‍♀️',desc:'Una buscadora ante los misterios del Orbe.'}];
const LVL=[0,60,140,240,360,500];
const MODS=[
 {id:0,name:'Valle de los Ecos',label:'Apertura · Sesión 1',art:'realm',mentor:'El llamado',ms:[{id:'ECO101',t:'portal',n:'El Llamado de la Aventura',p:3,x:30}]},
 {id:1,name:'Bosque de los Conceptos',label:'Módulo I · Sesiones 2–4',art:'forest',mentor:'Archivista Théol',ms:[{id:'AXR314',t:'main',n:'Los Pergaminos Dispersos',p:5,x:60},{id:'LUM582',t:'sec',n:'La Senda de los Ejemplos',p:2,x:25},{id:'VYR207',t:'sec',n:'El Claro del Debate',p:2,x:25}]},
 {id:2,name:'Cantera de los Elementos',label:'Módulo II · Sesiones 5–7',art:'quarry',mentor:'Maestra Bryn',ms:[{id:'NEX451',t:'main',n:'Las Vetas del Diseño',p:5,x:60},{id:'ORB126',t:'sec',n:'El Tallado de Mecánicas',p:2,x:25},{id:'KRN693',t:'sec',n:'La Gema Motivacional',p:2,x:25}]},
 {id:3,name:'Forja del Arquitecto',label:'Módulo III · Sesiones 8–10',art:'forge',mentor:'Forjador Ondal',ms:[{id:'ZEN248',t:'main',n:'Los Planos del Arquitecto',p:5,x:60},{id:'ELD570',t:'sec',n:'El Yunque',p:2,x:25},{id:'MIR831',t:'sec',n:'El Templado entre Pares',p:2,x:25}]},
 {id:4,name:'Santuario del Espejo',label:'Módulo IV · Sesiones 11–13',art:'mirror',mentor:'Guardiana Mira',ms:[{id:'ARC419',t:'main',n:'El Reflejo del Diseño',p:5,x:60},{id:'NEB264',t:'sec',n:'El Pulido del Prototipo',p:2,x:25},{id:'CYR905',t:'sec',n:'El Espejo Compartido',p:2,x:25}]},
 {id:5,name:'Bóveda del Orbe',label:'Cierre · Sesión 14',art:'vault',mentor:'El encuentro final',ms:[{id:'ORB714',t:'final',n:'La Defensa del Orbe',p:10,x:100}]}
];
const CM=Object.fromEntries(MODS.flatMap(m=>m.ms.map(x=>[x.id,{...x,mid:m.id}])));
const ACH=[
 ['primer_paso','✧','Primer llamado','Crea tu buscador o buscadora.'],
 ['codigo_activado','⌘','Primer Código Activado','Activa tu primer Código del Saber.'],
 ['umbral_abierto','◇','Umbral Abierto','Responde al Llamado de la Aventura.'],
 ['mision_central','▤','Primera Misión Principal','Completa una misión principal.'],
 ['explorador','⌖','Explorador/a de Senderos','Completa una misión secundaria.'],
 ['primer_dev','◆','Primer Canje con Mochi','Confirma tu primera mejora de atributos.'],
 ['nodo_despierto','❧','Rama Despierta','Revela tu primer talento.'],
 ['especialista','★','Stat Dominante','Alcanza 5 en un atributo.'],
 ['equilibrado','⚖','Buscador/a Integral','Alcanza 3 en los cinco atributos.'],
 ['ruta_completa','◈','Fragmento Recuperado','Completa las tres misiones de un módulo.'],
 ['constructor_epico','♜','Arquitecto/a de Ludaria','Alcanza el nivel 5.'],
 ['orbe_restaurado','✺','Orbe Restaurado','Reúne los cuatro fragmentos y registra la defensa final.']
];
const freshStats=(v=1)=>Object.fromEntries(SKS.map(s=>[s.key,v]));
const calcLv=xp=>LVL.reduce((lv,x,i)=>xp>=x?i+1:lv,1);
const fragments=p=>MODS.filter(m=>m.id>=1&&m.id<=4&&m.ms.every(x=>p.missions.includes(x.id)));
const missionDone=p=>p.missions.filter(c=>CM[c]&&['main','sec'].includes(CM[c].t)).length;
const xpPct=p=>p.level===6?100:Math.max(0,Math.min(100,100*(p.xp-LVL[p.level-1])/(LVL[p.level]-LVL[p.level-1])));
const defP=(name,cls)=>({name,class:cls,skills:freshStats(),pending:freshStats(0),points:0,xp:0,level:1,codes:[],missions:[],nodes:[],achs:['primer_paso'],tutSeen:false,version:3});
const integer=(n,fallback,min,max)=>Number.isFinite(Number(n))?Math.min(max,Math.max(min,Math.floor(Number(n)))):fallback;
function normalize(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||typeof raw.name!=='string'||!raw.name.trim()||!raw.skills||typeof raw.skills!=='object')throw Error('El archivo no contiene un personaje válido.');
 const p={...raw,name:raw.name.trim().slice(0,32)},legacy={sabiduria:'narrativa',maestria:'diseno',creacion:'creatividad',evaluacion:'estrategia',camaraderia:'motivacion'};
 p.skills={};p.pending={};
 SKS.forEach(s=>{p.skills[s.key]=integer(raw.skills[s.key]??raw.skills[legacy[s.key]],1,1,10);p.pending[s.key]=integer(raw.pending?.[s.key]??raw.pending?.[legacy[s.key]],0,0,10-p.skills[s.key]);});
 if(!CLS.some(c=>c.id===p.class)){p.legacyClass=p.class;p.class='Kael';}
 const arr=v=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'))]:[];
 p.codes=arr(raw.codes);p.missions=arr([...arr(raw.missions),...p.codes]).filter(c=>CM[c]&&['main','sec'].includes(CM[c].t));
 const map=Object.fromEntries(Object.entries(legacy).map(([k,v])=>[v,k]));
 p.nodes=arr(arr(raw.nodes).map(n=>{const [s,t]=n.split('_');return `${map[s]||s}_${t}`;})).filter(n=>SKS.some(s=>[1,2,3].some(i=>n===`${s.key}_${i}`)));
 p.achs=arr(raw.achs);if(!p.achs.includes('primer_paso'))p.achs.push('primer_paso');
 p.points=integer(raw.points,0,0,1e6);p.xp=integer(raw.xp,0,0,1e7);p.level=calcLv(p.xp);p.version=3;p.tutSeen=Boolean(raw.tutSeen);
 if(Object.values(p.pending).reduce((a,b)=>a+b,0)>p.points)p.pending=freshStats(0);
 checkAchievements(p);return p;
}
function checkAchievements(p){
 const conditions={primer_paso:true,codigo_activado:p.codes.length>0,umbral_abierto:p.codes.includes('ECO101'),mision_central:p.missions.some(c=>CM[c]?.t==='main'),explorador:p.missions.some(c=>CM[c]?.t==='sec'),nodo_despierto:p.nodes.length>0,especialista:SKS.some(s=>p.skills[s.key]>=5),equilibrado:SKS.every(s=>p.skills[s.key]>=3),ruta_completa:fragments(p).length>0,constructor_epico:p.level>=5,orbe_restaurado:p.codes.includes('ORB714')&&fragments(p).length===4};
 const unlocked=[];Object.entries(conditions).forEach(([id,yes])=>{if(yes&&!p.achs.includes(id)){p.achs.push(id);unlocked.push(id);}});return unlocked;
}
function redeem(p,raw){
 const code=String(raw).trim().toUpperCase();
 if(!/^[A-Z]{3}\d{3}$/.test(code))throw Error('Utiliza 3 letras y 3 números, sin espacios: ABC123.');
 const md=CM[code];if(!md)throw Error('Este código no pertenece al registro del Saber. Comprueba la clave con tu docente.');
 if(p.codes.includes(code))throw Error('Esta runa ya fue activada. Cada código puede utilizarse una sola vez.');
 const oldLevel=p.level,oldFragments=fragments(p).length;
 p.codes.push(code);if(['main','sec'].includes(md.t)&&!p.missions.includes(code))p.missions.push(code);
 p.points+=md.p;p.xp+=md.x;p.level=calcLv(p.xp);
 return {code,md,oldLevel,oldFragments,achievements:checkAchievements(p)};
}
function allocate(p,key,delta){
 if(!SKS.some(s=>s.key===key)||![1,-1].includes(delta))return false;
 const total=Object.values(p.pending).reduce((a,b)=>a+b,0);
 if(delta>0&&(total>=p.points||p.skills[key]+p.pending[key]>=10))return false;
 if(delta<0&&p.pending[key]<=0)return false;
 p.pending[key]+=delta;return true;
}
function confirmSpend(p){
 const n=Object.values(p.pending).reduce((a,b)=>a+b,0);
 if(n<=0||n>p.points||SKS.some(s=>p.pending[s.key]<0||p.skills[s.key]+p.pending[s.key]>10))throw Error('Revisa la asignación: necesitas puntos disponibles y cada atributo admite hasta 10.');
 SKS.forEach(s=>{p.skills[s.key]+=p.pending[s.key];});p.pending=freshStats(0);p.points-=n;
 if(!p.achs.includes('primer_dev'))p.achs.push('primer_dev');checkAchievements(p);return n;
}
function unlock(p,key,tier){
 const req=[3,5,8][tier-1],id=`${key}_${tier}`;
 if(!SKS.some(s=>s.key===key)||!req||p.skills[key]<req||p.nodes.includes(id))return false;
 p.nodes.push(id);checkAchievements(p);return true;
}
root.LudariaCore={SK,SKS,CLS,LVL,MODS,CM,ACH,freshStats,calcLv,fragments,missionDone,xpPct,defP,normalize,redeem,allocate,confirmSpend,unlock,checkAchievements};
})(typeof globalThis!=="undefined"?globalThis:this);


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


const LUDARIA_MISSION_ENTRIES = {
  "mision-0": "presentacion.html",
  "pergaminos-dispersos": "presentacion.html",
  "senda-ejemplos": "index.html",
  "claro-debate": "presentacion.html",
  "vetas-diseno": "presentacion.html",
  "tallado-mecanicas": "presentacion.html",
  "gema-motivacional": "presentacion.html",
  "planos-arquitecto": "presentacion.html",
  "yunque": "presentacion.html",
  "templado-pares": "presentacion.html",
  "reflejo-diseno": "index.html",
  "pulido-prototipo": "index.html",
  "espejo-compartido": "index.html",
  "defensa-orbe": "presentacion.html"
}
;

const LUDARIA = Object.freeze({
  sheetId: PropertiesService.getScriptProperties().getProperty('LUDARIA_SHEET_ID') || (SpreadsheetApp.getActiveSpreadsheet() && SpreadsheetApp.getActiveSpreadsheet().getId()),
  version: '0.1.0',
  maxAttempts: 5,
  attemptWindowMs: 15 * 60 * 1000,
  attributes: ['sabiduria', 'maestria', 'creacion', 'evaluacion', 'camaraderia'],
  headers: {
    Personajes: ['ID', 'Nombre', 'Alias normalizado', 'Personaje', 'Sal PIN', 'Verificador PIN', 'Tipo', 'Creado', 'Estado'],
    Progreso: ['ID', 'Nombre', 'Personaje', 'Nivel', 'XP', 'Puntos', 'Sabiduría', 'Maestría', 'Creación', 'Evaluación', 'Camaradería', 'Ventajas disponibles JSON', 'Actualizado'],
    Movimientos: ['Solicitud', 'Fecha', 'ID', 'Acción', 'Detalle JSON', 'Perfil JSON'],
    CatalogoAtributos: ['Clave', 'Atributo', 'Descripción', 'Inicial', 'Máximo', 'Coste por mejora', 'Umbrales de talento'],
    CatalogoVentajas: ['ID', 'Atributo', 'Mínimo', 'Misión', 'Nombre', 'Descripción', 'Estado de integración'],
    Aventuras: ['Evento', 'Fecha', 'ID', 'Misión', 'Ventaja', 'Acción', 'Detalle JSON'],
    Reflexiones: ['Evento', 'Fecha', 'ID', 'Contexto', 'Reflexión'],
    Panel: ['ID', 'Nombre', 'Tipo', 'Nivel', 'XP', 'Puntos', 'Atributo predominante', 'Ventajas disponibles', 'Movimientos', 'Actualizado'],
    Pruebas: ['Ejecución', 'Fecha', 'Comprobación', 'Resultado', 'Detalle']
  }
});

/** Solo editor. Repetible: conserva datos y secreto, y valida cabeceras. */
function instalarLudaria_() {
  return conBloqueo_(function () {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (!active || active.getId() !== LUDARIA.sheetId) {
      throw new Error('Abre Extensiones > Apps Script desde la planilla LUDARIA indicada.');
    }
    const props = PropertiesService.getScriptProperties();
    const bound = props.getProperty('LUDARIA_SHEET_ID');
    if (bound && bound !== LUDARIA.sheetId) throw new Error('Este proyecto ya está vinculado a otra planilla.');
    // Revisar TODAS las pestañas antes de modificar cualquiera.
    Object.keys(LUDARIA.headers).forEach(function (name) {
      const sheet = active.getSheetByName(name);
      if (sheet && sheet.getLastRow()) validarCabecera_(sheet, LUDARIA.headers[name]);
    });
    if (!props.getProperty('LUDARIA_PIN_PEPPER')) {
      if (active.getSheetByName('Personajes') && active.getSheetByName('Personajes').getLastRow() > 1) {
        throw new Error('Falta el secreto original. No se regenerará sobre personajes existentes.');
      }
      props.setProperty('LUDARIA_PIN_PEPPER', Utilities.getUuid() + Utilities.getUuid());
    }
    props.setProperty('LUDARIA_SHEET_ID', LUDARIA.sheetId);
    Object.keys(LUDARIA.headers).forEach(function (name) {
      const headers = LUDARIA.headers[name];
      const sheet = active.getSheetByName(name) || active.insertSheet(name);
      if (!sheet.getLastRow()) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setBackground('#163e2a').setFontColor('#ffffff').setFontWeight('bold');
      sheet.autoResizeColumns(1, headers.length);
    });
    const catalog = active.getSheetByName('CatalogoAtributos');
    if (catalog.getLastRow() === 1) catalog.getRange(2, 1, 5, 7).setValues([
      ['sabiduria', 'Sabiduría', 'Comprender qué es y qué no es gamificación.', 1, 10, 1, '3 / 5 / 8'],
      ['maestria', 'Maestría', 'Relacionar dinámicas, mecánicas y componentes.', 1, 10, 1, '3 / 5 / 8'],
      ['creacion', 'Creación', 'Convertir ideas en experiencias y prototipos.', 1, 10, 1, '3 / 5 / 8'],
      ['evaluacion', 'Evaluación', 'Revisar diseños con criterios pedagógicos.', 1, 10, 1, '3 / 5 / 8'],
      ['camaraderia', 'Camaradería', 'Colaborar y compartir saberes con el grupo.', 1, 10, 1, '3 / 5 / 8']
    ]);
    const advantages = active.getSheetByName('CatalogoVentajas');
    if (advantages.getLastRow() === 1) advantages.appendRow([
      'ojo_artesano', 'maestria', 5, 'vetas-diseno', 'Ojo del Artesano',
      'Consultar un esquema de apoyo para distinguir dinámicas, mecánicas y componentes.',
      'Piloto pendiente de integrar en la misión'
    ]);
    props.setProperty('LUDARIA_SCHEMA_VERSION', LUDARIA.version);
    SpreadsheetApp.flush();
    console.log('LUDARIA: instalación completada. Ahora ejecuta probarLudaria_.');
    return { ok: true, version: LUDARIA.version, sheets: Object.keys(LUDARIA.headers).length };
  });
}

/** Solo editor. Crea un único personaje DEMO; nunca acredita puntos de misiones. */
function probarLudaria_() {
  return conBloqueo_(function () {
    const ss = base_();
    const props = PropertiesService.getScriptProperties();
    const pin = props.getProperty('LUDARIA_DEMO_PIN') ||
      ('000000' + (parseInt(Utilities.getUuid().replace(/-/g, '').slice(0, 10), 16) % 1000000)).slice(-6);
    props.setProperty('LUDARIA_DEMO_PIN', pin);
    const alias = 'Explorador Demo Ludaria';
    const existing = buscarPersonaje_(ss, normalizarAlias_(alias));
    if (existing && existing[6] !== 'DEMO') throw new Error('El alias de prueba pertenece a un personaje real.');
    const record = existing || crearPersonaje_(ss, alias, pin, 'Kira', 'DEMO');
    asegurarCreacion_(ss, record);
    const attemptKey = claveIntentos_(normalizarAlias_(alias));
    const previousAttempts = props.getProperty(attemptKey);
    props.deleteProperty(attemptKey); // Solo la cuenta DEMO para una prueba repetible.
    const run = Utilities.getUuid();
    const results = [];
    const check = function (name, passed, detail) {
      results.push([run, new Date().toISOString(), name, passed ? 'OK' : 'ERROR', detail]);
    };
    try {
      const original = perfilActual_(ss, record[0]);
      const auth = identificarExplorador_(ss, '  EXPLORADOR   DEMO LUDARIA  ', pin);
      check('Identificación central con mayúsculas y espacios', auth.ok && auth.profile.id === record[0], 'Consulta el perfil guardado en Movimientos.');
      check('Acentos equivalentes', normalizarAlias_('  NÍCOLAS  del Bosque ') === normalizarAlias_('nicolas del bosque'), 'No utiliza coincidencias aproximadas.');
      const wrongPin = pin === '000000' ? '000001' : '000000';
      const wrong = identificarExplorador_(ss, alias, wrongPin);
      check('PIN incorrecto rechazado', !wrong.ok && !wrong.profile, 'No devuelve atributos ni datos del personaje.');
      const absent = identificarExplorador_(ss, 'personaje inexistente ' + run.slice(0, 8), pin);
      check('Personaje inexistente rechazado', !absent.ok && !absent.profile, 'Mismo mensaje para credenciales incorrectas.');
      for (let i = 1; i < LUDARIA.maxAttempts; i++) identificarExplorador_(ss, alias, wrongPin);
      const blocked = identificarExplorador_(ss, alias, pin);
      check('Límite de intentos', !blocked.ok && blocked.error === 'ESPERA', 'Cinco fallos bloquean temporalmente ese alias.');
      props.deleteProperty(attemptKey);
      const low = ventajasDisponibles_(original.skills);
      const simulated = Object.assign({}, original.skills, { maestria: 5 });
      check('Ventaja condicionada al atributo', low.length === 0 && ventajasDisponibles_(simulated).some(function (v) { return v.id === 'ojo_artesano'; }), 'Maestría 5 se simula en memoria; no modifica el personaje.');
      check('Ventaja desaparece al bajar el atributo', ventajasDisponibles_(Object.assign({}, simulated, { maestria: 4 })).length === 0, 'Se calcula con atributos actuales, no con desbloqueos históricos.');
      const final = perfilActual_(ss, record[0]);
      check('Pruebas sin alterar progreso', JSON.stringify(final) === JSON.stringify(original), 'Conserva puntos, XP, atributos e historial del personaje DEMO.');
      check('PIN no guardado en texto', record[5] !== pin && /^[a-f0-9]{64}$/.test(record[5]), 'Se guarda un verificador con sal y secreto privado del proyecto.');
      actualizarVistas_(ss, record, final);
      ss.getSheetByName('Pruebas').getRange(ss.getSheetByName('Pruebas').getLastRow() + 1, 1, results.length, 5).setValues(results);
      SpreadsheetApp.flush();
      if (results.some(function (r) { return r[3] !== 'OK'; })) throw new Error('Alguna prueba falló. Revisa la pestaña Pruebas.');
      console.log('LUDARIA: ' + results.length + '/' + results.length + ' pruebas OK. Base privada preparada; conexión con Genially pendiente.');
      return { ok: true, checks: results.length, demoId: record[0] };
    } finally {
      if (previousAttempts) props.setProperty(attemptKey, previousAttempts);
      else props.deleteProperty(attemptKey);
    }
  });
}

/** Todo lo que sigue es privado; las funciones terminadas en _ no se exponen a google.script.run. */
function conBloqueo_(work) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { return work(); } finally { lock.releaseLock(); }
}
function validarCabecera_(sheet, headers) {
  const actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (JSON.stringify(actual) !== JSON.stringify(headers) || sheet.getLastColumn() > headers.length) {
    throw new Error('La pestaña ' + sheet.getName() + ' tiene otra estructura. No se sobrescribió.');
  }
}
function base_() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('LUDARIA_SHEET_ID') !== LUDARIA.sheetId || !props.getProperty('LUDARIA_PIN_PEPPER')) {
    throw new Error('Primero ejecuta instalarLudaria_.');
  }
  const ss = SpreadsheetApp.openById(LUDARIA.sheetId);
  Object.keys(LUDARIA.headers).forEach(function (name) {
    const sheet = ss.getSheetByName(name);
    if (!sheet) throw new Error('Falta la pestaña ' + name + '. Ejecuta instalarLudaria_.');
    validarCabecera_(sheet, LUDARIA.headers[name]);
  });
  return ss;
}
function filas_(ss, name) {
  const sheet = ss.getSheetByName(name);
  return sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, LUDARIA.headers[name].length).getValues();
}
function normalizarAlias_(raw) {
  if (typeof raw !== 'string' || raw.length > 100) throw new Error('Nombre inválido.');
  const name = raw.normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 32 || !/^[A-Za-z0-9\u00C0-\u024F][A-Za-z0-9\u00C0-\u024F .'-]*$/.test(name)) throw new Error('Usa un nombre de 2 a 32 caracteres, con letras y números.');
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function buscarPersonaje_(ss, alias) {
  const matches = filas_(ss, 'Personajes').filter(function (r) { return r[2] === alias; });
  if (matches.length > 1) throw new Error('Alias duplicado en el registro. Requiere revisión del propietario.');
  return matches[0] || null;
}
function firma_(value) {
  const secret = PropertiesService.getScriptProperties().getProperty('LUDARIA_PIN_PEPPER');
  if (!secret) throw new Error('Falta el secreto del proyecto.');
  return Utilities.computeHmacSha256Signature(value, secret, Utilities.Charset.UTF_8).map(function (b) {
    return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
  }).join('');
}
function iguales_(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}
function claveIntentos_(alias) { return 'LUDARIA_AUTH_' + firma_('alias|' + alias); }
function perfilInicial_(id, name, avatar) {
  const skills = {};
  LUDARIA.attributes.forEach(function (key) { skills[key] = 1; });
  return { id: id, name: name, class: avatar, skills: skills, points: 0, xp: 0, level: 1, codes: [], missions: [], nodes: [], achs: ['primer_paso'], version: 3 };
}
/** Invocar únicamente con bloqueo adquirido. Registro recuperable si falla la vista derivada. */
function crearPersonaje_(ss, name, pin, avatar, type) {
  const alias = normalizarAlias_(name);
  if (!claveValida_(pin)) throw new Error('Clave personal inválida.');
  if (!['Kael', 'Kira'].includes(avatar) || !['DEMO', 'PARTICIPANTE'].includes(type)) throw new Error('Tipo de personaje inválido.');
  if (buscarPersonaje_(ss, alias)) throw new Error('Ese nombre de explorador ya existe.');
  const id = Utilities.getUuid(), salt = Utilities.getUuid(), at = new Date().toISOString();
  const cleanName = name.normalize('NFKC').trim().replace(/\s+/g, ' ');
  const record = [id, cleanName, alias, avatar, salt, firma_(id + '|' + salt + '|' + pin), type, at, 'ACTIVO'];
  ss.getSheetByName('Personajes').appendRow(record);
  asegurarCreacion_(ss, record);
  return record;
}
function asegurarCreacion_(ss, record) {
  const found = filas_(ss, 'Movimientos').some(function (r) { return r[2] === record[0]; });
  if (!found) ss.getSheetByName('Movimientos').appendRow([
    'crear-' + record[0], record[7], record[0], 'CREACION', JSON.stringify({ tipo: record[6] }),
    JSON.stringify(perfilInicial_(record[0], record[1], record[3]))
  ]);
}
function perfilActual_(ss, id) {
  const movements = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
  if (!movements.length) throw new Error('Personaje sin perfil confirmado.');
  const p = JSON.parse(movements[movements.length - 1][5]);
  if (p.id !== id || !p.skills || LUDARIA.attributes.some(function (key) {
    return !Number.isInteger(p.skills[key]) || p.skills[key] < 1 || p.skills[key] > 10;
  }) || !Number.isInteger(p.points) || p.points < 0 || !Number.isInteger(p.xp) || p.xp < 0) {
    throw new Error('El perfil guardado requiere revisión.');
  }
  return p;
}
/** Invocar únicamente con bloqueo adquirido. Sin sesiones ni credenciales en URLs. */
function identificarExplorador_(ss, name, pin) {
  let alias;
  try { alias = normalizarAlias_(name); } catch (_) { return { ok: false, error: 'CREDENCIALES', message: 'Revisa tu nombre de explorador y PIN.' }; }
  const props = PropertiesService.getScriptProperties();
  const key = claveIntentos_(alias), now = Date.now();
  let attempts = JSON.parse(props.getProperty(key) || 'null');
  if (!attempts || now - attempts.start >= LUDARIA.attemptWindowMs) attempts = { start: now, failures: 0 };
  if (attempts.failures >= LUDARIA.maxAttempts) return { ok: false, error: 'ESPERA', message: 'Espera unos minutos antes de intentarlo nuevamente.' };
  const record = buscarPersonaje_(ss, alias);
  const validPin = claveValida_(pin);
  const candidate = firma_((record ? record[0] + '|' + record[4] : 'inexistente|sin-sal') + '|' + (validPin ? pin : 'invalido'));
  if (!record || record[8] !== 'ACTIVO' || !validPin || !iguales_(candidate, record[5])) {
    // No crear una clave persistente por cada alias inventado; el acceso público aún no está implementado.
    if (record) { attempts.failures++; props.setProperty(key, JSON.stringify(attempts)); }
    return { ok: false, error: 'CREDENCIALES', message: 'Revisa tu nombre de explorador y PIN.' };
  }
  props.deleteProperty(key);
  asegurarCreacion_(ss, record);
  const profile = perfilActual_(ss, record[0]);
  return { ok: true, profile: profile, advantages: ventajasDisponibles_(profile.skills) };
}
/** Regla piloto; el apoyo todavía no existe dentro de la misión publicada. */
function ventajasDisponibles_(skills) {
 return LudariaRPG.available(skills).map(function(p){return {id:p.id,attribute:p.attribute,minimum:p.minimum,mission:p.mission,name:p.name,integration:'PREPARADA'};});
}

function escribirVista_(ss, name, id, values) {
  const existing = filas_(ss, name).findIndex(function (r) { return r[0] === id; });
  const sheet = ss.getSheetByName(name);
  sheet.getRange(existing < 0 ? sheet.getLastRow() + 1 : existing + 2, 1, 1, values.length).setValues([values]);
}
function actualizarVistas_(ss, record, p) {
  const at = new Date().toISOString(), advantages = ventajasDisponibles_(p.skills);
  escribirVista_(ss, 'Progreso', p.id, [p.id, p.name, p.class, p.level, p.xp, p.points].concat(
    LUDARIA.attributes.map(function (k) { return p.skills[k]; }), [JSON.stringify(advantages), at]
  ));
  const best = Math.max.apply(null, LUDARIA.attributes.map(function (k) { return p.skills[k]; }));
  const dominant = LUDARIA.attributes.filter(function (k) { return p.skills[k] === best; }).join(', ');
  escribirVista_(ss, 'Panel', p.id, [p.id, p.name, record[6], p.level, p.xp, p.points, dominant,
    advantages.map(function (a) { return a.name + ' (piloto)'; }).join(', '),
    filas_(ss, 'Movimientos').filter(function (r) { return r[2] === p.id; }).length, at]);
}


/** LUDARIA · Conexión central v0.4.1. Funciones privadas conservan el sufijo _. */
const LUDARIA_WEB = Object.freeze({
  pages: 'https://nespinozagonzalez-hub.github.io/misiones/',
  raw: 'https://raw.githubusercontent.com/nespinozagonzalez-hub/misiones/main/',
  routes: ['forja', 'mision-0'].concat(LudariaRPG.missions.map(function(m){return m.slug;})),
  maxCharacters: 300,
  sessionMs: 4 * 60 * 60 * 1000
});

/**
 * Ejecutar desde el editor si existe duda sobre qué proyecto conserva el paso 1.
 * Solo lee estado y nunca devuelve el secreto.
 */
function diagnosticarConexionLudaria() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  const bound = props.getProperty('LUDARIA_SHEET_ID');
  const secret = Boolean(props.getProperty('LUDARIA_PIN_PEPPER'));
  const target = Boolean(ss && ss.getId() === LUDARIA.sheetId);
  const people = target && ss.getSheetByName('Personajes');
  const rows = people && people.getLastRow() > 1
    ? people.getRange(2, 1, people.getLastRow() - 1, LUDARIA.headers.Personajes.length).getValues()
    : [];
  const participants = rows.filter(function (row) { return row[6] === 'PARTICIPANTE'; }).length;
  const demos = rows.filter(function (row) { return row[6] === 'DEMO'; }).length;
  let next;
  if (!target) {
    next = 'Abre la planilla privada y entra por Extensiones > Apps Script. Este proyecto no está vinculado a esa planilla.';
  } else if (!secret && rows.length) {
    next = 'Este proyecto no conserva el secreto original. No ejecutes la preparación ni borres filas; intenta restaurar o abrir el proyecto original.';
  } else if (bound && bound !== LUDARIA.sheetId) {
    next = 'Este proyecto está vinculado a otra planilla. No continúes aquí.';
  } else {
    next = 'El proyecto puede ejecutar prepararConexionLudaria sin regenerar el secreto ni sobrescribir personajes.';
  }
  const result = {
    ok: true,
    planillaCorrecta: target,
    proyectoVinculado: bound === LUDARIA.sheetId,
    secretoConservado: secret,
    personajes: rows.length,
    demos: demos,
    participantes: participants,
    puedePreparar: target && secret && (!bound || bound === LUDARIA.sheetId),
    siguientePaso: next
  };
  console.log(JSON.stringify(result));
  return result;
}

/** Ejecutar desde el editor con la cuenta propietaria, antes de implementar. */
function prepararConexionLudaria() {
  const active = Session.getActiveUser().getEmail();
  const effective = Session.getEffectiveUser().getEmail();
  if (!active || active !== effective || !SpreadsheetApp.getActiveSpreadsheet()) {
    throw new Error('Ejecuta esta preparación desde el editor, con la cuenta propietaria.');
  }
  instalarLudaria_();
  sincronizarCatalogoRpg_(base_());
  const props = PropertiesService.getScriptProperties();
  props.setProperty('LUDARIA_WEB_ENABLED', 'true');
  // Autoriza UrlFetch al ejecutar en el editor. No se descargan datos de participantes.
  const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + 'forja/index.html');
  if (response.getResponseCode() !== 200) throw new Error('No se pudo comprobar la interfaz de Forja.');
  console.log('Conexión preparada. Implementa como aplicación web, ejecutada como propietario. La planilla sigue privada.');
  return { ok: true, version: '0.4.1' };
}

function doGet(e) {
  const params = e && e.parameter || {};
  const route = params.mision || 'forja';
  if (!LUDARIA_WEB.routes.includes(route)) {
    return HtmlService.createHtmlOutput('<h1>Ruta todavía no conectada</h1><p>La presentación original sigue disponible en Genially.</p>');
  }
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('LUDARIA_WEB_ENABLED') !== 'true') {
    return HtmlService.createHtmlOutput('<h1>Conexión pendiente</h1><p>El propietario debe ejecutar prepararConexionLudaria desde el editor.</p>');
  }
  const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + route + '/' + (LUDARIA_MISSION_ENTRIES[route] || 'index.html'));
  if (response.getResponseCode() !== 200) throw new Error('No se pudo cargar la presentación.');
  const entry = params.entrada === 'mochi';
  let html = response.getContentText();
  html = html.replace(/<base\b[^>]*>/gi, '');
  const config = JSON.stringify({ route: route, market: entry, rpgVersion: LudariaRPG.version }).replace(/</g, '\\u003c');
  const insertion = '<base href="' + LUDARIA_WEB.pages + route + '/" target="_self">' +
    '<script>window.LUDARIA_CLOUD_CONFIG=' + config + ';window.FORJA_ENTRY=' + entry + ';</script>' +
    '<script>' + LUDARIA_CATALOG_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>' +
    '<script>' + LUDARIA_RPG_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>' +
    '<script>' + LUDARIA_CLIENT_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>';
  html = html.replace(/<head[^>]*>/i, function (head) { return head + insertion; });
  return HtmlService.createHtmlOutput(html).setTitle('Ludaria · ' + (entry ? 'Mercadito de Mochi' : route === 'forja' ? 'Forja del Buscador' : contextoRpg_(route).name))
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Único punto público para operaciones de participantes. No devuelve filas privadas. */
function ludariaApi(request) {
  try {
    return conBloqueo_(function () {
      if (PropertiesService.getScriptProperties().getProperty('LUDARIA_WEB_ENABLED') !== 'true') throw new Error('Conexión pendiente de activar.');
      if (!request || typeof request !== 'object' || JSON.stringify(request).length > 50000) throw new Error('Solicitud inválida.');
      limitePublico_();
      const ss = base_(), data = request.data || {};
      if (request.action === 'entrar') {
        const key = limpiarClave_(data.key);
        const result = identificarExplorador_(ss, data.name, key);
        if (!result.ok) return result;
        return respuestaPerfil_(ss, result.profile.id, tokenSesion_(result.profile.id));
      }
      if (request.action === 'registrar') return registrarPublico_(ss, request);
      if (request.action === 'recuperarClave') return recuperarClavePublica_(ss, request);
      const id = validarSesion_(request.access);
      const record = filas_(ss, 'Personajes').find(function (r) { return r[0] === id && r[8] === 'ACTIVO'; });
      if (!record) throw new Error('Acceso cerrado. Vuelve a identificarte.');
      if (request.action === 'cargar') return respuestaPerfil_(ss, id);
      if (request.action === 'cargarMision') {
        validarMision_(data.mission);
        const events = filas_(ss, 'Aventuras').filter(function (r) { return r[2] === id && r[3] === data.mission && r[5] === 'BORRADOR'; });
        const last = events.length ? events[events.length - 1] : null;
        return { ok: true, snapshot: last ? JSON.parse(last[6]).snapshot : null, revision: last ? last[0] : null };
      }
      if (request.action === 'guardarMision') return guardarMision_(ss, id, request);
      if (request.action === 'ventaja') return consultarVentajaRpg_(ss, id, request);
      if (request.action === 'catalogoRpg') return catalogoRpg_(ss,id,data.mission);
      if (request.action === 'accionRpg') return accionRpg_(ss,id,request);
      if (!['runa', 'compra', 'talento', 'redistribuir'].includes(request.action)) throw new Error('Acción no disponible.');
      validarSolicitud_(request.requestId);
      const signature = firma_(JSON.stringify({ action: request.action, data: data }));
      const moves = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
      const repeated = moves.find(function (r) { return r[0] === request.requestId; });
      if (repeated) {
        if (JSON.parse(repeated[4]).signature !== signature) throw new Error('Este identificador ya se usó para otra operación.');
        return respuestaPerfil_(ss, id);
      }
      const latest = moves[moves.length - 1];
      if (request.expectedRevision !== latest[0]) throw new Error('El perfil cambió. Actualízalo antes de confirmar.');
      const p = perfilActual_(ss, id), before = p.points, skillsBefore=Object.assign({},p.skills), xpBefore=p.xp;
      const reason=textoDecision_(data.reason,1000);
      let detail;
      if (request.action === 'runa') {
        const result = LudariaCore.redeem(p, data.code);
        detail = result.md.n;
      } else if (request.action === 'compra') {
        p.pending = cantidades_(data.quantities, 0, 9);
        LudariaCore.confirmSpend(p);
        detail = 'Compra con Mochi';
      } else if (request.action === 'talento') {
        if (!LudariaCore.unlock(p, data.key, data.tier)) throw new Error('Talento todavía no disponible.');
        detail = 'Talento revelado';
      } else {
        const target = cantidades_(data.skills, 1, 10);
        const budget = p.points + LUDARIA.attributes.reduce(function (sum, k) { return sum + p.skills[k] - 1; }, 0);
        const spent = LUDARIA.attributes.reduce(function (sum, k) { return sum + target[k] - 1; }, 0);
        if (spent > budget) throw new Error('La redistribución supera los puntos que has obtenido.');
        p.skills = target; p.points = budget - spent;
        p.nodes = p.nodes.filter(function (node) { const pieces = node.split('_'); return p.skills[pieces[0]] >= [3,5,8][Number(pieces[1])-1]; });
        detail = 'Redistribución de atributos';
      }
      delete p.pending;
      ss.getSheetByName('Movimientos').appendRow([request.requestId, new Date().toISOString(), id, request.action.toUpperCase(),
        JSON.stringify({ signature: signature, detail: detail, before: before, after: p.points, data: data, skillsBefore: skillsBefore, skillsAfter: Object.assign({},p.skills), xpBefore: xpBefore, xpAfter: p.xp, reason:reason, reasonSource:reason?'AUTOINFORME':'NO_DECLARADO' }), JSON.stringify(p)]);
      // El movimiento confirmado es la fuente de verdad. Una vista se puede reconstruir.
      try { actualizarVistas_(ss, record, p); } catch (_) { console.log('LUDARIA: vista derivada pendiente de reconstruir.'); }
      return respuestaPerfil_(ss, id);
    });
  } catch (error) { return { ok: false, message: error.message || 'No se pudo confirmar la operación.' }; }
}

function limitePublico_() {
  const props = PropertiesService.getScriptProperties(), minute = Math.floor(Date.now() / 60000);
  let record = JSON.parse(props.getProperty('LUDARIA_WEB_RATE') || 'null');
  if (!record || record.minute !== minute) record = { minute: minute, count: 0 };
  if (record.count >= 300) throw new Error('Muchos accesos simultáneos. Espera un minuto y vuelve a intentar.');
  record.count++; props.setProperty('LUDARIA_WEB_RATE', JSON.stringify(record));
}
function validarSolicitud_(id) { if (typeof id !== 'string' || !/^[a-f0-9-]{32,40}$/i.test(id)) throw new Error('Identificador de solicitud inválido.'); }
function limpiarClave_(key) { return typeof key === 'string' ? key.trim().toUpperCase() : ''; }
function claveValida_(key) { return typeof key === 'string' && (/^\d{6}$/.test(key) || /^LUD(?:-[A-F0-9]{6}){4}$/.test(key)); }
function registrarPublico_(ss, request) {
  validarSolicitud_(request.requestId);
  const data = request.data || {}, alias = normalizarAlias_(data.name);
  if (!['Kael', 'Kira'].includes(data.class)) throw new Error('Selecciona Kael o Kira.');
  const key = claveElegida_(data.key, data.keyConfirm);
  const props = PropertiesService.getScriptProperties(), receiptProperty = 'LUDARIA_ALTA_' + firma_('alias|' + alias);
  const signature = firma_(JSON.stringify({alias:alias,avatar:data.class,key:key}));
  const receipt = JSON.parse(props.getProperty(receiptProperty) || 'null');
  const existing = buscarPersonaje_(ss, alias);
  let record;
  if (existing) {
    if (existing[8] !== 'ACTIVO' || !receipt || receipt.requestId !== request.requestId || !iguales_(receipt.signature, signature) ||
        !iguales_(firma_(existing[0] + '|' + existing[4] + '|' + key), existing[5])) throw new Error('Ese nombre ya está registrado. Entra con tu clave o elige otro nombre.');
    asegurarCreacion_(ss, existing);
    record = existing;
  } else {
    if (filas_(ss, 'Personajes').length >= LUDARIA_WEB.maxCharacters) throw new Error('Registro completo. Contacta al facilitador.');
    props.setProperty(receiptProperty, JSON.stringify({requestId:request.requestId,signature:signature}));
    record = crearPersonaje_(ss, data.name, key, data.class, 'PARTICIPANTE');
  }
  const recoveryCode = codigoRespaldo_(request.requestId, record[0]);
  props.setProperty('LUDARIA_RESPALDO_' + record[0], JSON.stringify({digest:firma_('respaldo|' + record[0] + '|' + recoveryCode)}));
  actualizarVistas_(ss, record, perfilActual_(ss, record[0]));
  const response = respuestaPerfil_(ss, record[0], tokenSesion_(record[0])); response.key = key; response.recoveryCode = recoveryCode; return response;
}
function claveElegida_(key, confirmation) {
  const clean = limpiarClave_(key);
  if (!/^\d{6}$/.test(clean)) throw new Error('Elige una clave personal de seis dígitos.');
  if (clean !== limpiarClave_(confirmation)) throw new Error('Las claves no coinciden. Escríbelas otra vez.');
  return clean;
}
function codigoRespaldo_(requestId, id) {
  const hex = firma_('respaldo-alta|' + requestId + '|' + id).slice(0,24).toUpperCase();
  return 'RES-' + hex.match(/.{6}/g).join('-');
}
/** Recuperación con prueba privada de respaldo; nunca revela la clave anterior. */
function recuperarClavePublica_(ss, request) {
  validarSolicitud_(request.requestId);
  const data = request.data || {}, alias = normalizarAlias_(data.name), key = claveElegida_(data.key, data.keyConfirm);
  const code = limpiarClave_(data.recoveryCode), records = filas_(ss, 'Personajes');
  const index = records.findIndex(function(r){return r[2] === alias && r[8] === 'ACTIVO';});
  const props = PropertiesService.getScriptProperties(), attemptProperty = claveIntentos_(alias) + '_RESPALDO', now = Date.now();
  let attempts = JSON.parse(props.getProperty(attemptProperty) || 'null');
  if (!attempts || now - attempts.start >= LUDARIA.attemptWindowMs) attempts = {start:now,failures:0};
  if (attempts.failures >= LUDARIA.maxAttempts) throw new Error('Espera unos minutos antes de intentar recuperar la clave nuevamente.');
  const previous = index < 0 ? null : records[index].slice(), property = previous && 'LUDARIA_RESPALDO_' + previous[0];
  const backupRaw = property && props.getProperty(property), backup = JSON.parse(backupRaw || 'null');
  if (!previous || !backup || !/^RES(?:-[A-F0-9]{6}){4}$/.test(code) || !iguales_(backup.digest, firma_('respaldo|' + previous[0] + '|' + code))) {
    if (previous) {attempts.failures++; props.setProperty(attemptProperty, JSON.stringify(attempts));}
    throw new Error('Revisa el nombre y el código de recuperación. Si no lo tienes, pide ayuda al facilitador.');
  }
  const signature = firma_(JSON.stringify({alias:alias,key:key,code:code}));
  if (backup.requestId === request.requestId) {
    if (!iguales_(backup.signature, signature)) throw new Error('Esta solicitud ya se usó para otro cambio de clave.');
    const response = respuestaPerfil_(ss, previous[0], tokenSesion_(previous[0])); response.key = key; return response;
  }
  const next = previous.slice(), versionProperty = 'LUDARIA_ACCESS_VERSION_' + previous[0], previousVersion = props.getProperty(versionProperty);
  next[4] = Utilities.getUuid(); next[5] = firma_(previous[0] + '|' + next[4] + '|' + key);
  const row = ss.getSheetByName('Personajes').getRange(index + 2, 1, 1, LUDARIA.headers.Personajes.length);
  try {
    row.setValues([next]); props.setProperty(versionProperty, request.requestId);
    props.setProperty(property, JSON.stringify({digest:backup.digest,requestId:request.requestId,signature:signature}));
    registrarEventoRpg_(ss, previous[0], request, 'RECUPERACION_ACCESO', 'forja', '', {source:'RESPALDO',previousSessionsRevoked:true});
  } catch(error) {
    row.setValues([previous]); props.setProperty(property, backupRaw);
    if (previousVersion) props.setProperty(versionProperty, previousVersion); else props.deleteProperty(versionProperty);
    throw error;
  }
  props.deleteProperty(attemptProperty); props.deleteProperty(claveIntentos_(alias));
  const response = respuestaPerfil_(ss, previous[0], tokenSesion_(previous[0])); response.key = key; return response;
}
function tokenSesion_(id) {
  const version = PropertiesService.getScriptProperties().getProperty('LUDARIA_ACCESS_VERSION_' + id);
  const nonce = (version ? version + '~' : '') + Utilities.getUuid();
  const value = id + '.' + (Date.now() + LUDARIA_WEB.sessionMs) + '.' + nonce;
  return value + '.' + firma_('sesion|' + value);
}
function validarSesion_(token) {
  if (typeof token !== 'string' || token.length > 250) throw new Error('Identifícate con tu nombre y clave.');
  const parts = token.split('.'), value = parts.slice(0, 3).join('.');
  if (parts.length !== 4 || !iguales_(firma_('sesion|' + value), parts[3]) || !/^\d+$/.test(parts[1]) || Number(parts[1]) <= Date.now()) throw new Error('Tu sesión terminó. Vuelve a entrar con tu nombre y clave.');
  const version = PropertiesService.getScriptProperties().getProperty('LUDARIA_ACCESS_VERSION_' + parts[0]);
  if (version && !parts[2].startsWith(version + '~')) throw new Error('El facilitador renovó tu acceso. Entra con tu nueva clave personal.');
  return parts[0];
}

/** Solo el facilitador propietario, desde el editor del proyecto vinculado. */
function recuperarClaveLudaria() {
  comprobarFacilitador_();
  const ui = SpreadsheetApp.getUi();
  const answer = ui.prompt('Recuperar acceso a Ludaria', 'Nombre de explorador cuya identidad has verificado. Su progreso se conserva.', ui.ButtonSet.OK_CANCEL);
  if (answer.getSelectedButton() !== ui.Button.OK) return {ok:false,cancelled:true};
  const name = answer.getResponseText();
  const confirm = ui.alert('Renovar clave personal', 'Se asignará una nueva clave y se cerrarán los accesos anteriores de este personaje. No se cambian sus puntos, XP, atributos ni cuadernos. ¿Confirmar?', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return {ok:false,cancelled:true};
  const result = renovarAccesoExplorador_(name);
  // La clave se muestra al propietario en la hoja, nunca en registros de ejecución.
  ui.alert('Clave personal renovada', 'Explorador: ' + result.name + '\nNueva clave: ' + result.key + '\nEntrégala únicamente a este participante. Guarda esta clave antes de cerrar.', ui.ButtonSet.OK);
  return {ok:true,personaje:result.id};
}
function comprobarFacilitador_() {
  const active = Session.getActiveUser().getEmail(), effective = Session.getEffectiveUser().getEmail();
  const bound = SpreadsheetApp.getActiveSpreadsheet();
  if (!active || active !== effective || !bound || bound.getId() !== LUDARIA.sheetId) throw new Error('Esta función requiere al facilitador propietario desde el editor del proyecto original.');
  if (!PropertiesService.getScriptProperties().getProperty('LUDARIA_PIN_PEPPER')) throw new Error('Falta el secreto original. No se renovó ninguna clave.');
}
function renovarAccesoExplorador_(name) {
  comprobarFacilitador_();
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const ss = base_(), alias = normalizarAlias_(name), records = filas_(ss, 'Personajes');
    const index = records.findIndex(function(row){return row[2] === alias;});
    if (index < 0 || records[index][8] !== 'ACTIVO') throw new Error('No hay un personaje activo con ese nombre.');
    const previous = records[index].slice(), next = previous.slice();
    const requestId = Utilities.getUuid();
    const hex = firma_('recuperacion|' + requestId + '|' + previous[0]).slice(0,24).toUpperCase();
    const key = 'LUD-' + hex.match(/.{6}/g).join('-');
    next[4] = Utilities.getUuid(); next[5] = firma_(previous[0] + '|' + next[4] + '|' + key);
    const props = PropertiesService.getScriptProperties(), property = 'LUDARIA_ACCESS_VERSION_' + previous[0];
    const previousVersion = props.getProperty(property);
    const row = ss.getSheetByName('Personajes').getRange(index + 2, 1, 1, LUDARIA.headers.Personajes.length);
    try {
      row.setValues([next]); props.setProperty(property, requestId);
      registrarEventoRpg_(ss, previous[0], {requestId:requestId}, 'RECUPERACION_ACCESO', 'forja', '', {source:'FACILITADOR',previousSessionsRevoked:true});
    } catch(error) {
      row.setValues([previous]);
      if (previousVersion) props.setProperty(property, previousVersion); else props.deleteProperty(property);
      throw error;
    }
    props.deleteProperty(claveIntentos_(alias));
    props.deleteProperty('LUDARIA_RESPALDO_' + previous[0]);
    return {id:previous[0],name:previous[1],key:key};
  } finally { lock.releaseLock(); }
}
function cantidades_(raw, min, max) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || Object.keys(raw).some(function (k) { return !LUDARIA.attributes.includes(k); })) throw new Error('Atributos inválidos.');
  const result = {};
  LUDARIA.attributes.forEach(function (key) { if (!Number.isInteger(raw[key]) || raw[key] < min || raw[key] > max) throw new Error('Cantidad inválida en ' + key + '.'); result[key] = raw[key]; });
  return result;
}
function respuestaPerfil_(ss, id, access) {
  const p = perfilActual_(ss, id), moves = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
  p.history = moves.slice(-1000).map(function (r) { const d = JSON.parse(r[4]); return { id: r[0], at: r[1], type: String(r[3]).toLowerCase(), detail: d.detail || 'Creación del personaje', before: d.before || 0, after: d.after || 0, cost: (d.before || 0) - (d.after || 0), skillsBefore:d.skillsBefore||null, skillsAfter:d.skillsAfter||null, reason:d.reason||'', reasonSource:d.reasonSource||'NO_DECLARADO' }; });
  const result = { ok: true, profile: p, revision: moves[moves.length - 1][0], advantages: ventajasDisponibles_(p.skills) };
  if (access) result.access = access;
  return result;
}
function validarMision_(mission) { if (!LudariaRPG.missions.some(function(m){return m.slug===mission;})) throw new Error('Esta misión aún no está conectada.'); }
function guardarMision_(ss, id, request) {
  const data = request.data; validarMision_(data.mission); validarSolicitud_(request.requestId);
  if (!data.snapshot || typeof data.snapshot !== 'object' || Array.isArray(data.snapshot) || JSON.stringify(data.snapshot).length > 40000) throw new Error('Borrador inválido o demasiado extenso.');
  validarCuadernoRpg_(data.mission,data.snapshot);
  const events = filas_(ss, 'Aventuras').filter(function (r) { return r[2] === id && r[3] === data.mission && r[5] === 'BORRADOR'; });
  const signature = firma_(JSON.stringify(data.snapshot));
  const repeated = events.find(function (r) { return r[0] === request.requestId; });
  if (repeated) { if (JSON.parse(repeated[6]).signature !== signature) throw new Error('Reintento distinto del original.'); return { ok: true, revision: repeated[0] }; }
  const revision = events.length ? events[events.length-1][0] : null;
  if (request.expectedRevision !== revision) throw new Error('El cuaderno cambió en otra sesión. Copia tu borrador y recarga antes de guardar.');
  ss.getSheetByName('Aventuras').appendRow([request.requestId, new Date().toISOString(), id, data.mission, '', 'BORRADOR', JSON.stringify({ signature: signature, snapshot: data.snapshot })]);
  return { ok: true, revision: request.requestId };
}
function consultarVentaja_(ss,id,request){return consultarVentajaRpg_(ss,id,request);}


/** Reglas RPG y evidencias de decisiones. Solo datos del personaje autenticado. */
function contextoRpg_(slug) {
  if (slug === 'mision-0') return {slug:slug,name:'El Llamado de la Aventura',guardian:'Aster, guardián del umbral',purpose:'Responde al llamado y reconoce tu punto de partida.',perks:[],egg:null};
  const mission = LudariaRPG.find(slug);
  if (!mission) throw new Error('Destino desconocido.');
  return mission;
}
function textoDecision_(value, maximum) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string' || value.length > maximum) throw new Error('La reflexión es demasiado extensa o inválida.');
  return value.trim();
}
function registrarEventoRpg_(ss,id,request,action,mission,perk,detail) {
  validarSolicitud_(request.requestId);
  const signature = firma_(JSON.stringify({action:action,mission:mission,perk:perk,detail:detail}));
  const sheet=ss.getSheetByName('Aventuras');
  const events=filas_(ss,'Aventuras').filter(function(r){return r[2]===id;});
  const old=events.find(function(r){return r[0]===request.requestId;});
  if(old){if(JSON.parse(old[6]).signature!==signature)throw new Error('El identificador ya pertenece a otra decisión.');return old[0];}
  const p=perfilActual_(ss,id);
  sheet.appendRow([request.requestId,new Date().toISOString(),id,mission,perk,action,JSON.stringify({signature:signature,detail:detail,skills:Object.assign({},p.skills),points:p.points,xp:p.xp,level:p.level,catalogVersion:LudariaRPG.version})]);
  return request.requestId;
}
function catalogoRpg_(ss,id,slug) {
  const mission=contextoRpg_(slug),p=perfilActual_(ss,id);
  const records=filas_(ss,'Aventuras').filter(function(r){return r[2]===id&&r[3]===slug&&r[5]==='ACCION_RPG';});
  const responses={},responseRevisions={};records.forEach(function(r){responses[r[4]]=JSON.parse(r[6]).detail;responseRevisions[r[4]]=r[0];});
  return {ok:true,mission:mission.slug,guardian:mission.guardian,purpose:mission.purpose,skills:p.skills,
    perks:mission.perks.map(function(perk){return {id:perk.id,name:perk.name,attribute:perk.attribute,minimum:perk.minimum,kind:perk.kind,available:p.skills[perk.attribute]>=perk.minimum};}),responses:responses,responseRevisions:responseRevisions,egg:mission.egg?{id:mission.egg.id,name:mission.egg.name}:null,capabilities:{omitAdvantage:true},version:LudariaRPG.version};
}
function consultarVentajaRpg_(ss,id,request) {
  const data=request.data||{},perk=LudariaRPG.all.find(function(p){return p.id===data.id;});
  if(!perk||data.mission&&data.mission!==perk.mission)throw new Error('Ventaja desconocida para esta misión.');
  const p=perfilActual_(ss,id);
  if(p.skills[perk.attribute]<perk.minimum)throw new Error(perk.name+' requiere '+LudariaRPG.attributes[perk.attribute]+' '+perk.minimum+' actual.');
  registrarEventoRpg_(ss,id,request,'CONSULTA_VENTAJA',perk.mission,perk.id,{kind:perk.kind});
  return {ok:true,text:perk.text,perk:perk};
}
function accionRpg_(ss,id,request) {
  const data=request.data||{},mission=contextoRpg_(data.mission);
  if(data.type==='entrada'){
    registrarEventoRpg_(ss,id,request,'ENTRADA',mission.slug,'',{guardian:data.market?'Mochi, custodio de las posibilidades':mission.guardian,market:data.market===true});return {ok:true};
  }
  if(data.type==='omitir_ventaja'){
    const perk=mission.perks.find(function(p){return p.id===data.id;});
    if(!perk||perfilActual_(ss,id).skills[perk.attribute]<perk.minimum)throw new Error('No puedes omitir una ventaja que no tienes disponible.');
    if(!Number.isInteger(data.page)||data.page<1||data.page>50||data.reason!=='continuar_sin_ayuda')throw new Error('La elección de ayuda no es válida.');
    const event=registrarEventoRpg_(ss,id,request,'OMISION_VENTAJA',mission.slug,perk.id,{page:data.page,reason:data.reason});
    return {ok:true,event:event};
  }
  if(data.type==='easter'){
    if(!mission.egg||data.id!==mission.egg.id)throw new Error('Sello desconocido.');
    const old=filas_(ss,'Aventuras').find(function(r){return r[2]===id&&r[3]===mission.slug&&r[4]===data.id&&r[5]==='DESCUBRIMIENTO';});
    if(!old)registrarEventoRpg_(ss,id,request,'DESCUBRIMIENTO',mission.slug,data.id,{name:mission.egg.name});
    return {ok:true,text:mission.egg.text,name:mission.egg.name};
  }
  if(data.type==='decision'){
    const perk=mission.perks.find(function(p){return p.id===data.id;});
    if(!perk||perk.kind!=='accion'||perfilActual_(ss,id).skills[perk.attribute]<perk.minimum)throw new Error('Esta acción requiere el atributo actual indicado.');
    if(!perk.options.includes(data.choice))throw new Error('Elige una de las rutas propuestas.');
    const detail={choice:data.choice,reflection:textoDecision_(data.reflection,2000),work:textoDecision_(data.work,6000),reasonSource:data.reflection&&data.reflection.trim()?'AUTOINFORME':'NO_DECLARADO'};
    // Los reintentos confirmados conservan su resultado aun si hubo otra edición.
    const records=filas_(ss,'Aventuras').filter(function(r){return r[2]===id&&r[3]===mission.slug&&r[4]===perk.id&&r[5]==='ACCION_RPG';});
    if(!records.some(function(r){return r[0]===request.requestId;})&&Object.prototype.hasOwnProperty.call(data,'expectedEventId')){
      const latest=records.length?records[records.length-1][0]:null;
      if(data.expectedEventId!==latest)throw new Error('Esta decisión cambió en otra sesión. Conserva tu ensayo pendiente y consulta la versión actual antes de reemplazarla.');
    }
    const event=registrarEventoRpg_(ss,id,request,'ACCION_RPG',mission.slug,perk.id,detail);return {ok:true,event:event};
  }
  throw new Error('Acción narrativa desconocida.');
}
function sincronizarCatalogoRpg_(ss) {
  LudariaRPG.all.forEach(function(p){escribirVista_(ss,'CatalogoVentajas',p.id,[p.id,p.attribute,p.minimum,p.mission,p.name,p.text,'Preparada v'+LudariaRPG.version+'; comprobar despliegue real']);});
}
/** Solo editor propietario. Devuelve agregados, sin nombres ni respuestas privadas en logs. */
function analizarDecisionesLudaria() {
  if(!Session.getActiveUser().getEmail()||Session.getActiveUser().getEmail()!==Session.getEffectiveUser().getEmail()||!SpreadsheetApp.getActiveSpreadsheet())throw new Error('Análisis disponible solo desde el editor propietario.');
  const ss=base_(),counts={},attributes={},reasons={declarados:0,noDeclarados:0},movementReasons={declarados:0,noDeclarados:0},attributeMoves={},routes={},benefits={},omissions={};
  filas_(ss,'Aventuras').forEach(function(r){if(['ENTRADA','CONSULTA_VENTAJA','OMISION_VENTAJA','ACCION_RPG','DESCUBRIMIENTO'].includes(r[5])){counts[r[5]]=(counts[r[5]]||0)+1;if(r[5]==='CONSULTA_VENTAJA')benefits[r[4]]=(benefits[r[4]]||0)+1;if(r[5]==='OMISION_VENTAJA')omissions[r[4]]=(omissions[r[4]]||0)+1;if(r[5]==='ACCION_RPG'){const d=JSON.parse(r[6]);reasons[d.detail.reasonSource==='AUTOINFORME'?'declarados':'noDeclarados']++;const key=r[3]+' | '+d.detail.choice;routes[key]=(routes[key]||0)+1;}}});
  const decisions=filas_(ss,'Movimientos').filter(function(r){return ['COMPRA','REDISTRIBUIR'].includes(r[3]);});
  decisions.forEach(function(r){const d=JSON.parse(r[4]);movementReasons[d.reasonSource==='AUTOINFORME'?'declarados':'noDeclarados']++;if(d.skillsAfter)LUDARIA.attributes.forEach(function(k){const delta=d.skillsAfter[k]-d.skillsBefore[k];if(delta){attributes[k]=(attributes[k]||0)+delta;attributeMoves[k]=(attributeMoves[k]||0)+1;}});});
  return {ok:true,events:counts,movimientosDeAtributos:decisions.length,cambioNetoPorAtributo:attributes,cambiosPorAtributo:attributeMoves,motivosDeMovimientos:movementReasons,motivosDeAcciones:reasons,rutasPorMision:routes,consultasPorVentaja:benefits,omisionesPorVentaja:omissions,interpretacion:'Los motivos escritos son autoinformes; el sistema no infiere intención ni aprendizaje desde clics.'};
}

function validarCuadernoRpg_(mission,snapshot) {
 if(!Number.isInteger(snapshot.page)||snapshot.page<0||snapshot.page>50||snapshot.visited&&!Array.isArray(snapshot.visited))throw new Error('Cuaderno inválido. No se reemplazó la versión anterior.');
 if(mission==='vetas-diseno'&&(!Array.isArray(snapshot.cards)||snapshot.cards.length!==18))throw new Error('Faltan las tarjetas del cuaderno.');
 if(mission!=='vetas-diseno'&&(snapshot.version!==1||!snapshot.fields||typeof snapshot.fields!=='object'||Array.isArray(snapshot.fields)))throw new Error('El formato del cuaderno requiere revisión.');
}


const LUDARIA_CATALOG_SOURCE = "/** Ludaria \u00b7 cat\u00e1logo compartido. Apoyos pedag\u00f3gicos; conserva evaluaci\u00f3n y recompensas. */\n(function(root){\n'use strict';\nconst attributes={sabiduria:'Sabidur\u00eda',maestria:'Maestr\u00eda',creacion:'Creaci\u00f3n',evaluacion:'Evaluaci\u00f3n',camaraderia:'Camarader\u00eda'};\n// Cada registro: misi\u00f3n, guardi\u00e1n, encargo, atributo principal/secundario, tres apoyos espec\u00edficos.\nconst rows=[\n['pergaminos-dispersos','Los Pergaminos Dispersos','Iria, custodio del archivo','Reconstruye las diferencias entre gamificaci\u00f3n, ABJ, juegos serios y edutainment.','sabiduria','evaluacion',\n ['Br\u00fajula de conceptos','Compara prop\u00f3sito educativo, funci\u00f3n del juego y relaci\u00f3n con la actividad. Busca una evidencia de cada dimensi\u00f3n en el caso antes de clasificarlo.'],\n ['Dos lecturas del pergamino','Relee un caso desde dos hip\u00f3tesis de clasificaci\u00f3n. Escribe qu\u00e9 evidencia sostiene cada una y qu\u00e9 dato te har\u00eda cambiar de opini\u00f3n.'],\n ['La excepci\u00f3n del archivo','Prop\u00f3n un caso fronterizo. Comprueba si tu criterio sigue siendo \u00fatil y se\u00f1ala el l\u00edmite de tu explicaci\u00f3n.']],\n['senda-ejemplos','La Senda de los Ejemplos','Elian, rastreador de huellas','Contrasta dos experiencias documentadas con sus evidencias.','sabiduria','camaraderia',\n ['Lupa de huellas','Distingue lo que describe la fuente de lo que t\u00fa interpretas. Vincula elemento, funci\u00f3n pedag\u00f3gica y evidencia; una imagen decorativa no demuestra un efecto.'],\n ['Expediente paralelo','Escoge una experiencia y construye dos explicaciones posibles de una decisi\u00f3n de dise\u00f1o. Contr\u00e1stalas con la fuente sin a\u00f1adir resultados que no aparecen.'],\n ['Entrevista del sendero','Invita a un par real a cuestionar tu interpretaci\u00f3n. Registra su pregunta, la evidencia contrastada y el ajuste que decidiste; si trabajas a solas, prepara las preguntas para el encuentro.']],\n['claro-debate','El Claro del Debate','Liora, guardiana de las voces','Revisa tu postura sobre la gamificaci\u00f3n mediante argumentos y fuentes.','camaraderia','sabiduria',\n ['Turnos del claro','Distribuyan los papeles de quien argumenta, quien pregunta por evidencia y quien sintetiza. R\u00f3tenlos; la pausa para escuchar tambi\u00e9n forma parte del di\u00e1logo.'],\n ['La silla del contrapunto','Elige defender provisionalmente una postura diferente de la tuya o reconstruir el argumento de un compa\u00f1ero antes de responder. Anota qu\u00e9 cambi\u00f3 y qu\u00e9 sostuviste.'],\n ['Puente entre fuentes','Contrasta dos fuentes con conclusiones distintas. Examina contextos, indicadores y l\u00edmites antes de decidir si existe una contradicci\u00f3n.']],\n['vetas-diseno','Las Vetas del Dise\u00f1o','Brina, centinela de la cantera','Justifica din\u00e1micas, mec\u00e1nicas y componentes seg\u00fan su funci\u00f3n en el contexto.','maestria','creacion',\n ['Lente de la cantera','Busca la unidad de an\u00e1lisis: experiencia global, regla o proceso, representaci\u00f3n concreta. Explica qu\u00e9 hace ese elemento en el dise\u00f1o antes de nombrar su nivel.'],\n ['Ojo del Artesano','Din\u00e1micas: experiencia global y relaciones. Mec\u00e1nicas: reglas y procesos que hacen actuar. Componentes: representaciones concretas. Identifica la unidad de an\u00e1lisis y justifica seg\u00fan el contexto. Esta pauta no resuelve la actividad ni cambia su evaluaci\u00f3n.'],\n ['Una veta, dos formas','Elige un prop\u00f3sito pedag\u00f3gico y propone dos combinaciones de componentes que puedan servirlo. Explica qu\u00e9 mec\u00e1nica conservas y qu\u00e9 experiencia esperas favorecer.']],\n['tallado-mecanicas','El Tallado de Mec\u00e1nicas','Rokan, tallador de rutas','Relaciona reglas, acciones del jugador y experiencia en un juego.','maestria','evaluacion',\n ['Mapa del bucle','Describe estado inicial, acci\u00f3n permitida, respuesta del sistema y nueva decisi\u00f3n. Separa la regla de la sensaci\u00f3n que podr\u00eda producir.'],\n ['Banco de variaciones','Elige cambiar una regla de turno o una condici\u00f3n de informaci\u00f3n. Antes de jugar, predice una consecuencia; despu\u00e9s registra lo que observaste y el l\u00edmite del ensayo.'],\n ['Prueba de tensi\u00f3n','Somete la mec\u00e1nica a dos escenarios: un jugador que se rezaga y otro que domina. Se\u00f1ala evidencias de exclusi\u00f3n o participaci\u00f3n y una mejora posible.']],\n['gema-motivacional','La Gema Motivacional','Savia, guardiana de las facetas','Redise\u00f1a una decisi\u00f3n atendiendo a autonom\u00eda, competencia y relaci\u00f3n.','sabiduria','evaluacion',\n ['Tres facetas','Pregunta si existe una elecci\u00f3n significativa, un desaf\u00edo con apoyo y una relaci\u00f3n respetuosa. Distingue necesidad psicol\u00f3gica de una recompensa material.'],\n ['Contraluz de la gema','Revisa el mismo dilema desde dos necesidades psicol\u00f3gicas. Elige cu\u00e1l atender primero y justifica qu\u00e9 tensi\u00f3n permanece.'],\n ['Ensayo del cuidado','Revisa el redise\u00f1o para alguien que no quiera competir o exponerse. Identifica una alternativa equivalente y comprueba que la participaci\u00f3n siga siendo voluntaria.']],\n['planos-arquitecto','Los Planos del Arquitecto','Daren, custodio de los planos','Construye el canvas y comprueba la coherencia de sus decisiones.','creacion','maestria',\n ['Regla del arquitecto','Une objetivo, conducta observable y evidencia de aprendizaje. Despu\u00e9s revisa si la actividad y el componente elegidos ayudan a producir esa evidencia.'],\n ['Taller de bifurcaciones','Conserva tu objetivo y crea dos variantes: una con elecci\u00f3n de ruta y otra con colaboraci\u00f3n. Elige una y explica su adecuaci\u00f3n a tus participantes.'],\n ['Circuito del plano','Recorre el dise\u00f1o como jugador: qu\u00e9 hago, qu\u00e9 respuesta recibo y qu\u00e9 decisi\u00f3n tomo despu\u00e9s. Se\u00f1ala un tramo sin informaci\u00f3n \u00fatil y redise\u00f1a su feedback.']],\n['yunque','El Yunque','Ferna, guardiana de las chispas','Construye una versi\u00f3n del prototipo con narrativa, misiones y progresi\u00f3n coherentes.','creacion','camaraderia',\n ['Molde de la primera pieza','Para cada misi\u00f3n anota prop\u00f3sito, acci\u00f3n, evidencia y feedback. Vincula la narrativa con una decisi\u00f3n del jugador, no solo con un t\u00edtulo.'],\n ['Forja de alternativas','Ensaya dos versiones de una misi\u00f3n: una con recurso limitado y otra con cooperaci\u00f3n. Describe qu\u00e9 decisi\u00f3n permite cada versi\u00f3n y elige la que sirve mejor al objetivo.'],\n ['Mesa de artesanos','Invita a otra persona a recorrer una pieza del prototipo sin explicaciones adicionales. Registra su pregunta o dificultad real y decide un ajuste; si no hay par disponible, prepara el ensayo.']],\n['templado-pares','El Templado entre Pares','Neris, mediadora del taller','Usa las dos revisiones previstas para ajustar el canvas.','camaraderia','evaluacion',\n ['Acuerdo entre pares','Antes de revisar, acuerden evidencia, pregunta y sugerencia. Comenten una decisi\u00f3n del dise\u00f1o y su efecto posible, evitando juicios sobre la persona.'],\n ['Di\u00e1logo del templado','Elige pedir aclaraci\u00f3n a un revisor o comparar dos sugerencias divergentes. Registra lo que comprendes, lo que decides aplicar y tu motivo.'],\n ['Contraste de recomendaciones','Clasifica las sugerencias seg\u00fan evidencia disponible y efecto sobre el objetivo. Prioriza una; conserva la pauta original y explica por qu\u00e9 pospones otra.']],\n['reflejo-diseno','El Reflejo del Dise\u00f1o','Eira, custodio de los criterios','Aplica la r\u00fabrica a evidencias concretas sin cambiar sus criterios.','evaluacion','sabiduria',\n ['Espejo de evidencias','Elige un criterio de la r\u00fabrica y cita una evidencia observable del caso. Explica c\u00f3mo se relaciona con el descriptor y qu\u00e9 informaci\u00f3n te falta.'],\n ['Dos interpretaciones','Compara dos niveles posibles para un mismo criterio. Justifica cada lectura con el descriptor y decide cu\u00e1l sostienes; no se calcula una nota autom\u00e1tica.'],\n ['L\u00edmite del reflejo','Busca una conclusi\u00f3n sobre calidad que no puedas sostener con los datos. Reform\u00falala e indica qu\u00e9 evidencia adicional necesitar\u00edas.']],\n['pulido-prototipo','El Pulido del Prototipo','Mael, pulidor del santuario','Prioriza una mejora y comprueba su efecto en el prototipo.','evaluacion','creacion',\n ['Piedra de prioridad','Relaciona cada mejora con un criterio, una evidencia y una acci\u00f3n posible. Diferencia lo urgente para aprender de lo meramente ornamental.'],\n ['Pulido con contraste','Elige una mejora por impacto pedag\u00f3gico o por facilidad de implementaci\u00f3n. Compara ambas opciones y registra por qu\u00e9 priorizas una.'],\n ['Prototipo alternativo','Mant\u00e9n objetivo y evidencia, pero sustituye un componente tecnol\u00f3gico por una alternativa sencilla. Explica qu\u00e9 conservas y qu\u00e9 tendr\u00e1s que comprobar.']],\n['espejo-compartido','El Espejo Compartido','Arel, guardiana del encuentro','Exp\u00f3n tu dise\u00f1o y transforma el feedback recibido en un pr\u00f3ximo ajuste.','camaraderia','evaluacion',\n ['Escucha del espejo','Durante el feedback registra una fortaleza respaldada, una pregunta y una sugerencia concreta. Comprueba que entendiste antes de decidir.'],\n ['La r\u00e9plica razonada','Elige profundizar una pregunta de un par o explicar por qu\u00e9 conservar\u00e1s una decisi\u00f3n cuestionada. Anota el argumento y la evidencia utilizada.'],\n ['Huella del ajuste','Selecciona una sugerencia y define qu\u00e9 cambio har\u00e1s y qu\u00e9 evidencia te permitir\u00eda valorar su efecto. Conserva la pauta de revisi\u00f3n prevista.']],\n['defensa-orbe','La Defensa del Orbe','Oria, guardiana de la b\u00f3veda','Presenta el prototipo, reflexiona sobre el recorrido y completa los instrumentos de cierre.','evaluacion','creacion',\n ['Hilo de la defensa','Prepara una secuencia: necesidad, decisi\u00f3n, evidencia y l\u00edmite. Sustenta una fortaleza y una mejora de tu dise\u00f1o sin confundir narrativa con resultado.'],\n ['Contrapunto de la b\u00f3veda','Elige una decisi\u00f3n dif\u00edcil de tu prototipo y ensaya una objeci\u00f3n. Responde con evidencia o reconoce qu\u00e9 falta comprobar.'],\n ['La siguiente aventura','Dise\u00f1a una adaptaci\u00f3n del prototipo para otro contexto. Explica qu\u00e9 mantendr\u00edas, qu\u00e9 cambiar\u00edas y c\u00f3mo comprobar\u00edas su pertinencia.']]\n];\nconst routes5=[['Sostener la primera hip\u00f3tesis','Revisar la segunda hip\u00f3tesis'],['Explicar la decisi\u00f3n desde el objetivo','Explicar la decisi\u00f3n desde el contexto'],['Defender otra postura','Reconstruir el argumento de un par'],[],['Cambiar la regla de turno','Cambiar la informaci\u00f3n disponible'],['Priorizar autonom\u00eda','Priorizar competencia o relaci\u00f3n'],['Elegir una ruta','Elegir colaboraci\u00f3n'],['Ensayar recurso limitado','Ensayar cooperaci\u00f3n'],['Pedir aclaraci\u00f3n','Contrastar sugerencias divergentes'],['Sostener el primer nivel','Sostener el segundo nivel'],['Priorizar impacto pedag\u00f3gico','Priorizar facilidad de implementaci\u00f3n'],['Profundizar la pregunta de un par','Fundamentar una decisi\u00f3n cuestionada'],['Responder a la objeci\u00f3n con evidencia','Reconocer lo que falta comprobar']];\nconst missions=rows.map((r,i)=>({slug:r[0],name:r[1],guardian:r[2],purpose:r[3],entry:'index.html',perks:r.slice(6).map((p,j)=>({id:r[0]==='vetas-diseno'&&j===1?'ojo_artesano':r[0]+'_'+j,mission:r[0],attribute:j===2?r[5]:r[4],minimum:[3,5,8][j],name:p[0],text:p[1],kind:j===0||r[0]==='vetas-diseno'&&j===1?'apoyo':'accion',options:j===1?routes5[i]:j===2?['Ensayar el desaf\u00edo','Preparar el ensayo para despu\u00e9s']:[],prompt:'\u00bfQu\u00e9 decisi\u00f3n tomaste y qu\u00e9 te llev\u00f3 a elegirla?'})),egg:[0,5,7,12].includes(i)?{id:'sello_'+i,name:['El margen del archivista','La faceta silenciosa','La chispa de Mochi','El eco de la b\u00f3veda'][[0,5,7,12].indexOf(i)],text:['En un margen del archivo: \u00abUn buen concepto tambi\u00e9n explica cu\u00e1ndo deja de servir\u00bb. Prueba a escribir un contraejemplo.','La gema devuelve un reflejo: \u00abA veces elegir no competir tambi\u00e9n es participar\u00bb. Busca una decisi\u00f3n que respete esa elecci\u00f3n.','Una peque\u00f1a marca de pata: \u00abMochi no vende respuestas; vende ocasiones para probar\u00bb. Imagina un prototipo hecho solo con papel y l\u00e1piz.','Dentro del Orbe hay un espacio vac\u00edo: \u00abEl aprendizaje contin\u00faa donde dejas una pregunta\u00bb. Conserva una pregunta para tu pr\u00f3xima experiencia.'][[0,5,7,12].indexOf(i)]}:null}));\nconst forja={slug:'forja',name:'La Forja del Buscador',guardian:'Nara, guardiana de los nombres',purpose:'Forja tu identidad y conserva las decisiones de tu camino.',perks:[],egg:{id:'mochi_pata',name:'Una huella junto al yunque',text:'Mochi dej\u00f3 una marca: \u00abTodo atributo empieza en uno. Toda buena aventura, con una pregunta\u00bb. \u00bfQu\u00e9 quisieras comprender durante tu recorrido?'}};\nconst all=missions.flatMap(m=>m.perks);\nconst find=slug=>slug==='forja'?forja:missions.find(m=>m.slug===slug);\nconst available=skills=>all.filter(p=>Number.isInteger(skills?.[p.attribute])&&skills[p.attribute]>=p.minimum);\nconst catalog={version:'0.3.0',attributes,missions,forja,all,find,available};\nroot.LudariaRPG=catalog;\nif(typeof module==='object'&&module.exports)module.exports=catalog;\n})(typeof globalThis!=='undefined'?globalThis:this);\n";

const LUDARIA_RPG_SOURCE = "/** Interacciones RPG. Solo se activan dentro de la aplicaci\u00f3n central autenticada. */\n(() => {\n'use strict';\nlet cloud,route;\n// Solo memoria de esta p\u00e1gina: nunca se comparte identidad o respuestas entre iframes.\nconst drafts=new Map();\nconst pendingDraft=id=>{const draft=drafts.get(id);return draft&&(draft.saving||JSON.stringify(draft.data)!==draft.confirmed)?draft:null;};\nconst esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nfunction close(d){d.close();d.remove();}\nfunction focusTitle(d){const heading=d.querySelector('h2');heading.tabIndex=-1;heading.focus();}\nfunction modal(title,html){const opener=document.activeElement;const d=document.createElement('dialog');d.className='ludaria-cloud-dialog';d.innerHTML='<h2>'+esc(title)+'</h2>'+html;d.setAttribute('aria-label',title);document.body.append(d);d.addEventListener('close',()=>{d.remove();if(!document.querySelector('dialog[open]')&&opener?.isConnected)opener.focus();});d.showModal();return d;}\nfunction showPending(id){const draft=pendingDraft(id);if(!draft)return;const d=modal('Tu ensayo pendiente','<p>Este texto sigue sin confirmar. Puedes conservar una copia aunque la ayuda no est\u00e9 disponible ahora.</p><label>Ruta elegida<input data-rpg-draft-choice readonly></label><label>Mi ensayo<textarea data-rpg-draft-work readonly rows=\"5\"></textarea></label><label>Mi motivo<textarea data-rpg-draft-reflection readonly rows=\"3\"></textarea></label><button data-rpg-download>Guardar ensayo TXT</button><button data-rpg-close>Volver a mi recorrido</button>');\n d.querySelector('[data-rpg-draft-choice]').value=draft.data.choice;d.querySelector('[data-rpg-draft-work]').value=draft.data.work;d.querySelector('[data-rpg-draft-reflection]').value=draft.data.reflection;\n d.querySelector('[data-rpg-close]').onclick=()=>close(d);d.querySelector('[data-rpg-download]').onclick=()=>{const url=URL.createObjectURL(new Blob(['LUDARIA \u00b7 ENSAYO SIN CONFIRMAR\\nMisi\u00f3n: '+route+'\\nRuta: '+draft.data.choice+'\\n\\nEnsayo:\\n'+draft.data.work+'\\n\\nMotivo:\\n'+draft.data.reflection],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='Ludaria-ensayo-pendiente.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);};focusTitle(d);\n}\nasync function openPerk(id){\n const d=modal('El guardi\u00e1n abre su cuaderno','<p role=\"status\">Consultando tus posibilidades\u2026</p><button data-rpg-close>Volver</button>');d.querySelector('[data-rpg-close]').onclick=()=>close(d);\n try{\n  const r=await cloud.api('ventaja',{id,mission:route});if(!d.isConnected||!d.open)return;const p=r.perk;\n  const c=await cloud.api('catalogoRpg',{mission:route}),old=c.responses[id]||{};\n  if(!d.isConnected||!d.open)return;\n  d.setAttribute('aria-label',p.name);d.innerHTML='<h2>'+esc(p.name)+'</h2><p class=\"rpg-threshold\">'+esc(LudariaRPG.attributes[p.attribute])+' '+p.minimum+' \u00b7 '+esc(LudariaRPG.find(route)?.name||'Ludaria')+'</p><p>'+esc(r.text)+'</p>'+\n    (p.kind==='accion'?'<form data-rpg-form><label>Ruta elegida<select name=\"choice\" required><option value=\"\">Elige c\u00f3mo abordar el desaf\u00edo</option>'+p.options.map(x=>'<option>'+esc(x)+'</option>').join('')+'</select></label><label>Mi ensayo o decisi\u00f3n<textarea name=\"work\" maxlength=\"6000\" rows=\"5\"></textarea></label><label>\u00bfQu\u00e9 te llev\u00f3 a elegir esta ruta? <small>Opcional</small><textarea name=\"reflection\" maxlength=\"2000\" rows=\"3\"></textarea></label><button type=\"submit\">Conservar esta decisi\u00f3n</button><p role=\"status\" data-rpg-status></p></form>':'')+\n    '<p class=\"rpg-note\">Esta posibilidad ampl\u00eda tu pr\u00e1ctica. Las actividades y criterios de la misi\u00f3n se conservan.</p><button data-rpg-close>Continuar mi misi\u00f3n</button>';\n  d.querySelector('[data-rpg-close]').onclick=()=>close(d);\n  const f=d.querySelector('form');if(f){\n   const initial={type:'decision',mission:route,id,choice:old.choice||'',work:old.work||'',reflection:old.reflection||'',expectedEventId:c.responseRevisions?.[id]||null};\n   const draft=pendingDraft(id)||{data:initial,confirmed:JSON.stringify(initial),requestId:crypto.randomUUID(),signature:'',saving:false};\n   drafts.set(id,draft);f.elements.choice.value=draft.data.choice;f.elements.work.value=draft.data.work;f.elements.reflection.value=draft.data.reflection;\n   const compare=document.createElement('button');compare.type='button';compare.textContent='Comparar con la decisi\u00f3n confirmada';compare.dataset.rpgCompare='';f.append(compare);\n   compare.onclick=async()=>{compare.disabled=true;try{const latest=await cloud.api('catalogoRpg',{mission:route});if(!d.isConnected||!d.open)return;const saved=latest.responses[id]||{},version=latest.responseRevisions?.[id]||null;const view=modal('La decisi\u00f3n confirmada','<p>Compara este registro con tu ensayo pendiente antes de volver a guardarlo.</p><label>Ruta confirmada<input data-rpg-current-choice readonly></label><label>Ensayo confirmado<textarea data-rpg-current-work readonly rows=\"5\"></textarea></label><label>Motivo confirmado<textarea data-rpg-current-reflection readonly rows=\"3\"></textarea></label><button data-rpg-rebase>Retomar mi ensayo tras comparar</button><button data-rpg-close>Volver sin cambiar mi ensayo</button>');view.querySelector('[data-rpg-current-choice]').value=saved.choice||'';view.querySelector('[data-rpg-current-work]').value=saved.work||'';view.querySelector('[data-rpg-current-reflection]').value=saved.reflection||'';view.querySelector('[data-rpg-close]').onclick=()=>close(view);view.querySelector('[data-rpg-rebase]').onclick=()=>{if(draft.saving)return;draft.data.expectedEventId=version;draft.requestId=crypto.randomUUID();draft.signature='';f.querySelector('[data-rpg-status]').textContent='Comparaci\u00f3n realizada. Tu ensayo sigue pendiente; confirma cuando est\u00e9 listo.';close(view);};focusTitle(view);}catch(error){f.querySelector('[data-rpg-status]').textContent=error.message;}finally{compare.disabled=false;}};\n   const capture=()=>{draft.data={type:'decision',mission:route,id,choice:f.elements.choice.value,work:f.elements.work.value,reflection:f.elements.reflection.value,expectedEventId:draft.data.expectedEventId};};\n   f.addEventListener('input',capture);f.addEventListener('change',capture);\n   d.addEventListener('close',()=>{capture();if(JSON.stringify(draft.data)!==draft.confirmed||draft.saving)cloud.notify('Hay un ensayo sin confirmar. Reabre la ayuda del guardi\u00e1n para retomarlo.');});\n   f.onsubmit=async e=>{e.preventDefault();if(draft.saving)return;capture();const data={...draft.data},signature=JSON.stringify(data);if(draft.signature&&draft.signature!==signature)draft.requestId=crypto.randomUUID();draft.signature=signature;const requestId=draft.requestId;\n    const button=f.querySelector('button'),status=f.querySelector('[data-rpg-status]');button.disabled=true;draft.saving=true;status.textContent='Conservando tu decisi\u00f3n\u2026';\n    try{const result=await cloud.api('accionRpg',data,requestId);const unchanged=JSON.stringify(draft.data)===signature;draft.data.expectedEventId=result.event;draft.confirmed=JSON.stringify({...data,expectedEventId:result.event});status.textContent=unchanged?'Decisi\u00f3n confirmada en tu bit\u00e1cora.':'Decisi\u00f3n confirmada; los cambios posteriores siguen pendientes.';}catch(error){status.textContent='Sin confirmar: '+error.message+' Tu texto permanece aqu\u00ed y al reabrir esta ayuda.';}finally{draft.saving=false;button.disabled=false;}\n   };\n  }\n  focusTitle(d);\n }catch(error){if(d.isConnected){d.querySelector('p').textContent=error.message;if(pendingDraft(id)){const b=document.createElement('button');b.textContent='Conservar mi ensayo pendiente';b.onclick=()=>{close(d);showPending(id);};d.querySelector('p').after(b);}}}\n}\nasync function open(){\n const d=modal('El cuaderno del guardi\u00e1n','<p role=\"status\">Revisando tus atributos actuales\u2026</p><button data-rpg-close>Volver</button>');d.querySelector('button').onclick=()=>close(d);\n try{const r=await cloud.api('catalogoRpg',{mission:route});if(!d.isConnected||!d.open)return;d.innerHTML='<h2>'+esc(r.guardian)+'</h2><p>'+esc(r.purpose)+'</p><p>Estas posibilidades dependen de tus atributos actuales. Puedes consultar el cat\u00e1logo completo con Mochi.</p><div class=\"rpg-perks\">'+r.perks.map(p=>'<article class=\"rpg-perk '+(p.available?'is-available':'is-locked')+'\"><h3>'+esc(p.name)+'</h3><p>'+esc(LudariaRPG.attributes[p.attribute])+' '+r.skills[p.attribute]+' / umbral '+p.minimum+'</p><button data-rpg-open=\"'+esc(p.id)+'\" '+(p.available?'':'disabled')+'>'+(p.available?(p.kind==='accion'?'Ensayar una ruta diferente':'Consultar apoyo'):'Disponible con '+esc(LudariaRPG.attributes[p.attribute])+' '+p.minimum)+'</button>'+(pendingDraft(p.id)?'<button data-rpg-recover=\"'+esc(p.id)+'\">Conservar mi ensayo pendiente</button>':'')+'</article>').join('')+'</div>'+\n  (!r.perks.length?'<p>Este umbral abre tu aventura. Tu registro inicial se conserva con el protocolo de diagn\u00f3stico previsto.</p>':'')+\n  (r.egg?'<button class=\"rpg-seal\" data-rpg-egg=\"'+esc(r.egg.id)+'\" aria-label=\"Examinar el sello del guardi\u00e1n\">\u25c7 Examinar el sello del guardi\u00e1n</button>':'')+'<button data-rpg-close>Volver a mi recorrido</button>';\n  d.querySelector('[data-rpg-close]').onclick=()=>close(d);d.querySelectorAll('[data-rpg-open]').forEach(b=>b.onclick=()=>{close(d);openPerk(b.dataset.rpgOpen);});\n  d.querySelectorAll('[data-rpg-recover]').forEach(b=>b.onclick=()=>{close(d);showPending(b.dataset.rpgRecover);});\n  d.querySelector('[data-rpg-egg]')?.addEventListener('click',async e=>{const b=e.currentTarget;b.disabled=true;try{const x=await cloud.api('accionRpg',{type:'easter',mission:route,id:b.dataset.rpgEgg});const note=document.createElement('p');note.className='rpg-lore';note.textContent=x.name+' \u00b7 '+x.text;b.after(note);b.textContent='Sello descubierto \u00b7 sin coste ni puntos';}catch(error){b.disabled=false;b.textContent='Volver a examinar \u00b7 '+error.message;}});\n  focusTitle(d);\n }catch(error){if(d.isConnected)d.querySelector('p').textContent=error.message;}\n}\nwindow.LudariaRPGUI={open,openPerk};\ndocument.addEventListener('DOMContentLoaded',async()=>{\n if(!window.LudariaCloud?.active)return;cloud=window.LudariaCloud;route=window.LUDARIA_CLOUD_CONFIG.route;\n cloud.registerPendingCheck(()=>[...drafts.values()].some(draft=>draft.saving||JSON.stringify(draft.data)!==draft.confirmed));\n const style=document.createElement('style');style.textContent='.rpg-perks{display:grid;gap:12px;margin:18px 0}.rpg-perks article{padding:14px;border:1px solid #365b43;border-radius:12px;background:#0b1811}.rpg-perks h3{font:22px Georgia;color:#c9a66b;margin:0}.ludaria-cloud-dialog textarea{width:100%;box-sizing:border-box;background:#07120d;color:#f2ebdd;border:1px solid #53735d;border-radius:8px;padding:12px;font:inherit}.rpg-threshold,.rpg-note{font-size:14px;color:#8ed89a}.rpg-seal{margin:12px 0}.rpg-lore{border-left:3px solid #c9a66b;padding:12px;background:#0b1811}';document.head.append(style);\n await cloud.ready;\n // Consulta/entrada y borradores son evidencias distintas; no otorgan recompensas.\n try{await cloud.api('accionRpg',{type:'entrada',mission:route,market:window.LUDARIA_CLOUD_CONFIG.market===true});}catch(error){cloud.notify('El registro de entrada est\u00e1 sin confirmar. '+error.message);}\n});\n})();\n";

const LUDARIA_CLIENT_SOURCE = "(() => {\n  'use strict';\n  const config = window.LUDARIA_CLOUD_CONFIG;\n  if (!config) return;\n  let access = null, profile = null, revision = null, missionRevision = null;\n  let resolveReady, bar, status, pendingSnapshot = null, saving = false, failedSave = null, saveTimer, flushTask = null;\n  let identityKey = '', identityBackup = '';\n  const pendingChecks = new Set();\n  const hasPending = () => Boolean(pendingSnapshot || failedSave || saving || [...pendingChecks].some(check => check()));\n  const guardian = config.market ? {guardian:'Mochi, custodio de las posibilidades',purpose:'Antes de ofrecerte una mejora, necesito reconocer al buscador que llega a mi mercado.'} : config.route==='mision-0' ? {guardian:'Aster, guardi\u00e1n del umbral',purpose:'Responde al llamado y reconoce tu punto de partida.'} : LudariaRPG.find(config.route);\n  const portraitRoutes = ['forja','pergaminos-dispersos','senda-ejemplos','claro-debate','vetas-diseno','tallado-mecanicas','gema-motivacional','planos-arquitecto','yunque','templado-pares','reflejo-diseno','pulido-prototipo','espejo-compartido','defensa-orbe','mision-0','mochi'];\n  const portraitIndex = Math.max(0,portraitRoutes.indexOf(config.market ? 'mochi' : config.route));\n  const ready = new Promise(resolve => { resolveReady = resolve; });\n  const uid = () => crypto.randomUUID();\n  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\n  const stateText = text => { if (status) status.textContent = text; for(const id of ['store','saved-note']){const e=document.getElementById(id);if(e)e.textContent=text;} window.dispatchEvent(new CustomEvent('ludaria:savestatus',{detail:text})); };\n  function validateSnapshot(snapshot){if(snapshot===null)return null;if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||!Number.isInteger(snapshot.page)||snapshot.page<0||snapshot.page>50||config.route==='vetas-diseno'&&(!Array.isArray(snapshot.cards)||snapshot.cards.length!==18)||config.route!=='vetas-diseno'&&(snapshot.version!==1||!snapshot.fields||typeof snapshot.fields!=='object'||Array.isArray(snapshot.fields))||snapshot.visited&&!Array.isArray(snapshot.visited))throw Error('El cuaderno guardado requiere revisi\u00f3n; no se reemplazar\u00e1.');return snapshot;}\n  function rpc(request) {\n    return new Promise((resolve, reject) => {\n      let settled = false;\n      const timer = setTimeout(() => { settled = true; reject(Error('La confirmaci\u00f3n est\u00e1 tardando. Reintenta para comprobarla.')); }, 30000);\n      const finish = (ok, result) => { if (settled) return; settled = true; clearTimeout(timer); ok ? resolve(result) : reject(Error(result?.message || 'No se pudo confirmar.')); };\n      try { google.script.run.withSuccessHandler(result => finish(Boolean(result?.ok), result))\n        .withFailureHandler(error => finish(false, error)).ludariaApi(request); }\n      catch (error) { finish(false, error); }\n    });\n  }\n  function adopt(result) {\n    if (result.access) access = result.access;\n    if (result.profile) { profile = result.profile; revision = result.revision; }\n    if (bar && profile) bar.querySelector('[data-cloud-identity]').textContent = profile.name + ' \u00b7 ' + profile.class;\n    if (profile) window.dispatchEvent(new CustomEvent('ludaria:profile', { detail: profile }));\n    return result;\n  }\n  async function api(action, data = {}, requestId = uid()) {\n    const result = await rpc({ action, data, requestId, access, expectedRevision: revision });\n    adopt(result);\n    if (action === 'accionRpg' && ['decision', 'easter'].includes(data.type)) {\n      document.dispatchEvent(new CustomEvent('ludaria:confirmed', { detail: { type: data.type === 'easter' ? 'secreto' : 'decision' } }));\n    }\n    return result;\n  }\n  function dialog(title, content) {\n    const d = document.createElement('dialog'); d.className = 'ludaria-cloud-dialog';\n    d.innerHTML = '<h2>' + esc(title) + '</h2>' + content;\n    d.setAttribute('aria-label', title); document.body.append(d);\n    d.addEventListener('close', () => d.remove()); d.showModal(); return d;\n  }\n  function welcome() {\n    const title = guardian?.guardian || 'Tu historia contin\u00faa aqu\u00ed.';\n    const newKey = (label,name) => '<label>'+label+'<input name=\"'+name+'\" type=\"password\" inputmode=\"numeric\" pattern=\"[0-9]{6}\" minlength=\"6\" maxlength=\"6\" autocomplete=\"new-password\" aria-describedby=\"cloud-key-help\" required></label>';\n    const d = dialog(title, ''); d.classList.add('ludaria-welcome');\n    d.innerHTML = '<div class=\"cloud-welcome-grid\"><aside class=\"cloud-guardian\"><div class=\"cloud-portrait\" role=\"img\" aria-label=\"Retrato de '+esc(title)+'\" style=\"background-position:'+(portraitIndex%4/3*100)+'% '+(Math.floor(portraitIndex/4)/3*100)+'%\"></div><div class=\"cloud-guardian-copy\"><span class=\"cloud-eyebrow\">LUDARIA \u00b7 TU AVENTURA CONTIN\u00daA</span><h2>'+esc(title)+'</h2><p>'+esc(guardian?.purpose || 'Tu historia contin\u00faa aqu\u00ed.')+'</p><span class=\"cloud-guardian-seal\" aria-hidden=\"true\">\u2726</span></div></aside><section class=\"cloud-access\"><div class=\"cloud-access-intro\"><span class=\"cloud-eyebrow\">EL UMBRAL DEL BUSCADOR</span><h3>Bienvenido a Ludaria</h3><p>Tu nombre y tu clave abren el mismo personaje en cada misi\u00f3n.</p></div><nav class=\"cloud-access-tabs\" aria-label=\"Opciones de acceso\"><button type=\"button\" data-access-panel=\"login\" aria-pressed=\"true\">Ya tengo personaje</button><button type=\"button\" data-access-panel=\"register\" aria-pressed=\"false\">Crear personaje</button></nav><form id=\"cloud-login\"><label>Nombre de explorador<input name=\"name\" maxlength=\"32\" autocomplete=\"username\" required></label><label>Clave personal<input name=\"key\" type=\"password\" autocomplete=\"current-password\" required></label><button class=\"cloud-primary\" type=\"submit\">Entrar a mi aventura <span aria-hidden=\"true\">\u2192</span></button><button class=\"cloud-text-button\" type=\"button\" data-access-panel=\"recover\">Recuperar clave</button></form><form id=\"cloud-register\" hidden><p id=\"cloud-key-help\">Elige una clave de seis d\u00edgitos que puedas recordar. No uses la contrase\u00f1a de otro servicio.</p><label>Nombre de explorador<input name=\"name\" maxlength=\"32\" autocomplete=\"nickname\" required></label><label>Personaje<select name=\"avatar\"><option value=\"Kira\">Kira</option><option value=\"Kael\">Kael</option></select></label><div class=\"cloud-key-pair\">'+newKey('Elige tu clave personal','key')+newKey('Confirma tu clave','keyConfirm')+'</div><button class=\"cloud-primary\" type=\"submit\">Forjar mi personaje <span aria-hidden=\"true\">\u2726</span></button></form><form id=\"cloud-recover\" hidden><h3>Recuperar clave</h3><p>Usa el c\u00f3digo de recuperaci\u00f3n que guardaste al crear tu personaje y elige una nueva clave de seis d\u00edgitos.</p><label>Nombre de explorador<input name=\"name\" maxlength=\"32\" autocomplete=\"username\" required></label><label>C\u00f3digo de recuperaci\u00f3n<input name=\"recoveryCode\" type=\"password\" maxlength=\"31\" autocomplete=\"off\" placeholder=\"RES-\u2026\" required></label><div class=\"cloud-key-pair\">'+newKey('Nueva clave personal','key')+newKey('Confirma tu nueva clave','keyConfirm')+'</div><button class=\"cloud-primary\" type=\"submit\">Guardar nueva clave</button><details class=\"cloud-recovery-help\"><summary>No tengo mi c\u00f3digo de recuperaci\u00f3n</summary><p>Pide al facilitador que verifique tu identidad y renueve tu acceso. Tu personaje, tus puntos y tu cuaderno se conservan.</p><p>Si creaste tu personaje antes de que existieran estos c\u00f3digos, tambi\u00e9n puedes recuperarlo con su ayuda.</p></details><button class=\"cloud-text-button\" type=\"button\" data-access-panel=\"login\">Volver al acceso</button></form><p role=\"status\" aria-live=\"polite\" id=\"cloud-error\"></p><p class=\"cloud-access-note\">\u2727 Tu bit\u00e1cora conserva las decisiones de tu recorrido.</p></section></div>';\n    d.addEventListener('cancel', event => event.preventDefault());\n    let busy = false, registrationId = uid(), registrationSignature = '', recoveryId = uid(), recoverySignature = '';\n    d.querySelectorAll('[data-access-panel]').forEach(button => button.onclick = () => {\n      const panel = button.dataset.accessPanel;\n      d.classList.toggle('is-recovering',panel === 'recover');\n      d.querySelectorAll('form').forEach(form => { form.hidden = form.id !== 'cloud-'+panel; });\n      d.querySelectorAll('.cloud-access-tabs button').forEach(tab => tab.setAttribute('aria-pressed',String(tab.dataset.accessPanel === panel)));\n      d.querySelector('#cloud-error').textContent = '';\n      d.querySelector('#cloud-'+panel+' input').focus();\n    });\n    d.addEventListener('submit', async event => {\n      event.preventDefault(); if (busy) return;\n      busy = true; d.querySelectorAll('button').forEach(button => { button.disabled = true; });\n      const form = event.target, error = d.querySelector('#cloud-error'); error.textContent = 'Comprobando\u2026';\n      try {\n        let result;\n        if (form.id === 'cloud-login') result = await rpc({ action: 'entrar', data: { name: form.elements.name.value, key: form.elements.key.value } });\n        else if (form.id === 'cloud-register') {\n          const data = { name: form.elements.name.value, class: form.elements.avatar.value, key: form.elements.key.value, keyConfirm: form.elements.keyConfirm.value }, signature = JSON.stringify(data);\n          if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escr\u00edbelas otra vez.');\n          if (registrationSignature && registrationSignature !== signature) registrationId = uid();\n          registrationSignature = signature;\n          result = await rpc({ action: 'registrar', data, requestId: registrationId });\n        } else {\n          const data = { name: form.elements.name.value, recoveryCode: form.elements.recoveryCode.value, key: form.elements.key.value, keyConfirm: form.elements.keyConfirm.value }, signature = JSON.stringify(data);\n          if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escr\u00edbelas otra vez.');\n          if (recoverySignature && recoverySignature !== signature) recoveryId = uid();\n          recoverySignature = signature;\n          result = await rpc({action:'recuperarClave',data,requestId:recoveryId});\n        }\n        identityKey = result.key || form.elements.key.value.trim().toUpperCase();\n        identityBackup = result.recoveryCode || form.elements.recoveryCode?.value.trim().toUpperCase() || '';\n        adopt(result); form.reset(); d.close();\n        if (result.key) keyReceipt(identityKey,identityBackup,{recovered:form.id === 'cloud-recover'}); else finishWelcome();\n      } catch (exception) { error.textContent = exception.message; }\n      finally { busy = false; d.querySelectorAll('button').forEach(button => { button.disabled = false; }); }\n    });\n  }\n  function keyReceipt(key,recoveryCode,{review=false,recovered=false}={}) {\n    const title = review ? 'Mi nombre y mi clave' : recovered ? 'Tu clave est\u00e1 renovada' : 'Tu identidad est\u00e1 forjada';\n    const d = dialog(title, '<p>Entra a cada misi\u00f3n con este mismo nombre y clave personal.</p><label>Nombre de explorador<input readonly id=\"cloud-key-name\"></label><label>Tu clave personal<input type=\"password\" readonly id=\"cloud-key-value\"></label>'+(recoveryCode?'<label>C\u00f3digo de recuperaci\u00f3n<input type=\"password\" readonly id=\"cloud-recovery-value\"></label><p>Guarda tu c\u00f3digo de recuperaci\u00f3n en un lugar privado. Te permite elegir una clave nueva si olvidas la actual.</p>':'<p>Si necesitas recuperar tu clave, usa el c\u00f3digo de recuperaci\u00f3n de tu archivo guardado o pide ayuda al facilitador.</p>')+'<button type=\"button\" id=\"cloud-reveal-key\" aria-pressed=\"false\">Mostrar mis c\u00f3digos</button><div class=\"cloud-actions\"><button id=\"cloud-copy-key\">Copiar clave</button>'+(recoveryCode?'<button id=\"cloud-copy-recovery\">Copiar recuperaci\u00f3n</button>':'')+'<button id=\"cloud-download-key\">Guardar mi acceso TXT</button><button id=\"cloud-continue\">Continuar mi aventura \u2192</button></div><p role=\"status\" id=\"cloud-key-status\"></p>');\n    d.addEventListener('cancel', event => event.preventDefault());\n    d.querySelector('#cloud-key-name').value = profile.name; d.querySelector('#cloud-key-value').value = key;\n    if(recoveryCode)d.querySelector('#cloud-recovery-value').value = recoveryCode;\n    d.querySelector('#cloud-reveal-key').onclick = event => { const show = event.currentTarget.getAttribute('aria-pressed') !== 'true'; d.querySelectorAll('input[type=password],input[data-secret]').forEach(input => {input.dataset.secret='true';input.type=show?'text':'password';});event.currentTarget.setAttribute('aria-pressed',String(show));event.currentTarget.textContent=show?'Ocultar mis c\u00f3digos':'Mostrar mis c\u00f3digos'; };\n    function copyCode(value,selector,message) {return async () => {try {await navigator.clipboard.writeText(value);d.querySelector('#cloud-key-status').textContent=message;}catch {const input=d.querySelector(selector);input.type='text';input.dataset.secret='true';input.focus();input.select();d.querySelector('#cloud-reveal-key').setAttribute('aria-pressed','true');d.querySelector('#cloud-reveal-key').textContent='Ocultar mis c\u00f3digos';d.querySelector('#cloud-key-status').textContent='No se pudo copiar autom\u00e1ticamente. El c\u00f3digo est\u00e1 visible y seleccionado para que lo copies.';}};}\n    d.querySelector('#cloud-copy-key').onclick = copyCode(key,'#cloud-key-value','Clave copiada.');\n    d.querySelector('#cloud-copy-recovery')?.addEventListener('click',copyCode(recoveryCode,'#cloud-recovery-value','C\u00f3digo de recuperaci\u00f3n copiado.'));\n    d.querySelector('#cloud-download-key').onclick = () => {\n      const url = URL.createObjectURL(new Blob(['LUDARIA\\nNombre: ' + profile.name + '\\nClave personal elegida: ' + key + (recoveryCode?'\\nC\u00f3digo de recuperaci\u00f3n: '+recoveryCode:'')+'\\nAcceso personal: no compartir.'], { type: 'text/plain' }));\n      const a = document.createElement('a'); a.href = url; a.download = 'Mi-clave-Ludaria.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);\n      d.querySelector('#cloud-key-status').textContent = 'Descarga solicitada. Comprueba que guardaste el archivo.';\n    };\n    d.querySelector('#cloud-continue').onclick = () => { d.close(); if(!review)finishWelcome(); };\n  }\n  function finishWelcome() { stateText('Tu historia est\u00e1 al d\u00eda'); resolveReady(profile); }\n  async function loadMission() {\n    const result = await api('cargarMision', { mission: config.route }); missionRevision = result.revision; return validateSnapshot(result.snapshot);\n  }\n  function saveMission(snapshot) {\n    pendingSnapshot = JSON.parse(JSON.stringify(snapshot)); stateText('Cuaderno pendiente de guardar');\n    clearTimeout(saveTimer); saveTimer = setTimeout(flushMission, 1200);\n  }\n  function flushMission() {\n    clearTimeout(saveTimer);\n    if (flushTask) return flushTask;\n    if (!failedSave && !pendingSnapshot) return Promise.resolve();\n    flushTask = performSave();\n    return flushTask;\n  }\n  async function performSave() {\n    saving = true;\n    try {\n      while (failedSave || pendingSnapshot) {\n        const job = failedSave || { snapshot: pendingSnapshot, id: uid(), revision: missionRevision };\n        if (!failedSave) pendingSnapshot = null;\n        failedSave = job; stateText('Guardando cuaderno\u2026');\n        const result = await rpc({ action: 'guardarMision', data: { mission: config.route, snapshot: job.snapshot }, requestId: job.id, access, expectedRevision: job.revision });\n        missionRevision = result.revision; failedSave = null;\n      }\n      stateText('Cuaderno confirmado en tu bit\u00e1cora');\n    } catch (error) { stateText('Sin confirmar: ' + error.message); }\n    finally {\n      saving = false;\n      flushTask = null;\n      window.dispatchEvent(new CustomEvent('ludaria:savestatus', { detail: status?.textContent || '' }));\n    }\n  }\n  async function advantage() { if(window.LudariaRPGUI){window.LudariaRPGUI.open();return;}\n    try { const result = await api('ventaja', { id: 'ojo_artesano' }); dialog('Ojo del Artesano \u00b7 Maestr\u00eda 5', '<p>' + esc(result.text) + '</p><button onclick=\"this.closest(\\'dialog\\').close()\">Continuar mi pr\u00e1ctica</button>'); }\n    catch (error) { stateText(error.message); }\n  }\n  window.LudariaCloud = { active: true, ready, api, openAccess: welcome,\n    async registerCharacter(data, requestId) {\n      if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escr\u00edbelas otra vez.');\n      const result = await rpc({action: 'registrar', data, requestId});\n      identityKey = result.key || data.key; identityBackup = result.recoveryCode || '';\n      adopt(result); keyReceipt(identityKey, identityBackup); return result;\n    },\n    notify: stateText, loadMission, saveMission, flushMission,\n    get profile() { return profile; }, get hasPending() { return hasPending(); },\n    registerPendingCheck(check) { pendingChecks.add(check); return () => pendingChecks.delete(check); },\n    logout() { if (!hasPending() || confirm('Hay un cuaderno o ensayo sin confirmar. Copia o guarda tus notas antes de salir. \u00bfCerrar el acceso?')) { access = null; identityKey = ''; identityBackup = ''; location.reload(); } }\n  };\n  window.addEventListener('beforeunload', event => { if (hasPending()) { event.preventDefault(); event.returnValue = ''; } });\n  document.addEventListener('DOMContentLoaded', () => {\n    const style = document.createElement('style');\n    style.textContent = '.ludaria-cloud-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:#102018;color:#f2ebdd;padding:10px 16px;border-bottom:1px solid #c9a66b;position:relative;z-index:30;font:14px system-ui}.ludaria-cloud-bar [data-cloud-identity]{min-width:0;max-width:100%;overflow-wrap:anywhere}.ludaria-cloud-bar [data-cloud-status]{flex:1;min-width:160px}.ludaria-cloud-bar button,.ludaria-cloud-dialog button{border:1px solid #59c36a;background:#163e2a;color:#f2ebdd;border-radius:8px;padding:10px 14px;cursor:pointer;font:inherit}.ludaria-cloud-dialog{box-sizing:border-box;max-width:560px;width:calc(100% - 32px);max-height:90vh;overflow:auto;background:#102018;color:#f2ebdd;border:1px solid #c9a66b;padding:28px;border-radius:18px;font:16px/1.5 system-ui}.ludaria-cloud-dialog::backdrop{background:#07120dee}.ludaria-cloud-dialog h2{font:28px Georgia;color:#c9a66b;margin:0 0 12px}.ludaria-cloud-dialog p{margin:12px 0}.ludaria-cloud-dialog label{display:block;margin:12px 0}.ludaria-cloud-dialog input,.ludaria-cloud-dialog select{display:block;width:100%;box-sizing:border-box;padding:12px;margin-top:5px;border:1px solid #53735d;border-radius:8px;background:#07120d;color:#f2ebdd;font:inherit}.ludaria-cloud-dialog summary{cursor:pointer;padding:16px 0;color:#8ed89a}.cloud-actions{display:flex;flex-wrap:wrap;gap:10px}.ludaria-cloud-dialog button:disabled{opacity:.5}.ludaria-cloud-bar button:focus-visible,.ludaria-cloud-dialog :focus-visible{outline:3px solid #c9a66b;outline-offset:3px}';\n    style.textContent += `\n      .ludaria-cloud-dialog [hidden]{display:none!important}\n      .ludaria-welcome{max-width:920px;padding:0;border-color:#6b7650;border-radius:22px;box-shadow:0 30px 100px #0009}\n      .ludaria-welcome::backdrop{background:radial-gradient(ellipse at top,#142d22ee,#030d08f5);backdrop-filter:blur(5px)}\n      .cloud-welcome-grid{display:grid;grid-template-columns:36% 64%;min-height:540px}\n      .cloud-guardian{background:linear-gradient(150deg,#204634,#0a2116);border-right:1px solid #b6965438;overflow:hidden;position:relative}\n      .cloud-portrait{aspect-ratio:1;width:100%;background-image:url('https://nespinozagonzalez-hub.github.io/misiones/ludaria/assets/guardianes-v1.webp');background-size:400% 400%;background-repeat:no-repeat}\n      .cloud-guardian-copy{padding:25px 24px 20px;position:relative;background:linear-gradient(#122e20,#0b2217)}\n      .cloud-eyebrow{font:10px/1.6 system-ui;letter-spacing:1.8px;color:#c7ad6e;display:block}\n      .ludaria-welcome .cloud-guardian h2{font:28px/1.13 Georgia;margin:12px 0;color:#f0dfac}\n      .cloud-guardian-copy p{color:#ced9c7;font-size:14px;line-height:1.6}\n      .cloud-guardian-seal{display:block;color:#c6a75e;font-size:28px;margin-top:18px}\n      .cloud-access{padding:32px;background:radial-gradient(ellipse at top right,#213c2860,transparent 60%),#102018}\n      .cloud-access h3{font:28px/1.15 Georgia;color:#f0e4c5;margin:10px 0 12px}\n      .cloud-access-intro p{color:#bfcdbb;font-size:14px;margin:10px 0 22px}\n      .ludaria-welcome.is-recovering .cloud-access-intro{display:none}\n      .cloud-access-tabs{display:flex;gap:6px;border:1px solid #4d664238;border-radius:10px;background:#07160e;padding:4px;margin-bottom:20px}\n      .cloud-access-tabs button{flex:1;font-size:13px;background:transparent;border-color:transparent;padding:10px 5px;color:#acbba6}\n      .cloud-access-tabs button[aria-pressed=true]{background:#284b33;color:#f2ebd8;border-color:#627347}\n      .cloud-access label{font-size:13px;color:#ced7c5;margin:14px 0}\n      .cloud-access input,.cloud-access select{font-size:16px;background:#09170e;border-color:#3d5d43;padding:12px;border-radius:9px}\n      .cloud-access .cloud-primary{width:100%;background:linear-gradient(130deg,#bd9c51,#dfbf72);border-color:#e2c275;color:#162218;font-weight:700;margin-top:9px;display:flex;align-items:center;justify-content:center;gap:15px;min-height:46px}\n      .cloud-access .cloud-text-button{display:block;border:0;background:none;color:#cdbc86;text-decoration:underline;text-underline-offset:4px;padding:12px 0;font-size:13px}\n      .cloud-access-note{font:12px/1.6 system-ui;color:#7f997d;border-top:1px solid #6b765034;padding-top:15px;margin-top:20px!important}\n      .cloud-key-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}\n      .cloud-key-pair label,.cloud-key-pair input{min-width:0}\n      #cloud-key-help,#cloud-recover>p,.cloud-recovery-help p{font-size:13px;color:#b7c8ac}\n      .cloud-recovery-help summary{font-size:13px;padding:14px 0;color:#cdbc86}\n      #cloud-error:not(:empty){font-size:13px;color:#f1c481;padding:10px;background:#372c1760;border-radius:8px}\n      @media(max-width:620px){.ludaria-welcome{width:calc(100% - 20px);max-height:calc(100dvh - 20px);border-radius:16px}.cloud-welcome-grid{display:block;min-height:0}.cloud-guardian{display:flex;align-items:center;border-right:0;border-bottom:1px solid #b6965438;padding:16px;gap:16px}.cloud-portrait{width:94px;flex:0 0 94px;border:1px solid #b69654;border-radius:50%}.cloud-guardian-copy{padding:0;background:none}.cloud-guardian-copy p,.cloud-guardian-seal{display:none}.ludaria-welcome .cloud-guardian h2{font-size:23px;margin:7px 0}.cloud-guardian .cloud-eyebrow{font-size:8px;letter-spacing:1px}.cloud-access{padding:22px}.cloud-access h3{font-size:26px}.cloud-key-pair{gap:10px}}\n      @media(prefers-reduced-motion:reduce){.ludaria-welcome::backdrop{backdrop-filter:none}}\n    `;\n    document.head.append(style);\n    bar = document.createElement('div'); bar.className = 'ludaria-cloud-bar';\n    bar.innerHTML = '<strong data-cloud-identity>Ludaria</strong><span data-cloud-status role=\"status\">Identificaci\u00f3n central</span><button data-cloud-refresh>Actualizar perfil</button>' + (config.route !== 'forja' && config.route !== 'mision-0' ? '<button data-cloud-save>Guardar cuaderno</button>' : '<button data-cloud-access>Mi nombre y mi clave</button>') + '<button data-cloud-advantage>'+ (config.route==='forja'?'Examinar el sello de la Forja':'Ayudas del guardi\u00e1n')+'</button><button data-cloud-logout>Cerrar acceso</button>';\n    document.body.prepend(bar); status = bar.querySelector('[data-cloud-status]');\n    bar.querySelector('[data-cloud-refresh]').onclick = async () => {\n      const button = bar.querySelector('[data-cloud-refresh]');\n      if (button.disabled) return;\n      button.disabled = true;\n      try {\n        await api('cargar');\n        // Consultar atributos no confirma el cuaderno ni los ensayos pendientes.\n        if (!hasPending()) stateText('Perfil actualizado \u00b7 tu historia est\u00e1 al d\u00eda');\n      } catch (error) {\n        const draftStatus = status.textContent;\n        stateText('No se pudo actualizar el perfil: ' + error.message +\n          (hasPending() ? ' \u00b7 ' + draftStatus : ''));\n      } finally { button.disabled = false; }\n    };\n    bar.querySelector('[data-cloud-save]')?.addEventListener('click', flushMission);\n    bar.querySelector('[data-cloud-access]')?.addEventListener('click',() => {if(profile&&identityKey)keyReceipt(identityKey,identityBackup,{review:true});});\n    bar.querySelector('[data-cloud-advantage]')?.addEventListener('click', advantage);\n    bar.querySelector('[data-cloud-logout]').onclick = window.LudariaCloud.logout;\n    if (config.route === 'forja' && !config.market && document.getElementById('create-form')) {\n      bar.hidden = true; ready.then(() => { bar.hidden = false; });\n    } else welcome();\n  });\n})();\n";
