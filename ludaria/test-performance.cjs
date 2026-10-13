const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {context,setSource}=require('./mock.cjs');
setSource(fs.readFileSync(__dirname+'/Code-Ludaria-Conectado.gs','utf8'));
const t=context();t.run('prepararConexionLudaria()');
const cache=new Map();t.c.CacheService={getScriptCache:()=>({get:k=>cache.get(k)||null,put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})};
let reads=0;for(const sheet of t.sheets.values()){const range=sheet.getRange.bind(sheet);sheet.getRange=(...args)=>{const r=range(...args),get=r.getValues.bind(r);r.getValues=()=>{reads++;return get();};return r;};}
const send=q=>{t.c.request=q;return t.run('ludariaApi(request)');},uid=()=>crypto.randomUUID();
const signup=send({action:'registrar',requestId:uid(),data:{name:'Prueba rendimiento',class:'Kira',key:'314159',keyConfirm:'314159',mission:'yunque'}});
assert.equal(signup.ok,true,signup.message);assert.equal(signup.initialMission.snapshot,null);
const snap={version:1,page:3,fields:{nota:'Reflexión de prueba'},visited:[0,1,2,3]};
const saved=send({action:'guardarMision',access:signup.access,requestId:uid(),expectedRevision:null,data:{mission:'yunque',snapshot:snap}});assert.equal(saved.ok,true,saved.message);
reads=0;const resumed=send({action:'cargarInicio',access:signup.access,data:{mission:'yunque'}});const readCount=reads;
assert.equal(resumed.ok,true,resumed.message);assert.equal(resumed.initialMission.revision,saved.revision);assert.equal(resumed.initialMission.snapshot.fields.nota,snap.fields.nota);assert.equal(readCount,3,'Una lectura por tabla: Personajes, Movimientos y Aventuras; cabeceras ya comprobadas');
const other=send({action:'registrar',requestId:uid(),data:{name:'Segundo rendimiento',class:'Kael',key:'271828',keyConfirm:'271828',mission:'yunque'}});assert.equal(other.initialMission.snapshot,null);
const profile=send({action:'cargar',access:signup.access});
const rune=send({action:'runa',access:signup.access,requestId:uid(),expectedRevision:profile.revision,data:{code:'AXR314'}});assert.equal(rune.ok,true,rune.message);assert.equal(rune.profile.points,5,'La lectura memorizada se invalida al añadir el movimiento');
const buy=send({action:'compra',access:signup.access,requestId:uid(),expectedRevision:rune.revision,data:{quantities:{sabiduria:2,maestria:0,creacion:0,evaluacion:0,camaraderia:0}}});assert.equal(buy.ok,true,buy.message);assert.equal(buy.profile.skills.sabiduria,3);
assert.equal(send({action:'cargarInicio',access:signup.access,data:{mission:'pergaminos-dispersos'}}).profile.skills.sabiduria,3,'No se reutiliza un perfil obsoleto entre solicitudes');
assert.equal(send({action:'cargarInicio',access:signup.access+'x',data:{mission:'yunque'}}).ok,false);
// La vista docente conserva el historial y toma solo la última revisión de cada cuaderno.
const before=JSON.stringify(t.sheets.get('Aventuras').data);
const view=t.run('actualizarResumenCuadernosLudaria()');assert.equal(view.ok,true);assert.equal(view.cuadernos,1);assert.equal(t.sheets.get('CuadernosActuales').data[1][7],'nota: Reflexión de prueba');assert.equal(JSON.stringify(t.sheets.get('Aventuras').data),before);
t.c.Session.getActiveUser=()=>({getEmail:()=>''});assert.throws(()=>t.run('actualizarResumenCuadernosLudaria()'),/propietaria/);
console.log('PASS rendimiento: carga unificada en 3 lecturas de datos, sesión validada, atributos frescos tras compras, aislamiento y vista docente sin alterar historial. Servicios simulados.');
