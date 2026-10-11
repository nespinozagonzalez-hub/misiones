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
for (const path of ['mision-0/', 'yunque/', 'forja/other.html', 'vetas-diseno/?prueba=1']) assert.equal(run(path), undefined);
for (const config of [null, {...active, enabled: false}, {...active, verified: false}, {...active, routes: []},
  {...active, deployment: deployment+'?key=private'}, {...active, deployment: deployment+'#fragment'},
  {...active, deployment: deployment.replace('/exec', '/dev')}, {...active, deployment:'https://evil.test/exec'}]) assert.equal(run('forja/', config), undefined);
assert.equal(run('forja/', active, {LUDARIA_CLOUD_CONFIG:{route:'forja'}}), undefined);
assert.equal(run('forja/', active, {google:{script:{run:{}}}}), undefined);
const configContext = {window:{}};
vm.runInNewContext(fs.readFileSync(__dirname+'/gateway-config.js','utf8'), configContext);
assert.equal(configContext.window.LUDARIA_GATEWAY.enabled, false);
assert.equal(configContext.window.LUDARIA_GATEWAY.verified, false);
for (const file of ['forja/index.html','vetas-diseno/index.html','vetas-diseno/presentacion.html']) {
  const html = fs.readFileSync(__dirname+'/../'+file,'utf8');
  const configAt = html.indexOf('../ludaria/gateway-config.js');
  const gatewayAt = html.indexOf('../ludaria/gateway.js');
  assert.ok(configAt > 0 && gatewayAt > configAt && gatewayAt < html.indexOf('</head>'));
}
console.log('Entrada estable: 24 escenarios con dobles OK; despliegue real pendiente.');
