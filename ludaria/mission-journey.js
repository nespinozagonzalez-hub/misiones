/** Navegación de las sesiones y equipo opcional durante la visita. */
(() => {
  'use strict';

  const body = document.body;
  const slug = body.dataset.ludariaMission;
  const config = window.LudariaMissionJourney?.[slug];
  const stage = document.getElementById('stage');
  const counter = document.querySelector('#page-count, #page-number');
  const nav = body.querySelector(':scope > .navigation');
  if (!config || !stage || !counter || !nav || body.hasAttribute('data-mission-journey')) return;
  body.dataset.missionJourney = '';

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const cloud = window.LudariaCloud;
  const mission = config.gear && cloud?.active && window.LudariaRPG?.find(slug);
  const equipped = new Set();
  const seen = new Set();
  let page = 0, phase = -1, packKey = '', preparing = false, opener;

  const effects = body.querySelector(':scope > [data-ludaria-effects]');
  if (effects) nav.append(effects);

  let rail;
  if (config.phases) {
    rail = document.createElement('div');
    rail.className = 'mission-route-rail';
    rail.hidden = true;
    rail.innerHTML = `<section class="mission-route" aria-label="Ruta de la misión">
      <div class="mission-route-heading"><strong>Ruta de la misión</strong><span data-mission-phase></span></div>
      <ol class="mission-milestones">${config.phases.map(([, name], index) => `<li class="mission-milestone">
        <span class="mission-milestone-mark" aria-hidden="true">${index + 1}</span><strong>${esc(name)}</strong>
      </li>`).join('')}</ol>
    </section>`;
    stage.before(rail);
  }

  function updateRoute() {
    if (!rail) return;
    const current = config.phases.findLastIndex(([start]) => start <= page);
    if (current === phase) return;
    phase = current;
    rail.hidden = false;
    rail.querySelector('[data-mission-phase]').textContent = `Tramo ${current + 1} de ${config.phases.length}`;
    rail.querySelectorAll('li').forEach((step, index) => {
      if (index === current) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  }

  const hud = document.querySelector('.hud-right');
  let backpack, dialog;
  if (mission?.perks.length && hud && window.LudariaRPGUI?.openPerk) {
    backpack = document.createElement('button');
    backpack.type = 'button';
    backpack.id = 'mission-backpack';
    backpack.className = 'icon-button mission-backpack';
    backpack.title = 'Mochila de ventajas';
    backpack.hidden = true;
    backpack.setAttribute('aria-haspopup', 'dialog');
    backpack.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M9 7V5a3 3 0 0 1 6 0v2M8 7h8a4 4 0 0 1 4 4v9H4v-9a4 4 0 0 1 4-4ZM8 20v-6h8v6M8 11h8"/></svg>
      <span class="mission-backpack-label" aria-hidden="true">Mochila</span><span class="mission-backpack-count" aria-hidden="true"></span>`;
    hud.prepend(backpack);
    backpack.addEventListener('click', () => openPack(page === 1, backpack));

    dialog = document.createElement('dialog');
    dialog.className = 'mission-inventory';
    dialog.setAttribute('aria-labelledby', 'mission-pack-title');
    dialog.setAttribute('aria-describedby', 'mission-pack-intro');
    dialog.innerHTML = `<div class="mission-pack-top"><span>Mochila de misión</span><button type="button" data-pack-action="close" aria-label="Cerrar mochila">×</button></div>
      <h2 id="mission-pack-title" tabindex="-1"></h2>
      <p id="mission-pack-intro"></p>
      <div class="mission-items" role="region" aria-label="Objetos de la mochila" tabindex="0"></div>
      <footer class="mission-pack-footer">
        <div><strong role="status"></strong><small>Sin costo · Durante esta visita</small></div>
        <button type="button" class="mission-pack-button" data-pack-action="continue"></button>
      </footer>`;
    body.append(dialog);
    dialog.addEventListener('click', handlePackAction);
    dialog.addEventListener('close', () => {
      sync();
      if (!document.querySelector('dialog[open]')) opener?.focus({preventScroll:true});
    });
  }

  function perksForProfile() {
    const profile = cloud?.profile;
    if (!backpack || !profile) return [];
    return mission.perks.filter(perk => config.gear[perk.id]).map(perk => {
      const current = profile.skills?.[perk.attribute] ?? 1;
      return {...perk, current, available:current >= perk.minimum, gear:config.gear[perk.id]};
    });
  }

  function updateCover(perks) {
    if (page !== 1) return;
    const start = stage.querySelector('button[data-action="begin"], button[data-go="1"], button[data-action="go"][data-page="1"]');
    if (!start) return;
    const existing = start.previousElementSibling;
    const prepare = existing?.hasAttribute('data-mission-prepare') ? existing : null;
    if (!perks.length) {
      if (prepare) {
        prepare.remove();
        start.hidden = false;
      }
      return;
    }
    if (!prepare) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = start.className;
      button.dataset.missionPrepare = '';
      button.textContent = 'Preparar mochila';
      button.addEventListener('click', () => openPack(true, button));
      start.hidden = true;
      start.before(button);
    }
    const next = document.getElementById('next-label');
    if (next) next.textContent = equipped.size ? 'Entrar a la sesión' : 'Entrar sin equipar';
  }

  function card(perk) {
    const {gear, id, name} = perk;
    const selected = equipped.has(id);
    const state = selected ? 'equipped' : perk.available ? 'available' : 'locked';
    const label = selected ? 'Equipado' : perk.available ? 'Disponible' : 'Bloqueado';
    const lock = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 7V5a3 3 0 0 1 6 0v2M3 7h10v7H3z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
    const action = selected ? 'Quitar' : 'Equipar';
    const places = gear.moments.map(moment => `Pantalla ${moment.page} · ${moment.label}`).join(' / ');
    return `<article class="mission-item" data-item-art="${esc(gear.art)}" data-item-state="${state}" aria-labelledby="mission-item-${esc(id)}">
      <div class="mission-item-heading">
        <div class="mission-item-slot"><img src="${esc(gear.image)}" alt="" width="64" height="64"></div>
        <div><span class="mission-item-type">${esc([gear.type, gear.title].filter(Boolean).join(' · '))}</span><h3 id="mission-item-${esc(id)}">${esc(name)}</h3></div>
      </div>
      <div class="mission-item-effect"><strong>${esc(gear.effect)}</strong><p>${esc(gear.benefit)}</p><p class="mission-item-when">${esc(places)}</p></div>
      <div class="mission-item-controls">
        <span class="mission-item-status">${perk.available ? '' : lock}${label}</span>
        ${perk.available ? `<div class="mission-item-buttons">
          <button type="button" class="mission-pack-button secondary" data-pack-action="toggle" data-perk="${esc(id)}" aria-label="${action} ${esc(name)}">${action}</button>
          ${selected && !preparing ? `<button type="button" class="mission-pack-button" data-pack-action="use" data-perk="${esc(id)}" aria-label="Usar ${esc(name)}">Usar</button>` : ''}
        </div>` : `<p class="mission-item-requirement">Requiere ${esc(window.LudariaRPG.attributes[perk.attribute])} <strong>${esc(perk.minimum)}</strong> · Tienes ${esc(perk.current)}</p>`}
      </div>
    </article>`;
  }

  function updatePack(perks) {
    const key = perks.map(({id, current}) => `${id}:${current}:${equipped.has(id)}`).join('|');
    if (key === packKey) return;
    packKey = key;
    const items = dialog.querySelector('.mission-items');
    const scroll = items.scrollTop;
    const focus = document.activeElement;
    const previous = focus?.closest('[data-pack-action][data-perk]')?.dataset;
    items.innerHTML = perks.map(card).join('');
    items.scrollTop = scroll;
    if (previous) {
      const replacement = [...items.querySelectorAll('button')].find(button =>
        button.dataset.perk === previous.perk && button.dataset.packAction === previous.packAction);
      (replacement || dialog.querySelector('h2')).focus({preventScroll:true});
    }
    dialog.querySelector('[role="status"]').textContent = equipped.size === 1 ? '1 objeto equipado' : `${equipped.size} objetos equipados`;
    dialog.querySelector('[data-pack-action="continue"]').textContent = preparing
      ? (equipped.size ? 'Entrar a la sesión' : 'Entrar sin equipar') : 'Volver a la sesión';
  }

  function openPack(isPreparing, button) {
    const perks = perksForProfile();
    if (!perks.length || dialog.open) return;
    preparing = isPreparing;
    opener = button;
    packKey = '';
    dialog.querySelector('h2').textContent = preparing ? 'Prepara tu mochila' : 'Mochila de ventajas';
    dialog.querySelector('#mission-pack-intro').textContent = preparing
      ? 'Equipa lo que quieras llevar. Verás el icono junto a la actividad donde te ayuda.' : 'Elige Usar en un objeto equipado para abrir su ayuda.';
    updatePack(perks);
    dialog.querySelector('.mission-items').scrollTop = 0;
    dialog.showModal();
    dialog.querySelector('h2').focus({preventScroll:true});
  }

  function usePerk(id, button) {
    if (!equipped.has(id) || !perksForProfile().some(perk => perk.id === id && perk.available)) return;
    button.focus({preventScroll:true});
    window.LudariaRPGUI.openPerk(id);
  }

  function handlePackAction(event) {
    const button = event.target.closest('[data-pack-action]');
    if (!button) return;
    const {packAction, perk:id} = button.dataset;
    if (packAction === 'toggle') {
      if (!perksForProfile().some(perk => perk.id === id && perk.available)) return;
      if (equipped.has(id)) equipped.delete(id);
      else equipped.add(id);
      sync();
    } else if (packAction === 'use') {
      dialog.close();
      usePerk(id, backpack);
    } else {
      const enter = packAction === 'continue' && preparing && page === 1;
      if (enter) opener = null;
      dialog.close();
      if (enter) document.getElementById('next').click();
      else sync();
    }
  }

  function updateCue(available) {
    const tab = stage.querySelector('[role="tab"][aria-selected="true"]')?.id;
    const perk = available.find(({id, gear}) => equipped.has(id) && gear.moments.some(moment =>
      moment.page === page && (!moment.tab || moment.tab === tab)));
    const existing = stage.querySelector('[data-mission-cue]');
    if (existing && existing.dataset.missionCue !== perk?.id) existing.remove();
    if (!perk || dialog.open) return;

    let cue = stage.querySelector('[data-mission-cue]');
    if (!cue) {
      const {gear, id} = perk;
      const targetTab = gear.moments.find(moment => moment.page === page && moment.tab === tab)?.tab;
      const panel = targetTab && stage.querySelector('[role="tabpanel"]');
      const anchor = stage.querySelector('.section-title + .lead') || stage.querySelector('.section-title');
      if (!panel && !anchor) return;
      const moment = `${page}:${id}`;
      const first = !document.querySelector('dialog[open]') && !seen.has(moment);
      if (first) seen.add(moment);
      cue = document.createElement('div');
      cue.dataset.missionCue = id;
      cue.className = 'mission-cue';
      cue.innerHTML = `<button type="button" class="mission-use-item${first ? ' is-new' : ''}" data-item-art="${esc(gear.art)}"
          aria-labelledby="mission-use-name" aria-describedby="mission-use-effect">
        <span class="mission-use-icon"><img src="${esc(gear.image)}" alt="" width="32" height="32"></span>
        <span class="mission-use-copy"><span class="mission-use-kicker">${esc(gear.type)} de tu mochila · Úsalo aquí</span>
          <strong id="mission-use-name">Usar ${esc(gear.title || perk.name)}</strong><span id="mission-use-effect">${esc(gear.effect)}</span></span>
        <span class="mission-use-arrow" aria-hidden="true">›</span>
      </button>`;
      const button = cue.querySelector('button');
      button.addEventListener('click', () => usePerk(id, button));
      if (panel) panel.prepend(cue);
      else anchor.after(cue);
    }
    if (!cue.querySelector('[data-mission-omission]')) {
      const omit = window.LudariaMissionExperience?.omissionControl(perk, page);
      if (omit) cue.append(omit);
    }
  }

  function showBonusGuides() {
    for (const help of body.querySelectorAll('.ludaria-cloud-dialog[open]')) {
      for (const button of help.querySelectorAll('.rpg-perk [data-rpg-open]')) {
        const gear = config.gear[button.dataset.rpgOpen];
        if (!gear || button.previousElementSibling?.hasAttribute('data-bonus-preview')) continue;
        const preview = document.createElement('p');
        preview.dataset.bonusPreview = '';
        preview.textContent = `${gear.type} · ${gear.effect}. ${gear.benefit}`;
        button.before(preview);
        if (!button.disabled) {
          button.textContent = `Ver ${gear.type.toLowerCase()}`;
          const name = gear.title || button.closest('.rpg-perk').querySelector('h3')?.textContent;
          if (name) button.setAttribute('aria-label', `${button.textContent} · ${name}`);
        }
      }

      const title = help.querySelector('h2')?.textContent;
      const perk = mission.perks.find(p => p.name === title);
      const gear = perk && config.gear[perk.id];
      if (!gear) continue;
      const preview = help.querySelector('[data-rpg-preview] > .rpg-threshold')?.nextElementSibling;
      if (preview && preview.textContent !== gear.benefit) preview.textContent = gear.benefit;

      // El cliente desplegado usa un umbral directo y una nota al confirmar el acceso.
      const description = help.querySelector(':scope > .rpg-threshold')?.nextElementSibling;
      if (!description?.matches('p') || !help.querySelector(':scope > .rpg-note')) continue;

      const guide = document.createElement('section');
      guide.className = 'mission-bonus-guide';
      guide.dataset.missionBonus = perk.id;
      guide.dataset.itemArt = gear.art;
      guide.innerHTML = `<header>
        <img src="${esc(gear.image)}" alt="" width="48" height="48">
        <div><span class="mission-item-type">${esc([gear.type, gear.title].filter(Boolean).join(' · '))}</span><h3>${esc(gear.effect)}</h3></div>
      </header>
      <p>${esc(gear.benefit)}</p>
      <ol>${gear.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>
      <div class="mission-bonus-template"><strong>Plantilla para aplicar</strong><p>${esc(gear.template)}</p></div>`;
      const work = help.querySelector('[data-rpg-form] textarea[name="work"]');
      if (work) {
        const insert = document.createElement('button');
        insert.type = 'button';
        insert.textContent = 'Poner plantilla en mi ensayo';
        const updateInsert = () => { insert.hidden = Boolean(work.value); };
        work.addEventListener('input', updateInsert);
        insert.addEventListener('click', () => {
          if (work.value) return;
          work.value = gear.template;
          work.dispatchEvent(new Event('input', {bubbles:true}));
          work.focus();
        });
        updateInsert();
        guide.append(insert);
      }
      description.replaceWith(guide);
    }
  }

  function sync() {
    const match = counter.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) return;
    const current = Number(match[1]);
    if (page && page !== current) {
      stage.scrollTop = 0;
      if (window.scrollY) window.scrollTo({top:0, behavior:'instant'});
    }
    page = current;
    updateRoute();
    for (const hint of stage.querySelectorAll('button[data-action="hint"]')) {
      const label = hint.hasAttribute('data-group') ? 'Ver pista de la actividad' : 'Ver pista del candado';
      if (hint.textContent !== label) hint.textContent = label;
    }
    if (!backpack) return;

    const perks = perksForProfile();
    const available = perks.filter(perk => perk.available);
    for (const id of equipped) if (!available.some(perk => perk.id === id)) equipped.delete(id);
    backpack.hidden = !perks.length;
    backpack.dataset.equipped = String(equipped.size > 0);
    const count = backpack.querySelector('.mission-backpack-count');
    if (count.textContent !== String(available.length)) count.textContent = available.length;
    const ready = available.length === 1 ? '1 disponible' : `${available.length} disponibles`;
    backpack.setAttribute('aria-label', `Mochila de ventajas, ${ready} y ${equipped.size} ${equipped.size === 1 ? 'equipada' : 'equipadas'}`);
    updateCover(perks);
    updateCue(available);
    if (dialog.open) updatePack(perks);
  }

  const observer = new MutationObserver(sync);
  observer.observe(stage, {childList:true});
  observer.observe(counter, {childList:true, characterData:true, subtree:true});
  if (backpack) {
    new MutationObserver(showBonusGuides).observe(body, {childList:true, subtree:true});
    showBonusGuides();
  }
  window.addEventListener('ludaria:profile', sync);
  window.addEventListener('ludaria:omission-ready', sync);
  // Las flechas del diálogo no deben pasar a los atajos de cambio de pantalla.
  body.addEventListener('keydown', event => {
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.target.closest?.('dialog[open]')) event.stopPropagation();
  });
  sync();
})();
