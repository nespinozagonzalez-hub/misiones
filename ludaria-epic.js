(() => {
  'use strict';
  if(document.querySelector('[data-ludaria-effects]'))return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),key='ludaria_effects_v1';
  let requested=true,field=null,cleanup=null,lastBurst=0;
  try{requested=localStorage.getItem(key)!=='off';}catch{/* Decoración opcional sin almacenamiento. */}
  const toolbar=document.createElement('div'),toggle=document.createElement('button');
  toolbar.className='ludaria-effects';toolbar.dataset.ludariaEffects='1';
  toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Opciones de animación');
  toggle.type='button';toolbar.append(toggle);document.body.append(toolbar);
  function clear(){clearTimeout(cleanup);field?.remove();field=null;}
  function update(){const on=requested&&!reduced.matches;document.body.dataset.ludariaMotion=on?'on':'off';toggle.setAttribute('aria-pressed',String(on));toggle.textContent=reduced.matches?'Animaciones reducidas por tu dispositivo':on?'Animaciones: activadas':'Animaciones: pausadas';toggle.disabled=reduced.matches;if(!on)clear();}
  toggle.addEventListener('click',()=>{requested=!requested;try{localStorage.setItem(key,requested?'on':'off');}catch{}update();});
  reduced.addEventListener('change',update);update();
  function burst(origin){
    if(!requested||reduced.matches||document.hidden)return;
    const now=Date.now();if(now-lastBurst<600)return;lastBurst=now;clear();
    field=document.createElement('div');field.className='ludaria-spark-field';field.setAttribute('aria-hidden','true');field.inert=true;
    const r=origin?.getBoundingClientRect(),x=r?r.x+r.width/2:innerWidth*.5,y=r?r.y+r.height/2:innerHeight*.48;
    const count=innerWidth<600?8:14;
    for(let i=0;i<count;i++){const spark=document.createElement('i');spark.className='ludaria-spark';spark.style.left=x+'px';spark.style.top=y+'px';spark.style.setProperty('--dx',((i-count/2)*12)+'px');spark.style.setProperty('--dy',(-35-(i%5)*17)+'px');spark.style.animationDelay=(i%3)*40+'ms';field.append(spark);}
    document.body.append(field);cleanup=setTimeout(clear,1400);
  }
  // Solo la Forja confirma esta señal después de validar y guardar el movimiento.
  document.addEventListener('ludaria:confirmed',e=>{if(['runa','compra','talento','crear'].includes(e.detail?.type))burst(document.querySelector('dialog[open]')||document.querySelector('#page'));});
  const stage=document.querySelector('#stage,#page,#mission-content');
  if(stage){const observer=new MutationObserver(records=>{for(const record of records){for(const node of record.addedNodes){if(node.nodeType===1&&node.matches('.scene,.page-heading,.hero-card,.reading-reveal'))node.classList.add('ludaria-epic-scene');}}});observer.observe(stage,{childList:true});}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
})();
