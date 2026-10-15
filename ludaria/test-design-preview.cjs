/** Vista de diseño con DOM local. Nunca utiliza Google ni una planilla real. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {JSDOM, ResourceLoader, VirtualConsole} = require('jsdom');
const catalogue = require('./rpg-catalog.js');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(__dirname, 'vista-bienvenida.html'), 'utf8');
const pause = () => new Promise(resolve => setTimeout(resolve, 5));
async function until(check, label) {
  for (let attempt = 0; attempt < 300; attempt++) {
    if (check()) return;
    await pause();
  }
  throw Error('Espera agotada: ' + label);
}

async function inspect(query) {
  const network = [], errors = [];
  class LocalResources extends ResourceLoader {
    fetch(url) {
      const parsed = new URL(url);
      if (parsed.origin !== 'https://preview.test') {
        network.push('script externo');
        return null;
      }
      const file = path.join(root, parsed.pathname);
      assert.ok(file.startsWith(root + path.sep), 'Recursos dentro del repositorio');
      assert.ok(fs.existsSync(file), 'Recurso local presente');
      return Promise.resolve(fs.readFileSync(file));
    }
  }
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://preview.test/ludaria/vista-bienvenida.html' + query,
    runScripts: 'dangerously',
    resources: new LocalResources(),
    virtualConsole: console,
    beforeParse(window) {
      window.crypto.randomUUID = crypto.randomUUID;
      window.matchMedia = () => ({matches: false, addEventListener() {}, removeEventListener() {}});
      window.scrollTo = () => {};
      window.HTMLDialogElement.prototype.showModal = function() { this.open = true; };
      window.HTMLDialogElement.prototype.close = function() {
        this.open = false;
        this.dispatchEvent(new window.Event('close'));
      };
      // Fallar y bloquear antes de que una regresión intente salir a la red.
      window.fetch = () => { network.push('fetch'); throw Error('Red bloqueada en la prueba de diseño'); };
      window.XMLHttpRequest.prototype.open = function() {
        network.push('xhr');
        throw Error('Red bloqueada en la prueba de diseño');
      };
      window.navigator.sendBeacon = () => { network.push('beacon'); return false; };
    }
  });
  try {
    const window = dom.window, document = window.document;
    await until(() => document.querySelector('#cloud-login'), 'bienvenida ' + query);
    for (const panel of ['login', 'register', 'recover']) {
      document.querySelector('[data-access-panel="' + panel + '"]').click();
      const form = document.querySelector('#cloud-' + panel);
      form.elements.name.value = 'Persona de diseño';
      form.elements.key.value = '314159';
      if (form.elements.keyConfirm) form.elements.keyConfirm.value = '314159';
      if (form.elements.recoveryCode) form.elements.recoveryCode.value = 'RES-PRUEBA-SIN-VALIDEZ';
      form.dispatchEvent(new window.Event('submit', {bubbles: true, cancelable: true}));
      await until(() => !form.querySelector('button[type=submit]').disabled, panel + ' ' + query);
      assert.match(document.querySelector('#cloud-error').textContent, /vista de diseño/, panel + ': sin falso éxito');
      assert.equal(window.LudariaCloud.profile, null, panel + ': no autenticar ni crear un perfil');
    }
    assert.deepEqual(network, [], query + ': ninguna llamada externa de scripts o API');
    assert.deepEqual(errors, [], query + ': sin errores de DOM');
    assert.equal(window.sessionStorage.length, 0, query + ': sin sesión ni credenciales persistidas');
    assert.equal(window.localStorage.length, 0, query + ': sin progreso de prueba persistido');
  } finally {
    dom.window.close();
  }
}

(async () => {
  const queries = ['?mision=forja', '?entrada=mochi', '?mision=mision-0',
    ...catalogue.missions.map(mission => '?mision=' + mission.slug)];
  for (const query of queries) await inspect(query);
  console.log('PASS vista de diseño: ' + queries.length + ' contextos y ' + queries.length * 3 +
    ' envíos simulados bloqueados, sin llamadas externas de scripts/API ni credenciales persistidas. DOM local; no acredita escrituras en Google.');
})().catch(error => { console.error(error); process.exit(1); });
