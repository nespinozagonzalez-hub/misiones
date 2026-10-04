/** Ludaria · registro privado. Vincular a una hoja nueva, ejecutar setupForja. */
const HEADERS_FORJA={
 Personajes:['ID','Nombre','Personaje','Hash de acceso','Creado'],
 Movimientos:['Solicitud','Fecha','ID','Acción','Detalle','Coste','Saldo anterior','Saldo posterior','XP','Atributos JSON','Perfil JSON'],
 Panel:['ID','Nombre','Personaje','Nivel','XP','Saldo','Sabiduría','Maestría','Creación','Evaluación','Camaradería','Runas','Compras','Actualizado'],
 Migraciones:['Solicitud','Fecha','ID','Perfil antiguo JSON','Estado'],
 Catalogo:['Atributo','Objeto','Precio','Mejora','Máximo']
};
function setupForja_(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw Error('Abre este script desde Extensiones > Apps Script de tu hoja.');
 PropertiesService.getScriptProperties().setProperty('FORJA_SHEET_ID',ss.getId());
 Object.keys(HEADERS_FORJA).forEach(name=>{const s=ss.getSheetByName(name)||ss.insertSheet(name);if(!s.getLastRow()){s.appendRow(HEADERS_FORJA[name]);s.setFrozenRows(1);s.getRange(1,1,1,HEADERS_FORJA[name].length).setBackground('#163e2a').setFontColor('#ffffff').setFontWeight('bold');s.autoResizeColumns(1,HEADERS_FORJA[name].length);}});
 const cat=ss.getSheetByName('Catalogo');if(cat.getLastRow()===1)cat.getRange(2,1,5,5).setValues(LudariaCore.SKS.map((s,i)=>[s.key,['Pergamino del Saber','Herramienta del Artesano','Chispa Creativa','Cristal del Espejo','Lazo de Compañerismo'][i],1,1,10]));
 return 'Forja preparada. Implementa ahora como aplicación web.';
}
function doGet(e){const t=HtmlService.createTemplateFromFile('Forja');t.mochi=e&&e.parameter&&e.parameter.entrada==='mochi';t.cloudUrl=ScriptApp.getService().getUrl();return t.evaluate().setTitle('La Forja del Buscador · Ludaria').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);}
function db_(){const id=PropertiesService.getScriptProperties().getProperty('FORJA_SHEET_ID');if(!id)throw Error('El facilitador debe ejecutar setupForja.');return SpreadsheetApp.openById(id);}
function rows_(ss,n){return ss.getSheetByName(n).getDataRange().getValues().slice(1);}
function safe_(s){s=String(s);return /^[=+@-]/.test(s)?"'"+s:s;}
function digest_(a){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,a.id+'|'+a.key,Utilities.Charset.UTF_8).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');}
function access_(a){if(!a||typeof a.id!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(a.id)||typeof a.key!=='string'||!/^[a-zA-Z0-9-]{32,128}$/.test(a.key))throw Error('Acceso inválido. Importa tu copia privada.');return digest_(a);}
function state_(mov,id){const a=mov.filter(r=>r[2]===id);if(!a.length)return null;const p=JSON.parse(a[a.length-1][10]);p.pending=LudariaCore.freshStats(0);p.history=a.slice(-100).map(r=>({id:r[0],at:r[1],type:r[3],detail:r[4],cost:r[5],before:r[6],after:r[7]}));return p;}
function append_(ss,id,req,action,detail,before,p){const at=new Date().toISOString(),copy=JSON.parse(JSON.stringify(p));delete copy.history;ss.getSheetByName('Movimientos').appendRow([req,at,id,action,safe_(detail),before-p.points,before,p.points,p.xp,JSON.stringify(p.skills),JSON.stringify(copy)]);try{panel_(ss,id,p,at);}catch(e){console.warn('Panel pendiente de reconstrucción: '+e.message);}}
function panel_(ss,id,p,at){const s=ss.getSheetByName('Panel'),all=rows_(ss,'Panel'),i=all.findIndex(r=>r[0]===id),buys=rows_(ss,'Movimientos').filter(r=>r[2]===id&&r[3]==='compra').length;s.getRange(i<0?s.getLastRow()+1:i+2,1,1,14).setValues([[id,safe_(p.name),p.class,p.level,p.xp,p.points,...LudariaCore.SKS.map(x=>p.skills[x.key]),p.codes.length,buys,at]]);}
function forjaApi(req){
 const lock=LockService.getScriptLock();let locked=false;
 try{
  if(!req||typeof req!=='object'||!['crear','cargar','runa','compra','talento','migracion'].includes(req.action))throw Error('Operación desconocida.');
  const hash=access_(req.access),id=req.access.id,data=req.data||{},requestId=req.requestId;
  if(typeof requestId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(requestId))throw Error('Solicitud inválida.');
  locked=lock.tryLock(5000);if(!locked)throw Error('Otra operación está en curso. Espera y vuelve a confirmar.');
  const ss=db_(),people=rows_(ss,'Personajes'),person=people.find(r=>r[0]===id),mov=rows_(ss,'Movimientos');
  if(person&&person[3]!==hash)throw Error('No pudimos verificar tu acceso.');
  if(!person&&req.action!=='crear')throw Error('Este acceso no está registrado.');
  let p=state_(mov,id);
  if(req.action==='crear'){
   if(p)return {ok:true,profile:p};
   if(typeof data.name!=='string'||!data.name.trim()||data.name.trim().length>32||!['Kael','Kira'].includes(data.class))throw Error('Revisa el nombre y el personaje.');
   p=LudariaCore.defP(data.name.trim(),data.class);
   if(!person)ss.getSheetByName('Personajes').appendRow([id,safe_(p.name),p.class,hash,new Date().toISOString()]);
   append_(ss,id,requestId,'crear','Comienzo del viaje',0,p);
  }else{
   if(!p)throw Error('El registro está incompleto. Reintenta crear con el mismo acceso.');
   if(req.action==='cargar')return {ok:true,profile:p};
   if(mov.some(r=>r[0]===requestId&&r[2]===id))return {ok:true,profile:p,repeated:true};
   const before=p.points;
   if(req.action==='runa'){const r=LudariaCore.redeem(p,data.code);append_(ss,id,requestId,'runa','Runa '+r.code+' · '+r.md.n,before,p);}
   if(req.action==='compra'){
    const q=data.quantities,keys=LudariaCore.SKS.map(s=>s.key);
    if(!q||Array.isArray(q)||Object.keys(q).length!==5||keys.some(k=>!Number.isInteger(q[k])||q[k]<0||q[k]>9))throw Error('Cantidades inválidas.');
    p.pending=Object.assign({},q);const n=LudariaCore.confirmSpend(p);
    append_(ss,id,requestId,'compra',keys.filter(k=>q[k]).map(k=>k+' +'+q[k]).join(' · '),before,p);
   }
   if(req.action==='talento'){if(!Number.isInteger(data.tier)||!LudariaCore.unlock(p,data.key,data.tier))throw Error('Este talento no está disponible.');append_(ss,id,requestId,'talento','Talento '+data.key+' '+data.tier,before,p);}
   if(req.action==='migracion'){
    const old=LudariaCore.normalize(data.profile),m=ss.getSheetByName('Migraciones');
    if(!rows_(ss,'Migraciones').some(r=>r[0]===requestId&&r[2]===id))m.appendRow([requestId,new Date().toISOString(),id,JSON.stringify(old),'Pendiente']);
    return {ok:true,profile:p,message:'Pendiente de revisión; no se acreditó saldo.'};
   }
  }
  return {ok:true,profile:state_(rows_(ss,'Movimientos'),id)};
 }catch(e){console.warn('Forja: '+e.message);return {ok:false,error:e.message};}finally{if(locked)lock.releaseLock();}
}
/** Solo editor: reconstruye Panel a partir del registro, nunca altera saldos. */
function reconstruirPanel_(){const ss=db_(),mov=rows_(ss,'Movimientos');[...new Set(mov.map(r=>r[2]))].forEach(id=>panel_(ss,id,state_(mov,id),new Date().toISOString()));}
/** Solo editor: revisar la fila, después escribir aquí su número y ejecutar. */
function aprobarMigracion_(){const NUMERO_FILA=0;if(NUMERO_FILA<2)throw Error('Revisa la solicitud y configura NUMERO_FILA (2 o mayor).');aplicarMigracion_(NUMERO_FILA);}
function aplicarMigracion_(row){
 const lock=LockService.getScriptLock();lock.waitLock(5000);try{const ss=db_(),s=ss.getSheetByName('Migraciones'),r=s.getRange(row,1,1,5).getValues()[0];if(r[4]!=='Pendiente')throw Error('Solicitud ya revisada.');const mov=rows_(ss,'Movimientos'),current=state_(mov,r[2]);if(!current)throw Error('Acceso inexistente.');const old=LudariaCore.normalize(JSON.parse(r[3]));old.pending=LudariaCore.freshStats(0);const requestId='migracion-'+r[0];if(!mov.some(x=>x[0]===requestId&&x[2]===r[2]))append_(ss,r[2],requestId,'migracion','Migración aprobada por facilitador',current.points,old);s.getRange(row,5).setValue('Aprobada');}finally{lock.releaseLock();}
}
