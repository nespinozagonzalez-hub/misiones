const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),catalog=require('./rpg-catalog.js');
for(const mission of catalog.missions){
 const dom=new JSDOM('<!doctype html><html><head></head><body><dialog class="ludaria-cloud-dialog" open><h2>'+mission.guardian+'</h2><form id="cloud-login"><label>Nombre<input name="name"></label><label>Clave<input name="key"></label><button type="submit">Entrar</button></form><details><summary>Crear</summary><form id="cloud-register"></form></details><p id="cloud-error" role="status"></p></dialog></body></html>',{url:'https://ludaria.test/'+mission.slug+'/',runScripts:'outside-only'});
 const w=dom.window,d=w.document;w.LUDARIA_CLOUD_CONFIG={route:mission.slug};w.LudariaRPG=catalog;
 const dialog=d.querySelector('dialog'),form=d.querySelector('#cloud-login');let submitted=0;dialog.addEventListener('submit',e=>{e.preventDefault();submitted++;});
 w.eval(fs.readFileSync(__dirname+'/access-scenery.js','utf8'));
 assert.equal(dialog.dataset.accessScenery,mission.slug);assert.equal(d.querySelector('#cloud-login'),form,'Se conserva el formulario y su conexión');assert.equal(d.querySelector('.cloud-access-intro h3').textContent,mission.name);assert.equal(d.querySelector('.cloud-guardian h2').textContent,mission.guardian);assert.equal(d.querySelector('#cloud-register').hidden,true);assert.equal(d.querySelector('details'),null);assert.ok(d.querySelector('.cloud-portrait').getAttribute('style').includes('background-position'));
 const image=dialog.style.getPropertyValue('--access-landscape').match(/"([^"]+)"/)[1];assert.ok(fs.existsSync(path.join(__dirname,'..',new URL(image).pathname)),'Paisaje real: '+mission.slug);
 form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(submitted,1);assert.equal(d.querySelector('#cloud-error').getAttribute('role'),'status');dom.window.close();
}
console.log('PASS accesos: 13 guardianes y paisajes existentes, nombre/código, creación oculta y eventos originales conservados.');
