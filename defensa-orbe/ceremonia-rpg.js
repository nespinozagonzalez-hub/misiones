/** Ceremonia visual. Solo reutiliza el botón/restauración existente; no concede recompensas. */
(() => {
  'use strict';
  if (window.MISSION?.slug !== 'defensa-orbe') return;
  const script = document.currentScript;
  const asset = name => new URL('assets/' + name, script.src).href;
  const heroAsset = name => new URL('../forja/assets/' + name + '.webp', script.src).href;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const chapters = [
    ['I', 'Bosque de los Conceptos', 'La bruma intenta borrar los nombres.', 'El primer fragmento conserva las distinciones que construimos en el Bosque.'],
    ['II', 'Cantera de los Elementos', 'Las piezas se dispersan entre las sombras.', 'El segundo fragmento vuelve a enlazar las piezas de una experiencia con sentido.'],
    ['III', 'Forja del Arquitecto', 'Lethon amenaza lo que hemos creado.', 'El tercer fragmento protege el diseño que tomó forma durante el recorrido.'],
    ['IV', 'Santuario del Espejo', 'El último velo oculta nuestro reflejo.', 'El cuarto fragmento reúne la revisión, el cuidado y las preguntas que nos llevamos.']
  ];
  const actions = [
    ['sabiduria','✦','Iluminar','Sabiduría','Tu luz hace visibles las huellas del camino.'],
    ['maestria','⌘','Enlazar','Maestría','Las piezas vuelven a encontrar su lugar.'],
    ['creacion','❧','Proyectar','Creación','Tu creación traza un sendero entre la bruma.'],
    ['evaluacion','◇','Reflejar','Evaluación','El espejo devuelve una mirada más clara.'],
    ['camaraderia','∞','Unir','Camaradería','Las voces de los buscadores sostienen el fragmento.']
  ];
  let allowingOriginal = false, dialog = null, opener = null;
  function polish() {
    const button = document.querySelector('[data-action="orbe"]');
    if (!button || button.dataset.ceremonyReady) return;
    button.dataset.ceremonyReady = '1';
    button.textContent = document.querySelector('#orbe.restored') ? 'Revivir el encuentro con Lethon' : 'Entrar a la Bóveda · encuentro final';
    const note = document.createElement('p');
    note.className = 'orbe-invitation';
    note.textContent = 'El último encuentro llega después de recoger las evaluaciones. Cuatro fragmentos, cinco maneras de contribuir y una misma aventura.';
    button.closest('.actions').before(note);
  }
  function open(button) {
    if (dialog?.open) return;
    opener = button;
    const profile = window.LudariaCloud?.profile || window.LUDARIA_CEREMONY_PREVIEW_PROFILE;
    const avatar = ['Kael','Kira'].includes(profile?.class) ? profile.class.toLowerCase() : null;
    const name = profile?.name || 'Los buscadores';
    const wasRestored = Boolean(document.querySelector('#orbe.restored'));
    let count = 0, revealed = false, completed = false;
    const d = document.createElement('dialog');
    dialog = d;
    d.className = 'orbe-rpg';
    d.setAttribute('aria-labelledby', 'orbe-rpg-title');
    d.innerHTML = `<header class="orbe-rpg-header"><div><span class="orbe-kicker">LUDARIA · LA ÚLTIMA BRUMA</span><h2 id="orbe-rpg-title">La Defensa del Orbe</h2></div><button type="button" class="orbe-close" data-orbe-close aria-label="Cerrar el encuentro y volver al cuaderno">×</button></header>
      <div class="orbe-arena" role="img" aria-label="Lethon, el Devorador del Saber, entre las brumas de la Bóveda"><img class="orbe-arena-art" src="${asset('lethon-boveda-v1.webp')}" alt="" decoding="async"><div class="orbe-arena-shade"></div>
        <div class="orbe-fighter orbe-hero"><span class="orbe-fighter-name">${esc(name)}</span><span class="orbe-fighter-caption">La expedición de Ludaria</span>${avatar ? `<img class="orbe-hero-art" src="${heroAsset(avatar)}" alt="${esc(profile.class)}, personaje de ${esc(name)}">` : '<span class="orbe-hero-seal" aria-hidden="true">✧</span>'}</div>
        <div class="orbe-fighter orbe-enemy"><span class="orbe-fighter-name">Lethon</span><span class="orbe-fighter-caption">El Devorador del Saber</span><span class="orbe-mist-meter" aria-hidden="true"><i data-orbe-mist></i></span></div>
        <div class="orbe-fragments" aria-label="Fragmentos reunidos">${chapters.map(c => `<span data-orbe-fragment>${c[0]}</span>`).join('')}</div>
      </div>
      <section class="orbe-command"><div class="orbe-progress-label"><span>Restauración del Orbe</span><strong data-orbe-count>0 / 4 fragmentos</strong></div><progress max="4" value="0" aria-label="Restauración narrativa del Orbe"></progress>
        <div class="orbe-story" aria-live="polite" aria-atomic="true"><span class="orbe-kicker" data-orbe-place></span><h3 data-orbe-heading></h3><p data-orbe-story></p></div>
        <div class="orbe-actions" aria-label="Elige cómo contribuir">${actions.map(a => `<button type="button" data-orbe-action="${a[0]}"><span aria-hidden="true">${a[1]}</span><strong>${a[2]}</strong><small>${a[3]}</small></button>`).join('')}</div>
        <button type="button" class="orbe-next" data-orbe-next hidden></button><p class="orbe-footnote">Todas las acciones permiten contribuir. Esta ceremonia no asigna notas, XP ni recompensas nuevas.</p><p class="orbe-save-note" data-orbe-save role="status"></p>
      </section>`;
    document.body.append(d);
    const q = selector => d.querySelector(selector);
    function render() {
      q('progress').value = count;
      q('[data-orbe-count]').textContent = count + ' / 4 fragmentos';
      q('[data-orbe-mist]').style.width = (100 - count * 25) + '%';
      d.querySelectorAll('[data-orbe-fragment]').forEach((el, i) => el.classList.toggle('is-reunited', i < count));
      d.classList.toggle('is-restored', count === 4);
      q('.orbe-actions').hidden = revealed || count === 4;
      q('[data-orbe-next]').hidden = !revealed && count < 4;
      if (!revealed && count < 4) {
        const c = chapters[count];
        q('[data-orbe-place]').textContent = 'FRAGMENTO ' + c[0] + ' · ' + c[1];
        q('[data-orbe-heading]').textContent = c[2];
        q('[data-orbe-story]').textContent = 'Elige cómo aportar a la restauración. Cada buscador puede abrir este camino.';
      }
    }
    d.addEventListener('click', async event => {
      const b = event.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-orbe-close')) { d.close(); return; }
      if (b.dataset.orbeAction && !revealed && count < 4) {
        const a = actions.find(a => a[0] === b.dataset.orbeAction);
        if (!a) return;
        const c = chapters[count]; count++; revealed = true; render();
        q('[data-orbe-place]').textContent = 'FRAGMENTO ' + c[0] + ' REUNIDO · ' + a[3].toUpperCase();
        q('[data-orbe-heading]').textContent = count === 4 ? 'El Orbe vuelve a brillar.' : 'La bruma retrocede.';
        q('[data-orbe-story]').textContent = a[4] + ' ' + c[3];
        q('[data-orbe-next]').textContent = count === 4 ? 'Restaurar el Orbe y cerrar el recorrido' : 'Continuar hacia el siguiente fragmento';
        q('[data-orbe-next]').focus({preventScroll:true});
      } else if (b.hasAttribute('data-orbe-next')) {
        if (count < 4) { revealed = false; render(); q('[data-orbe-action]').focus({preventScroll:true}); return; }
        if (completed) { d.close(); return; }
        completed = true;
        // El flujo original sigue siendo el único que guarda s.open en el cuaderno existente.
        if (!wasRestored && button.isConnected) {
          allowingOriginal = true;
          try { button.click(); } finally { allowingOriginal = false; }
          const toast = document.getElementById('toast');
          if (toast) toast.textContent = 'Orbe restaurado. Revisa la confirmación de tu cuaderno.';
        }
        q('[data-orbe-heading]').textContent = 'El saber continúa contigo.';
        q('[data-orbe-story]').textContent = 'Lethon se disuelve entre las últimas brumas. La siguiente aventura empieza cuando llevas una decisión a tu aula y observas qué ocurre.';
        b.textContent = 'Volver a mi cuaderno';
        const cloud = window.LudariaCloud;
        if (cloud?.active && !wasRestored) {
          q('[data-orbe-save]').textContent = 'Confirmando la restauración en tu cuaderno…';
          await cloud.flushMission();
          if (d.isConnected) q('[data-orbe-save]').textContent = cloud.hasPending ? 'La ceremonia terminó. Hay cambios sin confirmar: revisa el guardado antes de salir.' : 'Restauración confirmada en tu cuaderno. La entrega y evaluación siguen el canal acordado.';
        } else q('[data-orbe-save]').textContent = 'Ceremonia finalizada. Conserva tu registro por el canal acordado con el facilitador.';
      }
    });
    d.addEventListener('close', () => { d.remove(); if (dialog === d) dialog = null; if (!dialog?.open && button.isConnected) button.focus({preventScroll:true}); });
    render(); d.showModal(); q('[data-orbe-action]').focus({preventScroll:true});
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action="orbe"]');
    if (!button || allowingOriginal) return;
    event.preventDefault(); event.stopImmediatePropagation(); open(button);
  }, true);
  const stage = document.getElementById('stage');
  if (stage) new MutationObserver(polish).observe(stage, {childList:true});
  polish();
})();
