/** Batalla en memoria. Solo la restauración original escribe el cuaderno existente. */
(() => {
 'use strict';
 if(window.MISSION?.slug!=='defensa-orbe'||!window.LudariaBattle)return;
 const Core=window.LudariaBattle,script=document.currentScript;
 const asset=name=>new URL('assets/'+name,script.src).href;
 const heroAsset=name=>new URL('../forja/assets/'+name+'.webp',script.src).href;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const symbols={sabiduria:'✦',maestria:'⌘',creacion:'❧',evaluacion:'◇',camaraderia:'∞'};
 const labels={sabiduria:'Sabiduría',maestria:'Maestría',creacion:'Creación',evaluacion:'Evaluación',camaraderia:'Camaradería'};
 let allowingOriginal=false,dialog=null;
 function polish(){
  const b=document.querySelector('[data-action="orbe"]');if(!b||b.dataset.ceremonyReady)return;
  b.dataset.ceremonyReady='1';b.textContent=document.querySelector('#orbe.restored')?'Revivir la batalla con Lethon':'La última batalla · entrar a la Bóveda';
  const n=document.createElement('p');n.className='orbe-invitation';n.textContent='Después de recoger las evaluaciones, enfrenta a Lethon, reúne los cuatro fragmentos y restaura el Orbe del Saber.';b.closest('.actions').before(n);
 }
 function open(button){
  if(dialog?.open)return;
  const profile=window.LudariaCloud?.profile||window.LUDARIA_CEREMONY_PREVIEW_PROFILE;
  const avatar=['Kael','Kira'].includes(profile?.class)?profile.class.toLowerCase():null,name=profile?.name||'La expedición';
  const wasRestored=Boolean(document.querySelector('#orbe.restored'));
  let state=Core.fresh(),screen='intro',report=false,completed=false,fxTimer,sound=false,audio;
  const d=document.createElement('dialog');dialog=d;d.className='orbe-rpg';d.setAttribute('aria-labelledby','orbe-rpg-title');
  d.innerHTML=`<header class="orbe-rpg-header"><div><span class="orbe-kicker">LUDARIA · LA BATALLA POR LA MEMORIA</span><h2 id="orbe-rpg-title">La última defensa</h2></div><div class="orbe-tools"><button type="button" data-orbe-sound aria-pressed="false">Sonido: apagado</button><button type="button" class="orbe-close" data-orbe-close aria-label="Cerrar la batalla y volver al cuaderno">×</button></div></header>
   <div class="orbe-layout"><div class="orbe-arena" role="group" aria-label="Campo de batalla de la Bóveda"><img class="orbe-victory-art" src="${asset('orbe-amanecer-v2.webp')}" alt="El Orbe restaurado ilumina la Bóveda al amanecer" decoding="async"><div class="orbe-arena-shade"></div>
    <div class="orbe-fighter orbe-hero" role="group" aria-label="Tu personaje y su escudo"><div class="orbe-nameplate"><strong>${esc(name)}</strong><small>Escudo de la expedición · <span data-orbe-ward-value>100</span>/100</small><progress data-orbe-ward max="100" value="100" aria-label="Escudo narrativo de la expedición"></progress></div>${avatar?`<img class="orbe-hero-art" src="${heroAsset(avatar)}" alt="${esc(profile.class)}, personaje de ${esc(name)}">`:'<span class="orbe-hero-seal" aria-hidden="true">✧</span>'}</div>
    <div class="orbe-fighter orbe-enemy" role="group" aria-label="Lethon y su poder"><div class="orbe-nameplate"><strong>Lethon</strong><small>Poder del Olvido · <span data-orbe-hp-value>100</span>/100</small><progress data-orbe-hp max="100" value="100" aria-label="Poder del Olvido de Lethon"></progress></div><img class="orbe-enemy-art" src="${asset('lethon-combate-v2.webp')}" alt="Lethon, el Devorador del Saber, invoca las Brumas del Olvido"></div>
    <div class="orbe-impact" aria-hidden="true" data-orbe-impact></div><div class="orbe-fragments" aria-label="Fragmentos de esta batalla">${['I','II','III','IV'].map(x=>`<span data-orbe-fragment>${x}</span>`).join('')}</div>
   </div><section class="orbe-command"><div class="orbe-progress-label"><span data-orbe-turn></span><strong data-orbe-count>0 / 4 fragmentos</strong></div><progress class="orbe-progress" max="4" value="0" aria-label="Restauración narrativa del Orbe"></progress>
    <div class="orbe-story" aria-live="polite" aria-atomic="true"><span class="orbe-kicker" data-orbe-place></span><h3 data-orbe-heading></h3><p data-orbe-story></p></div>
    <details class="orbe-help"><summary>Cómo combatir</summary><p>Ilumina para potenciar otra habilidad; enlaza para golpear y protegerte; crea para atacar; refleja para bloquear; une al gremio para recuperar escudo. Lethon contraataca con más fuerza a medida que retrocede. Si tu escudo cae, puedes reagruparte sin perder el recorrido. Las cinco habilidades están disponibles.</p></details>
    <div class="orbe-actions" aria-label="Elige tu habilidad">${Object.entries(Core.moves).map(([key,m])=>`<button type="button" data-orbe-action="${key}" title="${esc(m.detail)}"><span aria-hidden="true">${symbols[key]}</span><strong>${esc(m.name)}</strong><small>${labels[key]} · ${m.damage} impacto${m.guard?' · protege':m.heal?' · recupera':''}</small></button>`).join('')}</div>
    <button type="button" class="orbe-next" data-orbe-next></button><p class="orbe-footnote">Batalla narrativa. El escudo y el poder de Lethon solo pertenecen a este encuentro; tus atributos, notas y recompensas se conservan.</p><p class="orbe-save-note" data-orbe-save role="status"></p>
   </section></div>`;
  document.body.append(d);const q=s=>d.querySelector(s);
  function tell(k,t,text){q('[data-orbe-place]').textContent=k;q('[data-orbe-heading]').textContent=t;q('[data-orbe-story]').textContent=text;}
  function sync(){
   d.dataset.screen=screen;d.classList.toggle('is-restored',screen==='victory'||screen==='epilogue');
   q('[data-orbe-hp]').value=state.hp;q('[data-orbe-hp-value]').textContent=state.hp;q('[data-orbe-ward]').value=state.ward;q('[data-orbe-ward-value]').textContent=state.ward;
   q('.orbe-progress').value=state.fragments;q('[data-orbe-count]').textContent=state.fragments+' / 4 fragmentos';
   q('[data-orbe-turn]').textContent=screen==='battle'?'Turno '+state.turn+' · '+Core.phases[Math.min(3,state.fragments)].attack:screen==='victory'||screen==='epilogue'?'El Orbe del Saber':'La Bóveda de Ludaria';
   d.querySelectorAll('[data-orbe-fragment]').forEach((e,i)=>e.classList.toggle('is-reunited',i<state.fragments));
   q('.orbe-actions').hidden=screen!=='battle'||report;q('[data-orbe-next]').hidden=screen==='battle'&&!report;q('.orbe-help').hidden=screen!=='battle';
   q('[data-orbe-next]').textContent=screen==='intro'?'Enfrentar a Lethon':screen==='breather'?'Reagrupar la expedición':screen==='victory'?'Restaurar el Orbe y cerrar la aventura':screen==='epilogue'?'Volver a mi cuaderno':'Preparar el siguiente turno';
  }
  function nextTurn(){
   const phase=Core.phases[Math.min(3,state.fragments)];screen='battle';report=false;sync();
   tell('FRAGMENTO '+['I','II','III','IV'][Math.min(3,state.fragments)]+' · '+phase.place,phase.line,state.last==='sabiduria'?'La luz revela una abertura: usa otra habilidad para sumar 10 de impacto.':state.last==='maestria'?'El sello está preparado: otra habilidad recibirá 6 de impacto adicional.':'Lethon reúne las brumas. Elige tu siguiente movimiento.');
  }
  function pulse(key,damage){
   clearTimeout(fxTimer);d.dataset.fx=key;q('[data-orbe-impact]').textContent='−'+damage;
   fxTimer=setTimeout(()=>{if(d.isConnected){delete d.dataset.fx;q('[data-orbe-impact]').textContent='';}},650);
   if(sound&&audio){try{const now=audio.currentTime;[220,330,440].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f+(key==='creacion'?110:0);g.gain.setValueAtTime(0,now+i*.06);g.gain.linearRampToValueAtTime(.035,now+i*.06+.02);g.gain.exponentialRampToValueAtTime(.001,now+i*.06+.25);o.connect(g);g.connect(audio.destination);o.start(now+i*.06);o.stop(now+i*.06+.28);});}catch{sound=false;q('[data-orbe-sound]').textContent='Sonido: apagado';q('[data-orbe-sound]').setAttribute('aria-pressed','false');}}
  }
  d.addEventListener('click',async event=>{
   const b=event.target.closest('button');if(!b)return;
   if(b.hasAttribute('data-orbe-close')){d.close();return;}
   if(b.hasAttribute('data-orbe-sound')){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error();audio=audio||new Audio();sound=!sound;if(sound)await audio.resume();else await audio.suspend();if(!d.isConnected){audio.close().catch(()=>{});return;}b.textContent=sound?'Sonido: activado':'Sonido: apagado';b.setAttribute('aria-pressed',String(sound));}catch{sound=false;b.textContent='Sonido no disponible';b.setAttribute('aria-pressed','false');}return;}
   if(b.dataset.orbeAction&&screen==='battle'&&!report){
    state=Core.act(state,b.dataset.orbeAction);const e=state.lastEvent;report=true;screen=state.outcome==='victory'?'victory':state.outcome==='breather'?'breather':'battle';sync();pulse(e.key,e.damage);
    const detail=`${Core.moves[e.key].name}: ${e.damage} de impacto${e.bonus?' con combo':''}. ${e.healed?'Recuperas '+e.healed+' de escudo. ':''}${e.incoming?'Lethon responde con '+e.attack+': '+(e.incoming-e.blocked)+' de daño'+(e.blocked?'; bloqueas '+e.blocked:'')+'.':''}`;
    if(screen==='victory')tell('LOS CUATRO FRAGMENTOS · LA VICTORIA','«El saber que construimos no te pertenece, Lethon».','El último velo se rompe. Las voces de Théol, Bryn, Ondal y Mira se unen a la expedición. Lethon se disuelve y los cuatro fragmentos vuelven a encontrarse.');
    else if(screen==='breather')tell('LA EXPEDICIÓN SE REAGRUPA','Nadie queda atrás.','El escudo cede, pero los fragmentos reunidos siguen contigo. Recupera el aliento y vuelve a la batalla; nada de tu recorrido se pierde.');
    else tell(e.fragment?'UN FRAGMENTO VUELVE A BRILLAR':'TU MOVIMIENTO · RESPUESTA DE LETHON',e.fragment?Core.phases[Math.min(3,state.fragments-1)].memory:'La batalla continúa.',detail);
    q('[data-orbe-next]').focus({preventScroll:true});return;
   }
   if(!b.hasAttribute('data-orbe-next'))return;
   if(screen==='intro'){nextTurn();q('[data-orbe-action]').focus({preventScroll:true});return;}
   if(screen==='breather'){state=Core.recover(state);nextTurn();q('[data-orbe-action]').focus({preventScroll:true});return;}
   if(screen==='battle'){nextTurn();q('[data-orbe-action]').focus({preventScroll:true});return;}
   if(screen==='epilogue'){d.close();return;}
   if(screen==='victory'&&!completed){
    completed=true;screen='epilogue';sync();tell('EL FINAL DE ESTA AVENTURA · EL COMIENZO DE OTRA','El saber continúa contigo, '+name+'.','La Bóveda se abre al amanecer. Tu viaje por Ludaria termina, pero lo que has creado comienza ahora: llévalo al aula, escucha a quienes lo vivan y sigue transformándolo. El Orbe vuelve a brillar porque nadie construyó este camino a solas.');
    if(!wasRestored&&button.isConnected){allowingOriginal=true;try{button.click();}finally{allowingOriginal=false;}const toast=document.getElementById('toast');if(toast)toast.textContent='Orbe restaurado. Revisa la confirmación de tu cuaderno.';}
    if(button.isConnected)button.textContent='Revivir la batalla con Lethon';
    const cloud=window.LudariaCloud;if(cloud?.active&&!wasRestored){q('[data-orbe-save]').textContent='Confirmando la restauración en tu cuaderno…';await cloud.flushMission();if(d.isConnected)q('[data-orbe-save]').textContent=cloud.hasPending?'La batalla terminó. Hay cambios sin confirmar: revisa el guardado antes de salir.':'Restauración confirmada en tu cuaderno. La entrega y evaluación siguen el canal acordado.';}else q('[data-orbe-save]').textContent='Aventura finalizada. Conserva tu registro por el canal acordado con el facilitador.';
   }
  });
  function suspend(){if(document.hidden&&audio){sound=false;audio.suspend().catch(()=>{});q('[data-orbe-sound]').textContent='Sonido: apagado';q('[data-orbe-sound]').setAttribute('aria-pressed','false');}}
  document.addEventListener('visibilitychange',suspend);
  d.addEventListener('close',()=>{clearTimeout(fxTimer);document.removeEventListener('visibilitychange',suspend);if(audio)audio.close().catch(()=>{});d.remove();if(dialog===d)dialog=null;if(!dialog?.open&&button.isConnected)button.focus({preventScroll:true});});
  sync();tell('LA BÓVEDA DEL ORBE','«Habéis llegado lejos. Aquí termina vuestra memoria».','Lethon cierra el paso. Los cuatro fragmentos tiemblan entre sus manos. A tu espalda resuenan las voces de tus compañeros: protege la expedición, combina tus habilidades y rompe las Brumas del Olvido.');d.showModal();q('[data-orbe-next]').focus({preventScroll:true});
 }
 document.addEventListener('click',event=>{const b=event.target.closest('[data-action="orbe"]');if(!b||allowingOriginal)return;event.preventDefault();event.stopImmediatePropagation();open(b);},true);
 const stage=document.getElementById('stage');if(stage)new MutationObserver(polish).observe(stage,{childList:true});polish();
})();
