/** QA aislada del cierre: red externa bloqueada, datos ficticios y servidor en memoria. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const {context,setSource}=require('./mock.cjs');
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
   await p.setViewportSize(size);await p.goto(base+'/defensa-orbe/revision.html');
   await p.evaluate(()=>localStorage.setItem('QA-preserved','no modificar'));
   const before=await p.evaluate(()=>JSON.stringify(Object.entries(localStorage)));
   await p.locator('[data-action=orbe]').click();await p.locator('dialog.orbe-rpg').waitFor();
   await p.waitForFunction(()=>[...document.querySelectorAll('.orbe-rpg img')].every(i=>i.complete&&i.naturalWidth>0));
   assert.equal(await p.locator('.orbe-rpg').evaluate(d=>d.scrollWidth<=d.clientWidth+1),true,'Sin desborde horizontal '+JSON.stringify(size));
   assert.equal(await p.locator('[data-orbe-action]').count(),5,'Cinco acciones accesibles sin requisito de atributo');
   await p.screenshot({path:__dirname+`/preview-orbe-${size.width}x${size.height}.png`,fullPage:true});
   // Cerrar antes de terminar no restaura ni escribe datos.
   await p.keyboard.press('Escape');await p.locator('dialog.orbe-rpg').waitFor({state:'detached'});assert.equal(await p.locator('#orbe').evaluate(el=>el.classList.contains('restored')),false);
   assert.equal(await p.evaluate(()=>JSON.stringify(Object.entries(localStorage))),before);
   await p.locator('[data-action=orbe]').click();
   for(let n=0;n<4;n++){await p.locator('[data-orbe-action]').nth(n%5).click();assert.equal(await p.locator('progress').getAttribute('value'),String(n+1));if(n<3)await p.locator('[data-orbe-next]').click();}
   assert.equal(await p.locator('#orbe').evaluate(el=>el.classList.contains('restored')),false,'Cuatro fases visuales no confirman todavía el cuaderno');
   await p.locator('[data-orbe-next]').click();assert.equal(await p.locator('#orbe').evaluate(el=>el.classList.contains('restored')),true);
   assert.equal(await p.evaluate(()=>JSON.stringify(Object.entries(localStorage))),before,'Revisión no escribe estado');
   await p.locator('[data-orbe-next]').click();await p.locator('dialog.orbe-rpg').waitFor({state:'detached'});
  }
  const live=ctx;
  await live.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin===base)return r.continue();if(u.origin==='https://nespinozagonzalez-hub.github.io'&&u.pathname.startsWith('/misiones/'))return r.fulfill({path:path.join(root,u.pathname.slice('/misiones/'.length))});external.push(u.origin);return r.abort();});
  await live.addInitScript(()=>{window.google={script:{run:{withSuccessHandler(ok){return {withFailureHandler(bad){return {ludariaApi(request){window.qaApi(request).then(ok).catch(bad);}};}};}}}};});
  const cloud=await live.newPage();await cloud.setViewportSize({width:390,height:844});cloud.on('pageerror',e=>errors.push(e.message));await cloud.exposeFunction('qaApi',q=>{requests.push(q);return send(q);});
  await cloud.goto(base+'/cloud#pantalla-1');const f=cloud.locator('#cloud-login');await f.locator('[name=name]').fill('Buscadora QA');await f.locator('[name=key]').fill('314159');await f.locator('[type=submit]').click();
  await cloud.locator('[data-action=orbe]').waitFor();assert.equal(await cloud.locator('#page-count').innerText(),'12 / 12','Retoma el cierre conservando #pantalla-1 original');
  await cloud.locator('[data-action=orbe]').click();assert.equal(await cloud.locator('.orbe-hero .orbe-fighter-name').innerText(),'Buscadora QA');
  for(let n=0;n<4;n++){await cloud.locator('[data-orbe-action=camaraderia]').click();await cloud.locator('[data-orbe-next]').click();}
  await cloud.getByText('Restauración confirmada en tu cuaderno.',{exact:false}).waitFor();
  const saved=send({action:'cargarMision',access:account.access,data:{mission:'defensa-orbe'}}).snapshot;
  assert.deepEqual(saved.fields,original.fields);assert.deepEqual(saved.checks,original.checks);assert.equal(saved.open,true);
  assert.equal(JSON.stringify(t.sheets.get('Movimientos').data),movesBefore,'XP, saldo, runas y movimientos intactos');assert.equal(JSON.stringify(t.sheets.get('Personajes').data),peopleBefore,'Identidad intacta');
  const countBefore=requests.filter(r=>r.action==='guardarMision').length;
  await cloud.locator('[data-orbe-next]').click();await cloud.locator('[data-action=orbe]').click();for(let n=0;n<4;n++){await cloud.locator('[data-orbe-action=sabiduria]').click();await cloud.locator('[data-orbe-next]').click();}
  assert.equal(requests.filter(r=>r.action==='guardarMision').length,countBefore,'Repetir la ceremonia no genera otro guardado');
  assert.deepEqual(errors,[]);assert.deepEqual(external,[],'Toda la QA quedó aislada de servicios externos');
  console.log('PASS Orbe: seis encuadres, imágenes decodificadas, teclado, cancelación, cuatro fases, todas las rutas sin umbrales, repetición y cuaderno/identidad/XP/saldo intactos con servicios simulados.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
