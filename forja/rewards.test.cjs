const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname+'/';
function environment({reduced=false,paused=false}={}){
  const frames=new Map(),events={},mediaEvents={},dom=[];let seq=0,focus=0;
  class Element{
    constructor(){this.className='';this.attrs={};this.listeners={};this.dataset={};this.open=false;this.isConnected=true;this.classList={add:c=>this.className+=' '+c};}
    setAttribute(k,v){this.attrs[k]=v;}
    addEventListener(k,fn){this.listeners[k]=fn;}
    focus(){focus++;}
    set innerHTML(html){this.html=html;this.counters=[...html.matchAll(/data-count="(\d+)" data-prefix="([^"]*)"/g)].map(m=>({dataset:{count:m[1],prefix:m[2]},textContent:m[2]+m[1]}));}
    querySelectorAll(s){return s==='[data-count]'?this.counters:[];}
    querySelector(s){return s==='[data-reward-skip]'?{setAttribute:(k,v)=>this.skipHidden=k==='hidden'}:null;}
    showModal(){this.open=true;}
    close(){this.open=false;this.listeners.close?.();}
    remove(){this.isConnected=false;}
  }
  const media={matches:reduced,addEventListener:(k,fn)=>mediaEvents[k]=fn},body={dataset:{ludariaMotion:paused?'off':'on'},append:e=>dom.push(e)};
  const ctx={console,matchMedia:()=>media,document:{body,hidden:false,activeElement:new Element(),createElement:()=>new Element(),getElementById:()=>new Element(),addEventListener:(k,fn)=>events[k]=fn},requestAnimationFrame:fn=>(frames.set(++seq,fn),seq),cancelAnimationFrame:id=>frames.delete(id),MutationObserver:class{constructor(fn){this.run=fn;}observe(){ctx.observer=this;}}};ctx.window=ctx;
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(root+'core.js','utf8'),ctx);vm.runInContext(fs.readFileSync(root+'rewards.js','utf8'),ctx);
  return {ctx,frames,dom,media,mediaEvents,events,focus:()=>focus,flush(){for(const [id,fn]of [...frames]){frames.delete(id);fn(0)}for(const [id,fn]of [...frames]){frames.delete(id);fn(2000)}}};
}
let checks=0;const check=(name,fn)=>{fn();console.log('PASS '+name);checks++;};
check('14 runas: premios existentes, niveles, cuatro fragmentos y cierre',()=>{
  const e=environment(),C=e.ctx.LudariaCore,R=e.ctx.LudariaRewards,p=C.defP('Prueba <b>','Kira');
  for(const [code,md]of Object.entries(C.CM)){
    const before=R.capture(p);C.redeem(p,code);const saved=JSON.stringify(p);
    R.open({profile:p,before,code,md,asset:n=>'assets/'+n+'.webp'});e.flush();
    const d=e.dom.at(-1);assert.equal(JSON.stringify(p),saved,'la animación no modifica el personaje');
    assert.equal(d.counters[0].textContent,'+'+md.x);assert.equal(d.counters[1].textContent,'+'+md.p);
    assert(d.html.includes(md.n));assert.equal(d.html.includes('HAS SUBIDO DE NIVEL'),p.level>before.level);
    const newFragments=C.fragments(p).filter(m=>!before.fragments.includes(m.id));
    assert.equal((d.html.match(/FRAGMENTO [IV]+ RECUPERADO/g)||[]).length,newFragments.length);
    assert.equal(d.html.includes('El Orbe ha sido restaurado.'),code==='ORB714');d.close();assert.equal(e.frames.size,0);
  }
  assert.equal(p.xp,570);assert.equal(p.points,49);assert.equal(p.level,6);assert.equal(C.fragments(p).length,4);
});
check('defensa anticipada no inventa restauración ni fragmentos',()=>{
  const e=environment(),C=e.ctx.LudariaCore,R=e.ctx.LudariaRewards,p=C.defP('Prueba','Kael'),before=R.capture(p);C.redeem(p,'ORB714');
  R.open({profile:p,before,code:'ORB714',md:C.CM.ORB714,asset:n=>n});assert(!e.dom.at(-1).html.includes('El Orbe ha sido restaurado.'));assert.equal(C.fragments(p).length,0);
});
check('pausa y movimiento reducido muestran premios completos sin contadores animados',()=>{
  for(const opts of [{paused:true},{reduced:true}]){const e=environment(opts),C=e.ctx.LudariaCore,R=e.ctx.LudariaRewards,p=C.defP('Prueba','Kira'),before=R.capture(p);C.redeem(p,'ECO101');R.open({profile:p,before,code:'ECO101',md:C.CM.ECO101,asset:n=>n});const d=e.dom.at(-1);assert(d.className.includes('reward-still'));assert.equal(d.counters[0].textContent,'+30');assert(d.skipHidden);assert.equal(e.frames.size,0);}
});
check('cerrar, saltar o activar reducción cancela el ciclo y permite volver a activar',()=>{
  const e=environment(),C=e.ctx.LudariaCore,R=e.ctx.LudariaRewards,p=C.defP('Prueba','Kira'),before=R.capture(p);C.redeem(p,'ECO101');const opts={profile:p,before,code:'ECO101',md:C.CM.ECO101,asset:n=>n};
  R.open(opts);e.dom.at(-1).listeners.click({target:{closest:s=>s==='[data-reward-skip]'}});assert.equal(e.frames.size,0);assert.equal(e.dom.at(-1).counters[0].textContent,'+30');e.dom.at(-1).close();assert(e.focus()>0);
  R.open(opts);e.media.matches=true;e.mediaEvents.change();assert.equal(e.frames.size,0);assert(e.dom.at(-1).className.includes('reward-still'));e.dom.at(-1).close();
});
check('canje y talento reflejan sus datos confirmados sin gastar XP ni duplicar premios',()=>{
  const e=environment(),C=e.ctx.LudariaCore,R=e.ctx.LudariaRewards,p=C.defP('Prueba','Kael');C.redeem(p,'ECO101');let before=R.capture(p);const q={...C.freshStats(0),sabiduria:2};p.pending=q;C.confirmSpend(p);let saved=JSON.stringify(p);
  R.open({kind:'compra',profile:p,before,quantities:q,asset:n=>n});e.flush();let d=e.dom.at(-1);assert(d.html.includes('+2 en Sabiduría · 3/10'));assert(d.html.includes('3'));assert.equal(d.counters[1].textContent,'1');assert.equal(JSON.stringify(p),saved);d.close();
  before=R.capture(p);C.unlock(p,'sabiduria',1);saved=JSON.stringify(p);R.open({kind:'talento',profile:p,before,key:'sabiduria',tier:1,asset:n=>n});assert(e.dom.at(-1).html.includes('activado sin gastar puntos'));assert.equal(JSON.stringify(p),saved);assert.equal(p.xp,30);assert.equal(p.points,1);
});
check('recargar, código inválido y repetido conservan el estado',()=>{
  const e=environment(),C=e.ctx.LudariaCore,p=C.defP('Prueba','Kael');C.redeem(p,'ECO101');const saved=JSON.stringify(p);assert.throws(()=>C.redeem(p,'ECO101'));assert.throws(()=>C.redeem(p,'AAA000'));assert.equal(JSON.stringify(p),saved);const reloaded=C.normalize(JSON.parse(saved));assert.equal(reloaded.xp,30);assert.equal(reloaded.points,3);assert.equal(reloaded.codes.length,1);
});
console.log(checks+' grupos comprobados; vista visual real pendiente.');
