/** Prueba de navegación con dobles. No demuestra acceso a Google ni Genially. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(__dirname + '/gateway.js', 'utf8');
const deployment = 'https://script.google.com/macros/s/TEST_ONLY_12345678901234567890/exec';
const active = { enabled: true, verified: true, deployment, routes: ['forja', 'vetas-diseno'] };
function run(path, config = active, extra = {}) {
  let redirected;
  const href = 'https://nespinozagonzalez-hub.github.io/misiones/' + path;
  const location = {href, origin: new URL(href).origin, replace: value => { redirected = value; }};
  vm.runInNewContext(source, {window: {LUDARIA_GATEWAY: config, ...extra}, location, URL});
  return redirected;
}
assert.equal(run('forja/'), deployment);
assert.equal(run('forja/index.html?entrada=mochi'), deployment + '?entrada=mochi');
assert.equal(run('forja/?mochi=1'), deployment + '?entrada=mochi');
assert.equal(run('vetas-diseno/presentacion.html?v=old#pantalla-5'), deployment + '?mision=vetas-diseno#pantalla-5');
assert.equal(run('vetas-diseno/index.html?PIN=123456&key=private&name=private&access=private&url=https://evil.test#private'), deployment + '?mision=vetas-diseno');
assert.equal(run('mision-0/presentacion.html', {...active,routes:['forja','mision-0']}), undefined,'Misión 0 nunca usa el gateway');
for (const path of ['mision-0/', 'yunque/', 'forja/other.html', 'vetas-diseno/?prueba=1']) assert.equal(run(path), undefined);
for (const config of [null, {...active, enabled: false}, {...active, verified: false}, {...active, routes: []},
  {...active, deployment: deployment+'?key=private'}, {...active, deployment: deployment+'#fragment'},
  {...active, deployment: deployment.replace('/exec', '/dev')}, {...active, deployment:'https://evil.test/exec'}]) assert.equal(run('forja/', config), undefined);
assert.equal(run('forja/', active, {LUDARIA_CLOUD_CONFIG:{route:'forja'}}), undefined);
assert.equal(run('forja/', active, {google:{script:{run:{}}}}), undefined);
const configContext = {window:{}};
vm.runInNewContext(fs.readFileSync(__dirname+'/gateway-config.js','utf8'), configContext);
const published = configContext.window.LUDARIA_GATEWAY;
assert.equal(published.enabled, true);
assert.equal(published.verified, true);
assert.equal(published.routes.length, 14);
assert.equal(published.routes.includes('mision-0'), false);
for (const slug of published.routes) {
  const expected = published.deployment + (slug === 'forja' ? '' : '?mision=' + slug);
  for (const suffix of ['', 'index.html', 'presentacion.html']) {
    const file = slug + '/' + suffix;
    assert.equal(run(file + '?v=old&nombre=privado&clave=privada', published), expected,
      'La entrada existente debe cargar identificación central: ' + file);
  }
}
assert.equal(run('forja/?entrada=mochi', published), published.deployment + '?entrada=mochi');
assert.equal(run('mision-0/presentacion.html', published), undefined);
for (const file of ['forja/index.html', ...published.routes.filter(slug => slug !== 'forja')
  .flatMap(slug => ['index.html','presentacion.html'].filter(name => fs.existsSync(__dirname+'/../'+slug+'/'+name)).map(name => slug+'/'+name))]) {
  const html = fs.readFileSync(__dirname+'/../'+file,'utf8');
  const configAt = html.indexOf('../ludaria/gateway-config.js');
  const gatewayAt = html.indexOf('../ludaria/gateway.js');
  assert.ok(configAt > 0 && gatewayAt > configAt && gatewayAt < html.indexOf('</head>'));
}
console.log('Entrada estable: defensas, Forja/Mochi, 13 misiones y todas sus URLs originales conectadas OK con dobles; Misión 0 excluida.');
