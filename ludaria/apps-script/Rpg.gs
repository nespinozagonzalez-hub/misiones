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
  const decisions=filas_(ss,'Aventuras').filter(function(r){return r[2]===id&&r[3]===perk.mission&&r[4]===perk.id&&r[5]==='ACCION_RPG';});
  const last=decisions.length?decisions[decisions.length-1]:null;
  const responses={},responseRevisions={};
  if(last){responses[perk.id]=JSON.parse(last[6]).detail;responseRevisions[perk.id]=last[0];}
  registrarEventoRpg_(ss,id,request,'CONSULTA_VENTAJA',perk.mission,perk.id,{kind:perk.kind});
  return {ok:true,text:perk.text,perk:perk,catalog:{responses:responses,responseRevisions:responseRevisions}};
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
