/** Cierres de las 13 misiones. Decoración y orientación; nunca concede puntos. */
(() => {
  'use strict';
  if(!document.getElementById('ludaria-access-scenery')){const script=document.createElement('script');script.id='ludaria-access-scenery';script.src=new URL('../ludaria/access-scenery.js?v=20261012-acceso1',document.baseURI);document.head.append(script);}
  const stage = document.getElementById('stage');
  const counter = document.querySelector('#page-count, #page-number');
  if (!stage || !counter || document.body.hasAttribute('data-mission-experience')) return;
  document.body.dataset.missionExperience = '1';
  let previousPage = null, confirmationTimer;

  function updateBalance() {
    const note = stage.querySelector('[data-mochi-balance]');
    const points = window.LudariaCloud?.profile?.points;
    if (!note) return;
    note.hidden = !Number.isInteger(points) || points < 0;
    note.textContent = Number.isInteger(points) && points >= 0
      ? (points === 0 ? 'Tu personaje está listo para seguir creciendo.' : 'Tienes ' + points + (points === 1 ? ' punto disponible' : ' puntos disponibles') + ' para elegir tus mejoras.')
      : '';
  }

  function updateNotebookStatus() {
    const note = stage.querySelector('[data-mochi-notebook]');
    const cloud = window.LudariaCloud;
    if (!note) return;
    note.hidden = !cloud?.active;
    if (!cloud?.active) return;
    const state = document.querySelector('[data-cloud-status]')?.textContent || '';
    note.textContent = cloud.hasPending
      ? 'Antes de volver al mapa: quedan notas o ensayos sin confirmar. Guarda tu cuaderno y revisa el aviso de guardado.'
      : state === 'Cuaderno confirmado en tu bitácora'
        ? 'Tu cuaderno quedó confirmado. Guardar no equivale a entregar ni recibir evaluación.'
        : 'Revisa el estado de tu cuaderno antes de volver al mapa. Llegar al cierre no confirma una entrega ni concede puntos.';
  }

  function decorate() {
    const match = counter.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match || !stage.firstElementChild) return;
    const page = Number(match[1]), total = Number(match[2]);
    const arriving = page !== previousPage;
    previousPage = page;
    if (arriving) stage.firstElementChild.classList.add('mission-arrival');
    if (page !== total || total < 2 || stage.querySelector('[data-mochi-visit]')) return;
    const card = document.createElement('aside');
    card.dataset.mochiVisit = '';
    card.className = 'mochi-visit' + (arriving ? ' is-arriving' : '');
    card.setAttribute('aria-label', 'Mochi te espera en el mercadito');
    card.innerHTML = '<div class="mochi-visit-art"><img alt="Mochi te espera en su mercadito" loading="lazy" decoding="async"><div class="mochi-visit-sparks" aria-hidden="true"><i></i><i></i><i></i></div></div>' +
      '<div class="mochi-visit-copy"><span class="mochi-visit-kicker">Tu próxima parada · Mercadito de Mochi</span><h2>Mochi te espera</h2>' +
      '<blockquote>«Veeen a mejorar tu personaje. Usa tus puntos conmigo y descubre qué nuevas ayudas se abren para ti.»</blockquote>' +
      '<p data-mochi-balance hidden></p><p class="mochi-visit-note" data-mochi-notebook hidden></p><p class="mochi-visit-note">Activa la runa de esta misión en la Forja. Después, vuelve al mapa y visita mi mercadito.</p></div>';
    card.querySelector('img').src = new URL('../forja/assets/mochi.webp', document.baseURI).href;
    (stage.querySelector('.scene-content, .cover-content') || stage.firstElementChild).append(card);
    updateBalance();
    updateNotebookStatus();
  }


  // La omisión solo se registra por elección explícita. El mismo ID se conserva al reintentar.
  const omissions = new Map();
  let supportsOmission = false;
  function updateOmission(control, choice) {
    const button = control.querySelector('button');
    button.disabled = choice.state === 'pending' || choice.state === 'done';
    button.textContent = choice.state === 'done' ? 'Continuaste sin esta ayuda' : 'Seguir sin esta ayuda';
    control.querySelector('[role="status"]').textContent = choice.message;
  }

  function omissionControl(perk, page) {
    if (!supportsOmission) return null;
    const key = `${perk.id}:${page}`;
    const control = document.createElement('div');
    control.dataset.missionOmission = key;
    control.className = 'mission-omission';
    control.innerHTML = '<button type="button" class="contextual-skip">Seguir sin esta ayuda</button><p role="status" data-contextual-status></p>';
    const choice = omissions.get(key) || {requestId:null, state:'idle', message:''};
    updateOmission(control, choice);
    control.querySelector('button').addEventListener('click', async () => {
      if (choice.state === 'pending' || choice.state === 'done') return;
      if (!choice.requestId) choice.requestId = crypto.randomUUID();
      omissions.set(key, choice);
      choice.state = 'pending';
      choice.message = 'Registrando tu elección…';
      updateOmission(control, choice);
      try {
        await window.LudariaCloud.api('accionRpg', {type:'omitir_ventaja',mission:perk.mission,id:perk.id,page,reason:'continuar_sin_ayuda'}, choice.requestId);
        choice.state = 'done';
        choice.message = 'Elección confirmada. Puedes continuar sin penalizaciones.';
      } catch (error) {
        choice.state = 'error';
        choice.message = 'Sin confirmar. Puedes reintentar. ' + error.message;
      }
      for (const node of stage.querySelectorAll('[data-mission-omission]')) {
        if (node.dataset.missionOmission === key) updateOmission(node, choice);
      }
    });
    return control;
  }

  window.LudariaMissionExperience = {omissionControl};

  // El recorrido compartido coloca la ayuda junto a su actividad. Se conserva la tarjeta de la vista de revisión.
  function contextualAdvantage() {
    if (document.body.hasAttribute('data-mission-journey') || document.body.hasAttribute('data-gema-loadout')) return;
    const cloud = window.LudariaCloud;
    const mission = window.LudariaRPG?.find(window.LUDARIA_CLOUD_CONFIG?.route);
    const match = counter.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (!cloud?.active || !cloud.profile || !mission?.perks?.length || !match || !stage.firstElementChild) return;
    if (stage.querySelector('[data-contextual-perk]')) return;
    const page = Number(match[1]), total = Number(match[2]);
    if (!page || !total) return;
    const perk = mission.perks[Math.min(2, Math.floor((page - 1) * 3 / total))];
    const current = cloud.profile.skills?.[perk.attribute] ?? 1;
    const available = current >= perk.minimum;
    const container = stage.querySelector('.scene-content, .cover-content') || stage.firstElementChild;
    const panel = document.createElement('aside');
    panel.dataset.contextualPerk = perk.id;
    panel.dataset.contextSkill = String(current);
    panel.className = 'ludaria-contextual-perk' + (available ? ' is-unlocked' : ' is-locked');
    panel.setAttribute('aria-label', 'Encuentro opcional con el guardián');
    panel.innerHTML = '<div class="ludaria-contextual-perk-emblem" aria-hidden="true"><img alt="" width="112" height="112" src="'+new URL('../ludaria/assets/brujula-guardian-v1.png',document.baseURI).href+'"></div><div class="ludaria-contextual-perk-copy"><span class="ludaria-contextual-perk-kicker">'+(perk.kind==='accion'?'Ruta del guardián':'Pista del guardián')+' · opcional</span><span class="ludaria-contextual-perk-state">'+(available?'Ayuda disponible':'Por desbloquear')+'</span><h3 data-contextual-name></h3><p class="ludaria-contextual-guardian"></p><p data-contextual-threshold></p><p data-contextual-explanation></p><div class="ludaria-contextual-perk-actions"></div></div>';
    panel.querySelector('.ludaria-contextual-guardian').textContent = mission.guardian;
    panel.querySelector('[data-contextual-name]').textContent = perk.name;
    panel.querySelector('[data-contextual-threshold]').textContent = window.LudariaRPG.attributes[perk.attribute] + ' ' + current + ' / requisito ' + perk.minimum;
    panel.querySelector('[data-contextual-explanation]').textContent = available
      ? (perk.kind === 'accion' ? 'El guardián te ofrece otra forma de abordar este desafío. Tú eliges el camino.' : 'Tu guardián ha dejado una pista para este tramo. Invócala si necesitas encontrar el rumbo.')
      : 'Esta ayuda despertará al mejorar tu atributo con Mochi. Tu misión sigue abierta: puedes continuar sin ella.';
    if (available) {
      const actions = panel.querySelector('.ludaria-contextual-perk-actions');
      const consult = document.createElement('button');
      consult.type = 'button';
      consult.textContent = perk.kind === 'accion' ? 'Explorar otra ruta' : 'Invocar pista';
      consult.addEventListener('click', () => window.LudariaRPGUI?.openPerk(perk.id));
      actions.append(consult);
      const omit = omissionControl(perk, page);
      if (omit) actions.append(omit);
    }
    const mochi = container.querySelector('[data-mochi-visit]');
    if (mochi) container.insertBefore(panel, mochi);
    else container.append(panel);
  }
  function refreshContext() {
    stage.querySelector('[data-contextual-perk]')?.remove();
    contextualAdvantage();
  }
  function renderEnhancements() {
    decorate();
    contextualAdvantage();
  }

  new MutationObserver(renderEnhancements).observe(stage, { childList: true });
  window.addEventListener('ludaria:profile', () => {
    updateBalance();
    updateNotebookStatus();
    const panel = stage.querySelector('[data-contextual-perk]');
    const perk = window.LudariaRPG?.all?.find(p => p.id === panel?.dataset.contextualPerk);
    const skill = window.LudariaCloud?.profile?.skills?.[perk?.attribute];
    // Un registro confirmado sin cambio de atributo no debe borrar el mensaje de éxito.
    if (panel && perk && String(skill) === panel.dataset.contextSkill) return;
    refreshContext();
  });
  window.addEventListener('ludaria:savestatus', updateNotebookStatus);
  window.LudariaCloud?.ready?.then(async () => {
    contextualAdvantage();
    try {
      const catalogue = await window.LudariaCloud.api('catalogoRpg', {mission:window.LUDARIA_CLOUD_CONFIG.route});
      supportsOmission = catalogue.capabilities?.omitAdvantage === true;
      refreshContext();
      if (supportsOmission) window.dispatchEvent(new Event('ludaria:omission-ready'));
    } catch { /* Compatibilidad: la tarjeta permanece útil sin telemetría. */ }
  });
  document.addEventListener('ludaria:confirmed', event => {
    if (!['decision', 'secreto'].includes(event.detail?.type)) return;
    const surface = document.querySelector('.ludaria-cloud-dialog[open]');
    if (!surface) return;
    clearTimeout(confirmationTimer);
    surface.classList.remove('mission-confirmed');
    // Reinicia un destello breve únicamente tras una respuesta confirmada.
    void surface.offsetWidth;
    surface.classList.add('mission-confirmed');
    confirmationTimer = setTimeout(() => surface.classList.remove('mission-confirmed'), 1100);
  });
  renderEnhancements();
})();
