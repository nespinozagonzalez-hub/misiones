/** Presentación de ayudas sobre el cliente vigente. Conserva nodos, foco y manejadores. */
(() => {
  'use strict';
  if (window.LUDARIA_GUARDIAN_AID) return;
  window.LUDARIA_GUARDIAN_AID = true;
  const mission = window.LudariaRPG?.find(window.LUDARIA_CLOUD_CONFIG?.route);
  if (!mission) return;
  const icon = new URL('../ludaria/assets/brujula-guardian-v1.png', document.baseURI).href;
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = new URL('../ludaria/guardian-aid.css?v=20261026-ayudas1', document.baseURI);
  document.head.append(css);
  function emblem() {
    const image = document.createElement('img'); image.src = icon; image.alt = ''; image.width = 52; image.height = 52; image.className = 'ludaria-aid-emblem';
    return image;
  }
  function polish() {
    const trigger = document.querySelector('[data-cloud-advantage]');
    if (trigger && !trigger.querySelector('.ludaria-aid-emblem')) trigger.prepend(emblem());
    for (const dialog of document.querySelectorAll('.ludaria-cloud-dialog')) {
      const title = dialog.querySelector('h2');
      const catalogue = dialog.querySelector('.rpg-perks');
      const perk = mission.perks.find(p => p.name === title?.textContent);
      if (!catalogue && !perk) continue;
      dialog.classList.add('ludaria-guardian-aid');
      if (!dialog.querySelector('.ludaria-aid-heading')) {
        const head = document.createElement('header'); head.className = 'ludaria-aid-heading';
        head.append(emblem());
        const copy = document.createElement('div');
        const kicker = document.createElement('span'); kicker.textContent = catalogue ? 'CUADERNO DEL GUARDIÁN' : perk.kind === 'accion' ? 'UNA RUTA PARA EXPLORAR' : 'EL GUARDIÁN TE ORIENTA';
        const name = document.createElement('p'); name.textContent = catalogue ? 'Pistas y rutas de tu misión' : mission.guardian;
        copy.append(kicker, name); head.append(copy); title.before(head);
      }
      for (const card of dialog.querySelectorAll('.rpg-perk')) {
        if (card.querySelector('.ludaria-aid-badge')) continue;
        const badge = document.createElement('span'); badge.className = 'ludaria-aid-badge';
        badge.textContent = card.classList.contains('is-available') ? 'Ayuda disponible' : 'Por desbloquear';
        card.prepend(badge);
      }
    }
  }
  const observer = new MutationObserver(polish);
  observer.observe(document.body, {childList:true, subtree:true});
  window.addEventListener('pagehide', () => observer.disconnect());
  polish();
})();
