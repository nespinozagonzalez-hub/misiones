/** Batalla en memoria. Solo la restauración original escribe el cuaderno existente. */
(() => {
 'use strict';
 if(window.MISSION?.slug!=='defensa-orbe'||!window.LudariaBattle||!window.LudariaQuiz)return;
 const Core=window.LudariaBattle,Quiz=window.LudariaQuiz,script=document.currentScript;
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
  let state=Core.fresh(),screen='intro',report=false,completed=false,fxTimer,motionTimer,sound=false,audio;
  let pending=null,quizPassed=false;const seen=[],questions=new Map(),players={};
  const d=document.createElement('dialog');dialog=d;d.className='orbe-rpg';d.setAttribute('aria-labelledby','orbe-rpg-title');
  d.innerHTML=`<header class="orbe-rpg-header"><div><span class="orbe-kicker">LUDARIA · LA BATALLA POR LA MEMORIA</span><h2 id="orbe-rpg-title">La última defensa</h2></div><div class="orbe-tools"><button type="button" data-orbe-sound aria-pressed="false">Sonido: apagado</button><button type="button" class="orbe-close" data-orbe-close aria-label="Cerrar la batalla y volver al cuaderno">×</button></div></header>
   <div class="orbe-layout"><div class="orbe-arena" role="group" aria-label="Campo de batalla de la Bóveda"><img class="orbe-victory-art" src="${asset('orbe-amanecer-v2.webp')}" alt="El Orbe restaurado ilumina la Bóveda al amanecer" decoding="async"><div class="orbe-arena-shade"></div>
    <div class="orbe-fighter orbe-hero" role="group" aria-label="Tu personaje y su escudo"><div class="orbe-nameplate"><strong>${esc(name)}</strong><small>Escudo de la expedición · <span data-orbe-ward-value>100</span>/100</small><progress data-orbe-ward max="100" value="100" aria-label="Escudo narrativo de la expedición"></progress></div>${avatar?`<div class="orbe-actor-art"><img class="orbe-hero-art" src="${heroAsset(avatar)}" alt="${esc(profile.class)}, personaje de ${esc(name)}"><canvas class="orbe-sprite" data-sprite="${avatar}" width="704" height="576" aria-hidden="true"></canvas></div>`:'<span class="orbe-hero-seal" aria-hidden="true">✧</span>'}</div>
    <div class="orbe-fighter orbe-enemy" role="group" aria-label="Lethon y su poder"><div class="orbe-nameplate"><strong>Lethon</strong><small>Poder del Olvido · <span data-orbe-hp-value>100</span>/100</small><progress data-orbe-hp max="100" value="100" aria-label="Poder del Olvido de Lethon"></progress></div><div class="orbe-actor-art"><img class="orbe-enemy-art" src="${asset('lethon-combate-v2.webp')}" alt="Lethon, el Devorador del Saber, invoca las Brumas del Olvido"><canvas class="orbe-sprite" data-sprite="lethon" width="704" height="576" aria-hidden="true"></canvas></div></div>
    <span class="orbe-spell" aria-hidden="true"></span><div class="orbe-impact" aria-hidden="true" data-orbe-impact></div><div class="orbe-fragments" aria-label="Fragmentos de esta batalla">${['I','II','III','IV'].map(x=>`<span data-orbe-fragment>${x}</span>`).join('')}</div>
   </div><section class="orbe-command"><div class="orbe-progress-label"><span data-orbe-turn></span><strong data-orbe-count>0 / 4 fragmentos</strong></div><progress class="orbe-progress" max="4" value="0" aria-label="Restauración narrativa del Orbe"></progress>
    <div class="orbe-story" aria-live="polite" aria-atomic="true"><span class="orbe-kicker" data-orbe-place></span><h3 data-orbe-heading></h3><p data-orbe-story></p></div>
    <details class="orbe-help"><summary>Cómo combatir</summary><p>Ilumina para potenciar otra habilidad; enlaza para golpear y protegerte; crea para atacar; refleja para bloquear; une al gremio para recuperar escudo. Lethon contraataca con más fuerza a medida que retrocede. Si tu escudo cae, puedes reagruparte sin perder el recorrido. Las cinco habilidades están disponibles. Elige una, responde su pregunta y ejecuta el movimiento. Si fallas, recibe una pista y vuelve a intentarlo; no se consumen turnos ni se pierde escudo por el error.</p></details>
    <div class="orbe-actions" aria-label="Elige tu habilidad">${Object.entries(Core.moves).map(([key,m])=>`<button type="button" data-orbe-action="${key}" title="${esc(m.detail)}"><span aria-hidden="true">${symbols[key]}</span><strong>${esc(m.name)}</strong><small>${labels[key]} · ${m.damage} impacto${m.guard?' · protege':m.heal?' · recupera':''}</small></button>`).join('')}</div>
    <section class="orbe-quiz" data-orbe-quiz hidden aria-label="Desafío de la habilidad"></section>
    <button type="button" class="orbe-next" data-orbe-next></button><p class="orbe-footnote">Repaso formativo sin nota ni registro de respuestas. El escudo y el poder de Lethon solo pertenecen a este encuentro; tus atributos, notas y recompensas se conservan.</p><p class="orbe-save-note" data-orbe-save role="status"></p>
   </section></div>`;
  document.body.append(d);const q=s=>d.querySelector(s);
  if(window.LudariaSprites)d.querySelectorAll('[data-sprite]').forEach(canvas=>{const actor=canvas.dataset.sprite;canvas.addEventListener('sprite-ready',()=>canvas.closest('.orbe-fighter').dataset.spriteReady='1',{once:true});players[actor]=window.LudariaSprites.load(canvas,asset(window.LudariaSprites.sources[actor]),actor);});
  function tell(k,t,text){q('[data-orbe-place]').textContent=k;q('[data-orbe-heading]').textContent=t;q('[data-orbe-story]').textContent=text;}
  function sync(){
   d.dataset.screen=screen;d.classList.toggle('is-restored',screen==='victory'||screen==='epilogue');
   q('[data-orbe-hp]').value=state.hp;q('[data-orbe-hp-value]').textContent=state.hp;q('[data-orbe-ward]').value=state.ward;q('[data-orbe-ward-value]').textContent=state.ward;
   q('.orbe-progress').value=state.fragments;q('[data-orbe-count]').textContent=state.fragments+' / 4 fragmentos';
   q('[data-orbe-turn]').textContent=screen==='battle'?'Turno '+state.turn+' · '+Core.phases[Math.min(3,state.fragments)].attack:screen==='victory'||screen==='epilogue'?'El Orbe del Saber':'La Bóveda de Ludaria';
   d.querySelectorAll('[data-orbe-fragment]').forEach((e,i)=>e.classList.toggle('is-reunited',i<state.fragments));
   q('.orbe-actions').hidden=screen!=='battle'||report;q('[data-orbe-next]').hidden=screen==='quiz'||screen==='resolving'||(screen==='battle'&&!report);q('.orbe-help').hidden=screen!=='battle';
   q('[data-orbe-quiz]').hidden=screen!=='quiz';q('.orbe-story').hidden=screen==='quiz';
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
  function openQuestion(key){
   const cacheKey=state.turn+':'+key;if(!questions.has(cacheKey))questions.set(cacheKey,Quiz.choose(key,seen));
   pending={key,question:questions.get(cacheKey)};quizPassed=false;screen='quiz';report=false;sync();
   const question=pending.question;
   q('[data-orbe-quiz]').innerHTML=`<span class="orbe-kicker">PREPARA ${esc(Core.moves[key].name)}</span><h3 id="orbe-quiz-question">${esc(question.question)}</h3><div class="orbe-quiz-options" role="group" aria-labelledby="orbe-quiz-question">${question.options.map((option,i)=>`<button type="button" data-quiz-option="${i}"><span aria-hidden="true">${'ABCD'[i]}</span>${esc(option[0])}</button>`).join('')}</div><p class="orbe-quiz-feedback" data-quiz-feedback role="status" aria-live="polite"></p><p class="orbe-quiz-hint" data-quiz-hint-text hidden>${esc(question.hint)}</p><div class="orbe-quiz-tools"><button type="button" data-quiz-hint aria-expanded="false">Ver pista</button><button type="button" data-quiz-cancel>Cambiar habilidad</button></div><button type="button" class="orbe-next" data-quiz-execute hidden>Ejecutar ${esc(Core.moves[key].name)}</button>`;
   q('[data-quiz-option]').focus();
  }
  function finishMove(){
    const e=state.lastEvent;report=true;screen=state.outcome==='victory'?'victory':state.outcome==='breather'?'breather':'battle';delete d.dataset.motion;delete d.dataset.move;sync();
    const detail=`${Core.moves[e.key].name}: ${e.damage} de impacto${e.bonus?' con combo':''}. ${e.healed?'Recuperas '+e.healed+' de escudo. ':''}${e.incoming?'Lethon responde con '+e.attack+': '+(e.incoming-e.blocked)+' de daño'+(e.blocked?'; bloqueas '+e.blocked:'')+'.':''}`;
    if(screen==='victory')tell('LOS CUATRO FRAGMENTOS · LA VICTORIA','«El saber que construimos no te pertenece, Lethon».','El último velo se rompe. Las voces de Théol, Bryn, Ondal y Mira se unen a la expedición. Lethon se disuelve y los cuatro fragmentos vuelven a encontrarse.');
    else if(screen==='breather')tell('LA EXPEDICIÓN SE REAGRUPA','Nadie queda atrás.','El escudo cede, pero los fragmentos reunidos siguen contigo. Recupera el aliento y vuelve a la batalla; nada de tu recorrido se pierde.');
    else tell(e.fragment?'UN FRAGMENTO VUELVE A BRILLAR':'TU MOVIMIENTO · RESPUESTA DE LETHON',e.fragment?Core.phases[Math.min(3,state.fragments-1)].memory:'La batalla continúa.',detail);
    q('[data-orbe-next]').focus({preventScroll:true});
  }
  function executeMove(){
   if(screen!=='quiz'||!pending||!quizPassed)return;
   const {key,question}=pending;pending=null;seen.push(question.id);state=Core.act(state,key);screen='resolving';sync();
   tell('TU HABILIDAD SE DESPIERTA',Core.moves[key].name,'Tu respuesta abre una brecha en las brumas. La expedición actúa.');
   const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||document.body.dataset.ludariaMotion==='off';
   if(reduced){finishMove();return;}
   d.dataset.move=key;d.dataset.motion='hero';players[avatar]?.play();q('.orbe-arena').scrollIntoView({block:'nearest'});pulse(key,state.lastEvent.damage);
   motionTimer=setTimeout(()=>{if(!d.isConnected)return;if(state.lastEvent.incoming){d.dataset.motion='enemy';players.lethon?.play();tell('LETHON CONTRAATACA',state.lastEvent.attack,'La expedición sostiene el escudo frente a las Brumas del Olvido.');motionTimer=setTimeout(finishMove,850);}else finishMove();},850);
  }
  d.addEventListener('click',async event=>{
   const b=event.target.closest('button');if(!b)return;
   if(b.hasAttribute('data-orbe-close')){d.close();return;}
   if(b.hasAttribute('data-orbe-sound')){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error();audio=audio||new Audio();sound=!sound;if(sound)await audio.resume();else await audio.suspend();if(!d.isConnected){audio.close().catch(()=>{});return;}b.textContent=sound?'Sonido: activado':'Sonido: apagado';b.setAttribute('aria-pressed',String(sound));}catch{sound=false;b.textContent='Sonido no disponible';b.setAttribute('aria-pressed','false');}return;}
   if(b.dataset.orbeAction&&screen==='battle'&&!report){openQuestion(b.dataset.orbeAction);return;}
   if(b.hasAttribute('data-quiz-cancel')&&screen==='quiz'){pending=null;nextTurn();q('[data-orbe-action]').focus();return;}
   if(b.hasAttribute('data-quiz-hint')&&screen==='quiz'){q('[data-quiz-hint-text]').hidden=false;b.setAttribute('aria-expanded','true');return;}
   if(b.hasAttribute('data-quiz-option')&&screen==='quiz'&&pending&&!quizPassed){
    const result=Quiz.answer(pending.question,Number(b.dataset.quizOption));if(!result)return;
    b.dataset.result=result.correct?'correct':'retry';q('[data-quiz-feedback]').textContent=result.feedback;
    if(result.correct){quizPassed=true;d.querySelectorAll('[data-quiz-option]').forEach(option=>option.disabled=true);q('[data-quiz-execute]').hidden=false;q('[data-quiz-execute]').focus();}
    else{b.disabled=true;q('[data-quiz-hint-text]').hidden=false;q('[data-quiz-hint]').setAttribute('aria-expanded','true');q('[data-quiz-feedback]').textContent+=' Revisa la pista y prueba otra opción.';q('[data-quiz-option]:not(:disabled)').focus({preventScroll:true});}return;
   }
   if(b.hasAttribute('data-quiz-execute')){executeMove();return;}
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
  d.addEventListener('close',()=>{clearTimeout(fxTimer);clearTimeout(motionTimer);Object.values(players).forEach(player=>player.stop());document.removeEventListener('visibilitychange',suspend);if(audio)audio.close().catch(()=>{});d.remove();if(dialog===d)dialog=null;if(!dialog?.open&&button.isConnected)button.focus({preventScroll:true});});
  sync();tell('LA BÓVEDA DEL ORBE','«Habéis llegado lejos. Aquí termina vuestra memoria».','Lethon cierra el paso. Los cuatro fragmentos tiemblan entre sus manos. A tu espalda resuenan las voces de tus compañeros: protege la expedición, responde a los desafíos, combina tus habilidades y rompe las Brumas del Olvido.');d.showModal();q('[data-orbe-next]').focus({preventScroll:true});
 }
 document.addEventListener('click',event=>{const b=event.target.closest('[data-action="orbe"]');if(!b||allowingOriginal)return;event.preventDefault();event.stopImmediatePropagation();open(b);},true);
 const stage=document.getElementById('stage');if(stage)new MutationObserver(polish).observe(stage,{childList:true});polish();
})();
