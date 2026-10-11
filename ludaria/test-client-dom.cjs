/** Interfaz de acceso y guardado con respuestas controladas; sin Google real. */
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const delay=()=>new Promise(r=>setTimeout(r,5));
async function until(check,label){for(let n=0;n<300;n++){if(check())return;await delay();}throw Error('Espera: '+label);}
const fakeProfile={id:'personaje-de-prueba',name:'Explorador de prueba',class:'Kira',skills:{sabiduria:1,maestria:1,creacion:1,evaluacion:1,camaraderia:1},points:0,xp:0,level:1};
function create(route='yunque',market=false){
 const requests=[],saves=[];
 const dom=new JSDOM('<!doctype html><html lang="es"><head></head><body><div id="store"></div></body></html>',{url:'https://ludaria.test/cloud#pantalla-1',runScripts:'outside-only',pretendToBeVisual:true,beforeParse(w){
  w.crypto.randomUUID=()=>crypto.randomUUID();w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.Storage.prototype.getItem=w.Storage.prototype.setItem=()=>{throw Error('Storage bloqueado');};
  w.navigator.clipboard={writeText:async()=>{throw Error('Portapapeles bloqueado');}};
  w.google={script:{run:{withSuccessHandler:success=>({withFailureHandler:failure=>({ludariaApi(q){requests.push(q);if(q.action==='guardarMision'){saves.push({request:q,respond:success});return;}if(q.action==='cargarMision'){success({ok:true,revision:null,snapshot:null});return;}success({ok:true,profile:fakeProfile,revision:'crear',access:'sesion-ficticia',...(q.action==='registrar'?{key:q.data.key,recoveryCode:'RES-111111-222222-333333-444444'}:{})});}})})}}};
 }});
 const w=dom.window;w.LUDARIA_CLOUD_CONFIG={route,market};w.eval(fs.readFileSync(__dirname+'/rpg-catalog.js','utf8'));w.eval(fs.readFileSync(__dirname+'/client.js','utf8'));
 return {dom,w,d:w.document,requests,saves};
}
function submit(t,id,values){const f=t.d.querySelector(id);for(const [key,value]of Object.entries(values))f.elements[key].value=value;f.dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));}
(async()=>{
 const t=create();await until(()=>t.d.querySelector('#cloud-login'),'acceso');submit(t,'#cloud-login',{name:fakeProfile.name,key:'314159'});await t.w.LudariaCloud.ready;await t.w.LudariaCloud.loadMission();
 const cloud=t.w.LudariaCloud,snapshot=note=>({version:1,page:2,fields:{note},visited:[0,1,2]});
 cloud.saveMission(snapshot('Primera nota'));const first=cloud.flushMission();await until(()=>t.saves.length===1,'primer guardado');let secondFinished=false;const second=cloud.flushMission().then(()=>{secondFinished=true;});await delay();assert.equal(secondFinished,false,'Otra llamada debe esperar la confirmación en curso');
 cloud.saveMission(snapshot('Nota editada mientras se guarda'));t.saves[0].respond({ok:true,revision:'guardado-1'});await until(()=>t.saves.length===2,'edición posterior');assert.equal(t.saves[1].request.expectedRevision,'guardado-1');assert.equal(t.saves[1].request.data.snapshot.fields.note,'Nota editada mientras se guarda');t.saves[1].respond({ok:true,revision:'guardado-2'});await Promise.all([first,second]);assert.equal(cloud.hasPending,false);assert.match(t.d.querySelector('[data-cloud-status]').textContent,/confirmado/);
 cloud.saveMission(snapshot('Nota sin conexión'));const failed=cloud.flushMission();await until(()=>t.saves.length===3,'fallo');const failedId=t.saves[2].request.requestId;t.saves[2].respond({ok:false,message:'Conexión interrumpida'});await failed;assert.equal(cloud.hasPending,true);assert.match(t.d.querySelector('[data-cloud-status]').textContent,/Sin confirmar/);
 cloud.saveMission(snapshot('Edición posterior al fallo'));const retry=cloud.flushMission();await until(()=>t.saves.length===4,'reintento');assert.equal(t.saves[3].request.requestId,failedId);assert.equal(t.saves[3].request.data.snapshot.fields.note,'Nota sin conexión');t.saves[3].respond({ok:true,revision:'guardado-3'});await until(()=>t.saves.length===5,'edición conservada');assert.equal(t.saves[4].request.expectedRevision,'guardado-3');assert.equal(t.saves[4].request.data.snapshot.fields.note,'Edición posterior al fallo');t.saves[4].respond({ok:true,revision:'guardado-4'});await retry;assert.equal(cloud.hasPending,false);t.dom.window.close();
 for(const market of [false,true]){
  const a=create('forja',market);await until(()=>a.d.querySelector('#cloud-login'),'Forja/Mochi');a.d.querySelector('[data-access-panel=register]').click();submit(a,'#cloud-register',{name:fakeProfile.name,key:'314159',keyConfirm:'000000',avatar:'Kira'});await until(()=>a.d.querySelector('#cloud-error').textContent.includes('no coinciden'),'confirmación distinta');assert.equal(a.requests.length,0,'El desacuerdo no envía un alta');
  submit(a,'#cloud-register',{name:fakeProfile.name,key:'314159',keyConfirm:'314159',avatar:'Kira'});await until(()=>a.d.querySelector('#cloud-key-value'),'confirmación de identidad');assert.equal(a.d.querySelector('#cloud-key-value').type,'password');assert.equal(a.d.querySelector('#cloud-recovery-value').type,'password');
  a.d.querySelector('#cloud-copy-recovery').click();await until(()=>a.d.querySelector('#cloud-recovery-value').type==='text','alternativa al portapapeles');assert.match(a.d.querySelector('#cloud-key-status').textContent,/seleccionado/);a.d.querySelector('#cloud-reveal-key').click();assert.equal(a.d.querySelector('#cloud-recovery-value').type,'password');a.d.querySelector('#cloud-continue').click();await a.w.LudariaCloud.ready;
  a.w.LudariaCloud.registerPendingCheck(()=>true);a.w.LudariaCloud.notify('Ensayo pendiente de confirmación');a.d.querySelector('[data-cloud-access]').click();assert.equal(a.d.querySelector('#cloud-key-name').value,fakeProfile.name);assert.equal(a.d.querySelector('#cloud-key-value').value,'314159');assert.equal(a.d.querySelector('#cloud-key-value').type,'password');a.d.querySelector('#cloud-continue').click();assert.equal(a.w.LudariaCloud.hasPending,true);assert.equal(a.d.querySelector('[data-cloud-status]').textContent,'Ensayo pendiente de confirmación','Revisar el acceso no confirma un ensayo');a.dom.window.close();
 }
 console.log('PASS cliente: espera del guardado simultáneo, ediciones durante envío/fallo, reintentos sin duplicar, confirmación de clave, recuperación copiable y nombre/clave en Forja y Mochi sin perder avisos pendientes.');
})().catch(error=>{console.error(error);process.exit(1);});
