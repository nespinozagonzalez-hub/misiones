const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
function run(reducedOn){const listeners={},timers=new Map();let timer=0;const elements=[];class Element{constructor(tag){this.tag=tag;this.dataset={};this.attrs={};this.children=[];this.style={setProperty(){}};this.classList={add(){}};this.handlers={};elements.push(this);}setAttribute(k,v){this.attrs[k]=v;}append(el){this.children.push(el);}remove(){this.removed=true;}addEventListener(k,fn){this.handlers[k]=fn;}}
const body=new Element('body'),reduced={matches:reducedOn,addEventListener(k,fn){this.update=fn;}};
const context={console,Date,innerWidth:390,innerHeight:720,matchMedia:()=>reduced,localStorage:{getItem:()=>null,setItem(){}},MutationObserver:class{observe(){}},setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id),document:{body,hidden:false,querySelector:()=>null,createElement:tag=>new Element(tag),addEventListener:(k,fn)=>listeners[k]=fn}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../ludaria-epic.js','utf8'),context);const toggle=elements.find(x=>x.tag==='button');assert.equal(body.dataset.ludariaMotion,reducedOn?'off':'on');assert.equal(toggle.disabled,reducedOn);
listeners['ludaria:confirmed']({detail:{type:'preview'}});assert.equal(elements.filter(x=>x.className==='ludaria-spark').length,0);
listeners['ludaria:confirmed']({detail:{type:'compra'}});assert.equal(elements.filter(x=>x.className==='ludaria-spark').length,reducedOn?0:8);
if(!reducedOn){for(const fn of timers.values())fn();assert(elements.find(x=>x.className==='ludaria-spark-field').removed);toggle.handlers.click();assert.equal(body.dataset.ludariaMotion,'off');}
assert.equal(elements.find(x=>x.className==='ludaria-effects').attrs.role,'group');}
run(false);run(true);console.log('PASS efectos: evento confirmado, máximo 8 partículas móvil, limpieza, pausa y movimiento reducido.');
