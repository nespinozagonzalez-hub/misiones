(() => {
  'use strict';
  const config = window.LUDARIA_CLOUD_CONFIG;
  if (!config) return;
  let access = null, profile = null, revision = null, missionRevision = null;
  let resolveReady, bar, status, pendingSnapshot = null, saving = false, failedSave = null, saveTimer;
  const pendingChecks = new Set();
  const hasPending = () => Boolean(pendingSnapshot || failedSave || saving || [...pendingChecks].some(check => check()));
  const guardian = config.market ? {guardian:'Mochi, custodio de las posibilidades',purpose:'Antes de ofrecerte una mejora, necesito reconocer al buscador que llega a mi mercado.'} : config.route==='mision-0' ? {guardian:'Aster, guardián del umbral',purpose:'Responde al llamado y reconoce tu punto de partida.'} : LudariaRPG.find(config.route);
  const ready = new Promise(resolve => { resolveReady = resolve; });
  const uid = () => crypto.randomUUID();
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stateText = text => { if (status) status.textContent = text; for(const id of ['store','saved-note']){const e=document.getElementById(id);if(e)e.textContent=text;} window.dispatchEvent(new CustomEvent('ludaria:savestatus',{detail:text})); };
  function validateSnapshot(snapshot){if(snapshot===null)return null;if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||!Number.isInteger(snapshot.page)||snapshot.page<0||snapshot.page>50||config.route==='vetas-diseno'&&(!Array.isArray(snapshot.cards)||snapshot.cards.length!==18)||config.route!=='vetas-diseno'&&(snapshot.version!==1||!snapshot.fields||typeof snapshot.fields!=='object'||Array.isArray(snapshot.fields))||snapshot.visited&&!Array.isArray(snapshot.visited))throw Error('El cuaderno guardado requiere revisión; no se reemplazará.');return snapshot;}
  function rpc(request) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => { settled = true; reject(Error('La confirmación está tardando. Reintenta para comprobarla.')); }, 30000);
      const finish = (ok, result) => { if (settled) return; settled = true; clearTimeout(timer); ok ? resolve(result) : reject(Error(result?.message || 'No se pudo confirmar.')); };
      try { google.script.run.withSuccessHandler(result => finish(Boolean(result?.ok), result))
        .withFailureHandler(error => finish(false, error)).ludariaApi(request); }
      catch (error) { finish(false, error); }
    });
  }
  function adopt(result) {
    if (result.access) access = result.access;
    if (result.profile) { profile = result.profile; revision = result.revision; }
    if (bar && profile) bar.querySelector('[data-cloud-identity]').textContent = profile.name + ' · ' + profile.class;
    if (profile) window.dispatchEvent(new CustomEvent('ludaria:profile', { detail: profile }));
    return result;
  }
  async function api(action, data = {}, requestId = uid()) {
    const result = await rpc({ action, data, requestId, access, expectedRevision: revision });
    adopt(result);
    if (action === 'accionRpg' && ['decision', 'easter'].includes(data.type)) {
      document.dispatchEvent(new CustomEvent('ludaria:confirmed', { detail: { type: data.type === 'easter' ? 'secreto' : 'decision' } }));
    }
    return result;
  }
  function dialog(title, content) {
    const d = document.createElement('dialog'); d.className = 'ludaria-cloud-dialog';
    d.innerHTML = '<h2>' + esc(title) + '</h2>' + content;
    d.setAttribute('aria-label', title); document.body.append(d);
    d.addEventListener('close', () => d.remove()); d.showModal(); return d;
  }
  function welcome() {
    const d = dialog(guardian?.guardian || 'Tu historia continúa aquí.', '<p>'+esc(guardian?.purpose || 'Tu historia continúa aquí.')+'</p><p>Antes de cruzar este umbral, identifícate con el mismo nombre de explorador y clave en cada misión.</p>' +
      '<form id="cloud-login"><label>Nombre de explorador<input name="name" maxlength="32" autocomplete="username" required></label><label>Clave personal<input name="key" type="password" autocomplete="current-password" required></label><button type="submit">Recuperar mi personaje</button></form>' +
      '<details><summary>Voy a crear mi personaje</summary><p>Elige un nombre propio para tu aventura. Recibirás una clave personal para recuperarla.</p><form id="cloud-register"><label>Nombre de explorador<input name="name" maxlength="32" autocomplete="nickname" required></label><label>Personaje<select name="avatar"><option value="Kira">Kira</option><option value="Kael">Kael</option></select></label><button type="submit">Crear mi personaje</button></form></details><p class="rpg-note">Tu bitácora conserva tus decisiones y reflexiones para revisar el recorrido con el facilitador.</p><p role="status" id="cloud-error"></p>');
    d.addEventListener('cancel', event => event.preventDefault());
    let busy = false, registrationId = uid(), registrationSignature = '';
    d.addEventListener('submit', async event => {
      event.preventDefault(); if (busy) return;
      busy = true; d.querySelectorAll('button').forEach(button => { button.disabled = true; });
      const form = event.target, error = d.querySelector('#cloud-error'); error.textContent = 'Comprobando…';
      try {
        let result;
        if (form.id === 'cloud-login') result = await rpc({ action: 'entrar', data: { name: form.elements.name.value, key: form.elements.key.value } });
        else {
          const data = { name: form.elements.name.value, class: form.elements.avatar.value }, signature = JSON.stringify(data);
          if (registrationSignature && registrationSignature !== signature) registrationId = uid();
          registrationSignature = signature;
          result = await rpc({ action: 'registrar', data, requestId: registrationId });
        }
        adopt(result); form.reset(); d.close();
        if (result.key) keyReceipt(result.key); else finishWelcome();
      } catch (exception) { error.textContent = exception.message; }
      finally { busy = false; d.querySelectorAll('button').forEach(button => { button.disabled = false; }); }
    });
  }
  function keyReceipt(key) {
    const d = dialog('Tu clave de Ludaria.', '<p>Tu personaje ya está registrado. Guarda esta clave: la usarás junto a tu nombre para entrar desde cualquier misión o dispositivo.</p><label>Nombre de explorador<input readonly id="cloud-key-name"></label><label>Clave personal<input readonly id="cloud-key-value"></label><p>La clave es personal. Evita compartirla.</p><div class="cloud-actions"><button id="cloud-copy-key">Copiar clave</button><button id="cloud-download-key">Guardar clave TXT</button><button id="cloud-continue">Ya la guardé · continuar</button></div><p role="status" id="cloud-key-status"></p>');
    d.addEventListener('cancel', event => event.preventDefault());
    d.querySelector('#cloud-key-name').value = profile.name; d.querySelector('#cloud-key-value').value = key;
    d.querySelector('#cloud-copy-key').onclick = async () => { try { await navigator.clipboard.writeText(key); d.querySelector('#cloud-key-status').textContent = 'Clave copiada.'; } catch { d.querySelector('#cloud-key-value').select(); d.querySelector('#cloud-key-status').textContent = 'Selecciona y copia la clave.'; } };
    d.querySelector('#cloud-download-key').onclick = () => {
      const url = URL.createObjectURL(new Blob(['LUDARIA\nNombre: ' + profile.name + '\nClave: ' + key + '\nClave personal: no compartir.'], { type: 'text/plain' }));
      const a = document.createElement('a'); a.href = url; a.download = 'Mi-clave-Ludaria.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
      d.querySelector('#cloud-key-status').textContent = 'Descarga solicitada. Comprueba que guardaste el archivo.';
    };
    d.querySelector('#cloud-continue').onclick = () => { d.close(); finishWelcome(); };
  }
  function finishWelcome() { stateText('Tu historia está al día'); resolveReady(profile); }
  async function loadMission() {
    const result = await api('cargarMision', { mission: config.route }); missionRevision = result.revision; return validateSnapshot(result.snapshot);
  }
  function saveMission(snapshot) {
    pendingSnapshot = JSON.parse(JSON.stringify(snapshot)); stateText('Cuaderno pendiente de guardar');
    clearTimeout(saveTimer); saveTimer = setTimeout(flushMission, 1200);
  }
  async function flushMission() {
    clearTimeout(saveTimer); if (saving) return;
    saving = true;
    try {
      while (failedSave || pendingSnapshot) {
        const job = failedSave || { snapshot: pendingSnapshot, id: uid(), revision: missionRevision };
        if (!failedSave) pendingSnapshot = null;
        failedSave = job; stateText('Guardando cuaderno…');
        const result = await rpc({ action: 'guardarMision', data: { mission: config.route, snapshot: job.snapshot }, requestId: job.id, access, expectedRevision: job.revision });
        missionRevision = result.revision; failedSave = null;
      }
      stateText('Cuaderno confirmado en tu bitácora');
    } catch (error) { stateText('Sin confirmar: ' + error.message); }
    finally { saving = false; }
  }
  async function advantage() { if(window.LudariaRPGUI){window.LudariaRPGUI.open();return;}
    try { const result = await api('ventaja', { id: 'ojo_artesano' }); dialog('Ojo del Artesano · Maestría 5', '<p>' + esc(result.text) + '</p><button onclick="this.closest(\'dialog\').close()">Continuar mi práctica</button>'); }
    catch (error) { stateText(error.message); }
  }
  window.LudariaCloud = { active: true, ready, api, notify: stateText, loadMission, saveMission, flushMission,
    get profile() { return profile; }, get hasPending() { return hasPending(); },
    registerPendingCheck(check) { pendingChecks.add(check); return () => pendingChecks.delete(check); },
    logout() { if (!hasPending() || confirm('Hay un cuaderno o ensayo sin confirmar. Copia o guarda tus notas antes de salir. ¿Cerrar el acceso?')) { access = null; location.reload(); } }
  };
  window.addEventListener('beforeunload', event => { if (hasPending()) { event.preventDefault(); event.returnValue = ''; } });
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '.ludaria-cloud-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:#102018;color:#f2ebdd;padding:10px 16px;border-bottom:1px solid #c9a66b;position:relative;z-index:30;font:14px system-ui}.ludaria-cloud-bar [data-cloud-status]{flex:1;min-width:160px}.ludaria-cloud-bar button,.ludaria-cloud-dialog button{border:1px solid #59c36a;background:#163e2a;color:#f2ebdd;border-radius:8px;padding:10px 14px;cursor:pointer;font:inherit}.ludaria-cloud-dialog{box-sizing:border-box;max-width:560px;width:calc(100% - 32px);max-height:90vh;overflow:auto;background:#102018;color:#f2ebdd;border:1px solid #c9a66b;padding:28px;border-radius:18px;font:16px/1.5 system-ui}.ludaria-cloud-dialog::backdrop{background:#07120dee}.ludaria-cloud-dialog h2{font:28px Georgia;color:#c9a66b;margin:0 0 12px}.ludaria-cloud-dialog p{margin:12px 0}.ludaria-cloud-dialog label{display:block;margin:12px 0}.ludaria-cloud-dialog input,.ludaria-cloud-dialog select{display:block;width:100%;box-sizing:border-box;padding:12px;margin-top:5px;border:1px solid #53735d;border-radius:8px;background:#07120d;color:#f2ebdd;font:inherit}.ludaria-cloud-dialog summary{cursor:pointer;padding:16px 0;color:#8ed89a}.cloud-actions{display:flex;flex-wrap:wrap;gap:10px}.ludaria-cloud-dialog button:disabled{opacity:.5}.ludaria-cloud-bar button:focus-visible,.ludaria-cloud-dialog :focus-visible{outline:3px solid #c9a66b;outline-offset:3px}';
    document.head.append(style);
    bar = document.createElement('div'); bar.className = 'ludaria-cloud-bar';
    bar.innerHTML = '<strong data-cloud-identity>Ludaria</strong><span data-cloud-status role="status">Identificación central</span><button data-cloud-refresh>Actualizar perfil</button>' + (config.route !== 'forja' && config.route !== 'mision-0' ? '<button data-cloud-save>Guardar cuaderno</button>' : '') + '<button data-cloud-advantage>'+ (config.route==='forja'?'Examinar el sello de la Forja':'Ayudas del guardián')+'</button><button data-cloud-logout>Cerrar acceso</button>';
    document.body.prepend(bar); status = bar.querySelector('[data-cloud-status]');
    bar.querySelector('[data-cloud-refresh]').onclick = async () => { try { await api('cargar'); stateText('Tu historia está al día'); } catch (error) { stateText(error.message); } };
    bar.querySelector('[data-cloud-save]')?.addEventListener('click', flushMission);
    bar.querySelector('[data-cloud-advantage]')?.addEventListener('click', advantage);
    bar.querySelector('[data-cloud-logout]').onclick = window.LudariaCloud.logout;
    welcome();
  });
})();
