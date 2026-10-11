/** Cierres de las 13 misiones. Decoración y orientación; nunca concede puntos. */
(() => {
  'use strict';
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
      '<p data-mochi-balance hidden></p><p class="mochi-visit-note">Activa la runa de esta misión en la Forja. Después, vuelve al mapa y visita mi mercadito.</p></div>';
    card.querySelector('img').src = new URL('../forja/assets/mochi.webp', document.baseURI).href;
    (stage.querySelector('.scene-content, .cover-content') || stage.firstElementChild).append(card);
    updateBalance();
  }


  // Cada tramo del recorrido propone una de las tres ventajas según el personaje.
  // No cambia la evaluación, no revela ayudas bloqueadas y no registra clics pasivos.
  const skipped = new Set(), skipRequests = new Map();
  let supportsOmission = false;
  function contextualAdvantage() {
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
    panel.innerHTML = '<span class="ludaria-contextual-perk-kicker">Encuentro opcional · Guardián</span><h3 data-contextual-name></h3><p data-contextual-threshold></p><p data-contextual-explanation></p><div class="ludaria-contextual-perk-actions"></div><p data-contextual-status role="status"></p>';
    panel.querySelector('[data-contextual-name]').textContent = perk.name;
    panel.querySelector('[data-contextual-threshold]').textContent = window.LudariaRPG.attributes[perk.attribute] + ' ' + current + ' / requisito ' + perk.minimum;
    panel.querySelector('[data-contextual-explanation]').textContent = available
      ? 'Tienes una posibilidad adicional para explorar esta parte de la misión. La actividad principal sigue siendo la misma.'
      : 'Esta alternativa se activa al mejorar tu atributo con Mochi. Puedes continuar sin ella.';
    if (available) {
      const actions = panel.querySelector('.ludaria-contextual-perk-actions');
      const consult = document.createElement('button');
      consult.type = 'button';
      consult.textContent = perk.kind === 'accion' ? 'Explorar otra ruta' : 'Consultar orientación';
      consult.addEventListener('click', () => window.LudariaRPGUI?.openPerk(perk.id));
      actions.append(consult);
      if (supportsOmission) {
      const omit = document.createElement('button');
      omit.type = 'button';
      omit.className = 'contextual-skip';
      omit.textContent = skipped.has(perk.id) ? 'Continuaste sin esta ayuda' : 'Seguir sin esta ayuda';
      omit.disabled = skipped.has(perk.id);
      omit.addEventListener('click', async () => {
        if (skipped.has(perk.id) || omit.disabled) return;
        omit.disabled = true;
        const status = panel.querySelector('[data-contextual-status]');
        status.textContent = 'Registrando tu elección…';
        const key = perk.id + ':' + page;
        if (!skipRequests.has(key)) skipRequests.set(key, crypto.randomUUID());
        try {
          await cloud.api('accionRpg', {type:'omitir_ventaja',mission:mission.slug,id:perk.id,page,reason:'continuar_sin_ayuda'},skipRequests.get(key));
          skipped.add(perk.id);
          omit.textContent = 'Continuaste sin esta ayuda';
          status.textContent = 'Elección confirmada. Puedes continuar sin penalizaciones.';
        } catch (error) {
          omit.disabled = false;
          status.textContent = 'Sin confirmar: ' + error.message + '. Puedes reintentar.';
        }
      });
      actions.append(omit);
      }
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
    const panel = stage.querySelector('[data-contextual-perk]');
    const perk = window.LudariaRPG?.all?.find(p => p.id === panel?.dataset.contextualPerk);
    const skill = window.LudariaCloud?.profile?.skills?.[perk?.attribute];
    // Un registro confirmado sin cambio de atributo no debe borrar el mensaje de éxito.
    if (panel && perk && String(skill) === panel.dataset.contextSkill) return;
    refreshContext();
  });
  window.LudariaCloud?.ready?.then(async () => {
    contextualAdvantage();
    try {
      const catalogue = await window.LudariaCloud.api('catalogoRpg', {mission:window.LUDARIA_CLOUD_CONFIG.route});
      supportsOmission = catalogue.capabilities?.omitAdvantage === true;
      refreshContext();
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
