/** QA aislada del cierre: red externa bloqueada, datos ficticios y servidor en memoria. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const {context,setSource}=require('./mock.cjs'),Quiz=require('../defensa-orbe/batalla-quiz.js');
const root=path.resolve(__dirname,'..');
setSource(fs.readFileSync(__dirname+'/Code-Ludaria-Conectado.gs','utf8'));
const t=context();t.run('prepararConexionLudaria()');
const send=request=>{t.c.request=request;return JSON.parse(JSON.stringify(t.run('ludariaApi(request)')));};
let account=send({action:'registrar',requestId:crypto.randomUUID(),data:{name:'Buscadora QA',class:'Kira',key:'314159',keyConfirm:'314159'}});assert.equal(account.ok,true);
const original={version:1,page:11,fields:{identificador:'QA',post1:'Registro inicial final conservado',prototipo:'Prototipo versión 2',g1:'Reflexión intacta',f9:'Valoración intacta'},checks:{original:true},visited:[0,1,2,3,4,5,6,7,8,9,10,11],open:false};
assert.equal(send({action:'guardarMision',access:account.access,requestId:crypto.randomUUID(),expectedRevision:null,data:{mission:'defensa-orbe',snapshot:original}}).ok,true);
const movesBefore=JSON.stringify(t.sheets.get('Movimientos').data),peopleBefore=JSON.stringify(t.sheets.get('Personajes').data);
t.c.UrlFetchApp.fetch=url=>({getResponseCode:()=>200,getContentText:()=>fs.readFileSync(path.join(root,url.replace('https://raw.githubusercontent.com/nespinozagonzalez-hub/misiones/main/','')),'utf8')});
const errors=[],external=[],requests=[];
async function chooseAndAnswer(p,key,{wrong=false,capture=false}={}){
 await p.locator('[data-orbe-action='+key+']').click();
 assert.equal(await p.locator('dialog.orbe-rpg').getAttribute('data-screen'),'quiz');
 const title=await p.locator('#orbe-quiz-question').innerText(),question=Quiz.bank.find(q=>q.question===title);assert(question);
 const before=await p.locator('[data-orbe-hp]').getAttribute('value');
 if(wrong){
  await p.locator('[data-quiz-option="'+((question.correct+1)%4)+'"]').click();
  assert.equal(await p.locator('[data-quiz-execute]').isVisible(),false,'Un error no ejecuta la habilidad');
  assert.equal(await p.locator('[data-orbe-hp]').getAttribute('value'),before,'Un error no consume el turno');
  assert.equal(await p.locator('[data-quiz-hint-text]').isVisible(),true);assert.match(await p.locator('[data-quiz-feedback]').innerText(),/prueba otra opción/);
 }
 assert.equal(await p.locator('.orbe-rpg').evaluate(d=>d.scrollWidth<=d.clientWidth+1),true,'Pregunta sin desborde horizontal');
 if(capture)await p.screenshot({path:__dirname+'/preview-quiz-orbe-390.png',fullPage:true});
 await p.locator('[data-quiz-option="'+question.correct+'"]').click();
 assert.equal(await p.locator('[data-orbe-hp]').getAttribute('value'),before,'Leer la devolución no ejecuta todavía el movimiento');
 await p.locator('[data-quiz-execute]').click();
 await p.waitForFunction(()=>document.querySelector('.orbe-rpg')?.dataset.screen!=='resolving');
}
async function fight(p){
 await p.locator('[data-orbe-next]').click();
 const route=['sabiduria','creacion','evaluacion','creacion','creacion'];let turn=0;
 while(await p.locator('dialog.orbe-rpg').getAttribute('data-screen')!=='victory'){
  assert(turn<35,'Batalla debe poder terminar');
  const screen=await p.locator('dialog.orbe-rpg').getAttribute('data-screen');
  if(screen==='breather'){await p.locator('[data-orbe-next]').click();continue;}
  await chooseAndAnswer(p,route[turn%route.length]);turn++;
  if(await p.locator('dialog.orbe-rpg').getAttribute('data-screen')==='battle')await p.locator('[data-orbe-next]').click();
 }
 assert(turn>=4,'Hay turnos de combate, no una restauración instantánea');
 assert.equal(await p.locator('[data-orbe-hp]').getAttribute('value'),'0');
 assert.equal(await p.locator('.orbe-progress').getAttribute('value'),'4');
 await p.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.orbe-enemy')).opacity)<.05&&Number(getComputedStyle(document.querySelector('.orbe-victory-art')).opacity)>.95);
}
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');let file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
 if(u.pathname==='/cloud'){t.c.params={parameter:{mision:'defensa-orbe'}};res.setHeader('content-type','text/html');res.end(t.run('doGet(params).html').replace('https://nespinozagonzalez-hub.github.io/misiones/defensa-orbe/','/defensa-orbe/'));return;}
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.statusCode=404;return res.end();}
 if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 const ext=path.extname(file),mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp','.png':'image/png'};
 res.setHeader('content-type',mime[ext]||'text/plain');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 try{
  const ctx=await browser.newContext();
  await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin===base)return r.continue();if(u.origin==='https://nespinozagonzalez-hub.github.io'&&u.pathname.startsWith('/misiones/'))return r.fulfill({path:path.join(root,u.pathname.slice('/misiones/'.length))});external.push(u.origin);return r.abort();});
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  for(const size of [{width:1280,height:900},{width:768,height:1024},{width:1024,height:768},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
   await p.setViewportSize(size);await p.emulateMedia({reducedMotion:'reduce'});await p.goto(base+'/defensa-orbe/revision.html');
   await p.evaluate(()=>localStorage.setItem('QA-preserved','no modificar'));
   const before=await p.evaluate(()=>JSON.stringify(Object.entries(localStorage)));
   await p.locator('[data-action=orbe]').click();await p.locator('dialog.orbe-rpg').waitFor();
   await p.waitForFunction(()=>[...document.querySelectorAll('.orbe-rpg img')].every(i=>i.complete&&i.naturalWidth>0));
   assert.equal(await p.locator('.orbe-rpg').evaluate(d=>d.scrollWidth<=d.clientWidth+1),true,'Sin desborde horizontal '+JSON.stringify(size));
   assert.equal(await p.locator('[data-orbe-action]').count(),5,'Cinco acciones accesibles sin requisito de atributo');
   assert.equal(await p.locator('[data-orbe-sound]').getAttribute('aria-pressed'),'false','Sonido apagado al entrar');
   if(size.width===1280||size.width===390)await p.screenshot({path:__dirname+`/preview-intro-${size.width}.png`,fullPage:true});
   await p.locator('[data-orbe-next]').click();
   for(const side of ['hero','enemy'])assert.equal(await p.locator('.orbe-'+side).evaluate(e=>e.querySelector('img').getBoundingClientRect().top>=e.querySelector('.orbe-nameplate').getBoundingClientRect().bottom-1),true,'El nombre no tapa al personaje '+side);
   if(size.width===390){await p.locator('[data-orbe-sound]').click();await p.waitForFunction(()=>/activado|no disponible/.test(document.querySelector('[data-orbe-sound]').textContent));if(await p.locator('[data-orbe-sound]').getAttribute('aria-pressed')==='true')await p.locator('[data-orbe-sound]').click();}
   await p.screenshot({path:__dirname+`/preview-orbe-${size.width}x${size.height}.png`,fullPage:true});
   if(size.width===320){
    for(let turn=0;turn<6;turn++){await chooseAndAnswer(p,'sabiduria');if(await p.locator('dialog.orbe-rpg').getAttribute('data-screen')==='battle')await p.locator('[data-orbe-next]').click();}
    assert.equal(await p.locator('dialog.orbe-rpg').getAttribute('data-screen'),'breather');
    const fragments=await p.locator('.orbe-progress').getAttribute('value');
    await p.locator('[data-orbe-next]').click();
    assert.equal(await p.locator('.orbe-progress').getAttribute('value'),fragments,'Reagruparse conserva los fragmentos');
    assert.equal(await p.evaluate(()=>document.activeElement?.hasAttribute('data-orbe-action')),true,'El teclado vuelve a una habilidad visible al reagruparse');
   }
   if(size.width===390){
    await p.locator('[data-orbe-action=evaluacion]').click();await p.locator('[data-quiz-cancel]').click();
    assert.equal(await p.locator('[data-orbe-hp]').getAttribute('value'),'100','Cancelar pregunta conserva el encuentro');
    await chooseAndAnswer(p,'evaluacion',{wrong:true,capture:true});
    assert.equal(await p.locator('[data-orbe-ward]').getAttribute('value'),'100','Responder activa la defensa real');
   }
   // Cerrar antes de terminar no restaura ni escribe datos.
   await p.keyboard.press('Escape');await p.locator('dialog.orbe-rpg').waitFor({state:'detached'});assert.equal(await p.locator('#orbe').evaluate(el=>el.classList.contains('restored')),false);
   assert.equal(await p.evaluate(()=>JSON.stringify(Object.entries(localStorage))),before);
   await p.locator('[data-action=orbe]').click();
   await fight(p);
   if(size.width===1280||size.width===390)await p.screenshot({path:__dirname+`/preview-victoria-${size.width}.png`,fullPage:true});
   assert.equal(await p.locator('#orbe').evaluate(el=>el.classList.contains('restored')),false,'Cuatro fases visuales no confirman todavía el cuaderno');
   await p.locator('[data-orbe-next]').click();assert.equal(await p.locator('#orbe').evaluate(el=>el.classList.contains('restored')),true);
   assert.equal(await p.evaluate(()=>JSON.stringify(Object.entries(localStorage))),before,'Revisión no escribe estado');
   await p.locator('[data-orbe-next]').click();await p.locator('dialog.orbe-rpg').waitFor({state:'detached'});
  }
  await p.setViewportSize({width:1280,height:900});await p.emulateMedia({reducedMotion:'no-preference'});await p.goto(base+'/defensa-orbe/revision.html');await p.locator('#review-avatar').selectOption('Kael');
  await p.locator('[data-action=orbe]').click();await p.locator('[data-orbe-next]').click();
  await p.waitForFunction(()=>document.querySelector('.orbe-hero')?.dataset.spriteReady==='1'&&document.querySelector('.orbe-enemy')?.dataset.spriteReady==='1');
  assert.match(await p.locator('.orbe-hero-art').getAttribute('src'),/kael/);
  await p.locator('[data-orbe-action=creacion]').click();
  const motionTitle=await p.locator('#orbe-quiz-question').innerText(),motionQuestion=Quiz.bank.find(q=>q.question===motionTitle);
  await p.locator('[data-quiz-option="'+motionQuestion.correct+'"]').click();await p.locator('[data-quiz-execute]').click();
  assert.equal(await p.locator('.orbe-rpg').getAttribute('data-motion'),'hero');
  const firstPosition=await p.locator('.orbe-hero .orbe-sprite').evaluate(e=>getComputedStyle(e).backgroundPosition);
  await p.waitForFunction(previous=>getComputedStyle(document.querySelector('.orbe-hero .orbe-sprite')).backgroundPosition!==previous,firstPosition);
  assert.equal(await p.locator('.orbe-hero-art').evaluate(e=>getComputedStyle(e).visibility),'hidden');
  await p.screenshot({path:__dirname+'/preview-sprite-kael.png',fullPage:true});
  await p.waitForFunction(()=>document.querySelector('.orbe-rpg')?.dataset.motion==='enemy');
  assert.equal(await p.locator('.orbe-enemy-art').evaluate(e=>getComputedStyle(e).visibility),'hidden');
  await p.screenshot({path:__dirname+'/preview-sprite-lethon.png',fullPage:true});
  await p.waitForFunction(()=>document.querySelector('.orbe-rpg')?.dataset.screen==='battle');
  assert.equal(await p.locator('.orbe-hero-art').evaluate(e=>getComputedStyle(e).visibility),'visible');await p.keyboard.press('Escape');
  await p.goto(base+'/defensa-orbe/revision.html');await p.locator('[data-action=orbe]').click();await p.locator('[data-orbe-next]').click();
  await p.waitForFunction(()=>document.querySelector('.orbe-hero')?.dataset.spriteReady==='1');
  await p.locator('[data-orbe-action=evaluacion]').click();
  const kiraTitle=await p.locator('#orbe-quiz-question').innerText(),kiraQuestion=Quiz.bank.find(q=>q.question===kiraTitle);
  await p.locator('[data-quiz-option="'+kiraQuestion.correct+'"]').click();await p.locator('[data-quiz-execute]').click();
  assert.match(await p.locator('.orbe-hero .orbe-sprite').evaluate(e=>getComputedStyle(e).backgroundImage),/kira-ataque/);
  assert.equal(await p.locator('.orbe-hero .orbe-sprite').evaluate(e=>getComputedStyle(e).animationName),'orbe-frames');
  await p.screenshot({path:__dirname+'/preview-sprite-kira.png',fullPage:true});
  await p.waitForFunction(()=>document.querySelector('.orbe-rpg')?.dataset.screen==='battle');await p.keyboard.press('Escape');
  // Si falta un atlas se conserva el retrato y la batalla sigue disponible.
  await p.route('**/kira-ataque-v3.webp',r=>r.abort());await p.goto(base+'/defensa-orbe/revision.html');await p.locator('[data-action=orbe]').click();await p.locator('[data-orbe-next]').click();
  await p.emulateMedia({reducedMotion:'reduce'});await chooseAndAnswer(p,'maestria');
  assert.equal(await p.locator('.orbe-hero-art').evaluate(e=>getComputedStyle(e).visibility),'visible');await p.keyboard.press('Escape');await p.unroute('**/kira-ataque-v3.webp');
  await p.emulateMedia({reducedMotion:'reduce'});
  const live=ctx;
  await live.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin===base)return r.continue();if(u.origin==='https://nespinozagonzalez-hub.github.io'&&u.pathname.startsWith('/misiones/'))return r.fulfill({path:path.join(root,u.pathname.slice('/misiones/'.length))});external.push(u.origin);return r.abort();});
  await live.addInitScript(()=>{window.google={script:{run:{withSuccessHandler(ok){return {withFailureHandler(bad){return {ludariaApi(request){window.qaApi(request).then(ok).catch(bad);}};}};}}}};});
  const cloud=await live.newPage();await cloud.setViewportSize({width:390,height:844});cloud.on('pageerror',e=>errors.push(e.message));await cloud.exposeFunction('qaApi',q=>{requests.push(q);return send(q);});
  await cloud.goto(base+'/cloud#pantalla-1');const f=cloud.locator('#cloud-login');await f.locator('[name=name]').fill('Buscadora QA');await f.locator('[name=key]').fill('314159');await f.locator('[type=submit]').click();
  await cloud.locator('[data-action=orbe]').waitFor();assert.equal(await cloud.locator('#page-count').innerText(),'12 / 12','Retoma el cierre conservando #pantalla-1 original');
  await cloud.locator('[data-action=orbe]').click();assert.equal(await cloud.locator('.orbe-hero .orbe-nameplate strong').innerText(),'Buscadora QA');
  await fight(cloud);await cloud.locator('[data-orbe-next]').click();
  await cloud.getByText('Restauración confirmada en tu cuaderno.',{exact:false}).waitFor();
  const saved=send({action:'cargarMision',access:account.access,data:{mission:'defensa-orbe'}}).snapshot;
  assert.deepEqual(saved.fields,original.fields);assert.deepEqual(saved.checks,original.checks);assert.equal(saved.open,true);
  assert.equal(JSON.stringify(t.sheets.get('Movimientos').data),movesBefore,'XP, saldo, runas y movimientos intactos');assert.equal(JSON.stringify(t.sheets.get('Personajes').data),peopleBefore,'Identidad intacta');
  const countBefore=requests.filter(r=>r.action==='guardarMision').length;
  await cloud.locator('[data-orbe-next]').click();await cloud.locator('[data-action=orbe]').click();await fight(cloud);await cloud.locator('[data-orbe-next]').click();
  assert.equal(requests.filter(r=>r.action==='guardarMision').length,countBefore,'Repetir la ceremonia no genera otro guardado');
  assert.deepEqual(errors,[]);assert.deepEqual(external,[],'Toda la QA quedó aislada de servicios externos');
  console.log('PASS Orbe: seis encuadres, preguntas para ataque y defensa, error/pista/reintento, cancelación, atlas Kael y Lethon con poses distintas, movimiento reducido y respaldo sin atlas, victoria, epílogo y cuaderno/identidad/XP/saldo intactos con servicios simulados.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
