const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const {context,setSource}=require('./mock.cjs');
setSource(fs.readFileSync(__dirname+'/Code-Ludaria-Conectado.gs','utf8'));
const server=context();server.run('prepararConexionLudaria()');
const read=p=>fs.readFileSync(__dirname+'/../'+p,'utf8');
const delay=()=>new Promise(r=>setTimeout(r,5));
async function until(check){for(let i=0;i<200;i++){if(check())return;await delay();}throw Error('Tiempo de espera');}
async function fixture(legacy=false){
 const calls=[];
 const dom=new JSDOM(read('forja/index.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''),{url:'https://ludaria.test/forja/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;w.crypto.randomUUID=()=>crypto.randomUUID();w.matchMedia=()=>({matches:false});
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.google={script:{run:{withSuccessHandler:success=>({withFailureHandler:failure=>({ludariaApi(q){calls.push(q);try{server.c.request=q;success(JSON.parse(JSON.stringify(server.run('ludariaApi(request)'))));}catch(e){failure(e);}}})})}}};
 w.LUDARIA_CLOUD_CONFIG={route:'forja',market:false};w.eval(read('ludaria/rpg-catalog.js'));
 if(legacy) {
  w.LudariaCloud={active:true,ready:new Promise(()=>{}),registerPendingCheck:()=>{},api:()=>{throw Error('No registrar con la clave antigua');}};
  d.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const bar=d.createElement('div');bar.className='ludaria-cloud-bar';d.body.prepend(bar);const dialog=d.createElement('dialog');dialog.className='ludaria-cloud-dialog';dialog.innerHTML='<form id="cloud-login"><input name="name"><input name="key"><button>Recuperar mi personaje</button></form><details><summary>Voy a crear mi personaje</summary><form id="cloud-register"><input name="name"><select name="avatar"><option>Kira</option></select></form></details><p id="cloud-error"></p>';d.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();},0));
 } else w.eval(read('ludaria/client.js'));
 w.eval(read('forja/core.js'));w.eval(read('forja/app.js'));if(legacy)Object.defineProperty(d,'readyState',{get:()=> 'interactive'});w.eval(read('forja/onboarding.js'));w.eval(read('ludaria/access-scenery.js'));
 await delay();return {dom,w,d,calls};
}
(async()=>{
 const t=await fixture();assert.equal(t.d.querySelector('.ludaria-cloud-dialog[open]'),null);assert.equal(t.d.querySelector('#welcome').hidden,false);assert.equal(t.d.querySelectorAll('#welcome img').length,2);
 t.d.querySelector('[data-action=resume]').click();await delay();const access=t.d.querySelector('.ludaria-cloud-dialog[open]');assert.equal(access.querySelector('#cloud-login [type=submit]').textContent,'Cargar mi personaje');assert.equal(access.querySelector('.cloud-access-tabs'),null);assert.equal(access.querySelector('[data-access-panel=recover]'),null);assert.equal([...access.querySelectorAll('button')].filter(b=>!b.closest('[hidden]')).length,2,'Solo cargar y volver a la Forja');[...access.querySelectorAll('button')].find(b=>b.textContent==='Volver a la Forja').click();assert.equal(t.d.querySelector('.ludaria-cloud-dialog[open]'),null);
 t.d.querySelector('[data-action=begin]').click();assert.equal(t.d.querySelector('#creation').hidden,false);assert.equal(t.d.querySelectorAll('.avatar-choice img').length,2);
 const f=t.d.querySelector('#create-form');f.querySelector('#name').value='Buscadora visual';f.querySelector('[value=Kira]').checked=true;f.elements.key.value='314159';f.elements.keyConfirm.value='000000';f.dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));await delay();assert.equal(t.calls.length,0);assert.match(t.d.querySelector('#creation-status').textContent,/no coinciden/);
 f.elements.keyConfirm.value='314159';f.dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>t.d.querySelector('#cloud-key-value'));assert.equal(t.calls.length,1);assert.equal(t.calls[0].action,'registrar');assert.equal(t.calls[0].data.class,'Kira');assert.equal(t.d.querySelector('#cloud-key-value').value,'314159');t.d.querySelector('#cloud-continue').click();await until(()=>!t.d.querySelector('#app').hidden);assert.equal(t.d.querySelector('.hero-portrait img').getAttribute('src'),'assets/kira.webp');t.dom.window.close();
 const old=await fixture(true);assert.equal(old.d.querySelector('.ludaria-cloud-dialog[open]'),null,'La versión antigua tampoco tapa la Forja');assert.equal(old.d.querySelector('#welcome').hidden,false);old.d.querySelector('[data-action=resume]').click();assert.ok(old.d.querySelector('.ludaria-cloud-dialog[open]'));old.dom.window.close();
 console.log('PASS Forja visual: bienvenida sin acceso, dos retratos, elección visual, clave confirmada, una sola alta central, ficha Kira y acceso secundario compatible con el script anterior.');
})().catch(e=>{console.error(e);process.exit(1);});
