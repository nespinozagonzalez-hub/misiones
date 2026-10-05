(() => {
  'use strict';
  const C=window.LudariaCore, esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let dialog=null,frame=0,origin=null;
  const motion=()=>!reduced.matches&&document.body.dataset.ludariaMotion!=='off'&&!document.hidden;
  const capture=p=>({xp:p.xp,points:p.points,level:p.level,achs:[...p.achs],fragments:C.fragments(p).map(m=>m.id)});
  function settle(){
    cancelAnimationFrame(frame);frame=0;
    if(!dialog)return;
    dialog.classList.add('reward-still');
    dialog.querySelectorAll('[data-count]').forEach(e=>e.textContent=e.dataset.prefix+e.dataset.count);
    dialog.querySelector('[data-reward-skip]')?.setAttribute('hidden','');
  }
  function dispose(){
    cancelAnimationFrame(frame);frame=0;
    const previous=dialog;dialog=null;previous?.remove();
  }
  function close(){dialog?.close();}
  function open({kind='runa',profile:p,before,code,md,quantities={},key,tier,asset}){
    if(dialog?.open)dialog.close();
    dispose();origin=document.activeElement;
    const fragments=C.fragments(p).filter(m=>!before.fragments.includes(m.id));
    const achievements=C.ACH.filter(([id])=>p.achs.includes(id)&&!before.achs.includes(id));
    const restored=p.achs.includes('orbe_restaurado')&&!before.achs.includes('orbe_restaurado');
    const levelUp=p.level>before.level,skill=C.SKS.find(s=>s.key===key);
    const products=[['sabiduria','Pergamino del Saber','pergamino'],['maestria','Herramienta del Artesano','herramienta'],['creacion','Chispa Creativa','chispa'],['evaluacion','Cristal del Espejo','cristal'],['camaraderia','Lazo de Compañerismo','lazo']];
    const loot=kind==='compra'?products.filter(([k])=>quantities[k]>0):kind==='talento'?[products.find(([k])=>k===key)]:[];
    const total=Object.values(quantities).reduce((a,b)=>a+b,0);
    const headline=restored?'El Orbe ha sido restaurado.':fragments.length?'Un fragmento vuelve a Ludaria.':kind==='compra'?'Mochi ha fortalecido tu camino.':kind==='talento'?'Un nuevo talento despierta.':'El Saber responde a tu llamada.';
    const subtitle=kind==='runa'?md.n:kind==='talento'?skill.label+' · Talento '+['I','II','III'][tier-1]:'Tus mejoras ya forman parte de tu personaje.';
    const art=restored?'cristal':fragments.length?'fragmento':kind==='compra'?'mochi':kind==='talento'?loot[0][2]:'libro';
    const region=kind==='runa'?C.MODS.find(m=>m.id===md.mid).name:kind==='compra'?'EL MERCADITO DE MOCHI':'EL ÁRBOL DE TALENTOS';
    const metric=(n,label,symbol,prefix='+')=>`<div class="reward-metric"><span aria-hidden="true">${symbol}</span><div><strong data-count="${n}" data-prefix="${prefix}">${prefix}${n}</strong><span>${label}</span></div></div>`;
    const metrics=kind==='runa'?metric(md.x,'XP obtenida','✧')+metric(md.p,'Puntos de mejora','◆'):kind==='compra'?metric(total,'Mejoras aplicadas','❧')+metric(p.points,'Puntos disponibles','◆',''):metric(tier,'Grado del talento','❧','')+metric(p.points,'Puntos disponibles','◆','');
    const start=C.xpPct({xp:before.xp,level:before.level}),end=C.xpPct(p);
    const xp=kind==='runa'?`<div class="reward-xp"><div><span>Nivel ${p.level}${levelUp?' · nuevo nivel':''}</span><span>${p.xp} XP${C.LVL[p.level]?' / '+C.LVL[p.level]+' XP':' · nivel máximo'}</span></div><div class="reward-xp-track" role="progressbar" aria-label="Progreso del nivel ${p.level}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(end)}"><span style="--xp-from:${levelUp?0:start}%;--xp-to:${end}%"></span></div></div>`:'';
    const finds=fragments.map(m=>`<article class="reward-find reward-fragment"><img src="${asset('fragmento')}" alt=""><div><span class="eyebrow">FRAGMENTO ${['','I','II','III','IV'][m.id]} RECUPERADO</span><h3>${esc(m.name)}</h3><p>Has reunido ${C.fragments(p).length} de los 4 fragmentos del Orbe.</p></div></article>`).join('');
    const items=loot.map(([k,title,img])=>`<article class="reward-find"><img src="${asset(img)}" alt=""><div><span class="eyebrow">${kind==='compra'?'MEJORA CONFIRMADA':'TALENTO REVELADO'}</span><h3>${esc(title)}</h3><p>${kind==='compra'?'+'+quantities[k]+' en '+C.SKS.find(s=>s.key===k).label+' · '+p.skills[k]+'/10':'Talento '+['I','II','III'][tier-1]+' de '+skill.label+' · activado sin gastar puntos'}</p></div></article>`).join('');
    const relics=achievements.length?`<div class="reward-relics"><span class="eyebrow">${achievements.length===1?'NUEVA RELIQUIA':'NUEVAS RELIQUIAS'}</span>${achievements.map(([,symbol,title,desc])=>`<div class="reward-relic"><span aria-hidden="true">${symbol}</span><div><strong>${esc(title)}</strong><p>${esc(desc)}</p></div></div>`).join('')}</div>`:'';
    dialog=document.createElement('dialog');dialog.className='reward-dialog'+(restored?' reward-restored':'');
    dialog.setAttribute('aria-labelledby','reward-title');dialog.setAttribute('aria-describedby','reward-subtitle');
    dialog.innerHTML=`<div class="reward-sheet"><div class="reward-particles" aria-hidden="true">${Array.from({length:18},(_,i)=>`<i style="--x:${7+(i*37)%88}%;--rise:${80+(i%5)*26}px;--delay:${(i%6)*.13}s;--size:${i%3+2}px"></i>`).join('')}</div><div class="reward-top"><span class="eyebrow">${esc(region)}</span><button class="icon-button" data-reward-close autofocus aria-label="Cerrar recompensas">×</button></div><div class="reward-emblem" aria-hidden="true"><div class="reward-ring ring-outer"></div><div class="reward-ring ring-inner"></div><span class="reward-glyphs">✧ · ◇ · ✧ · ◇</span>${restored?'<div class="reward-shards"><i></i><i></i><i></i><i></i></div>':''}<img src="${asset(art)}" alt=""></div><div class="reward-heading"><span class="reward-kicker">${restored?'EL SABER VUELVE A BRILLAR':kind==='runa'?'RUNA DEL SABER ACTIVADA':kind==='compra'?'CANJE COMPLETADO':'RAMA DESPIERTA'}</span><h2 id="reward-title">${headline}</h2><p id="reward-subtitle">${esc(subtitle)}</p>${code?`<span class="reward-code">${esc(code)}</span>`:''}</div><div class="reward-metrics">${metrics}</div>${levelUp?`<div class="reward-level"><span aria-hidden="true">✦</span><div><span>HAS SUBIDO DE NIVEL</span><strong>${before.level} <span aria-hidden="true">→</span> ${p.level}</strong></div><span class="reward-level-label">${esc(p.name)}<br>Nivel ${p.level}</span></div>`:''}${xp}<div class="reward-loot">${finds}${items}${restored?'<p class="reward-ending">Los cuatro fragmentos y tu defensa final se han unido. La memoria de Ludaria está completa.</p>':''}${relics}</div><div class="reward-footer"><p>${kind==='compra'?'Canje confirmado · '+total+' puntos gastados · saldo '+p.points:kind==='talento'?'Talento confirmado · tus puntos se conservan':'Runa confirmada · saldo '+p.points+' puntos de mejora'}</p><button class="button gold" data-reward-close>${kind==='compra'?'Gracias, Mochi':kind==='talento'?'Seguir mi camino':'Continuar mi viaje'} <span aria-hidden="true">↗</span></button><button class="reward-skip" data-reward-skip>Ver sin animación</button></div></div>`;
    document.body.append(dialog);
    dialog.addEventListener('click',e=>{if(e.target.closest('[data-reward-close]'))close();else if(e.target.closest('[data-reward-skip]'))settle();});
    const active=dialog,previousFocus=origin;
    dialog.addEventListener('close',()=>{if(dialog!==active){active.remove();return;}dispose();const target=previousFocus?.isConnected?previousFocus:document.getElementById('code')||document.getElementById('page');target?.focus({preventScroll:true});});
    dialog.showModal();
    if(!motion()){settle();return;}
    const counters=[...dialog.querySelectorAll('[data-count]')];counters.forEach(e=>e.textContent=e.dataset.prefix+'0');
    let began;
    function count(now){
      if(!dialog?.open)return;
      if(!motion()){settle();return;}
      began??=now;const t=Math.min(1,(now-began)/1200),ease=1-Math.pow(1-t,3);
      counters.forEach(e=>e.textContent=e.dataset.prefix+Math.round(Number(e.dataset.count)*ease));
      if(t<1)frame=requestAnimationFrame(count);else frame=0;
    }
    frame=requestAnimationFrame(count);
  }
  // Pausar decoración no interrumpe ni revierte una recompensa ya confirmada.
  new MutationObserver(()=>{if(dialog&&!motion())settle();}).observe(document.body,{attributes:true,attributeFilter:['data-ludaria-motion']});
  reduced.addEventListener('change',()=>{if(!motion())settle();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
  window.LudariaRewards={capture,open};
})();
