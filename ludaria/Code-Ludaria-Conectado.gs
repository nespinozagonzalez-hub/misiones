/** LUDARIA v0.2.0. Sustituye Código.gs en el MISMO proyecto del paso 1.
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
  return Number.isInteger(skills.maestria) && skills.maestria >= 5 ? [{
    id: 'ojo_artesano', attribute: 'maestria', minimum: 5, mission: 'vetas-diseno',
    name: 'Ojo del Artesano', integration: 'PILOTO'
  }] : [];
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


/** LUDARIA · Conexión central v0.2.0. Funciones privadas conservan el sufijo _. */
const LUDARIA_WEB = Object.freeze({
  pages: 'https://nespinozagonzalez-hub.github.io/misiones/',
  raw: 'https://raw.githubusercontent.com/nespinozagonzalez-hub/misiones/main/',
  routes: ['forja', 'vetas-diseno'],
  maxCharacters: 300,
  sessionMs: 4 * 60 * 60 * 1000
});

/** Ejecutar desde el editor con la cuenta propietaria, antes de implementar. */
function prepararConexionLudaria() {
  const active = Session.getActiveUser().getEmail();
  const effective = Session.getEffectiveUser().getEmail();
  if (!active || active !== effective || !SpreadsheetApp.getActiveSpreadsheet()) {
    throw new Error('Ejecuta esta preparación desde el editor, con la cuenta propietaria.');
  }
  instalarLudaria_();
  const props = PropertiesService.getScriptProperties();
  props.setProperty('LUDARIA_WEB_ENABLED', 'true');
  // Autoriza UrlFetch al ejecutar en el editor. No se descargan datos de participantes.
  const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + 'forja/index.html');
  if (response.getResponseCode() !== 200) throw new Error('No se pudo comprobar la interfaz de Forja.');
  console.log('Conexión preparada. Implementa como aplicación web, ejecutada como propietario. La planilla sigue privada.');
  return { ok: true, version: '0.2.0' };
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
  const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + route + '/index.html');
  if (response.getResponseCode() !== 200) throw new Error('No se pudo cargar la presentación.');
  const entry = params.entrada === 'mochi';
  let html = response.getContentText();
  html = html.replace(/<base\b[^>]*>/gi, '');
  const config = JSON.stringify({ route: route, market: entry }).replace(/</g, '\\u003c');
  const insertion = '<base href="' + LUDARIA_WEB.pages + route + '/" target="_self">' +
    '<script>window.LUDARIA_CLOUD_CONFIG=' + config + ';window.FORJA_ENTRY=' + entry + ';</script>' +
    '<script>' + LUDARIA_CLIENT_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>';
  html = html.replace(/<head[^>]*>/i, function (head) { return head + insertion; });
  return HtmlService.createHtmlOutput(html).setTitle('Ludaria · ' + (entry ? 'Mercadito de Mochi' : route === 'forja' ? 'Forja del Buscador' : 'Las Vetas del Diseño'))
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
      if (request.action === 'ventaja') return consultarVentaja_(ss, id, request);
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
      const p = perfilActual_(ss, id), before = p.points;
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
        JSON.stringify({ signature: signature, detail: detail, before: before, after: p.points, data: data }), JSON.stringify(p)]);
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
  const hex = firma_('alta|' + request.requestId + '|' + alias + '|' + data.class).slice(0, 24).toUpperCase();
  const key = 'LUD-' + hex.match(/.{6}/g).join('-');
  const existing = buscarPersonaje_(ss, alias);
  if (existing) {
    if (!iguales_(firma_(existing[0] + '|' + existing[4] + '|' + key), existing[5])) throw new Error('Ese nombre ya está registrado. Entra con tu clave o elige otro nombre.');
    asegurarCreacion_(ss, existing);
    const response = respuestaPerfil_(ss, existing[0], tokenSesion_(existing[0])); response.key = key; return response;
  }
  if (filas_(ss, 'Personajes').length >= LUDARIA_WEB.maxCharacters) throw new Error('Registro completo. Contacta al facilitador.');
  const record = crearPersonaje_(ss, data.name, key, data.class, 'PARTICIPANTE');
  actualizarVistas_(ss, record, perfilActual_(ss, record[0]));
  const response = respuestaPerfil_(ss, record[0], tokenSesion_(record[0])); response.key = key; return response;
}
function tokenSesion_(id) {
  const value = id + '.' + (Date.now() + LUDARIA_WEB.sessionMs) + '.' + Utilities.getUuid();
  return value + '.' + firma_('sesion|' + value);
}
function validarSesion_(token) {
  if (typeof token !== 'string' || token.length > 250) throw new Error('Identifícate con tu nombre y clave.');
  const parts = token.split('.'), value = parts.slice(0, 3).join('.');
  if (parts.length !== 4 || !iguales_(firma_('sesion|' + value), parts[3]) || !/^\d+$/.test(parts[1]) || Number(parts[1]) <= Date.now()) throw new Error('Tu sesión terminó. Vuelve a entrar con tu nombre y clave.');
  return parts[0];
}
function cantidades_(raw, min, max) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || Object.keys(raw).some(function (k) { return !LUDARIA.attributes.includes(k); })) throw new Error('Atributos inválidos.');
  const result = {};
  LUDARIA.attributes.forEach(function (key) { if (!Number.isInteger(raw[key]) || raw[key] < min || raw[key] > max) throw new Error('Cantidad inválida en ' + key + '.'); result[key] = raw[key]; });
  return result;
}
function respuestaPerfil_(ss, id, access) {
  const p = perfilActual_(ss, id), moves = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
  p.history = moves.slice(-1000).map(function (r) { const d = JSON.parse(r[4]); return { id: r[0], at: r[1], type: String(r[3]).toLowerCase(), detail: d.detail || 'Creación del personaje', before: d.before || 0, after: d.after || 0, cost: (d.before || 0) - (d.after || 0) }; });
  const result = { ok: true, profile: p, revision: moves[moves.length - 1][0], advantages: ventajasDisponibles_(p.skills) };
  if (access) result.access = access;
  return result;
}
function validarMision_(mission) { if (mission !== 'vetas-diseno') throw new Error('Esta misión aún no está conectada.'); }
function guardarMision_(ss, id, request) {
  const data = request.data; validarMision_(data.mission); validarSolicitud_(request.requestId);
  if (!data.snapshot || typeof data.snapshot !== 'object' || Array.isArray(data.snapshot) || JSON.stringify(data.snapshot).length > 40000) throw new Error('Borrador inválido o demasiado extenso.');
  const events = filas_(ss, 'Aventuras').filter(function (r) { return r[2] === id && r[3] === data.mission && r[5] === 'BORRADOR'; });
  const signature = firma_(JSON.stringify(data.snapshot));
  const repeated = events.find(function (r) { return r[0] === request.requestId; });
  if (repeated) { if (JSON.parse(repeated[6]).signature !== signature) throw new Error('Reintento distinto del original.'); return { ok: true, revision: repeated[0] }; }
  const revision = events.length ? events[events.length-1][0] : null;
  if (request.expectedRevision !== revision) throw new Error('El cuaderno cambió en otra sesión. Copia tu borrador y recarga antes de guardar.');
  ss.getSheetByName('Aventuras').appendRow([request.requestId, new Date().toISOString(), id, data.mission, '', 'BORRADOR', JSON.stringify({ signature: signature, snapshot: data.snapshot })]);
  return { ok: true, revision: request.requestId };
}
function consultarVentaja_(ss, id, request) {
  validarSolicitud_(request.requestId);
  if (request.data.id !== 'ojo_artesano' || !ventajasDisponibles_(perfilActual_(ss, id).skills).length) throw new Error('Ojo del Artesano requiere Maestría 5 actual.');
  const repeated = filas_(ss, 'Aventuras').some(function (r) { return r[0] === request.requestId && r[2] === id && r[5] === 'CONSULTA_VENTAJA'; });
  if (!repeated) ss.getSheetByName('Aventuras').appendRow([request.requestId, new Date().toISOString(), id, 'vetas-diseno', 'ojo_artesano', 'CONSULTA_VENTAJA', '{}']);
  return { ok: true, text: 'Dinámicas: experiencia global y relaciones. Mecánicas: reglas y procesos que hacen actuar. Componentes: representaciones concretas. Identifica la unidad de análisis y justifica según el contexto. Esta pauta no resuelve la actividad ni cambia su evaluación.' };
}


