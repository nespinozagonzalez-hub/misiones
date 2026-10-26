(() => {
 'use strict';
 const sprites=window.LudariaSprites,target=document.getElementById('frames'),status=document.getElementById('frames-status');let loaded=0,failed=0;
 for(const actor of Object.keys(sprites.layouts)){
  const section=document.createElement('section'),name=actor[0].toUpperCase()+actor.slice(1);section.innerHTML=`<h2>${name}</h2><div class="frames">${sprites.layouts[actor].map((_,index)=>`<figure><canvas width="704" height="576" data-actor="${actor}" data-frame="${index}" role="img" aria-label="${name}, pose ${index+1}"></canvas><figcaption>${name} · ${index+1} / 6</figcaption></figure>`).join('')}</div>`;target.append(section);
  const image=new Image();image.onload=()=>{section.querySelectorAll('canvas').forEach((canvas,index)=>sprites.draw(canvas,image,actor,index));loaded++;update();};image.onerror=()=>{failed++;update();};image.src='assets/'+sprites.sources[actor];
 }
 function update(){status.textContent=failed?'Alguna imagen no pudo cargar. Vuelve a abrir esta vista para reintentar.':loaded===3?'18 poses cargadas.':'Cargando las poses…';}
})();
