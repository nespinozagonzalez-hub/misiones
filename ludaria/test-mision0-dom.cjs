/** Diagnóstico completo en DOM con transporte interceptado; no escribe en Sheet. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom'),root=path.resolve(__dirname,'..');
const frozen={
 'config.d219902609.js':'918948d7bfc5e4deff197a85d6906d7004d97ad9b1f5b8ab0b690ce6dce7b3a9',
 'instrumento.4f6bbd522c.js':'4f6bbd522cdff23b3cfd896b55d275075c918ae765c4b5a9e82144d5c483d144',
 'transport.59e12ed8f0.js':'59e12ed8f09c02b0d87f8df4d005bb245f15adee74545c77be3e29249e9e5f27'
};
for(const [name,hash]of Object.entries(frozen))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'mision-0',name))).digest('hex'),hash,'Conserva instrumento, receptor y protocolo originales');
const delay=()=>new Promise(r=>setTimeout(r,10));async function until(check,label){for(let n=0;n<1000;n++){if(check())return;await delay();}throw Error('Espera: '+label);}
async function exercise(blocked){
 const posts=[],errors=[];let receipts=0,acknowledge=false;
 class Resources extends ResourceLoader{fetch(url){const u=new URL(url);if(u.hostname==='script.google.com'){receipts++;return Promise.resolve(Buffer.from('window['+JSON.stringify(u.searchParams.get('callback'))+']('+JSON.stringify({ok:true,received:acknowledge,id:u.searchParams.get('id')})+');'));}if(u.hostname!=='ludaria.test')return null;const file=path.join(root,u.pathname);return fs.existsSync(file)?Promise.resolve(fs.readFileSync(file)):null;}}
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(fs.readFileSync(path.join(root,'mision-0/presentacion.html'),'utf8'),{url:'https://ludaria.test/mision-0/presentacion.html#pantalla-1',runScripts:'dangerously',resources:new Resources(),pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.crypto.randomUUID=()=>crypto.randomUUID();w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  if(blocked)w.Storage.prototype.getItem=w.Storage.prototype.setItem=()=>{throw Error('Storage bloqueado');};
  w.fetch=async(url,options)=>{posts.push({url,payload:JSON.parse(options.body.get('payload'))});return {type:'opaque'};};
 }});
 const w=dom.window,d=w.document;await until(()=>d.querySelector('#stage h1'),'portada');assert.equal(w.LudariaCloud,undefined,'Misión 0 no usa registro central');assert.equal(d.querySelector('#draft-storage-note').hidden,!blocked);
 for(let page=1;page<=10;page++){d.querySelector('#next').click();assert.equal(Number(d.querySelector('#page-count').textContent.split('/')[0]),page+1);assert.ok(d.querySelector('#stage').textContent.length>30);}assert.equal(d.querySelector('#next').disabled,true,'La puerta espera un recibo');
 d.querySelector('[data-action=go][data-page="2"]').click();for(const [name,value]of [['name','Prueba de diagnóstico'],['area','Ciencias de prueba']]){const input=d.querySelector('[data-field='+name+']');input.value=value;input.dispatchEvent(new w.Event('input',{bubbles:true}));}
 d.querySelector('[data-action=go][data-page="9"]').click();
 for(let q=0;q<8;q++){
  d.querySelector('[data-action=question][data-index="'+q+'"]').click();const text=d.querySelector('[data-answer]'),none=d.querySelector('[data-none]'),scale=d.querySelector('[data-scale="3"]');
  if(text){text.value='Respuesta de prueba sin calificación';text.dispatchEvent(new w.Event('input',{bubbles:true}));}else if(none){none.checked=true;none.dispatchEvent(new w.Event('change',{bubbles:true}));}else{assert.ok(scale);scale.checked=true;scale.dispatchEvent(new w.Event('change',{bubbles:true}));}
 }
 d.querySelector('[data-action=go][data-page="10"]').click();assert.equal(d.querySelector('[data-action=send]').disabled,false);d.querySelector('[data-action=send]').click();await until(()=>receipts>=1,'comprobación de recibo');assert.equal(d.querySelector('#next').disabled,true,'Un POST opaco no acredita recepción');acknowledge=true;
 await until(()=>d.querySelector('[data-action=go][data-page="11"]')&&!d.querySelector('#next').disabled,'recepción confirmada');assert.equal(posts.length,1);assert.equal(posts[0].payload.name,'Prueba de diagnóstico');assert.equal(Object.keys(posts[0].payload.answers).filter(k=>/^q[1-8]$/.test(k)).length,8);assert.equal(posts[0].url,w.LUDARIA_CONFIG.receiverUrl);d.querySelector('#next').click();assert.equal(Number(d.querySelector('#page-count').textContent.split('/')[0]),12);assert.deepEqual(errors,[]);dom.window.close();
}
(async()=>{await exercise(false);await exercise(true);console.log('PASS Misión 0: 12 pantallas, ocho respuestas, puerta cerrada hasta recibo, POST opaco sin falso éxito, aviso de storage bloqueado y receptor/instrumento originales intactos. Servicios interceptados.');})().catch(e=>{console.error(e);process.exit(1);});
