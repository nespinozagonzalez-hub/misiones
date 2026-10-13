/** Contrato de las incrustaciones originales; no accede a Google ni Genially. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const catalogue = JSON.parse(read('produccion/CATALOGO_14_SESIONES.json'));
const origin = 'https://nespinozagonzalez-hub.github.io';
const slugs = ['mision-0', 'pergaminos-dispersos', 'senda-ejemplos', 'claro-debate', 'vetas-diseno', 'tallado-mecanicas', 'gema-motivacional', 'planos-arquitecto', 'yunque', 'templado-pares', 'reflejo-diseno', 'pulido-prototipo', 'espejo-compartido', 'defensa-orbe'];
assert.deepEqual(catalogue.map(item => item.slug), slugs, 'Las 14 sesiones conservan su orden y sus slugs');
// Referencia independiente del catálogo editable: edición original f37b9b7.
// Si guía y catálogo cambian juntos, el contrato debe detectar la sustitución.
const originalPaths = [
  'mision-0/presentacion.html?v=20261004-epic1',
  'pergaminos-dispersos/presentacion.html?v=20261004-epic1#pantalla-1',
  'senda-ejemplos/?v=20261004-epic1',
  'claro-debate/presentacion.html?v=20261004-epic1',
  'vetas-diseno/presentacion.html?v=20261004-epic1',
  'tallado-mecanicas/presentacion.html?v=20261004-epic1#pantalla-1',
  'gema-motivacional/presentacion.html?v=20261004-epic1#pantalla-1',
  'planos-arquitecto/presentacion.html?v=20261004-epic1#pantalla-1',
  'yunque/presentacion.html?v=20261004-epic1#pantalla-1',
  'templado-pares/presentacion.html?v=20261004-epic1#pantalla-1',
  'reflejo-diseno/?v=20261004-epic1#pantalla-1',
  'pulido-prototipo/?v=20261004-epic1#pantalla-1',
  'espejo-compartido/index.html?v=20261004-epic1#pantalla-1',
  'defensa-orbe/presentacion.html?v=20261004-epic1#pantalla-1'
];
catalogue.forEach((item, index) => assert.equal(item.url, origin + '/misiones/' + originalPaths[index], item.name + ': contrato original independiente'));
const expected = catalogue.map(item => ({src:item.url, title:item.name + ' · Ludaria', height:item.height}));
expected.push({src:origin + '/misiones/forja/', title:'Forja del Buscador · Ludaria', height:850});
expected.push({src:origin + '/misiones/forja/?entrada=mochi', title:'Mercadito de Mochi · Ludaria', height:850});
const guide = read('produccion/RESUMEN_PARA_INCRUSTAR.md');
const activeGuides = [
  guide,
  read('produccion/INSTRUCCIONES.md'),
  read('ludaria/LEEME.md')
].join('\n');
assert.doesNotMatch(activeGuides, /falta reemplazar el archivo y actualizar la misma implementación/i, 'Las guías activas no deben pedir reinstalar v0.4.1');
assert.doesNotMatch(activeGuides, /aún requiere publicar una nueva versión de la misma implementación/i, 'Las guías activas reconocen el Apps Script instalado');
assert.doesNotMatch(activeGuides, /v0\.4\.3[^.\n]*(?:todavía no consta instalada|requiere reemplazar)/i, 'Las guías activas no deben pedir reinstalar v0.4.3');
assert.match(activeGuides, /v0\.4\.3 (?:ya )?(?:fue |está )?instalada/i, 'Las guías activas registran la instalación de v0.4.3');
const blocks = [...guide.matchAll(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/g)].map(match => match[0]);
assert.equal(blocks.length, 16, '14 sesiones y dos complementos; sin duplicaciones');
for (let i = 0; i < expected.length; i++) {
  const attrs = Object.fromEntries([...blocks[i].matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
  const item = expected[i];
  assert.equal(attrs.src, item.src, item.title + ': conservar URL original, query y fragmento');
  assert.equal(attrs.title, item.title);
  assert.equal(attrs.height, String(item.height));
  assert.equal(attrs.width, '100%');
  assert.equal(attrs.allow, 'fullscreen');
  const url = new URL(attrs.src);
  assert.equal(url.origin, origin, item.title + ': conservar origen GitHub Pages');
  const local = url.pathname.slice('/misiones/'.length) + (url.pathname.endsWith('/') ? 'index.html' : '');
  assert.ok(fs.existsSync(path.join(root, local)), item.title + ': archivo de entrada existente');
}
const config = {window:{}};
vm.runInNewContext(read('ludaria/gateway-config.js'), config);
assert.equal(config.window.LUDARIA_GATEWAY.enabled, true, 'Conservar los guardianes en los iframe originales');
assert.equal(config.window.LUDARIA_GATEWAY.verified, true, 'Navegación comprobada en Genially; guardado autenticado por separado');
assert.ok(!config.window.LUDARIA_GATEWAY.routes.includes('mision-0'), 'Diagnóstico independiente');
assert.match(guide, /no (?:modificar|sustituir|reemplazar) en (?:bloque|masa)/i, 'La guía recuerda conservar Genially');
console.log('PASS: 16 bloques originales con rutas, queries, fragmentos, alturas y títulos conservados; conexión activa y Misión 0 independiente. Esta prueba no valida escrituras en Google.');
