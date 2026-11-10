'use strict';
(async () => {
let startingMission=true;
function missionHash(){return startingMission && window.LudariaCloud?.active && centralSnapshot ? '' : location.hash;}

function setPageHistory(state,title,hash){if(!window.LudariaCloud?.active)history.replaceState(state,title,location.href.split('#')[0]+hash);}

const cloud=window.LudariaCloud; let centralSnapshot=null;
if(cloud?.active){await cloud.ready;try{centralSnapshot=await cloud.loadMission();}catch(error){const stage=document.getElementById('stage')||document.querySelector('main');if(stage){stage.textContent='No se pudo recuperar tu cuaderno. '+error.message+' Conserva tus notas y vuelve a intentarlo.';}return;}}

const C=window.GEMA,KEY='ludaria_gema_motivacional_v1',$=id=>document.getElementById(id);
const fresh=()=>({version:1,page:0,visited:[0],fields:{},seals:['pending','pending','pending'],choices:[null,null,null],hints:[false,false,false],vote:null,lenses:[],tab:0,ceremony:false,timer:600});
let state=fresh(),storageOK=true,feedback={},opener=null,running=false,toastTimeout;
try{const s=(cloud?.active ? centralSnapshot : JSON.parse(localStorage.getItem(KEY)||'null'));if(s?.version===1){state.page=Number.isInteger(s.page)&&s.page>=0&&s.page<12?s.page:0;state.visited=Array.isArray(s.visited)?[...new Set(s.visited.filter(n=>Number.isInteger(n)&&n>=0&&n<12))]:[0];for(const k of Object.keys(C.fields))if(typeof s.fields?.[k]==='string')state.fields[k]=s.fields[k].slice(0,6000);for(let i=0;i<3;i++){state.choices[i]=[0,1,2].includes(s.choices?.[i])?s.choices[i]:null;state.seals[i]=s.seals?.[i]==='assisted'?'assisted':s.seals?.[i]==='solved'&&state.choices[i]===C.quizzes[i].correct?'solved':'pending';state.hints[i]=s.hints?.[i]===true;}state.vote=[0,1,2].includes(s.vote)?s.vote:null;state.tab=[0,1,2].includes(s.tab)?s.tab:0;state.lenses=Array.isArray(s.lenses)?s.lenses.filter(x=>C.lenses.some(l=>l.id===x)):[];state.ceremony=s.ceremony===true;state.timer=Number.isInteger(s.timer)?Math.max(0,Math.min(600,s.timer)):600;}}catch(e){storageOK=false;}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){if(cloud?.active){cloud.saveMission(state);return;}
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { storageOK = false; }
  const note = $('saved-note');
  if (note) note.textContent = localNotebookStatus();
}
const b=(action,text,attrs='',secondary=false)=>`<button class="button ${secondary?'secondary':''}" data-action="${action}" ${attrs}>${text}</button>`;
const t=(action,text,attrs='')=>`<button class="text-button" data-action="${action}" ${attrs}>${text}</button>`;
const field=(id,scope='page')=>`<label class="field" for="field-${scope}-${id}">${C.fields[id].label}<textarea id="field-${scope}-${id}" data-field="${id}" maxlength="6000" rows="2" placeholder="${esc(C.fields[id].placeholder)}">${esc(state.fields[id])}</textarea></label>`;
const status=x=>x==='solved'?'Resuelto':x==='assisted'?'Apertura acompañada':'Por resolver';
const phases = [
  { name: 'Explora', start: 0 },
  { name: 'Interpreta', start: 3 },
  { name: 'Rediseña', start: 7 },
  { name: 'Cierra', start: 10 }
];
const readings = ['Hay una tensión', 'Necesito más información', 'Veo una oportunidad'];
const quizNext = [
  'Anoten qué preguntarían y qué observarían antes de revisar la regla.',
  'Anoten qué regla cambiarían y por qué.',
  'Lleven la precaución que eligieron a la reflexión de cierre.'
];

function missionRoute(pageIndex) {
  const current = phases.filter(phase => phase.start <= pageIndex).length - 1;
  return `<section class="gema-route" aria-label="Ruta de práctica de la Gema">
    <div class="gema-route-heading"><strong>Ruta de la Gema</strong><span>Tramo ${current + 1} de ${phases.length}</span></div>
    <ol class="gema-milestones">${phases.map((phase, index) => `
      <li class="gema-milestone" ${index === current ? 'aria-current="step"' : ''}>
        <span class="gema-milestone-mark" aria-hidden="true">${index + 1}</span>
        <span><strong>${phase.name}</strong><small class="gema-milestone-note"></small></span>
      </li>`).join('')}
    </ol>
  </section>`;
}

const equipped = new Set();
const shownPerkMoments = new Set();
const itemGear = {
  'gema-motivacional_0': {
    art: 'pocion', type: 'Poción de enfoque', effect: '3 preguntas para leer el caso',
    benefit: 'Detecta si hay elección, apoyo para avanzar y sentido de pertenencia.',
    when: 'En el primer dilema y en Diagnóstico',
    page: 3, workshopTab: 0
  },
  'gema-motivacional_1': {
    art: 'prisma', type: 'Prisma de contraste', effect: '2 formas de abordar el dilema',
    benefit: 'Compara dar más opciones con ofrecer más apoyo o fortalecer al equipo.',
    when: 'En «Los puntos arbitrarios» y en Rediseño',
    page: 5, workshopTab: 1
  },
  'gema-motivacional_2': {
    art: 'corazon', type: 'Corazón del cuidado', effect: '1 prueba de inclusión',
    benefit: 'Ensaya una forma de participar sin competir ni exponerse.',
    when: 'En Contraste y al compartir tu rediseño',
    page: 8, workshopTab: 2
  }
};

function missionPerks() {
  const profile = window.LudariaCloud?.profile;
  const mission = window.LudariaRPG?.find('gema-motivacional');
  if (!$('gema-backpack') || !profile || !mission || !window.LudariaRPGUI?.openPerk) return [];
  return mission.perks.map(perk => {
    const current = profile.skills?.[perk.attribute] ?? 1;
    return {...perk, current, available: current >= perk.minimum};
  });
}

function updateBackpack() {
  const perks = missionPerks();
  const available = perks.filter(perk => perk.available);
  for (const id of equipped) {
    if (!available.some(perk => perk.id === id)) equipped.delete(id);
  }
  const button = $('gema-backpack');
  if (!button) return perks;
  button.hidden = !perks.length;
  $('gema-backpack-count').textContent = available.length;
  button.dataset.equipped = String(equipped.size > 0);
  const availableLabel = available.length === 1 ? '1 disponible' : `${available.length} disponibles`;
  button.setAttribute('aria-label', `Mochila de ventajas, ${availableLabel} y ${equipped.size} ${equipped.size === 1 ? 'equipada' : 'equipadas'}`);
  updatePerkCue(available);
  return perks;
}

function updatePerkCue(available) {
  const slot = $('stage').querySelector('[data-gema-perk-cue]');
  if (!slot) return;
  const perk = available.find(({id}) => {
    const gear = itemGear[id];
    return equipped.has(id) && gear && (state.page === 7 ? gear.workshopTab === state.tab : gear.page === state.page);
  });
  if (slot.dataset.perk === (perk?.id || '')) return;
  slot.dataset.perk = perk?.id || '';
  slot.hidden = !perk;
  if (!perk) {
    slot.replaceChildren();
    return;
  }
  const gear = itemGear[perk.id];
  const moment = `${state.page}:${perk.id}`;
  const firstAppearance = !$('modal').open && !shownPerkMoments.has(moment);
  if (firstAppearance) shownPerkMoments.add(moment);
  const pulse = firstAppearance ? ' is-new' : '';
  slot.innerHTML = `<button type="button" class="gema-use-item${pulse}" data-item-art="${gear.art}"
      data-action="use-perk" data-perk="${esc(perk.id)}" aria-labelledby="gema-use-name" aria-describedby="gema-use-effect">
    <span class="gema-use-icon"><img src="assets/objeto-${gear.art}.svg" alt="" width="32" height="32"></span>
    <span class="gema-use-copy">
      <span class="gema-use-kicker">De tu mochila · Úsalo aquí</span>
      <strong id="gema-use-name">Usar ${gear.type}</strong>
      <span id="gema-use-effect">${gear.effect}</span>
    </span>
    <span class="gema-use-arrow" aria-hidden="true">›</span>
  </button>`;
}

const perkCue = '<div data-gema-perk-cue hidden></div>';

function inventoryCard(perk, preparing) {
  const gear = itemGear[perk.id];
  const selected = equipped.has(perk.id);
  const id = esc(perk.id);
  const name = esc(perk.name);
  const attribute = esc(window.LudariaRPG.attributes[perk.attribute]);
  const itemState = selected ? 'equipped' : perk.available ? 'available' : 'locked';
  const stateLabel = selected ? 'Equipado' : perk.available ? 'Disponible' : 'Bloqueado';
  const lock = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 7V5a3 3 0 0 1 6 0v2M3 7h10v7H3z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  return `<article class="gema-item" data-item-art="${gear?.art || ''}" data-item-state="${itemState}" aria-labelledby="gema-item-${id}">
    <div class="gema-item-heading">
      ${gear ? `<div class="gema-item-slot"><img src="assets/objeto-${gear.art}.svg" alt="" width="64" height="64"></div>` : ''}
      <div>${gear ? `<span class="gema-item-type">${gear.type}</span>` : ''}<h3 id="gema-item-${id}">${name}</h3></div>
    </div>
    <div class="gema-item-effect">
      <strong>${gear?.effect || name}</strong>
      <p>${gear?.benefit || esc(perk.text)}</p>
      ${gear ? `<p class="gema-item-when">${gear.when}</p>` : ''}
    </div>
    <div class="gema-item-controls">
      <span class="gema-item-status">${perk.available ? '' : lock}${stateLabel}</span>
      ${perk.available ? `<div class="gema-item-buttons">
        ${b('equip-perk', selected ? 'Quitar' : 'Equipar', `data-perk="${id}" aria-label="${selected ? 'Quitar' : 'Equipar'} ${name}"`, true)}
        ${selected && !preparing ? b('use-perk','Usar',`data-perk="${id}" aria-label="Usar ${name}"`) : ''}
      </div>` : `<p class="gema-item-requirement">Requiere ${attribute} <strong>${esc(perk.minimum)}</strong> · Tienes ${esc(perk.current)}</p>`}
    </div>
  </article>`;
}

function backpack(preparing = false) {
  const perks = updateBackpack();
  const dialog = $('modal');
  let pack = dialog.open && dialog.querySelector('.gema-pack');
  if (!perks.length) {
    if (pack) close();
    return;
  }
  if (!pack) {
    modal(preparing ? 'Prepara tu mochila' : 'Mochila de ventajas', `
      <div class="gema-pack" data-gema-preparing="${preparing}">
        <p class="gema-pack-intro" id="gema-pack-intro">${preparing ? 'Equipa lo que quieras llevar. Verás su icono junto a la actividad donde te ayuda.' : 'Elige <strong>Usar</strong> en un objeto equipado para abrir su ayuda.'}</p>
        <div class="gema-items" role="region" aria-label="Objetos de la mochila" tabindex="0"></div>
        <footer class="gema-pack-footer">
          <div><strong role="status"></strong><small>Sin costo · Durante esta visita</small></div>
          ${preparing ? b('enter-session','Entrar sin equipar') : b('close','Volver a la sesión','',true)}
        </footer>
      </div>`, true);
    pack = dialog.querySelector('.gema-pack');
  }
  const cards = pack.querySelector('.gema-items');
  const scrollTop = cards.scrollTop;
  const active = document.activeElement;
  const focused = active !== cards && cards.contains(active) ? active.dataset : null;
  cards.innerHTML = perks.map(perk => inventoryCard(perk, preparing)).join('');
  cards.scrollTop = scrollTop;
  if (focused) {
    const nextFocus = [...cards.querySelectorAll('button')].find(button =>
      button.dataset.perk === focused.perk && button.dataset.action === focused.action);
    (nextFocus || $('modal-title')).focus({preventScroll:true});
  }
  const count = pack.querySelector('[role=status]');
  const summary = equipped.size === 1 ? '1 objeto equipado' : `${equipped.size} objetos equipados`;
  if (count.textContent !== summary) count.textContent = summary;
  const enter = pack.querySelector('[data-action=enter-session]');
  if (enter) enter.textContent = equipped.size ? 'Entrar a la sesión' : 'Entrar sin equipar';
}

function prepareSession() {
  if (missionPerks().length) backpack(true);
  else go(1);
}

window.addEventListener('ludaria:profile', () => {
  const bag = $('modal-body').querySelector('[data-gema-preparing]');
  if ($('modal').open && bag) backpack(bag.dataset.gemaPreparing === 'true');
  else updateBackpack();
});

function updateMilestones() {
  const facets = new Set(state.lenses).size;
  const hasReading = Boolean(state.fields.initial?.trim());
  const hasRule = Boolean(state.fields.rule?.trim());
  const hasEvidence = Boolean(state.fields.evidence?.trim());
  const hasReflection = Boolean(state.fields.exit?.trim());
  const designNote = hasRule ? (hasEvidence ? 'Regla y contraste' : 'Contraste pendiente') : 'Regla por anotar';
  const evidence = [
    [facets === C.lenses.length, `${facets}/${C.lenses.length} facetas`],
    [hasReading, hasReading ? 'Lectura anotada' : 'Lectura por anotar'],
    [hasRule && hasEvidence, designNote],
    [hasReflection, hasReflection ? 'Reflexión anotada' : 'Reflexión pendiente']
  ];
  ($('gema-route-rail') || $('stage')).querySelectorAll('.gema-milestone').forEach((node, index) => {
    const [earned, label] = evidence[index];
    node.classList.toggle('has-evidence', earned);
    const note = node.querySelector('.gema-milestone-note');
    if (note.textContent !== label) note.textContent = label;
  });
}

function localNotebookStatus() {
  return storageOK ? 'Cuaderno guardado en este dispositivo.' : 'Guardado local sin confirmar. Copia tu registro.';
}

function notebookStatus() {
  const message = window.LudariaCloud?.active
    ? document.querySelector('[data-cloud-status]')?.textContent || 'Comprueba la confirmación de tu cuaderno.'
    : localNotebookStatus();
  return `<p class="note gema-save-note" id="saved-note">${esc(message)}</p>`;
}

const title=n=>`<div class="section-title"><div><span class="eyebrow">LA CANTERA · MAESTRA BRYN · MAESTRÍA</span><h2>${C.pages[n].title}</h2></div><span class="time-label">${C.pages[n].time} min · ${n===8?'entre equipos':'en grupo'}</span></div><p class="lead"><strong class="gema-now">Ahora</strong> ${C.pages[n].prompt}</p>`;
const scene=(n,body)=>`<section class="scene"><div class="scene-content wide">${title(n)}${n === 7 ? '' : perkCue}${body}<p class="note product">Producto: ${C.pages[n].product}</p></div></section>`;
const source=()=>`<div class="source-line">${t('sources','Fuentes y alcance')}<span class="note inline-note">Casos y pautas: elaboración didáctica propia.</span></div>`;
const caseBox=i=>`<div class="case-panel"><span class="eyebrow">CASO FICTICIO · PARA ANALIZAR</span><p>${C.cases[i].text}</p></div>`;
const clock=()=>`${String(Math.floor(state.timer/60)).padStart(2,'0')}:${String(state.timer%60).padStart(2,'0')}`;
const gem=(large=false)=>`<div class="gem-visual ${large?'large':''}" aria-hidden="true"><svg viewBox="0 0 300 260"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#b1efbd"/><stop offset=".4" stop-color="#388d67"/><stop offset="1" stop-color="#071d16"/></linearGradient></defs><path d="M90 22h120l70 78-130 146L20 100Z" fill="url(#g)" stroke="#c9a66b" stroke-width="2"/><path d="m90 22 30 78 30 146 30-146 30-78M20 100h260M90 22l90 78M210 22l-90 78" fill="none" stroke="#d3e4b5" stroke-opacity=".5" stroke-width="1.5"/></svg></div>`;
function quiz(i) {
  const q = C.quizzes[i];
  const seal = state.seals[i];
  let message = feedback[i];
  if (seal === 'solved') {
    message = { kind: 'success', text: '<strong>Sello abierto.</strong> ' + q.options[q.correct].why + ' ' + quizNext[i] };
  } else if (seal === 'assisted' && !message) {
    message = { kind: 'hint', text: '<strong>Pauta abierta con acompañamiento.</strong> ' + quizNext[i] };
  }
  return `<div class="split challenge-split">
    <div>
      <h3 class="question-title">${q.question}</h3>
      <div class="options">${q.options.map((option, index) => `<button class="choice ${state.choices[i]===index?'selected':''}" data-action="choice" data-quiz="${i}" data-option="${index}" aria-pressed="${state.choices[i]===index}"><span class="choice-mark">${String.fromCharCode(65+index)}</span><span>${option.text}</span></button>`).join('')}</div>
      <div class="actions">${b('check','Revisar mi decisión',`data-quiz="${i}"`)}${t('hint','Ver pista del candado',`data-quiz="${i}"`)}</div>
      ${message ? `<div class="feedback ${message.kind}" role="status" tabindex="-1" data-gema-feedback>${message.text}</div>` : ''}
      ${state.hints[i] ? `<p class="note"><strong>Pista del candado.</strong> ${q.hint}</p>` : ''}
      <p class="note">${t('assist','Abrir con acompañamiento',`data-quiz="${i}"`)} · Puedes seguir sin resolver.</p>
    </div>
    <aside class="lock-panel ${seal!=='pending'?'open':''}">
      <div class="lock-glyph" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="10" y="21" width="28" height="22" rx="3"/><path d="M16 21v-7a8 8 0 0 1 16 0v7"/><circle cx="24" cy="31" r="2"/></svg></div>
      <span class="eyebrow">CANDADO ${i+1}</span>
      <h3>${q.name}</h3>
      <p>${status(seal)}</p>
      ${seal!=='pending' ? b('reward','Consultar la pauta',`data-quiz="${i}"`,true) : '<p class="note">Pauta complementaria. El contenido esencial sigue disponible.</p>'}
    </aside>
  </div>`;
}

function finale() {
  return `<div class="gema-finale">
    <div class="panel gema-ritual">
      <div class="gema-ritual-heading">
        <div class="fragment ${state.ceremony?'lit':''}" aria-hidden="true">${gem()}<span>II</span></div>
        <div><span class="eyebrow">CIERRE NARRATIVO</span><h3 class="ceremony-title">Cuidar la experiencia también es diseñar.</h3></div>
      </div>
      <p class="note">Compartan qué regla cambiaron y cómo observarían su efecto en la participación.</p>
      <div class="actions">
        ${b('ceremony',state.ceremony?'Cierre narrativo activado':'Activar cierre en clase',`aria-pressed="${state.ceremony}"`)}
        ${b('record','Ver mi registro','',true)}
      </div>
      <p class="note">El Fragmento II se refleja en la Forja cuando registras las tres misiones de la Cantera.</p>
    </div>
    <section class="gema-finish-guide" aria-labelledby="gema-finish-title">
      <span class="eyebrow">DEL AULA A LA AVENTURA</span>
      <h3 id="gema-finish-title">Registra la huella de la Gema</h3>
      <ol>
        <li><strong>Comparte tu trabajo.</strong> Entrega el rediseño y la reflexión por el canal de la clase.</li>
        <li><strong>Recibe la runa.</strong> Tu docente te da el Código del Saber al cerrar.</li>
        <li><strong>Actívala en «Runas».</strong> Abre la Forja con tu personaje y revisa la etapa en «Mi viaje».</li>
      </ol>
      ${notebookStatus()}
      <div class="actions"><a class="button secondary" href="../forja/" target="_blank" rel="noopener">Abrir la Forja <span aria-hidden="true">↗</span></a></div>
      <p class="gema-next-stop"><strong>Siguiente parada</strong> Los Planos del Arquitecto</p>
    </section>
  </div>`;
}

const groups=[['situation','purpose','diagnosis'],['risk','rule','participation'],['evidence','peer','revision']];
function page(n){switch(n){
case 0:return `<section class="scene"><div class="cover-content"><span class="eyebrow">MISIÓN SECUNDARIA 2 · MÓDULO 2 · CIERRE</span><h1 class="cover-title">La Gema<br><span>Motivacional</span></h1><p class="lead">La luz de una aventura depende de quienes la recorren. Rediseñemos las reglas que invitan a aprender.</p><div class="cover-meta"><span class="small-line"></span><span>Cantera de los Elementos · Maestra Bryn</span></div><div class="actions">${b('begin', missionPerks().length ? 'Preparar mochila' : 'Entrar a la Cantera')}</div><p class="note">90 minutos sincrónicos · Maestría · Fragmento II</p></div></section>`;
case 1:return scene(n,`<blockquote class="mentor">“Antes de pulir una regla, escuchen lo que provoca en quienes la viven.”<small>BRYN · VOZ NARRATIVA DE ESTA MISIÓN</small></blockquote><div class="three-column">${[['01','Escuchar','Una persona reconoce la tensión; otra pregunta por una evidencia.'],['02','Rediseñar','Conserven el propósito y hagan explícita una regla distinta.'],['03','Contrastar','Intercambien roles y revisen el efecto que necesitan comprobar.']].map(([num,h,p])=>`<article class="panel"><span class="num">${num}</span><h3>${h}</h3><p>${p}</p></article>`).join('')}</div><p class="note">Misión secundaria optativa; presentación disponible para todos. Los tres candados abren pautas, no acreditan aprendizaje.</p>`);
case 2:return scene(n,`<div class="split facets"><div>${gem()}<p class="note"><strong class="gema-choice-label">Tú eliges</strong> Abre las facetas en el orden que prefieras. Escoge una y explica a tu equipo qué te ayuda a observar.</p></div><div class="lens-buttons">${C.lenses.map(l=>`<button class="evidence-card ${state.lenses.includes(l.id)?'seen':''}" data-action="lens" data-lens="${l.id}"><small>FACETA ${C.lenses.indexOf(l)+1}</small><strong>${l.title}</strong></button>`).join('')}<p class="note">Lentes de Ryan y Deci (2020). Pueden intervenir varias necesidades en una misma situación.</p>${source()}</div></div>`);
case 3:return scene(n,`<div class="split"><div>${caseBox(0)}<div class="vote-row"><span class="note"><strong class="gema-choice-label">Tú eliges</strong> ¿Cuál es tu primera lectura?</span>${readings.map((v,i)=>`<button class="button secondary small ${state.vote===i?'selected':''}" data-action="vote" data-option="${i}" aria-pressed="${state.vote===i}">${v}</button>`).join('')}</div><p class="note gema-reading" role="status">${state.vote===null ? 'La lectura que elijas será el punto de partida de tu anotación.' : `Elegiste «${readings[state.vote]}». Anota la regla y la señal que sostienen tu lectura.`}</p></div><div>${field('initial')}${notebookStatus()}</div></div>`);
case 4:return scene(n,'<p class="note gema-case-reminder"><strong>El dilema.</strong> Una actividad cooperativa termina con una clasificación individual por rapidez.</p>'+quiz(0)+source());
case 5:return scene(n,`<div class="compact-case">${caseBox(1)}</div>${quiz(1)}<div class="actions">${t('points-note','Registrar una regla que revisaríamos')}</div>`);
case 6:return scene(n,`<div class="ethics-grid">${C.ethics.map((e,i)=>`<button class="panel ethics-card" data-action="ethics" data-option="${i}"><span class="num">0${i+1}</span><h3>${e.title}</h3><p>${e.question}</p></button>`).join('')}</div><div class="actions">${b('risk-note','Registrar nuestro riesgo','',true)}${t('sources','Kim y Werbach · referencia y límites')}</div><p class="note">Adaptación didáctica de un marco organizacional. No sustituye la escucha de quienes participan.</p>`);
case 7:return scene(n,`<p class="note"><strong class="gema-choice-label">Tú eliges</strong> Decidan qué regla del caso quieren cambiar. Propongan una alternativa y decidan qué observarían para saber si mejora la experiencia.</p><div class="worksheet-tabs" role="tablist" aria-label="Etapa del rediseño">${['Diagnóstico','Rediseño','Contraste'].map((name,i)=>`<button role="tab" id="tab-${i}" aria-controls="worksheet-panel" aria-selected="${state.tab===i}" tabindex="${state.tab===i?0:-1}" data-action="tab" data-option="${i}">${name}</button>`).join('')}</div><div class="worksheet" id="worksheet-panel" role="tabpanel" aria-labelledby="tab-${state.tab}">${perkCue}<div class="work-grid gema-fields">${groups[state.tab].map(id=>field(id)).join('')}</div></div>${notebookStatus()}<p class="note">Revisen el rediseño entre pares y con el facilitador.</p><div class="actions">${t('record','Ver nuestro registro completo')}${t('model','Ver un ejemplo de rediseño')}</div>`);
case 8:return scene(n,`<div class="split peer-split"><div><div class="steps">${[['1','Presentar · 4 min','Cada equipo explica propósito, regla y evidencia prevista.'],['2','Preguntar · 4 min','¿Quién podría quedar fuera? ¿Qué ayudaría a contrastar el ajuste?'],['3','Revisar · 2 min','El equipo conserva una pregunta y precisa su propuesta.']].map(([num,h,p])=>`<div class="step"><span class="num">${num}</span><div><strong>${h}</strong><p>${p}</p></div></div>`).join('')}</div><div class="work-grid peer-fields">${field('peer')}${field('revision')}</div></div><aside class="timer-box"><span class="eyebrow">TIEMPO ORIENTATIVO</span><div class="timer" id="timer" role="timer" aria-label="Tiempo restante">${clock()}</div><div class="actions">${b('timer',running?'Pausar':'Iniciar')}${t('timer-reset','Reiniciar')}</div><p class="note">No cambia de pantalla. Pueden seguir conversando.</p></aside></div>`);
case 9:return scene(n,quiz(2));
case 10:{const url=window.GEMA_CONFIG?.formularioCierre,valid=typeof url==='string'&&/^https:\/\//.test(url);return scene(n,`<div class="split"><div>${field('exit')}<div class="actions">${b('record','Conservar nuestro registro')}${b('notebook','Abrir cuaderno','',true)}</div>${notebookStatus()}</div><aside class="panel"><span class="eyebrow">CIERRE DEL MÓDULO 2</span><h3>Una huella para la Forja</h3><p>Compartan el rediseño y la reflexión por el canal que indique el facilitador.</p>${valid?`<a class="button secondary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Abrir formulario de cierre</a><p class="note">El envío se realiza en ese formulario. El HTML no lo verifica.</p>`:'<p class="note">El enlace de formulario está pendiente de configurar. Mientras tanto, el registro local permite conservar y compartir la respuesta.</p>'}</aside></div>`);}
case 11:return scene(n,finale());
}}
function render(focus=false){
  document.body.classList.toggle('is-cover',state.page===0);
  $('stage').innerHTML=page(state.page);
  const rail=$('gema-route-rail');
  if(rail) rail.innerHTML=missionRoute(state.page);
  else $('stage').querySelector('.scene-content, .cover-content')?.insertAdjacentHTML('afterbegin',missionRoute(state.page));
  updateMilestones();
  updateBackpack();
  $('page-count').textContent = `${state.page + 1} / 12`;
  $('previous').disabled = state.page === 0;
  $('next-label').textContent = 'Siguiente';
  if (state.page === 11) $('next-label').textContent = 'Mi registro';
  if (state.page === 0 && $('gema-backpack')?.hidden === false) {
    $('next-label').textContent = equipped.size ? 'Entrar a la sesión' : 'Entrar sin equipar';
  }
  $('route-dots').innerHTML=C.pages.map((p,i)=>`<button class="route-dot ${state.visited.includes(i)?'visited':''} ${i===state.page?'current':''}" data-action="go" data-page="${i}" aria-label="Pantalla ${i+1}: ${p.title}" ${i===state.page?'aria-current="step"':''}></button>`).join('');$('seal-status').innerHTML=C.quizzes.map((q,i)=>`<button class="seal-dot ${state.seals[i]}" data-action="seal" data-quiz="${i}" aria-label="Candado ${q.name}: ${status(state.seals[i])}">${i+1}</button>`).join('');if(focus)$('stage').focus({preventScroll:true});}
function go(n){if(!Number.isInteger(n)||n<0||n>=12)return;if($('modal').open)$('modal').close();state.page=n;if(!state.visited.includes(n))state.visited.push(n);save();setPageHistory(null,'',`#pantalla-${n+1}`);render(true);$('stage').scrollTop=0;window.scrollTo({top:0,behavior:'instant'});}
function modal(h, body, inventory = false) {
  const dialog = $('modal');
  if (!dialog.open) opener = document.activeElement;
  dialog.classList.toggle('gema-inventory', inventory);
  if (inventory) dialog.setAttribute('aria-describedby', 'gema-pack-intro');
  else dialog.removeAttribute('aria-describedby');
  $('modal-body').innerHTML = `<h2 id="modal-title" tabindex="-1">${h}</h2>${body}`;
  if (!dialog.open) dialog.showModal();
  $('modal-title').focus({preventScroll:true});
}
function close(){const old=opener,d=old?.dataset?{...old.dataset}:null;$('modal').close();render();if(old?.isConnected)old.focus({preventScroll:true});else if(d){[...document.querySelectorAll('[data-action]')].find(x=>Object.entries(d).every(([k,v])=>x.dataset[k]===v))?.focus({preventScroll:true});}}
function toast(msg){clearTimeout(toastTimeout);$('toast').textContent=msg;$('toast').hidden=false;toastTimeout=setTimeout(()=>$('toast').hidden=true,4000);}
function reward(i){modal('La pauta de '+C.quizzes[i].name,`<p>${status(state.seals[i])}. Recurso complementario para conversar.</p><ul class="reward-list">${C.quizzes[i].reward.map(x=>`<li>${x}</li>`).join('')}</ul><p class="note">La elección que revisamos:</p><p>${C.quizzes[i].options[C.quizzes[i].correct].why}</p><p class="note"><strong>Tu siguiente paso.</strong> ${quizNext[i]}</p><p class="note">Pauta elaborada para esta actividad. No es una rúbrica de la tesis ni una calificación.</p>`);}
function references(){modal('Fuentes y alcance',C.sources.map(s=>`<h3>${s.title}</h3><p>${esc(s.apa)}</p><p class="note">${esc(s.use)}</p>${s.url?`<p><a href="${s.url}" target="_blank" rel="noopener noreferrer">Consultar fuente primaria</a></p>`:''}`).join('')+'<p class="note">Casos, preguntas, pautas y rediseños: elaboración didáctica propia. Arte original generado para Ludaria; gema interactiva construida con código.</p>');}
function textRecord(){return ['BUSCADORES DE LA GAMIFICACIÓN PERDIDA','La Gema Motivacional · Sesión 7 · Misión secundaria 2 · Módulo 2','Fecha: '+new Date().toLocaleDateString('es-CL'),'',...Object.entries(C.fields).flatMap(([id,f])=>[f.label.toUpperCase(),state.fields[id]||'(Sin registro)','']),'PRÁCTICA LOCAL',...C.quizzes.flatMap((q,i)=>[q.name+': '+status(state.seals[i]),'Decisión: '+(q.options[state.choices[i]]?.text||'Sin elegir'),'Pista consultada: '+(state.hints[i]?'Sí':'No')]),'','Lectura inicial: '+(readings[state.vote]||'Sin elegir'),'Facetas consultadas: '+(state.lenses.map(id=>C.lenses.find(l=>l.id===id).title).join(', ')||'Ninguna'),'Cierre narrativo local: '+(state.ceremony?'Activado':'No activado'),'','La entrega formal sigue el canal acordado con el facilitador. Las respuestas abiertas requieren revisión humana. El cierre local no acredita formularios ni códigos.','','FUENTES',...C.sources.map(s=>s.apa)].join('\n');}
function record(){modal('Registro de La Gema Motivacional',`<p>Conserva el rediseño y compártelo por el canal indicado en clase.</p><label class="field" for="export-text">Registro completo<textarea id="export-text" readonly rows="12">${esc(textRecord())}</textarea></label><div class="actions">${b('copy','Copiar registro')}${b('download','Descargar TXT','',true)}</div><p class="note">Si el marco restringe la copia o descarga, selecciona el texto o abre la misión en otra pestaña.</p>`);}
function notebook(){modal('Cuaderno de la Gema',`<div class="work-grid">${Object.keys(C.fields).map(id=>field(id,'book')).join('')}</div><div class="actions">${b('record','Ver registro completo')}</div><p class="note">Borrador por dispositivo. Sin envío ni calificación automática.</p>`);}
document.addEventListener('click',async e=>{const el=e.target.closest('[data-action]');if(!el||el.disabled)return;const a=el.dataset.action,i=Number(el.dataset.quiz),o=Number(el.dataset.option);switch(a){
case 'begin':prepareSession();break;
case 'backpack':backpack(state.page===0);break;
case 'equip-perk': {
  const id = el.dataset.perk;
  if (!missionPerks().some(perk => perk.id === id && perk.available)) break;
  if (equipped.has(id)) equipped.delete(id);
  else equipped.add(id);
  backpack(el.closest('[data-gema-preparing]').dataset.gemaPreparing === 'true');
  break;
}
case 'enter-session':go(1);break;
case 'use-perk': {
  const id = el.dataset.perk;
  if (!equipped.has(id) || !missionPerks().some(perk => perk.id === id && perk.available)) break;
  if ($('modal').open) {
    $('modal').close();
    $('gema-backpack').focus({preventScroll:true});
  } else {
    el.focus({preventScroll:true});
  }
  window.LudariaRPGUI.openPerk(id);
  break;
}
case 'go':go(Number(el.dataset.page));break;case 'close':close();break;
case 'map':modal('Los pasos de la Gema',`<p>Elige una pantalla para volver al punto que quieras revisar. ${state.visited.length}/12 pantallas visitadas. Registra las etapas de la aventura con las runas de la Forja.</p><div class="modal-grid">${C.pages.map((p,n)=>`<button class="map-item" data-action="go" data-page="${n}"><span>${n+1}</span>${p.title}</button>`).join('')}</div><div class="actions">${t('reset-ask','Reiniciar esta misión')}</div>`);break;
case 'sources':references();break;case 'notebook':notebook();break;case 'record':record();break;
case 'lens':{const l=C.lenses.find(x=>x.id===el.dataset.lens);if(!l)break;if(!state.lenses.includes(l.id))state.lenses.push(l.id);save();modal(l.title,`<p>${l.body}</p><div class="case-panel" style="margin-top:20px"><p>${l.question}</p></div><p class="note">Síntesis de Ryan y Deci (2020); pregunta de aplicación propia. Conversen una situación concreta, sin suponer la experiencia de todos.</p><div class="actions">${t('sources','Referencia y alcance')}</div>`);break;}
case 'vote':state.vote=o;save();render();document.querySelector(`[data-action="vote"][data-option="${o}"]`)?.focus({preventScroll:true});break;
case 'choice':state.choices[i]=o;state.seals[i]='pending';delete feedback[i];save();render();document.querySelector(`[data-action="choice"][data-quiz="${i}"][data-option="${o}"]`)?.focus({preventScroll:true});break;
case 'check': {
  const selected = state.choices[i];
  const quizData = C.quizzes[i];
  if (selected === quizData.correct) {
    state.seals[i] = 'solved';
    save();
    render();
    document.querySelector(`[data-action="check"][data-quiz="${i}"]`)?.focus({preventScroll:true});
    reward(i);
    break;
  }
  feedback[i] = selected === null
    ? {kind:'hint',text:'Elige una alternativa antes de revisar. También puedes pedir una pista.'}
    : {kind:'error',text:quizData.options[selected].why+' Revisa tu decisión o pide una pista.'};
  render();
  $('stage').querySelector('[data-gema-feedback]')?.focus();
  break;
}
case 'hint':state.hints[i]=true;save();render();break;
case 'assist':modal('Abrir con acompañamiento',`<p>Conversen la práctica. La pauta puede abrirse con apoyo y el sello lo indicará.</p><div class="actions">${b('assist-confirm','Abrir pauta con apoyo',`data-quiz="${i}"`)}${b('close','Volver a intentar','',true)}</div>`);break;
case 'assist-confirm':state.seals[i]='assisted';delete feedback[i];save();render();reward(i);break;
case 'seal':if(state.seals[i]!=='pending')reward(i);else go([4,5,9][i]);break;case 'reward':reward(i);break;
case 'points-note':modal('Una regla que revisaríamos',field('points','notes'));break;case 'risk-note':modal('Un riesgo concreto',field('risk','notes'));break;
case 'ethics':modal(C.ethics[o].title,`<p>${C.ethics[o].question}</p><p class="note">Apliquen la pregunta a una regla concreta del dilema. Es una adaptación didáctica; no una conclusión automática sobre su equipo.</p>${field('risk','ethic')}<div class="actions">${t('sources','Referencia y límites')}</div>`);break;
case 'tab':state.tab=o;save();render();$('tab-'+o).focus({preventScroll:true});break;
case 'model':modal('Un rediseño posible',`<p><strong>Caso ficticio:</strong> se reconoce solo la rapidez individual en una tarea cooperativa.</p><div class="relationship"><div><small>PROPÓSITO</small><p>Explicar una solución conjuntamente.</p></div><div><small>REGLA PROPUESTA</small><p>Elegir roles, justificar aportes y revisar la explicación con feedback.</p></div><div><small>CUIDADO</small><p>Ofrecer formatos equivalentes y una vía para pedir apoyo.</p></div><div><small>CONTRASTE</small><p>Observar aportes y preguntar cómo se vivió el reconocimiento.</p></div></div><p class="note">Propuesta ilustrativa propia. No garantiza efectos ni sustituye el diseño de su equipo.</p>`);break;
case 'timer':if(state.timer===0)state.timer=600;running=!running;save();render();break;case 'timer-reset':running=false;state.timer=600;save();render();break;
case 'ceremony':
  state.ceremony=true;
  save();
  render();
  $('stage').querySelector('[data-action="ceremony"]')?.focus({preventScroll:true});
  toast('Cierre narrativo activado. Activa tu runa en la Forja cuando la recibas.');
  break;
case 'copy':try{if(!navigator.clipboard?.writeText)throw Error();await Promise.race([navigator.clipboard.writeText(textRecord()),new Promise((_,reject)=>setTimeout(()=>reject(Error()),3500))]);toast('Registro copiado.');}catch(err){$('export-text')?.focus();$('export-text')?.select();toast('Selecciona el registro y usa Copiar en tu dispositivo.');}break;
case 'download':{const url=URL.createObjectURL(new Blob(['\ufeff'+textRecord()],{type:'text/plain;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='Bitacora_La_Gema_Motivacional.txt';document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Descarga solicitada; también puedes copiar el registro visible.');break;}
case 'fullscreen':if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Abre la misión en una pestaña para usar pantalla completa.'));break;
case 'reset-ask':modal('Reiniciar esta misión',`<p>Se borrará únicamente el borrador de La Gema Motivacional en este dispositivo. Conserva tu registro primero.</p><div class="actions">${b('reset','Reiniciar')}${b('record','Ver registro antes','',true)}</div>`);break;
case 'reset':state=fresh();running=false;feedback={};save();go(0);break;
}});
document.addEventListener('input',e=>{const id=e.target.dataset.field;if(C.fields[id]){state.fields[id]=e.target.value;save();updateMilestones();}});
$('previous').addEventListener('click',()=>go(state.page-1));$('next').addEventListener('click',()=>state.page===11?record():go(state.page+1));$('modal').addEventListener('cancel',e=>{e.preventDefault();close();});
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||$('modal').open)return;if(e.target.closest('[role="tab"]')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();state.tab=e.key==='Home'?0:e.key==='End'?2:(state.tab+(e.key==='ArrowRight'?1:2))%3;save();render();$('tab-'+state.tab).focus();return;}if(e.target.closest('input,textarea,select,button,a'))return;if(e.key==='ArrowRight'){e.preventDefault();go(state.page+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(state.page-1);}});
window.addEventListener('hashchange',()=>{const m=/^#pantalla-(\d+)$/.exec(missionHash());if(m)go(Number(m[1])-1);});
setInterval(()=>{if(running&&state.page===8){state.timer=Math.max(0,state.timer-1);save();if($('timer'))$('timer').textContent=clock();if(state.timer===0){running=false;render();toast('Terminó el tiempo orientativo; pueden seguir conversando.');}}},1000);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)$('fireflies').innerHTML=Array.from({length:10},(_,i)=>`<i class="fly" style="left:${(i*37+9)%100}%;top:${(i*19+13)%100}%;animation-delay:-${i}s"></i>`).join('');
// El enlace de entrada lleva #pantalla-1. Al reabrirlo, conserva el punto guardado.
const start=/^#pantalla-(\d+)$/.exec(missionHash());
const requestedPage=start ? Number(start[1])-1 : 0;
if(requestedPage>0&&requestedPage<C.pages.length)state.page=requestedPage;
if(!state.visited.includes(state.page))state.visited.push(state.page);
function dockEffects() {
  const effects = document.querySelector('body > [data-ludaria-effects]');
  if (effects) document.querySelector('.navigation')?.append(effects);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dockEffects, {once:true});
else dockEffects();
save();
render();
startingMission=false;
})();

