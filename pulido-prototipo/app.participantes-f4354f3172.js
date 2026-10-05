'use strict';
(() => {
  const C = window.PULIDO;
  const CFG = window.PULIDO_CONFIG || {};
  const KEY = 'ludaria_pulido_prototipo_v1';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaultState = () => ({version:1,page:0,visited:[0],evidence:[],levels:{},priority:[],fields:{},activeRubric:'coherencia'});
  let state = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.version === 1) state = {...defaultState(), ...saved, fields:{...(saved.fields || {})}, levels:{...(saved.levels || {})}};
  } catch (_) {}

  const stage = $('#stage');
  const modal = $('#modal');
  const modalBody = $('#modal-body');
  const toast = $('#toast');
  const field = id => state.fields[id] || '';
  const save = () => { localStorage.setItem(KEY, JSON.stringify(state)); updateHud(); };
  const notify = message => { toast.textContent = message; toast.hidden = false; clearTimeout(notify.t); notify.t = setTimeout(() => toast.hidden = true, 2600); };
  const setField = (id, value) => { state.fields[id] = value; save(); };
  const pageMeta = () => C.pages[state.page];
  const product = () => `<p class="product"><strong>Producto:</strong> ${esc(pageMeta().product)}</p>`;
  const heading = (eyebrow, title, lead='') => `<div class="section-title"><div><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div><span class="time-label">${pageMeta().time} min</span></div>`;
  const textArea = (id, wide=false) => { const f=C.fields[id]; return `<label class="field${wide?' wide':''}">${esc(f.label)}<textarea data-field="${id}" placeholder="${esc(f.placeholder)}">${esc(field(id))}</textarea></label>`; };
  const rubricField = (criterion, kind, label, placeholder) => `<label class="field">${esc(label)}<textarea data-field="rubric_${kind}_${criterion.id}" placeholder="${esc(placeholder)}">${esc(field(`rubric_${kind}_${criterion.id}`))}</textarea></label>`;
  const levelsDone = () => C.rubric.filter(r => state.levels[r.id]).length;

  function cover(){ return `<section class="scene"><div class="cover-content"><span class="eyebrow">MISIÓN SECUNDARIA · SESIÓN 12 · SANTUARIO DEL ESPEJO</span><h1 class="cover-title">El Pulido del <span>Prototipo</span></h1><p class="lead">Autoevalúa tu diseño con la rúbrica del Anexo E, decide un ajuste viable y prepara sus condiciones de implementación.</p><div class="cover-meta"><span class="small-line"></span><span>90 min sincrónicos · 60 min autónomos</span></div><blockquote class="mentor">“El espejo no dicta una nota: devuelve evidencias para decidir qué conservar y qué pulir.”<small>GUARDIANA MIRA</small></blockquote><div class="actions"><button class="button" data-go="1">Comenzar el taller</button><button class="button secondary" data-action="resources">Recursos</button></div><p class="note">Tu trabajo se conserva solo en este navegador. Descarga o copia la bitácora antes de cambiar de dispositivo.</p></div></section>`; }
  function evidence(){ return `<section class="scene"><div class="scene-content wide">${heading('PASO 1 · REUNIR','Reunir las huellas',pageMeta().prompt)}<div class="evidence-checklist">${C.rubric.map((r,i)=>`<button data-evidence="${r.id}" aria-pressed="${state.evidence.includes(r.id)}"><strong>${i+1} · ${esc(r.name)}</strong><small>${esc(r.evidence)}</small></button>`).join('')}</div><div class="feedback hint">Marca una huella cuando puedas localizarla. Un vacío también es información: no obliga a elegir un nivel antes de revisar el prototipo.</div>${textArea('purpose',true)}${product()}</div></section>`; }
  function method(){ return `<section class="scene"><div class="scene-content wide">${heading('PASO 2 · MÉTODO','Cómo autoevaluar sin castigarse',pageMeta().prompt)}<div class="loop-flow"><article class="loop-step"><span class="num">1</span><h3>Descriptor</h3><p>Lee los tres niveles sin traducirlos a puntos.</p></article><article class="loop-step"><span class="num">2</span><h3>Evidencia</h3><p>Localiza una decisión, regla, secuencia o recurso.</p></article><article class="loop-step"><span class="num">3</span><h3>Argumento</h3><p>Explica por qué la evidencia corresponde al nivel elegido.</p></article><article class="loop-step"><span class="num">4</span><h3>Ajuste</h3><p>Decide qué conservar o cambiar.</p></article></div><div class="feedback">La rúbrica orienta revisión profesional. No calcula promedio, resultado ni eficacia futura.</div>${product()}</div></section>`; }
  function rubric(){
    const r=C.rubric.find(x=>x.id===state.activeRubric)||C.rubric[0];
    return `<section class="scene"><div class="scene-content wide">${heading(`PASO 3 · CRITERIO ${C.rubric.indexOf(r)+1} DE 5`,'El espejo del prototipo',r.question)}<div class="rubric-work"><nav class="rubric-nav" aria-label="Criterios">${C.rubric.map((x,i)=>`<button data-rubric="${x.id}" aria-selected="${x.id===r.id}">${i+1} · ${esc(x.name)}${state.levels[x.id]?' · ✓':''}</button>`).join('')}</nav><div class="rubric-panel"><h3>${esc(r.name)}</h3><p class="note">Elige el descriptor que puedas sostener hoy. No es una calificación.</p><div class="descriptor-options">${Object.entries(r.levels).map(([id,text])=>`<button class="descriptor" data-level="${id}" data-criterion="${r.id}" aria-pressed="${state.levels[r.id]===id}"><strong>${id==='inicial'?'Inicial':id==='desarrollo'?'En desarrollo':'Logrado'}</strong><span>${esc(text)}</span></button>`).join('')}</div><div class="rubric-fields">${rubricField(r,'evidence','Evidencia localizada',`Cita una parte concreta del prototipo: ${r.evidence}`)}${rubricField(r,'reason','Argumento de la decisión','Relaciona la evidencia con las palabras del descriptor elegido.')}</div><p class="note">${state.levels[r.id]?'Selección registrada. Revísala si la evidencia no sostiene el descriptor.':'Aún no has elegido un nivel para este criterio.'}</p></div></div>${product()}</div></section>`;
  }
  function priority(){ return `<section class="scene"><div class="scene-content wide">${heading('PASO 4 · PRIORIZAR','Elegir qué pulir primero',pageMeta().prompt)}<div class="priority-grid">${C.rubric.map((r,i)=>`<button class="priority-card" data-priority="${r.id}" aria-pressed="${state.priority.includes(r.id)}"><strong>${i+1} · ${esc(r.name)}</strong><span>${state.levels[r.id] ? `Nivel elegido: ${state.levels[r.id]==='inicial'?'Inicial':state.levels[r.id]==='desarrollo'?'En desarrollo':'Logrado'}`:'Nivel aún no elegido'}</span></button>`).join('')}</div><p class="note">Selecciona uno o dos criterios. Impacto, viabilidad y riesgo son preguntas para decidir, no una puntuación.</p>${textArea('priorityReason',true)}${product()}</div></section>`; }
  function adjustment(){ return `<section class="scene"><div class="scene-content wide">${heading('PASO 5 · AJUSTAR','Tallado de la nueva versión',pageMeta().prompt)}<div class="change-flow">${['before','change','expected','risk'].map(id=>`<article class="change-step">${textArea(id)}</article>`).join('')}</div><div class="feedback hint">Describe una decisión concreta. La evidencia esperada es algo observable que después podrás revisar; no es un resultado inventado.</div>${product()}</div></section>`; }
  function context(){ return `<section class="scene"><div class="scene-content wide">${heading('PASO 6 · PLANIFICAR','Plan de implementación · contexto',pageMeta().prompt)}<div class="plan-grid">${textArea('course')}${textArea('learning')}${textArea('moment',true)}</div><p class="note">Evita nombres u otros datos personales. El curso destinatario, los tiempos y los recursos son los elementos prescritos en la ficha de la sesión.</p>${product()}</div></section>`; }
  function conditions(){ return `<section class="scene"><div class="scene-content wide">${heading('PASO 7 · PREVER','Plan de implementación · condiciones',pageMeta().prompt)}<div class="plan-grid">${textArea('timing')}${textArea('resources')}${textArea('evidencePlan')}${textArea('contingency')}</div><div class="feedback">La contingencia protege el propósito de aprendizaje si falla una herramienta, falta tiempo o aparece una barrera de acceso.</div>${product()}</div></section>`; }
  function closing(){
    const selected=state.priority.map(id=>C.rubric.find(r=>r.id===id)?.name).filter(Boolean).join(', ')||'Sin prioridad registrada';
    return `<section class="scene"><div class="scene-content wide">${heading('CIERRE · CONSERVAR','Una versión lista para conversar',pageMeta().prompt)}<div class="summary-strip"><article><strong>${levelsDone()} de 5</strong><p>Criterios con nivel elegido y espacio de argumentación.</p></article><article><strong>${esc(selected)}</strong><p>Prioridad declarada para el ajuste.</p></article><article><strong>60 minutos</strong><p>Carga autónoma prescrita para completar la versión ajustada y el plan.</p></article></div><div class="plan-grid">${textArea('consultation')}${textArea('asyncNote')}</div><div class="actions"><button class="button" data-action="notebook">Revisar bitácora</button><button class="button secondary" data-action="download">Descargar registro .txt</button><button class="button secondary" data-action="copy">Copiar registro</button></div><p class="note">Comparte el archivo por el canal real que indique el facilitador. Esta página no envía ni registra respuestas.</p>${product()}</div></section>`;
  }
  const screens=[cover,evidence,method,rubric,priority,adjustment,context,conditions,closing];
  function render(){
    state.page=Math.max(0,Math.min(screens.length-1,state.page)); state.visited=[...new Set([...(state.visited||[]),state.page])]; save();
    document.body.classList.toggle('is-cover',state.page===0); stage.innerHTML=screens[state.page]();
    $('#previous').disabled=state.page===0; $('#next').disabled=state.page===screens.length-1; $('#next-label').textContent=state.page===screens.length-2?'Cerrar recorrido':'Siguiente'; $('#page-count').textContent=`${state.page+1} / ${screens.length}`;
    $('#route-dots').innerHTML=C.pages.map((p,i)=>`<button class="route-dot${state.visited.includes(i)?' visited':''}${state.page===i?' current':''}" data-go="${i}" aria-label="Ir a ${esc(p.title)}" aria-current="${state.page===i?'page':'false'}"></button>`).join('');
    updateHud(); stage.focus({preventScroll:true});
  }
  function updateHud(){ $('#seal-status').innerHTML=C.rubric.map((r,i)=>`<span class="seal-dot${state.levels[r.id]?' solved':''}" title="${esc(r.name)}">${state.levels[r.id]?'✓':i+1}</span>`).join(''); }
  function recordText(){
    const line=[]; line.push('LUDARIA · EL PULIDO DEL PROTOTIPO','Registro local de autoevaluación, ajuste y plan','');
    line.push(`Propósito: ${field('purpose')||'—'}`,'','AUTOEVALUACIÓN');
    C.rubric.forEach(r=>{ const l=state.levels[r.id]; line.push(`\n${r.name}`,`Nivel: ${l?l==='inicial'?'Inicial':l==='desarrollo'?'En desarrollo':'Logrado':'—'}`,`Evidencia: ${field(`rubric_evidence_${r.id}`)||'—'}`,`Argumento: ${field(`rubric_reason_${r.id}`)||'—'}`); });
    line.push('','PRIORIDAD',state.priority.map(id=>C.rubric.find(r=>r.id===id)?.name).filter(Boolean).join(', ')||'—',`Razón: ${field('priorityReason')||'—'}`,'','AJUSTE');
    ['before','change','expected','risk'].forEach(id=>line.push(`${C.fields[id].label}: ${field(id)||'—'}`));
    line.push('','PLAN DE IMPLEMENTACIÓN'); ['course','learning','moment','timing','resources','evidencePlan','contingency','consultation','asyncNote'].forEach(id=>line.push(`${C.fields[id].label}: ${field(id)||'—'}`));
    line.push('','Nota: registro descriptivo sin puntos, pesos, promedio ni resultados simulados.'); return line.join('\n');
  }
  function showModal(html){ modalBody.innerHTML=html; modal.showModal(); }
  function showMap(){ showModal(`<h2 id="modal-title">Índice del taller</h2><p>Navegación siempre disponible: consulta cualquier pantalla del taller.</p><div class="modal-grid">${C.pages.map((p,i)=>`<button class="map-item${i===state.page?' current':''}" data-go="${i}"><span>${i+1}</span>${esc(p.title)} · ${p.time} min</button>`).join('')}</div>`); }
  function showSources(){ showModal(`<h2 id="modal-title">Fuentes y límites</h2>${C.sources.map(s=>`<article class="panel"><h3>${esc(s.title)}</h3><p>${esc(s.apa)}</p>${s.url?`<p><a href="${esc(s.url)}" target="_blank" rel="noopener">Abrir fuente primaria o enlace editorial</a></p>`:''}<p class="note">${esc(s.use)}</p></article>`).join('')}`); }
  function showResources(){ const items=[['Prototipo',CFG.prototipoExterno,'Usa tu archivo o versión actual del prototipo.'],['Rúbrica',CFG.rubricaExterna,'La rúbrica íntegra está disponible en la pantalla 4.'],['Plan',CFG.planExterno,'La ficha editable está integrada en las pantallas 7 y 8.']]; showModal(`<h2 id="modal-title">Recursos del taller</h2><p>Los enlaces externos son opcionales. Las alternativas locales permiten completar la sesión.</p>${items.map(([n,u,f])=>`<article class="panel"><h3>${n}</h3>${u?`<p><a href="${esc(u)}" target="_blank" rel="noopener">Abrir recurso configurado</a></p>`:`<p>${esc(f)}</p><span class="pill">Alternativa local disponible</span>`}</article>`).join('')}`); }
  function showNotebook(){ showModal(`<h2 id="modal-title">Bitácora del pulido</h2><p>Este texto refleja lo guardado en este navegador y no se envía a ningún servicio.</p><label class="field">Registro reunido<textarea id="record" readonly style="min-height:340px">${esc(recordText())}</textarea></label><div class="actions"><button class="button" data-action="download">Descargar .txt</button><button class="button secondary" data-action="copy">Copiar</button><button class="text-button" data-action="reset-dialog">Borrar datos locales…</button></div>`); }
  function download(){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([recordText()],{type:'text/plain;charset=utf-8'})); a.download='registro-el-pulido-del-prototipo.txt'; a.click(); URL.revokeObjectURL(a.href); notify('Registro descargado.'); }
  async function copy(){ try{ await navigator.clipboard.writeText(recordText()); notify('Registro copiado.'); }catch(_){ const r=$('#record'); if(r){r.select();notify('Texto seleccionado: usa el comando copiar.');}else showNotebook();} }

  document.addEventListener('input',e=>{ if(e.target.matches('[data-field]')) setField(e.target.dataset.field,e.target.value); });
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a[data-action]'); if(!b)return; const a=b.dataset.action;
    if(b.dataset.go!==undefined){ state.page=Number(b.dataset.go); modal.close(); render(); return; }
    if(b.dataset.evidence){ const id=b.dataset.evidence; state.evidence=state.evidence.includes(id)?state.evidence.filter(x=>x!==id):[...state.evidence,id]; save(); render(); return; }
    if(b.dataset.rubric){ state.activeRubric=b.dataset.rubric; save(); render(); return; }
    if(b.dataset.level){ state.levels[b.dataset.criterion]=b.dataset.level; save(); render(); return; }
    if(b.dataset.priority){ const id=b.dataset.priority; if(state.priority.includes(id)) state.priority=state.priority.filter(x=>x!==id); else if(state.priority.length<2) state.priority.push(id); else {notify('Elige uno o dos criterios: quita uno antes de añadir otro.');return;} save();render();return; }
    if(a==='close')modal.close(); else if(a==='map')showMap();  else if(a==='sources')showSources(); else if(a==='resources')showResources(); else if(a==='notebook')showNotebook(); else if(a==='download')download(); else if(a==='copy')copy(); else if(a==='fullscreen'){ if(!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }
    else if(a==='reset-dialog')showModal(`<h2 id="modal-title">Borrar datos locales</h2><p>Esta acción elimina de este navegador la autoevaluación, el ajuste y el plan. Descarga el registro antes si quieres conservarlo.</p><div class="actions"><button class="button" data-action="reset-confirm">Borrar</button><button class="button secondary" data-action="close">Cancelar</button></div>`);
    else if(a==='reset-confirm'){ localStorage.removeItem(KEY); state=defaultState(); modal.close(); render(); notify('Datos locales borrados.'); }
  });
  $('#previous').addEventListener('click',()=>{if(state.page>0){state.page--;render();}}); $('#next').addEventListener('click',()=>{if(state.page<screens.length-1){state.page++;render();}});
  document.addEventListener('keydown',e=>{ if(modal.open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return; if(e.key==='ArrowRight'&&state.page<screens.length-1){state.page++;render();} if(e.key==='ArrowLeft'&&state.page>0){state.page--;render();} });
  modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
  for(let i=0;i<18;i++){const f=document.createElement('i');f.className='fly';f.style.left=`${(i*37)%97}%`;f.style.top=`${(i*53)%88}%`;f.style.animationDelay=`-${i%9}s`;$('#fireflies').append(f);}
  render();
})();

