const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const pause=()=>new Promise(r=>setTimeout(r,5));
async function until(check){for(let n=0;n<300;n++){if(check())return;await pause();}throw Error('La sesión no terminó de cargar');}
const profile={id:'demo',name:'Demo sesión',class:'Kira',skills:{sabiduria:1,maestria:1,creacion:1,evaluacion:1,camaraderia:1},points:0,xp:0,level:1};
const token='demo.'+(Date.now()+3600000)+'.nonce.firma';
const snapshot={version:1,page:4,fields:{nota:'Cuaderno recuperado'},visited:[0,1,2,3,4]};
function create(storage,{blocked=false,fail=false,defer=false}={}){
 const calls=[],pending=[];
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://ludaria.test/cloud',runScripts:'outside-only',pretendToBeVisual:true,beforeParse(w){
  w.crypto.randomUUID=()=>crypto.randomUUID();
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.Storage.prototype.getItem=k=>{if(blocked)throw Error('bloqueado');return storage.get(k)||null;};
  w.Storage.prototype.setItem=(k,v)=>{if(blocked)throw Error('bloqueado');storage.set(k,v);};
  w.Storage.prototype.removeItem=k=>{if(blocked)throw Error('bloqueado');storage.delete(k);};
  w.google={script:{run:{withSuccessHandler:ok=>({withFailureHandler:bad=>({ludariaApi(q){calls.push(q);if(fail){ok({ok:false,message:'Sesión revocada'});return;}if(defer&&q.action==='cargar'){pending.push(()=>ok({ok:true,profile,revision:'r1'}));return;}ok({ok:true,profile,revision:'r1',access:token,...(['entrar','cargarInicio'].includes(q.action)?{initialMission:{mission:'yunque',snapshot,revision:'cuaderno1'}}:{})});}})})}}};
 }});
 const w=dom.window;w.LUDARIA_CLOUD_CONFIG={route:'yunque',market:false};w.eval(fs.readFileSync(__dirname+'/rpg-catalog.js','utf8'));w.eval(fs.readFileSync(__dirname+'/client.js','utf8'));
 return {dom,w,d:w.document,calls,pending};
}
function submit(t){const f=t.d.querySelector('#cloud-login');f.elements.name.value=profile.name;f.elements.key.value='314159';f.dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));}
(async()=>{
 const storage=new Map(),first=create(storage);await until(()=>first.d.querySelector('#cloud-login'));submit(first);await first.w.LudariaCloud.ready;
 assert.equal(first.calls[0].data.mission,'yunque');assert.equal((await first.w.LudariaCloud.loadMission()).page,4);assert.equal(first.calls.length,1,'El cuaderno inicial no requiere otra consulta');
 const stored=JSON.parse(storage.get('ludaria-session-v1'));assert.equal(stored.access,token);assert.equal(JSON.stringify(stored).includes('314159'),false);assert.equal(JSON.stringify(stored).includes('Cuaderno recuperado'),false);
 first.w.LudariaCloud.saveMission(snapshot);await first.w.LudariaCloud.flushMission();assert.equal(first.calls.length,1,'Un cuaderno sin cambios no vuelve a guardarse');first.dom.window.close();
 const next=create(storage,{defer:true});await next.w.LudariaCloud.ready;assert.equal(next.calls[0].action,'cargarInicio');assert.equal(next.d.querySelector('#cloud-login'),null);assert.equal((await next.w.LudariaCloud.loadMission()).fields.nota,snapshot.fields.nota);
 const a=next.w.LudariaCloud.api('cargar'),b=next.w.LudariaCloud.api('cargar');assert.equal(next.pending.length,1,'Las lecturas simultáneas comparten una solicitud');next.pending[0]();await Promise.all([a,b]);next.dom.window.close();
 const revoked=create(storage,{fail:true});await until(()=>revoked.d.querySelector('#cloud-login'));assert.equal(storage.has('ludaria-session-v1'),false);revoked.dom.window.close();
 storage.set('ludaria-session-v1',JSON.stringify({access:token,expires:Date.now()-1}));const expired=create(storage);await until(()=>expired.d.querySelector('#cloud-login'));assert.equal(expired.calls.length,0);expired.dom.window.close();
 const blocked=create(storage,{blocked:true});await until(()=>blocked.d.querySelector('#cloud-login'));submit(blocked);await blocked.w.LudariaCloud.ready;assert.equal(blocked.w.LudariaCloud.profile.name,profile.name);blocked.dom.window.close();
 console.log('PASS sesión: continuidad, expiración/revocación, almacenamiento bloqueado, clave no persistida, cuaderno en una llamada, deduplicación de lecturas y guardados sin cambios.');
})().catch(e=>{console.error(e);process.exitCode=1;});
