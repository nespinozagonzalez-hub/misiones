/** Entradas reales e interfaz RPG con servicios simulados, sin datos de participantes. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright'),{context,setSource}=require('./mock.cjs'),catalog=require('./rpg-catalog.js');
const root=path.resolve(__dirname,'..');setSource(fs.readFileSync(__dirname+'/Code-Ludaria-Conectado.gs','utf8'));const t=context();t.run('prepararConexionLudaria()');
// El reloj del doble representa acciones humanas; no 300 solicitudes en segundos de CI.
let simulatedTime=Date.now();const RealDate=Date;t.c.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[simulatedTime]));}static now(){return simulatedTime;}};
const uid=()=>crypto.randomUUID();const send=q=>{simulatedTime+=1000;t.c.request=q;return JSON.parse(JSON.stringify(t.run('ludariaApi(request)')));};
let person=send({action:'registrar',requestId:uid(),data:{name:'Ensayo de guardianes',class:'Kira',key:'314159',keyConfirm:'314159'}});const key=person.key,access=person.access;
const call=(action,data)=>{const r=send({action,data,access,expectedRevision:person.revision,requestId:uid()});assert.equal(r.ok,true,r.message);if(r.profile)person=r;return r;};
for(const code of ['ECO101','AXR314','LUM582','VYR207','NEX451','ORB126','KRN693','ZEN248','ELD570','MIR831','ARC419','NEB264','CYR905','ORB714'])call('runa',{code});
call('redistribuir',{skills:Object.fromEntries(Object.keys(catalog.attributes).map(k=>[k,8]))});
t.c.UrlFetchApp.fetch=url=>({getResponseCode:()=>200,getContentText:()=>fs.readFileSync(path.join(root,url.replace('https://raw.githubusercontent.com/nespinozagonzalez-hub/misiones/main/','')),'utf8')});
const mimeTypes={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/frame'){const slug=url.searchParams.get('mision');if(!catalog.find(slug)){res.statusCode=404;res.end();return;}res.setHeader('content-type','text/html');res.end('<!doctype html><html lang="es"><body><iframe title="Prueba local de Ludaria" src="/cloud?mision='+encodeURIComponent(slug)+'#pantalla-1" style="width:100%;height:720px;border:0"></iframe></body></html>');return;}if(url.pathname==='/cloud'){const slug=url.searchParams.get('mision')||'forja';t.c.params={parameter:{mision:slug}};res.setHeader('content-type','text/html');res.end(t.run('doGet(params).html').replace('https://nespinozagonzalez-hub.github.io/misiones/'+slug+'/', '/'+slug+'/'));return;}let file=path.join(root,url.pathname);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.statusCode=404;res.end();return;}res.setHeader('content-type',mimeTypes[path.extname(file)]||'text/html');res.end(fs.readFileSync(file));});
async function enterCharacter(surface, name, pin) {
 const form=surface.locator('#cloud-login');
 await form.locator('[name=name]').fill(name);
 await form.locator('[name=key]').fill(pin);
 await form.locator('button[type=submit]').click();
 await form.waitFor({state:'hidden'});
}
async function login(p){try{await enterCharacter(p,'Ensayo de guardianes',key);await p.waitForFunction(()=>document.querySelector('#stage')?.textContent.trim().length>50);}catch(e){console.error('Estado de entrada:',p.url(),await p.locator('body').innerText());throw e;}}

async function checkGemaJourney(browser, base) {
 const name='Buscadora de la Gema de prueba';
 const pilot=send({action:'registrar',requestId:uid(),data:{name,class:'Kira',key:'314159',keyConfirm:'314159'}});
 assert.equal(pilot.ok,true,pilot.message);
 const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const errors=[];
 let failNextSave=false;
 await context.exposeFunction('mockApi',request=>{
  if(failNextSave&&request.action==='guardarMision'){
   failNextSave=false;
   return {ok:false,message:'Fallo de confirmación simulado'};
  }
  return send(request);
 });
 await context.addInitScript(()=>{
  window.google={script:{run:{withSuccessHandler:success=>({withFailureHandler:failure=>({ludariaApi:request=>window.mockApi(request).then(success).catch(failure)})})}}};
 });
 await context.route('https://fonts.googleapis.com/**',route=>route.abort());
 await context.route('https://fonts.gstatic.com/**',route=>route.abort());
 // El gateway real se prueba aparte. Aquí se mantiene la Forja conectada al servidor simulado.
 await context.route(base+'/forja/',route=>route.fulfill({status:302,headers:{location:base+'/cloud?mision=forja'}}));
 const page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 try {
  await page.goto(base+'/gema-motivacional/presentacion.html#pantalla-1');
  await page.locator('#route-dots [data-page="3"]').click();
  await page.locator('#stage [data-field=initial]').fill('Lectura de prueba en modo local.');
  await page.goto(base+'/gema-motivacional/index.html#pantalla-1');
  assert.equal(await page.locator('#page-count').innerText(),'4 / 12');
  assert.equal(await page.locator('#stage [data-field=initial]').inputValue(),'Lectura de prueba en modo local.');
  assert.match(await page.locator('#saved-note').innerText(),/guardado en este dispositivo/);

  await page.goto(base+'/frame?mision=gema-motivacional');
  const mission=page.frameLocator('iframe');
  await enterCharacter(mission,name,pilot.key);
  const route=mission.getByRole('region',{name:'Ruta de práctica de la Gema'});
  await route.waitFor();
  const milestones=route.locator('li');
  const step=route.locator('[aria-current=step]');
  const go=number=>mission.locator('#route-dots [data-page="'+(number-1)+'"]').click();
  const saveNote=mission.locator('#saved-note');
  const saveDraft=()=>mission.locator('[data-cloud-save]').click();

  assert.equal(await milestones.count(),4);
  assert.match(await step.innerText(),/Explora/);
  await mission.getByRole('button',{name:'Preparar mochila'}).click();
  const preparation=mission.locator('#modal[open]');
  assert.equal(await preparation.getByRole('button',{name:/^Equipar/}).count(),0);
  assert.equal(await preparation.getByText('Bloqueado',{exact:true}).count(),3);
  assert.deepEqual(await preparation.locator('.gema-item-effect > strong').allTextContents(),[
   '3 preguntas para leer el caso','2 formas de abordar el dilema','1 prueba de inclusión'
  ]);
  assert.match(await preparation.getByRole('article',{name:'Tres facetas'}).innerText(),/Requiere Sabiduría 3 · Tienes 1/);
  assert.match(await preparation.getByRole('article',{name:'Ensayo del cuidado'}).innerText(),/Requiere Evaluación 8 · Tienes 1/);
  const itemImages=preparation.locator('.gema-item-slot img');
  assert.equal(await itemImages.count(),3);
  await itemImages.evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  assert.equal(await preparation.evaluate(dialog=>dialog.getBoundingClientRect().bottom<=innerHeight),true);
  await preparation.getByRole('button',{name:'Entrar sin equipar'}).click();
  assert.equal(await mission.locator('#page-count').innerText(),'2 / 12');
  await go(12);
  assert.match(await step.innerText(),/Cierra/);
  assert.equal(await route.locator('.has-evidence').count(),0,'Visitar el cierre solo cambia la ubicación');
  await mission.getByRole('button',{name:'Activar cierre en clase'}).click();
  assert.equal(await route.locator('.has-evidence').count(),0,'El gesto narrativo no anota una reflexión');
  const beforeRune=send({action:'cargar',access:pilot.access}).profile;
  assert.deepEqual(beforeRune.codes,[]);
  assert.equal(beforeRune.xp,0);
  assert.equal(beforeRune.points,0);

  await go(3);
  for(const lens of ['Autonomía','Competencia','Vinculación']) {
   await mission.getByRole('button',{name:new RegExp(lens)}).click();
   await mission.locator('#modal[open] [data-action=close]').click();
  }
  assert.match(await milestones.nth(0).innerText(),/3\/3 facetas/);
  await go(4);
  assert.match(await step.innerText(),/Interpreta/);
  await mission.getByRole('button',{name:'Hay una tensión',exact:true}).click();
  assert.match(await mission.locator('.gema-reading').innerText(),/Elegiste «Hay una tensión»/);
  await saveDraft();
  await saveNote.filter({hasText:'Cuaderno confirmado en tu bitácora'}).waitFor();
  failNextSave=true;
  const reading=mission.locator('#stage [data-field=initial]');
  await reading.fill('La regla de rapidez puede reducir las preguntas.');
  assert.match(await milestones.nth(1).innerText(),/Lectura anotada/);
  assert.equal(await reading.evaluate(element=>element===document.activeElement),true);
  await saveDraft();
  await saveNote.filter({hasText:'Sin confirmar: Fallo de confirmación simulado'}).waitFor();
  await saveDraft();
  await saveNote.filter({hasText:'Cuaderno confirmado en tu bitácora'}).waitFor();

  await go(5);
  const question=mission.locator('#stage');
  await question.locator('[data-action=choice][data-option="1"]').click();
  await question.getByRole('button',{name:'Revisar mi decisión'}).click();
  assert.match(await question.locator('[data-gema-feedback]').innerText(),/Revisa tu decisión o pide una pista/);
  await question.locator('[data-action=choice][data-option="0"]').click();
  await question.getByRole('button',{name:'Revisar mi decisión'}).click();
  await mission.locator('#modal[open]').getByText('Tu siguiente paso.').waitFor();
  await mission.locator('#modal[open] [data-action=close]').click();
  assert.match(await question.locator('[data-gema-feedback]').innerText(),/Sello abierto/);

  await go(8);
  assert.match(await step.innerText(),/Rediseña/);
  await mission.getByRole('tab',{name:'Rediseño'}).click();
  await mission.locator('#stage [data-field=rule]').fill('Reconocemos la explicación conjunta.');
  assert.match(await milestones.nth(2).innerText(),/Contraste pendiente/);
  await mission.getByRole('tab',{name:'Contraste'}).click();
  await mission.locator('#stage [data-field=evidence]').fill('Observaremos las preguntas y los aportes.');
  assert.match(await milestones.nth(2).innerText(),/Regla y contraste/);
  await go(11);
  await mission.locator('#stage [data-field=exit]').fill('Cambiamos la regla que premiaba solo la rapidez.');
  await saveDraft();
  await saveNote.filter({hasText:'Cuaderno confirmado en tu bitácora'}).waitFor();
  await page.reload();
  await mission.locator('#stage [data-field=exit]').waitFor();
  assert.equal(await mission.locator('#page-count').innerText(),'11 / 12');
  assert.equal(await route.locator('.has-evidence').count(),4,'Las cuatro huellas se reconstruyen al recuperar el cuaderno');
  await go(12);
  const forgeLink=mission.getByRole('link',{name:'Abrir la Forja'});
  await forgeLink.waitFor();
  assert.match(await mission.locator('.gema-next-stop').innerText(),/Los Planos del Arquitecto/);
  const frame=page.frames().find(item=>item.url().includes('/cloud?mision=gema-motivacional'));
  assert.ok(frame);
  assert.equal(await frame.evaluate(()=>innerHeight),720);
  const fixedLayout=await frame.evaluate(()=>{
   const stage=document.querySelector('#stage');
   const bar=document.querySelector('#gema-route-rail');
   const footer=document.querySelector('.navigation');
   const before=[bar.getBoundingClientRect().top,footer.getBoundingClientRect().top];
   stage.scrollTop=stage.scrollHeight;
   return stage.scrollTop>0 && window.scrollY===0 &&
     before[0]===bar.getBoundingClientRect().top && before[1]===footer.getBoundingClientRect().top;
  });
  assert.equal(fixedLayout,true,'El contenido se desplaza y la ruta y navegación permanecen fijas');
  await forgeLink.scrollIntoViewIfNeeded();
  await page.screenshot({path:__dirname+'/preview-gema-cierre-720.png'});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await route.screenshot({path:__dirname+'/preview-gema-hitos-mobile.png'});

  const [forge]=await Promise.all([context.waitForEvent('page'),forgeLink.click()]);
  forge.on('pageerror',error=>errors.push(error.message));
  await forge.locator('[data-action=resume]').click();
  await enterCharacter(forge,name,pilot.key);
  await forge.getByRole('button',{name:'Mi viaje',exact:true}).click();
  const meter=forge.getByRole('progressbar',{name:'Etapas registradas en Ludaria'});
  assert.equal(await meter.getAttribute('value'),'0');
  assert.equal(await meter.getAttribute('max'),'14');
  await forge.getByRole('button',{name:'Runas',exact:true}).click();
  const [rune, award]=await forge.evaluate(()=>Object.entries(LudariaCore.CM).find(([,entry])=>entry.n==='La Gema Motivacional'));
  await forge.getByRole('textbox',{name:'Código del Saber'}).fill(rune);
  await forge.getByRole('button',{name:'Activar runa'}).click();
  await forge.locator('.reward-dialog').getByRole('button',{name:'Ver mi viaje'}).click();
  await meter.waitFor();
  assert.equal(await meter.getAttribute('value'),'1');
  const quarry=forge.locator('.journey-region').filter({has:forge.getByText('Cantera de los Elementos',{exact:true})});
  assert.equal(await quarry.getAttribute('open'),'');
  assert.equal(await quarry.locator('.journey-stop.is-registered').count(),1);
  assert.match(await quarry.locator('.mission.done').innerText(),/La Gema Motivacional[\s\S]*Registrada/);
  const afterRune=send({action:'cargar',access:pilot.access}).profile;
  assert.deepEqual(afterRune.codes,[rune]);
  assert.equal(afterRune.xp,award.x);
  assert.equal(afterRune.points,award.p);
  await forge.screenshot({path:__dirname+'/preview-gema-viaje.png'});
  await forge.setViewportSize({width:390,height:844});
  assert.equal(await forge.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  assert.deepEqual(errors,[]);
  console.log('PASS piloto Gema: huellas por acciones, feedback, fallo y confirmación de guardado, reanudación, marco de 720px y runa en Mi viaje. Servicios simulados.');
 } finally {
  await context.close();
 }
}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const browser=await chromium.launch({headless:true});const errors=[];
try{
 await checkGemaJourney(browser,base);
 const ctx=await browser.newContext({viewport:{width:390,height:844}});const setup=()=>{Storage.prototype.getItem=()=>{throw Error('Storage bloqueado');};Storage.prototype.setItem=()=>{throw Error('Storage bloqueado');};window.google={script:{run:{withSuccessHandler:success=>({withFailureHandler:failure=>({ludariaApi:q=>window.mockApi(q).then(success).catch(failure)})})}}};};await ctx.addInitScript(setup);
 for(const mission of catalog.missions){
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(mission.slug+': '+e.message));p.on('dialog',d=>d.type()==='beforeunload'?d.accept():d.dismiss());await p.exposeFunction('mockApi',send);await p.route('https://fonts.googleapis.com/**',r=>r.abort());await p.route('https://fonts.gstatic.com/**',r=>r.abort());await p.goto(base+'/cloud?mision='+mission.slug+'#pantalla-1');
  await p.locator('[data-access-scenery="'+mission.slug+'"]').waitFor();assert.equal(await p.locator('.ludaria-cloud-dialog h2').innerText(),mission.guardian);assert.equal(await p.locator('#cloud-register').isVisible(),false);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'Acceso móvil sin desbordamiento');if(mission.slug==='pergaminos-dispersos')await p.screenshot({path:__dirname+'/preview-acceso-mision-mobile.png',fullPage:true});await login(p);
  if(mission.slug==='gema-motivacional'){
   const before=await p.evaluate(()=>({points:LudariaCloud.profile.points,xp:LudariaCloud.profile.xp}));
   await p.setViewportSize({width:390,height:568});
   await p.getByRole('button',{name:'Preparar mochila'}).click();
   const pack=p.locator('#modal.gema-inventory[open]');
   const keepEntryVisible=await pack.evaluate(dialog=>{
    const items=dialog.querySelector('.gema-items');
    const entry=dialog.querySelector('[data-action=enter-session]');
    const before=entry.getBoundingClientRect();
    items.scrollTop=items.scrollHeight;
    const after=entry.getBoundingClientRect();
    return items.scrollTop>0 && items.scrollWidth<=items.clientWidth+1 && before.top===after.top && after.bottom<=innerHeight;
   });
   assert.equal(keepEntryVisible,true,'La acción de entrada sigue a la vista mientras se desplazan las fichas');
   await pack.locator('.gema-items').focus();
   assert.equal(await pack.locator('.gema-items').evaluate(items=>{
    window.dispatchEvent(new Event('ludaria:profile'));
    return items===document.activeElement;
   }),true,'Una actualización de atributos conserva el foco del inventario');
   await p.getByRole('button',{name:'Equipar Tres facetas'}).click();
   const remove=p.getByRole('button',{name:'Quitar Tres facetas'});
   assert.equal(await remove.evaluate(button=>button===document.activeElement),true);
   assert.equal(await pack.locator('.gema-pack-footer [role=status]').innerText(),'1 objeto equipado');
   assert.equal(await pack.getByRole('article',{name:'Tres facetas'}).getByText('Equipado',{exact:true}).count(),1);
   await p.getByRole('button',{name:'Equipar Ensayo del cuidado'}).click();
   assert.equal(await pack.locator('.gema-pack-footer [role=status]').innerText(),'2 objetos equipados');
   await p.getByRole('button',{name:'Quitar Ensayo del cuidado'}).click();
   await p.getByRole('button',{name:'Entrar a la sesión',exact:true}).click();
   await p.setViewportSize({width:390,height:844});
   await p.getByRole('button',{name:'Mochila de ventajas, 3 disponibles y 1 equipada'}).click();
   assert.equal(await pack.getByRole('button',{name:/^Usar/}).count(),1);
   await p.getByRole('button',{name:'Usar Tres facetas',exact:true}).click();
   await p.locator('.ludaria-cloud-dialog[open] h2').getByText('Tres facetas',{exact:true}).waitFor();
   await p.keyboard.press('Escape');
   assert.deepEqual(await p.evaluate(()=>({points:LudariaCloud.profile.points,xp:LudariaCloud.profile.xp})),before);
  }
  await p.locator('[data-cloud-advantage]').click();await p.locator('[data-rpg-open]').first().waitFor();assert.equal(await p.locator('[data-rpg-open]').count(),3);
  for(const perk of mission.perks){
   await p.locator('[data-rpg-open="'+perk.id+'"]').click();await p.locator('.ludaria-cloud-dialog[open] h2').getByText(perk.name,{exact:true}).waitFor();assert.ok((await p.locator('.ludaria-cloud-dialog').innerText()).includes(perk.text));assert.equal(await p.evaluate(()=>document.querySelector('dialog[open]')?.contains(document.activeElement)),true,mission.slug+' foco de ayuda cargada');
   if(perk.kind==='accion'){const f=p.locator('[data-rpg-form]');await f.locator('select').selectOption({label:perk.options[0]});await f.locator('[name=work]').fill('Ensayo contextual de '+mission.slug);await f.locator('[name=reflection]').fill('Elegí esta ruta para comparar sus consecuencias.');await f.locator('button[type=submit]').click();await p.getByText('Decisión confirmada en tu bitácora.',{exact:true}).waitFor();}
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,mission.slug+' ancho RPG');await p.keyboard.press('Escape');await p.locator('[data-cloud-advantage]').click();await p.locator('[data-rpg-open]').first().waitFor();
  }
  if(mission.egg){await p.locator('[data-rpg-egg]').click();await p.locator('.rpg-lore').waitFor();}
  await p.keyboard.press('Escape');
  let field=null;for(let step=0;step<35;step++){const candidate=p.locator('#stage textarea[data-field]:visible').first();if(await candidate.count()){field=await candidate.getAttribute('data-field');await candidate.fill('Cuaderno recuperable de '+mission.slug);break;}if(await p.locator('#next').isDisabled())break;await p.locator('#next').click();}
  assert.ok(field,'Falta campo de cuaderno '+mission.slug);await p.evaluate(()=>window.LudariaCloud.flushMission());assert.equal(await p.evaluate(()=>window.LudariaCloud.hasPending),false,mission.slug+' guardado');
  assert.equal(new URL(p.url()).pathname,'/cloud',mission.slug+' conserva la conexión al navegar');await p.reload();await login(p);assert.equal(await p.locator('#stage textarea[data-field="'+field+'"]:visible').inputValue(),'Cuaderno recuperable de '+mission.slug);
  assert.equal(await p.locator('[data-mochi-visit]').count(),0,mission.slug+' invitación solo al cierre');
  const beforeEnd=await p.evaluate(()=>({points:LudariaCloud.profile.points,xp:LudariaCloud.profile.xp}));
  // Abrir cada pantalla detecta errores de plantillas que no aparecen en la portada.
  const count=Number((await p.locator('#page-count, #page-number').innerText()).split('/')[1]);for(let step=0;step<count;step++){if(Number((await p.locator('#page-count, #page-number').innerText()).split('/')[0])===count||await p.locator('#next').isDisabled())break;await p.locator('#next').click();assert.ok((await p.locator('#stage').innerText()).length>30,mission.slug+' pantalla');}
  const invite=p.locator('[data-mochi-visit]');await invite.waitFor();assert.equal(await invite.count(),1);assert.equal(await invite.locator('a,button').count(),0);assert.ok((await invite.innerText()).includes('Veeen a mejorar tu personaje'));
  await invite.scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('[data-mochi-visit] img')?.naturalWidth>0);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,mission.slug+' cierre móvil');
  assert.deepEqual(await p.evaluate(()=>({points:LudariaCloud.profile.points,xp:LudariaCloud.profile.xp})),beforeEnd);
  await p.locator('[data-ludaria-effects] button').click();assert.equal(await invite.evaluate(e=>getComputedStyle(e).animationName),'none','Pausa detiene la invitación');await p.locator('[data-ludaria-effects] button').click();
  await p.evaluate(()=>window.LudariaCloud.flushMission());if(mission.slug==='pergaminos-dispersos'||mission.slug==='yunque')await p.screenshot({path:__dirname+'/preview-rpg-'+mission.slug+'.png',fullPage:true});await p.close();console.log('OK '+mission.slug);
 }
 // Las 13 entradas en escritorio y en un marco local de 720px. No es Genially.
 const desktop=await browser.newContext({viewport:{width:1280,height:960}});await desktop.addInitScript(setup);
 for(const mission of catalog.missions){for(const framed of [false,true]){const p=await desktop.newPage();p.on('pageerror',e=>errors.push(mission.slug+': '+e.message));await p.exposeFunction('mockApi',send);await p.route('https://fonts.googleapis.com/**',r=>r.abort());await p.route('https://fonts.gstatic.com/**',r=>r.abort());await p.goto(base+(framed?'/frame?mision=':'/cloud?mision=')+mission.slug+'#pantalla-1');const surface=framed?p.frames().find(f=>f.url().includes('/cloud?')):p;assert.ok(surface,mission.slug+' marco');await login(surface);await surface.locator('[data-cloud-advantage]').click();await surface.locator('[data-rpg-open]').first().waitFor();assert.equal(await surface.evaluate(()=>document.querySelector('dialog[open]')?.contains(document.activeElement)),true);await surface.locator('[data-rpg-open]').first().click();await surface.getByText(mission.perks[0].name,{exact:true}).waitFor();assert.equal(await surface.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await surface.locator('dialog[open]').press('Escape');assert.equal(await surface.evaluate(()=>document.activeElement?.hasAttribute('data-cloud-advantage')),true);if(framed&&mission.slug==='yunque')await p.screenshot({path:__dirname+'/preview-rpg-iframe-yunque.png',fullPage:true});await p.close();}console.log('ESCRITORIO/IFRAME preparado: '+mission.slug);}
 // La invitación se mantiene legible dentro del iframe y con movimiento reducido.
 const reduced=await browser.newContext({viewport:{width:1280,height:960},reducedMotion:'reduce'});await reduced.addInitScript(setup);const end=await reduced.newPage();await end.exposeFunction('mockApi',send);await end.route('https://fonts.googleapis.com/**',r=>r.abort());await end.route('https://fonts.gstatic.com/**',r=>r.abort());await end.goto(base+'/frame?mision=yunque');const finale=end.frames().find(f=>f.url().includes('/cloud?'));await login(finale);const last=Number((await finale.locator('#page-count').innerText()).split('/')[1]);
 // Un cuaderno compartido puede reabrirse en la última pantalla: volver a la portada
 // evita que «Mi registro» abra un diálogo modal y bloquee el botón Siguiente.
 await finale.locator('[data-action="go"][data-page="0"]').click();
 assert.equal(Number((await finale.locator('#page-count').innerText()).split('/')[0]),1);
 for(let step=1;step<last;step++)await finale.locator('#next').click();await finale.locator('[data-mochi-visit]').waitFor();await finale.locator('[data-mochi-visit]').scrollIntoViewIfNeeded();assert.equal(await finale.locator('[data-mochi-visit]').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await finale.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await finale.locator('#previous').click();assert.equal(await finale.locator('[data-mochi-visit]').count(),0);await finale.locator('#next').click();assert.equal(await finale.locator('[data-mochi-visit]').count(),1);await end.screenshot({path:__dirname+'/preview-mochi-cierre-iframe.png',fullPage:true});await reduced.close();
 await desktop.close();await ctx.close();
 // Las decisiones se recuperan sin pertenecer a otro jugador.
 const other=send({action:'registrar',requestId:uid(),data:{name:'Aislamiento navegador',class:'Kael',key:'314159',keyConfirm:'314159'}});const empty=send({action:'catalogoRpg',access:other.access,data:{mission:'yunque'}});assert.deepEqual(empty.responses,{});assert.equal(empty.perks.every(x=>!x.available),true);
 assert.deepEqual(errors,[]);console.log('PASS: 13 entradas HTML, 39 ventajas visibles, acciones/reflexiones, guardianes, cinco atributos, cuadernos entre recargas, pantallas, móvil, escritorio, foco e iframe local 720px sin localStorage. Servicios simulados; Google y Genially reales pendientes.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
