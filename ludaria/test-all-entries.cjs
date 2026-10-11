/** Sintaxis y recursos del código realmente cargado por las 14 sesiones. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),entries=require('./mission-entries.json');
const htmlFiles=new Set(['index.html','forja/index.html']);
for(const slug of Object.keys(entries))for(const name of ['index.html','presentacion.html'])if(fs.existsSync(path.join(root,slug,name)))htmlFiles.add(slug+'/'+name);
const scripts=new Set(),styles=new Set();let references=0,inline=0;
function resource(ref,parent){
 ref=ref.replaceAll('&amp;','&');if(!ref||ref.startsWith('#')||/^(data:|blob:|mailto:|javascript:)/i.test(ref))return null;
 const url=new URL(ref,'https://ludaria.test/'+parent);
 let relative;if(url.origin==='https://ludaria.test')relative=url.pathname.slice(1);else if(url.origin==='https://nespinozagonzalez-hub.github.io'&&url.pathname.startsWith('/misiones/'))relative=url.pathname.slice('/misiones/'.length);else return null;
 let file=path.resolve(root,decodeURIComponent(relative));assert.ok(file===root||file.startsWith(root+path.sep),'Recurso fuera del repositorio');
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 assert.ok(fs.existsSync(file),parent+' referencia ausente: '+ref);references++;return file;
}
for(const filename of htmlFiles){
 const text=fs.readFileSync(path.join(root,filename),'utf8');
 for(const match of text.matchAll(/<(script|link|img|a|iframe)\b[^>]*?\b(src|href)=["']([^"']+)["'][^>]*>/gi)){
  const file=resource(match[3],filename);if(!file)continue;if(match[1].toLowerCase()==='script')scripts.add(file);if(match[1].toLowerCase()==='link'&&file.endsWith('.css'))styles.add(file);
 }
 for(const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))if(!/\bsrc=/.test(match[1])&&!/type=["'](?:application\/|module)/.test(match[1])&&match[2].trim()){new vm.Script(match[2],{filename});inline++;}
}
for(const file of scripts)new vm.Script(fs.readFileSync(file,'utf8'),{filename:path.relative(root,file)});
for(const file of styles)for(const match of fs.readFileSync(file,'utf8').matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi))resource(match[1],path.relative(root,file));
assert.equal(Object.keys(entries).length,14);assert.equal(htmlFiles.size,26,'Portal, Forja y todas las entradas/alias existentes');
console.log('PASS inventario: '+htmlFiles.size+' entradas HTML, '+scripts.size+' scripts activos, '+inline+' bloques inline y '+references+' referencias locales válidas. No valida servicios externos.');