const LUDARIA_CLIENT_SOURCE = "(() => {\n  'use strict';\n  const config = window.LUDARIA_CLOUD_CONFIG;\n  if (!config) return;\n  let access = null, profile = null, revision = null, missionRevision = null;\n  let resolveReady, bar, status, pendingSnapshot = null, saving = false, failedSave = null, saveTimer;\n  const ready = new Promise(resolve => { resolveReady = resolve; });\n  const uid = () => crypto.randomUUID();\n  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\n  const stateText = text => { if (status) status.textContent = text; };\n  function rpc(request) {\n    return new Promise((resolve, reject) => {\n      let settled = false;\n      const timer = setTimeout(() => { settled = true; reject(Error('La confirmaci\u00f3n est\u00e1 tardando. Reintenta para comprobarla.')); }, 30000);\n      const finish = (ok, result) => { if (settled) return; settled = true; clearTimeout(timer); ok ? resolve(result) : reject(Error(result?.message || 'No se pudo confirmar.')); };\n      google.script.run.withSuccessHandler(result => finish(Boolean(result?.ok), result))\n        .withFailureHandler(error => finish(false, error)).ludariaApi(request);\n    });\n  }\n  function adopt(result) {\n    if (result.access) access = result.access;\n    if (result.profile) { profile = result.profile; revision = result.revision; }\n    if (bar && profile) bar.querySelector('[data-cloud-identity]').textContent = profile.name + ' \u00b7 ' + profile.class;\n    if (profile) window.dispatchEvent(new CustomEvent('ludaria:profile', { detail: profile }));\n    return result;\n  }\n  async function api(action, data = {}, requestId = uid()) {\n    const result = await rpc({ action, data, requestId, access, expectedRevision: revision });\n    return adopt(result);\n  }\n  function dialog(title, content) {\n    const d = document.createElement('dialog'); d.className = 'ludaria-cloud-dialog';\n    d.innerHTML = '<h2>' + esc(title) + '</h2>' + content;\n    d.setAttribute('aria-label', title); document.body.append(d);\n    d.addEventListener('close', () => d.remove()); d.showModal(); return d;\n  }\n  function welcome() {\n    const d = dialog('Tu historia contin\u00faa aqu\u00ed.', '<p>Identif\u00edcate con el mismo nombre de explorador y clave en cada misi\u00f3n.</p>' +\n      '<form id=\"cloud-login\"><label>Nombre de explorador<input name=\"name\" maxlength=\"32\" autocomplete=\"username\" required></label><label>Clave personal<input name=\"key\" type=\"password\" autocomplete=\"current-password\" required></label><button type=\"submit\">Recuperar mi personaje</button></form>' +\n      '<details><summary>Voy a crear mi personaje</summary><p>Elige un nombre propio para tu aventura. Recibir\u00e1s una clave personal para recuperarla.</p><form id=\"cloud-register\"><label>Nombre de explorador<input name=\"name\" maxlength=\"32\" autocomplete=\"nickname\" required></label><label>Personaje<select name=\"avatar\"><option value=\"Kira\">Kira</option><option value=\"Kael\">Kael</option></select></label><button type=\"submit\">Crear mi personaje</button></form></details><p role=\"status\" id=\"cloud-error\"></p>');\n    d.addEventListener('cancel', event => event.preventDefault());\n    let busy = false, registrationId = uid(), registrationSignature = '';\n    d.addEventListener('submit', async event => {\n      event.preventDefault(); if (busy) return;\n      busy = true; d.querySelectorAll('button').forEach(button => { button.disabled = true; });\n      const form = event.target, error = d.querySelector('#cloud-error'); error.textContent = 'Comprobando\u2026';\n      try {\n        let result;\n        if (form.id === 'cloud-login') result = await rpc({ action: 'entrar', data: { name: form.elements.name.value, key: form.elements.key.value } });\n        else {\n          const data = { name: form.elements.name.value, class: form.elements.avatar.value }, signature = JSON.stringify(data);\n          if (registrationSignature && registrationSignature !== signature) registrationId = uid();\n          registrationSignature = signature;\n          result = await rpc({ action: 'registrar', data, requestId: registrationId });\n        }\n        adopt(result); form.reset(); d.close();\n        if (result.key) keyReceipt(result.key); else finishWelcome();\n      } catch (exception) { error.textContent = exception.message; }\n      finally { busy = false; d.querySelectorAll('button').forEach(button => { button.disabled = false; }); }\n    });\n  }\n  function keyReceipt(key) {\n    const d = dialog('Tu clave de Ludaria.', '<p>Tu personaje ya est\u00e1 registrado. Guarda esta clave: la usar\u00e1s junto a tu nombre para entrar desde cualquier misi\u00f3n o dispositivo.</p><label>Nombre de explorador<input readonly id=\"cloud-key-name\"></label><label>Clave personal<input readonly id=\"cloud-key-value\"></label><p>La clave es personal. Evita compartirla.</p><div class=\"cloud-actions\"><button id=\"cloud-copy-key\">Copiar clave</button><button id=\"cloud-download-key\">Guardar clave TXT</button><button id=\"cloud-continue\">Ya la guard\u00e9 \u00b7 continuar</button></div><p role=\"status\" id=\"cloud-key-status\"></p>');\n    d.addEventListener('cancel', event => event.preventDefault());\n    d.querySelector('#cloud-key-name').value = profile.name; d.querySelector('#cloud-key-value').value = key;\n    d.querySelector('#cloud-copy-key').onclick = async () => { try { await navigator.clipboard.writeText(key); d.querySelector('#cloud-key-status').textContent = 'Clave copiada.'; } catch { d.querySelector('#cloud-key-value').select(); d.querySelector('#cloud-key-status').textContent = 'Selecciona y copia la clave.'; } };\n    d.querySelector('#cloud-download-key').onclick = () => {\n      const url = URL.createObjectURL(new Blob(['LUDARIA\\nNombre: ' + profile.name + '\\nClave: ' + key + '\\nClave personal: no compartir.'], { type: 'text/plain' }));\n      const a = document.createElement('a'); a.href = url; a.download = 'Mi-clave-Ludaria.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);\n      d.querySelector('#cloud-key-status').textContent = 'Descarga solicitada. Comprueba que guardaste el archivo.';\n    };\n    d.querySelector('#cloud-continue').onclick = () => { d.close(); finishWelcome(); };\n  }\n  function finishWelcome() { stateText('Perfil recuperado desde Sheets'); resolveReady(profile); }\n  async function loadMission() {\n    const result = await api('cargarMision', { mission: config.route }); missionRevision = result.revision; return result.snapshot;\n  }\n  function saveMission(snapshot) {\n    pendingSnapshot = JSON.parse(JSON.stringify(snapshot)); stateText('Cuaderno pendiente de guardar');\n    clearTimeout(saveTimer); saveTimer = setTimeout(flushMission, 1200);\n  }\n  async function flushMission() {\n    clearTimeout(saveTimer); if (saving) return;\n    saving = true;\n    try {\n      while (failedSave || pendingSnapshot) {\n        const job = failedSave || { snapshot: pendingSnapshot, id: uid(), revision: missionRevision };\n        if (!failedSave) pendingSnapshot = null;\n        failedSave = job; stateText('Guardando cuaderno\u2026');\n        const result = await rpc({ action: 'guardarMision', data: { mission: config.route, snapshot: job.snapshot }, requestId: job.id, access, expectedRevision: job.revision });\n        missionRevision = result.revision; failedSave = null;\n      }\n      stateText('Cuaderno confirmado en Sheets');\n    } catch (error) { stateText('Sin confirmar: ' + error.message); }\n    finally { saving = false; }\n  }\n  async function advantage() {\n    try { const result = await api('ventaja', { id: 'ojo_artesano' }); dialog('Ojo del Artesano \u00b7 Maestr\u00eda 5', '<p>' + esc(result.text) + '</p><button onclick=\"this.closest(\\'dialog\\').close()\">Continuar mi pr\u00e1ctica</button>'); }\n    catch (error) { stateText(error.message); }\n  }\n  window.LudariaCloud = { active: true, ready, api, loadMission, saveMission, flushMission,\n    get profile() { return profile; }, get hasPending() { return Boolean(pendingSnapshot || failedSave || saving); },\n    logout() { if ((!pendingSnapshot && !failedSave && !saving) || confirm('Hay un cuaderno sin confirmar. Copia o guarda tus notas antes de salir. \u00bfCerrar el acceso?')) { access = null; location.reload(); } }\n  };\n  window.addEventListener('beforeunload', event => { if (pendingSnapshot || failedSave || saving) { event.preventDefault(); event.returnValue = ''; } });\n  document.addEventListener('DOMContentLoaded', () => {\n    const style = document.createElement('style');\n    style.textContent = '.ludaria-cloud-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:#102018;color:#f2ebdd;padding:10px 16px;border-bottom:1px solid #c9a66b;position:relative;z-index:30;font:14px system-ui}.ludaria-cloud-bar [data-cloud-status]{flex:1;min-width:160px}.ludaria-cloud-bar button,.ludaria-cloud-dialog button{border:1px solid #59c36a;background:#163e2a;color:#f2ebdd;border-radius:8px;padding:10px 14px;cursor:pointer;font:inherit}.ludaria-cloud-dialog{max-width:560px;width:calc(100% - 32px);max-height:90vh;overflow:auto;background:#102018;color:#f2ebdd;border:1px solid #c9a66b;padding:28px;border-radius:18px;font:16px/1.5 system-ui}.ludaria-cloud-dialog::backdrop{background:#07120dee}.ludaria-cloud-dialog h2{font:28px Georgia;color:#c9a66b;margin:0 0 12px}.ludaria-cloud-dialog p{margin:12px 0}.ludaria-cloud-dialog label{display:block;margin:12px 0}.ludaria-cloud-dialog input,.ludaria-cloud-dialog select{display:block;width:100%;box-sizing:border-box;padding:12px;margin-top:5px;border:1px solid #53735d;border-radius:8px;background:#07120d;color:#f2ebdd;font:inherit}.ludaria-cloud-dialog summary{cursor:pointer;padding:16px 0;color:#8ed89a}.cloud-actions{display:flex;flex-wrap:wrap;gap:10px}.ludaria-cloud-dialog button:disabled{opacity:.5}.ludaria-cloud-bar button:focus-visible,.ludaria-cloud-dialog :focus-visible{outline:3px solid #c9a66b;outline-offset:3px}';\n    document.head.append(style);\n    bar = document.createElement('div'); bar.className = 'ludaria-cloud-bar';\n    bar.innerHTML = '<strong data-cloud-identity>Ludaria</strong><span data-cloud-status role=\"status\">Identificaci\u00f3n central</span><button data-cloud-refresh>Actualizar perfil</button>' + (config.route !== 'forja' ? '<button data-cloud-save>Guardar cuaderno</button><button data-cloud-advantage>Ojo del Artesano \u00b7 Maestr\u00eda 5</button>' : '') + '<button data-cloud-logout>Cerrar acceso</button>';\n    document.body.prepend(bar); status = bar.querySelector('[data-cloud-status]');\n    bar.querySelector('[data-cloud-refresh]').onclick = async () => { try { await api('cargar'); stateText('Perfil actualizado desde Sheets'); } catch (error) { stateText(error.message); } };\n    bar.querySelector('[data-cloud-save]')?.addEventListener('click', flushMission);\n    bar.querySelector('[data-cloud-advantage]')?.addEventListener('click', advantage);\n    bar.querySelector('[data-cloud-logout]').onclick = window.LudariaCloud.logout;\n    welcome();\n  });\n})();\n";
