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

  new MutationObserver(decorate).observe(stage, { childList: true });
  window.addEventListener('ludaria:profile', updateBalance);
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
  decorate();
})();
