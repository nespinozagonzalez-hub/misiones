const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {context,setSource}=require('./mock.cjs'),catalog=require('./rpg-catalog.js');
setSource(fs.readFileSync(__dirname+'/Code-Ludaria-Conectado.gs','utf8'));
const t=context();t.run('prepararConexionLudaria()');
const uid=()=>crypto.randomUUID();const send=q=>{t.c.request=q;return t.run('ludariaApi(request)');};
let p=send({action:'registrar',requestId:uid(),data:{name:'Prueba RPG',class:'Kira'}});const access=p.access;
const call=(action,data,id=uid())=>{const r=send({action,data,requestId:id,access,expectedRevision:p.revision});if(r.profile)p=r;return r;};
assert.equal(catalog.missions.length,13);assert.equal(catalog.all.length,39);assert.equal(new Set(catalog.missions.map(m=>m.guardian)).size,13);
for(const k of Object.keys(catalog.attributes))for(const n of [3,5,8])assert.ok(catalog.all.some(x=>x.attribute===k&&x.minimum===n),k+' '+n);
for(const m of catalog.missions){const r=call('catalogoRpg',{mission:m.slug});assert.equal(r.ok,true);assert.ok(r.perks.every(x=>!x.available));assert.equal(call('ventaja',{mission:m.slug,id:m.perks[0].id}).ok,false);}
for(const code of ['ECO101','AXR314','LUM582','VYR207','NEX451','ORB126','KRN693','ZEN248','ELD570','MIR831','ARC419','NEB264','CYR905','ORB714'])assert.equal(call('runa',{code}).ok,true);
const high=Object.fromEntries(Object.keys(catalog.attributes).map(k=>[k,8]));const xp=p.profile.xp;
assert.equal(call('redistribuir',{skills:high,reason:'Quiero contrastar rutas antes de elegir.'}).ok,true);
const after=p.profile.history.at(-1);assert.equal(after.reasonSource,'AUTOINFORME');assert.equal(after.skillsBefore.sabiduria,1);assert.equal(after.skillsAfter.sabiduria,8);assert.equal(p.profile.xp,xp);
for(const m of catalog.missions){
 const snapshot=m.slug==='vetas-diseno'?{page:0,cards:Array(18).fill(''),visited:[0]}:{version:1,page:0,fields:{nota:'Dato de '+m.slug},visited:[0]};
 assert.equal(send({action:'guardarMision',access,requestId:uid(),expectedRevision:null,data:{mission:m.slug,snapshot}}).ok,true,m.slug);
 const omit={type:'omitir_ventaja',mission:m.slug,id:m.perks[0].id,page:1,reason:'continuar_sin_ayuda'},omitId=uid();
 const skipCount=t.sheets.get('Aventuras').data.length;
 assert.equal(call('accionRpg',omit,omitId).ok,true);
 assert.equal(call('accionRpg',omit,omitId).ok,true,'Omisión idempotente');
 assert.equal(t.sheets.get('Aventuras').data.length,skipCount+1);
 assert.equal(call('accionRpg',{...omit,page:80}).ok,false);
 for(const perk of m.perks){assert.equal(call('ventaja',{mission:m.slug,id:perk.id}).ok,true,perk.id);if(perk.kind==='accion'){
  const event=uid(),data={type:'decision',mission:m.slug,id:perk.id,choice:perk.options[0],work:'Ensayo de prueba',reflection:'Para comprender el efecto.'};
  assert.equal(call('accionRpg',data,event).ok,true);assert.equal(call('accionRpg',data,event).ok,true);assert.equal(call('accionRpg',{...data,reflection:'Diferente'},event).ok,false);
 }}
 const c=call('catalogoRpg',{mission:m.slug});assert.ok(c.perks.every(x=>x.available));
 if(m.egg){const a={type:'easter',mission:m.slug,id:m.egg.id};const before=t.sheets.get('Aventuras').data.length;assert.equal(call('accionRpg',a).ok,true);assert.equal(call('accionRpg',a).ok,true);assert.equal(t.sheets.get('Aventuras').data.length,before+1);}
}
assert.equal(call('accionRpg',{type:'decision',mission:'vetas-diseno',id:'ojo_artesano',choice:'Inventada'}).ok,false);
assert.equal(call('ventaja',{mission:'yunque',id:'ojo_artesano'}).ok,false);
// Dos sesiones editan el mismo ensayo: conservar la revisión previa al confirmar.
const mission=catalog.find('pergaminos-dispersos'),perk=mission.perks.find(x=>x.kind==='accion');
const current=call('catalogoRpg',{mission:mission.slug}),version=current.responseRevisions[perk.id];
const decision={type:'decision',mission:mission.slug,id:perk.id,choice:perk.options[0],work:'Primera sesión',reflection:'',expectedEventId:version};
const first=uid();assert.equal(call('accionRpg',decision,first).ok,true);
const beforeConflict=t.sheets.get('Aventuras').data.length;
assert.match(call('accionRpg',{...decision,work:'Segunda sesión'}).message,/otra sesión/);
assert.equal(t.sheets.get('Aventuras').data.length,beforeConflict);
assert.equal(call('accionRpg',{...decision,work:'Texto comparado',expectedEventId:first}).ok,true);
assert.equal(call('accionRpg',decision,first).ok,true,'Reintento después de otro cambio: recuperar sin duplicar');
assert.equal(t.sheets.get('Aventuras').data.length,beforeConflict+1);
assert.equal(call('catalogoRpg',{mission:mission.slug}).responses[perk.id].work,'Texto comparado');
const low=Object.fromEntries(Object.keys(catalog.attributes).map(k=>[k,1]));assert.equal(call('redistribuir',{skills:low}).ok,true);
assert.equal(call('ventaja',{id:'ojo_artesano'}).ok,false);
assert.equal(call('accionRpg',{type:'omitir_ventaja',mission:'vetas-diseno',id:'ojo_artesano',page:1,reason:'continuar_sin_ayuda'}).ok,false);assert.equal(p.profile.xp,xp);assert.equal(p.profile.history.at(-1).reasonSource,'NO_DECLARADO');
assert.ok(call('catalogoRpg',{mission:'yunque'}).responses.yunque_1,'Retirar un apoyo conserva la decisión anterior');
const quantities=Object.fromEntries(Object.keys(catalog.attributes).map(k=>[k,k==='sabiduria'?2:0]));
assert.equal(call('compra',{quantities,reason:'Quiero estudiar la brújula de conceptos.'}).ok,true);
assert.equal(p.profile.history.at(-1).skillsBefore.sabiduria,1);assert.equal(p.profile.history.at(-1).skillsAfter.sabiduria,3);assert.equal(p.profile.history.at(-1).reasonSource,'AUTOINFORME');
const movements=t.sheets.get('Movimientos').data.length;assert.equal(call('compra',{quantities,reason:'a'.repeat(1001)}).ok,false);assert.equal(t.sheets.get('Movimientos').data.length,movements);
const other=send({action:'registrar',requestId:uid(),data:{name:'Segundo RPG',class:'Kael'}});assert.deepEqual(Object.keys(send({action:'catalogoRpg',access:other.access,data:{mission:'yunque'}}).responses),[]);
assert.equal(send({action:'guardarMision',access:other.access,requestId:uid(),expectedRevision:null,data:{mission:'yunque',snapshot:{page:0}}}).ok,false);
assert.equal(send({action:'cargarMision',access,data:{mission:'mision-0'}}).ok,false);
assert.equal(call('accionRpg',{type:'entrada',mission:'mision-0'}).ok,true);
assert.equal(t.run('analizarDecisionesLudaria().ok'),true);
assert.ok(t.run('analizarDecisionesLudaria().motivosDeMovimientos.declarados')>=2);
assert.ok(t.run('analizarDecisionesLudaria().events.OMISION_VENTAJA')>=13);
const prior=t.c.Session.getActiveUser;t.c.Session.getActiveUser=()=>({getEmail:()=>''});assert.throws(()=>t.run('analizarDecisionesLudaria()'),/propietario/);t.c.Session.getActiveUser=prior;
console.log('PASS: 13 guardianes, 39 ventajas, umbrales 3/5/8, retiro por atributos actuales, decisiones idempotentes, motivos declarados, aislamiento, borradores, secretos sin XP y análisis privado.');
