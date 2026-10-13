const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom'),{context,setSource}=require('./mock.cjs'),catalog=require('./rpg-catalog.js');
setSource(fs.readFileSync(__dirname+'/Code-Ludaria-Conectado.gs','utf8'));const t=context();t.run('prepararConexionLudaria()');
const uid=()=>crypto.randomUUID(),send=q=>{t.c.request=q;return JSON.parse(JSON.stringify(t.run('ludariaApi(request)')));};
let account=send({action:'registrar',requestId:uid(),data:{name:'Prueba fluidez',class:'Kira',key:'314159',keyConfirm:'314159'}});const access=account.access;
account=send({action:'runa',access,requestId:uid(),expectedRevision:account.revision,data:{code:'AXR314'}});
account=send({action:'compra',access,requestId:uid(),expectedRevision:account.revision,data:{quantities:{sabiduria:2,maestria:0,creacion:0,evaluacion:0,camaraderia:0}}});
const calls=[],pending=[];
function fixture(route='pergaminos-dispersos',market=false){
 const dom=new JSDOM('<html><head></head><body><button id="origin">Ayudas</button></body></html>',{url:'https://ludaria.test',runScripts:'outside-only',pretendToBeVisual:true,beforeParse(w){
  w.crypto.randomUUID=uid;w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.google={script:{run:{withSuccessHandler:ok=>({withFailureHandler:bad=>({ludariaApi(q){calls.push(q);if(['ventaja','catalogoRpg','cargarInicio'].includes(q.action)){pending.push(()=>ok(send(q)));return;}ok(send(q));}})})}}};
 }});const w=dom.window;
 w.LUDARIA_CLOUD_CONFIG={route,market};w.eval(fs.readFileSync(__dirname+'/rpg-catalog.js','utf8'));w.eval(fs.readFileSync(__dirname+'/client.js','utf8'));w.eval(fs.readFileSync(__dirname+'/rpg-ui.js','utf8'));return {dom,w,d:w.document};
}
const pause=()=>new Promise(r=>setTimeout(r,5));async function until(fn){for(let n=0;n<300;n++){if(fn())return;await pause();}throw Error('Prueba no terminó');}
(async()=>{
 const f=fixture();await until(()=>f.d.querySelector('#cloud-login'));const login=f.d.querySelector('#cloud-login');login.elements.name.value='Prueba fluidez';login.elements.key.value='314159';login.dispatchEvent(new f.w.Event('submit',{bubbles:true,cancelable:true}));await f.w.LudariaCloud.ready;await pause();
 const perk=catalog.find('pergaminos-dispersos').perks[0];calls.length=0;
 const opening=f.w.LudariaRPGUI.openPerk(perk.id);assert.equal(f.d.querySelector('dialog h2').textContent,perk.name);assert.ok(f.d.querySelector('[data-rpg-preview]').textContent.includes(perk.text),'Explicación visible antes de responder Google');assert.equal(calls.length,1);assert.equal(f.d.querySelector('[data-rpg-form]'),null,'No permite escribir sobre una revisión aún sin recuperar');pending.shift()();await opening;assert.equal(calls.length,1,'Consulta y recuperación usan una llamada');f.d.querySelector('[data-rpg-close]').click();
 // Un perfil insuficiente nunca muestra la explicación inmediata.
 const low=Object.fromEntries(Object.keys(catalog.attributes).map(k=>[k,1]));
 const downgraded=send({action:'redistribuir',access,requestId:uid(),expectedRevision:account.revision,data:{skills:low}});assert.equal(downgraded.ok,true);
 // Perfil local todavía alto: la negativa del servidor retira la vista provisional.
 const stale=f.w.LudariaRPGUI.openPerk(perk.id);assert.ok(f.d.querySelector('[data-rpg-preview]'));pending.shift()();await stale;
 assert.equal(f.d.querySelector('[data-rpg-preview]'),null);assert.equal(f.d.querySelector('[data-rpg-form]'),null);f.d.querySelector('[data-rpg-close]').click();
 await f.w.LudariaCloud.api('cargar');
 const locked=f.w.LudariaRPGUI.openPerk(perk.id);assert.equal(f.d.querySelector('[data-rpg-preview]'),null);pending.shift()();await locked;assert.equal(f.d.querySelector('[data-rpg-form]'),null);f.d.querySelector('[data-rpg-close]').click();
 const list=f.w.LudariaRPGUI.open();assert.ok(f.d.querySelector('[data-rpg-open]'),'Catálogo visible sin esperar servidor');pending.shift()();await list;f.d.querySelector('[data-rpg-close]').click();f.dom.window.close();
 for(const market of [false,true]){calls.length=0;const f=fixture('forja',market);f.w.sessionStorage.setItem('ludaria-session-v1',JSON.stringify({access,expires:Date.now()+10000,name:'Prueba fluidez',class:'Kira'}));await until(()=>f.d.querySelector('#cloud-session-preview'));assert.ok(f.d.querySelector('#cloud-session-preview').textContent.includes('Prueba fluidez'));assert.ok(f.d.querySelector('#cloud-session-preview img'));assert.equal(f.d.querySelector('[data-rpg-form]'),null);pending.shift()();await f.w.LudariaCloud.ready;assert.equal(f.d.querySelector('#cloud-session-preview'),null,'Carga desaparece al confirmar sesión');f.dom.window.close();}
 console.log('PASS fluidez: explicación y catálogo antes de respuesta, una consulta por ventaja, revisión protegida y ventana de carga de Forja/Mochi. Servicios simulados.');
})().catch(e=>{console.error(e);process.exitCode=1;});
