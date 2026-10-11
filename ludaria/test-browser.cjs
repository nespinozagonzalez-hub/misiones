/** Integración local del navegador con un doble de Apps Script. Nunca llama al Sheet real. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const {context,setSource} = require('./mock.cjs');
setSource(fs.readFileSync(__dirname+'/Code-Ludaria-Conectado.gs','utf8'));
const t=context();t.run('prepararConexionLudaria()');
const root=path.resolve(__dirname,'..');
const errors=[];
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');let file=path.join(root,url.pathname);
  if(url.pathname==='/cloud'){
    const route=url.searchParams.get('mision')||'forja';
    let html=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
    html=html.replace(/<head[^>]*>/i,h=>h+`<base href="/${route}/"><script>window.LUDARIA_CLOUD_CONFIG=${JSON.stringify({route,market:url.searchParams.get('entrada')==='mochi'})};window.FORJA_ENTRY=${url.searchParams.get('entrada')==='mochi'};</script><script src="/ludaria/client.js"></script>`);
    res.setHeader('content-type','text/html');res.end(html);return;
  }
  if(url.pathname==='/frame') {res.setHeader('content-type','text/html');res.end('<iframe title="Genially fixture" style="width:100%;height:720px;border:0" src="/cloud"></iframe>');return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.statusCode=404;res.end();return;}
  res.setHeader('content-type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'text/plain');res.end(fs.readFileSync(file));
});
const bridge=()=>{
  window.google={script:{run:{withSuccessHandler(success){
    return {withFailureHandler(failure){
      return {ludariaApi(request){window.mockApi(request).then(success).catch(failure);}};
    }};
  }}}};
};
async function login(page,name,key){const f=page.locator('#cloud-login');await f.locator('[name=name]').fill(name);await f.locator('[name=key]').fill(key);await f.locator('button').click();await page.locator('.ludaria-cloud-dialog').waitFor({state:'hidden'});}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true});
  async function createPage(viewport={width:1280,height:900}){
    const ctx=await browser.newContext({viewport});await ctx.addInitScript(bridge);
    await ctx.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('Storage blocked fixture');};Storage.prototype.getItem=function(){throw Error('Storage blocked fixture');};});
    const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
    await p.exposeFunction('mockApi',r=>{t.c.request=r;return JSON.parse(JSON.stringify(t.run('ludariaApi(request)')));});
    await p.route('https://fonts.googleapis.com/**',r=>r.abort());await p.route('https://fonts.gstatic.com/**',r=>r.abort());
    return p;
  }
  try{
    const p=await createPage();await p.goto(base+'/cloud');
    await p.locator('.ludaria-cloud-dialog').waitFor();
    assert.equal(await p.locator('.ludaria-cloud-dialog').evaluate(d=>d.contains(document.activeElement)),true);
    await p.locator('.ludaria-cloud-dialog summary').click();
    const form=p.locator('#cloud-register');await form.locator('[name=name]').fill('Exploradora de prueba');await form.locator('button').click();
    await p.locator('#cloud-key-value').waitFor();const key=await p.locator('#cloud-key-value').inputValue();assert.match(key,/^LUD-/);
    await p.screenshot({path:__dirname+'/preview-clave.png',fullPage:true});
    await p.locator('#cloud-continue').click();await p.locator('#app').waitFor({state:'visible'});
    await p.locator('[data-go=codigos]').first().click();await p.locator('#code').fill('AXR314');await p.locator('#rune-form button').click();
    await p.waitForFunction(()=>window.LudariaCloud.profile.points===5);
    await p.keyboard.press('Escape');
    await p.locator('[data-go=misiones]').first().click();assert.equal(await p.locator('.mission a').count(),0);
    const m=await createPage({width:390,height:844});await m.goto(base+'/cloud?entrada=mochi');await login(m,'EXPLORADORA DE PRUEBA',key);
    await m.locator('[data-skill-info=maestria]').first().click();await m.locator('#modal details summary').click();assert.equal(await m.locator('#modal').innerText().then(s=>s.includes('vista previa')),true);await m.keyboard.press('Escape');
    for(let i=0;i<4;i++)await m.locator('[data-allocate=maestria][data-delta="1"]').click();
    await m.locator('[data-action=checkout]').click();await m.locator('[data-action=buy]').click();
    await m.waitForFunction(()=>window.LudariaCloud.profile.skills.maestria===5);
    assert.equal(await m.evaluate(()=>window.LudariaCloud.profile.points),1);await m.keyboard.press('Escape');
    assert.equal(await m.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await m.screenshot({path:__dirname+'/preview-mochi-mobile.png',fullPage:true});
    const v=await createPage();await v.goto(base+'/cloud?mision=vetas-diseno');await login(v,'Exploradora de prueba',key);await v.locator('#stage h1, #stage h2').first().waitFor();
    await v.locator('[data-cloud-advantage]').click();await v.locator('.ludaria-cloud-dialog h2').waitFor();assert.ok((await v.locator('.ludaria-cloud-dialog').innerText()).includes('Dinámicas:'));await v.keyboard.press('Escape');
    await v.locator('[data-action=notebook]').first().click();await v.locator('[data-field=note]').fill('Mi nota recuperable en otra sesión');
    await v.locator('[data-cloud-save]').click({force:true});await v.waitForFunction(()=>!window.LudariaCloud.hasPending);
    await v.keyboard.press('Escape');await v.screenshot({path:__dirname+'/preview-vetas.png',fullPage:true});
    const v2=await createPage();await v2.goto(base+'/cloud?mision=vetas-diseno');await login(v2,'exploradora de prueba',key);await v2.locator('[data-action=notebook]').first().click();assert.equal(await v2.locator('[data-field=note]').inputValue(),'Mi nota recuperable en otra sesión');await v2.keyboard.press('Escape');
    await m.locator('[data-go=inventario]').first().click();await m.locator('[data-action=redistribute]').click();
    await m.locator('#redistribute-maestria').fill('1');await m.locator('[data-action=redistribute-confirm]').click();await m.waitForFunction(()=>window.LudariaCloud.profile.skills.maestria===1);assert.equal(await m.evaluate(()=>window.LudariaCloud.profile.points),5);
    await v2.locator('[data-cloud-advantage]').click();await v2.waitForFunction(()=>document.querySelector('[data-cloud-status]').textContent.includes('requiere Maestría 5'));
    const f=await createPage();await f.goto(base+'/frame');const frame=f.frameLocator('iframe');await frame.locator('#cloud-login [name=name]').fill('Exploradora de prueba');await frame.locator('#cloud-login [name=key]').fill(key);await frame.locator('#cloud-login button').click();await frame.locator('#app').waitFor({state:'visible'});
    assert.deepEqual(errors,[]);console.log('PASS: alta y clave, recuperación entre sesiones sin localStorage, compras, demo previa, cuaderno central, retirada de ventaja, móvil 390px, foco de acceso e iframe local 720px. No prueba el despliegue real de Google.');
  }catch(error){console.error('Errores del navegador:',errors);for(const page of browser.contexts().flatMap(c=>c.pages())){console.error('Estado:',page.url(),await page.locator('#stage').textContent().catch(()=>''));}throw error;}
  finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
