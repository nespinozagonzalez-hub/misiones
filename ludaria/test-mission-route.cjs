/** Guía de juego compartida: ruta de hitos, «Ahora» y momentos de juego en 12 misiones.
 * Servidor local en memoria, modo sin conexión central y red externa bloqueada. */
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'mission-entries.json'), 'utf8'));
const own = ['mision-0', 'gema-motivacional'];
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((request, response) => {
  const file = path.join(root, decodeURIComponent(new URL(request.url, 'http://x').pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  response.end(fs.readFileSync(file));
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch();
  const open = async (slug, viewport) => {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(base + slug + '/' + entries[slug]);
    await page.waitForSelector('#route-dots .route-dot');
    await page.waitForTimeout(200);
    return { page, errors };
  };
  const read = page => page.evaluate(() => {
    const dots = [...document.querySelectorAll('#route-dots .route-dot')];
    const milestones = [...document.querySelectorAll('#ludaria-ruta .ld-milestone')];
    return {
      total: dots.length,
      current: dots.findIndex(dot => dot.classList.contains('current') || ['page', 'step', 'true'].includes(dot.getAttribute('aria-current'))),
      milestones: milestones.length,
      phase: milestones.map((node, index) => node.getAttribute('aria-current') === 'step' ? index : -1).filter(index => index >= 0),
      heading: document.querySelector('#ludaria-ruta .ld-route-heading')?.textContent || '',
      now: document.querySelectorAll('#stage .ld-now').length,
      moves: document.querySelectorAll('#stage .ld-move').length,
      lead: document.querySelector('#stage .lead')?.textContent.trim() || '',
      overflow: document.documentElement.scrollWidth > innerWidth + 2
    };
  });

  let screens = 0, nowTags = 0, moveTags = 0, missions = 0;
  for (const slug of Object.keys(entries)) {
    const { page, errors } = await open(slug, { width: 1280, height: 720 });
    if (own.includes(slug)) {
      assert.equal(await page.locator('#ludaria-ruta').count(), 0, slug + ' conserva su propia guía');
      await page.close();
      continue;
    }
    missions++;
    let state = await read(page), previousPhase = 0, missionNow = 0, missionMoves = 0;
    assert.equal(state.milestones, 4, slug + ': cuatro hitos');
    for (let index = 0; index < state.total; index++) {
      state = await read(page);
      assert.equal(state.current, index, slug + ': pantalla ' + (index + 1));
      assert.equal(state.phase.length, 1, slug + ': un solo tramo actual en la pantalla ' + (index + 1));
      assert.ok(state.phase[0] >= previousPhase, slug + ': los tramos avanzan en orden');
      assert.match(state.heading, /Tramo [1-4] de 4/);
      assert.ok(state.now <= 1 && state.moves <= 1, slug + ': sin etiquetas repetidas');
      assert.ok(!/^Ahora\s+Ahora/i.test(state.lead), slug + ': «Ahora» no duplica el texto de la consigna');
      assert.equal(state.overflow, false, slug + ': sin desborde horizontal');
      if (index === 0) assert.equal(state.now + state.moves, 0, slug + ': la portada queda limpia');
      previousPhase = state.phase[0]; missionNow += state.now; missionMoves += state.moves; screens++;
      if (index < state.total - 1) {
        await page.evaluate(next => document.querySelectorAll('#route-dots .route-dot')[next].click(), index + 1);
        await page.waitForFunction(next => {
          const dot = document.querySelectorAll('#route-dots .route-dot')[next];
          return dot && (dot.classList.contains('current') || dot.getAttribute('aria-current') === 'page') &&
            document.querySelector('#ludaria-ruta .ld-milestone[aria-current="step"]');
        }, index + 1);
        await page.waitForTimeout(60);
      }
    }
    assert.equal(previousPhase, 3, slug + ': la última pantalla pertenece al cierre');
    if (slug === 'defensa-orbe') assert.equal(missionNow + missionMoves, 0, 'El cierre conserva sus instrumentos sin indicaciones añadidas');
    else assert.ok(missionNow > 0 && missionMoves > 0, slug + ': consignas y momentos de juego visibles');
    nowTags += missionNow; moveTags += missionMoves;
    // Todo el recorrido quedó visitado y un hito lleva al inicio de su tramo.
    assert.equal(await page.locator('#ludaria-ruta .ld-milestone.is-complete').count(), 4, slug + ': tramos recorridos');
    await page.locator('#ludaria-ruta .ld-milestone').nth(1).click();
    await page.waitForFunction(() => document.querySelectorAll('#ludaria-ruta .ld-milestone')[1].getAttribute('aria-current') === 'step');
    assert.deepEqual(errors, [], slug + ': sin errores de consola');
    await page.close();
  }
  assert.equal(missions, 12);

  // Una pantalla nueva empieza arriba en móvil, también donde la misión no lo hacía.
  for (const slug of ['pulido-prototipo', 'espejo-compartido']) {
    const { page } = await open(slug, { width: 390, height: 780 });
    await page.click('#next');
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.click('#next');
    await page.waitForFunction(() => scrollY === 0);
    await page.close();
  }
  // La tabla de comparación de Las Vetas cabe en un teléfono estrecho.
  {
    const { page } = await open('vetas-diseno', { width: 320, height: 700 });
    await page.evaluate(() => document.querySelectorAll('#route-dots .route-dot')[9].click());
    await page.waitForSelector('#stage .comparison');
    const sizes = await page.evaluate(() => { const table = document.querySelector('#stage .comparison'); return [table.offsetWidth, table.parentElement.clientWidth]; });
    assert.ok(sizes[0] <= sizes[1], 'La tabla no supera su contenedor');
    await page.close();
  }
  await browser.close();
  server.close();
  console.log('PASS guía de juego: ' + missions + ' misiones, ' + screens + ' pantallas, ' + nowTags + ' consignas «Ahora», ' + moveTags + ' momentos de juego, cuatro hitos navegables, inicio de pantalla en móvil y tabla adaptable. Sin conexión central ni datos reales.');
})().catch(error => { console.error(error); process.exit(1); });
