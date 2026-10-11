/** Navegación de iframe con destinos interceptados. Nunca valida Google real. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('playwright');
const gateway = fs.readFileSync(__dirname + '/gateway.js', 'utf8');
const deployment = 'https://script.google.com/macros/s/TEST_ONLY_12345678901234567890/exec';
const origin = 'https://nespinozagonzalez-hub.github.io';
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const context = await browser.newContext({viewport:{width:390,height:844}});
    const seen = [];
    await context.route(origin+'/**', route => {
      const u = new URL(route.request().url());
      const fixture = u.pathname === '/frame';
      const config = {enabled:!u.searchParams.has('disabled'),verified:true,deployment,routes:['forja','vetas-diseno']};
      route.fulfill({contentType:'text/html; charset=utf-8',body: fixture ? '<iframe title="Prueba del contenedor" style="width:100%;height:720px" src="/misiones/vetas-diseno/presentacion.html?key=private&name=private#pantalla-5"></iframe>' : '<html lang="es"><head><script>window.LUDARIA_GATEWAY='+JSON.stringify(config)+';</script><script>'+gateway+'</script></head><body><h1>Presentación local</h1></body></html>'});
    });
    await context.route('https://script.google.com/**', route => {
      seen.push(route.request().url());
      route.fulfill({contentType:'text/html; charset=utf-8',body:'<h1>Destino interceptado de prueba</h1>'});
    });
    const p = await context.newPage();
    await p.goto(origin+'/misiones/forja/?disabled=1');
    await p.locator('h1').waitFor();assert.equal(await p.locator('h1').innerText(),'Presentación local');assert.equal(seen.length,0);
    await p.goto(origin+'/misiones/forja/?entrada=mochi&key=private');
    await p.waitForURL(deployment+'?entrada=mochi');assert.equal(await p.locator('h1').innerText(),'Destino interceptado de prueba');
    await p.goto(origin+'/frame');
    await p.frameLocator('iframe').getByRole('heading',{name:'Destino interceptado de prueba'}).waitFor();
    assert.equal(seen.at(-1),deployment+'?mision=vetas-diseno');
    const frame = p.frames().find(f=>f.url().startsWith(deployment));assert.equal(new URL(frame.url()).hash,'#pantalla-5');
    assert.ok(seen.every(url=>!url.includes('private')));
    await p.screenshot({path:__dirname+'/preview-entrada-iframe.png',fullPage:true});
    console.log('Entrada: modo desactivado, Mochi e iframe móvil con destino interceptado OK; Google/Genially reales pendientes.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
