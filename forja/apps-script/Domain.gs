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
