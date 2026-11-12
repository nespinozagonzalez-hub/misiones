(() => {
  'use strict';
  const config = window.LUDARIA_CLOUD_CONFIG;
  if (!config) return;
  let access = null, profile = null, revision = null, missionRevision = null;
  let resolveReady, bar, status, pendingSnapshot = null, saving = false, failedSave = null, saveTimer, flushTask = null;
  let identityKey = '', identityBackup = '';
  let initialMission = null, lastSavedSnapshot = null;
  const reads = new Map();
  const sessionKey = 'ludaria-session-v1';
  function forgetSession() { try { sessionStorage.removeItem(sessionKey); } catch (_) {} }
  function rememberSession() {
    if (!access || !profile) return;
    const expires = Number(access.split('.')[1]);
    if (!Number.isFinite(expires) || expires <= Date.now()) return;
    try { sessionStorage.setItem(sessionKey, JSON.stringify({access,expires,name:profile.name,class:profile.class})); } catch (_) {}
  }
  function previousSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
      if (saved && typeof saved.access === 'string' && saved.expires > Date.now()) return saved;
    } catch (_) {}
    forgetSession(); return null;
  }
  const pendingChecks = new Set();
  const hasPending = () => Boolean(pendingSnapshot || failedSave || saving || [...pendingChecks].some(check => check()));
  const guardian = config.market ? {guardian:'Mochi, custodio de las posibilidades',purpose:'Antes de ofrecerte una mejora, necesito reconocer al buscador que llega a mi mercado.'} : config.route==='mision-0' ? {guardian:'Aster, guardián del umbral',purpose:'Responde al llamado y reconoce tu punto de partida.'} : LudariaRPG.find(config.route);
  const portraitRoutes = ['forja','pergaminos-dispersos','senda-ejemplos','claro-debate','vetas-diseno','tallado-mecanicas','gema-motivacional','planos-arquitecto','yunque','templado-pares','reflejo-diseno','pulido-prototipo','espejo-compartido','defensa-orbe','mision-0','mochi'];
  const portraitIndex = Math.max(0,portraitRoutes.indexOf(config.market ? 'mochi' : config.route));
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
    if (result.profile) { profile = result.profile; revision = result.revision; rememberSession(); }
    if (result.initialMission?.mission === config.route) initialMission = result.initialMission;
    if (bar && profile) bar.querySelector('[data-cloud-identity]').textContent = profile.name + ' · ' + profile.class;
    if (profile) window.dispatchEvent(new CustomEvent('ludaria:profile', { detail: profile }));
    return result;
  }
  async function api(action, data = {}, requestId = uid()) {
    const readKey = ['cargar','cargarMision','catalogoRpg'].includes(action) ? action + ':' + JSON.stringify(data) : null;
    let task = readKey && reads.get(readKey);
    if (!task) {
      task = rpc({ action, data, requestId, access, expectedRevision: revision });
      if (readKey) reads.set(readKey, task);
    }
    let result;
    try { result = await task; } finally { if (readKey && reads.get(readKey) === task) reads.delete(readKey); }
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
  const emailInput = '<label>Correo de recuperación<input name="email" type="email" maxlength="254" autocomplete="email" required></label>';
  const nameInput = '<label>Nombre de explorador<input name="name" maxlength="32" autocomplete="username" required></label>';
  const codeInput = '<label>Código de 6 dígitos<input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required></label>';
  const keyInput = (label, name) => `<label>${label}<input name="${name}" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="new-password" required></label>`;
  const newKeyPair = (label, confirmLabel) => `<div class="cloud-key-pair">${keyInput(label, 'key')}${keyInput(confirmLabel, 'keyConfirm')}</div>`;
  const requestWithId = () => {
    const sent = new Map();
    return (action, data) => {
      const signature = JSON.stringify(data);
      if (sent.get(action)?.signature !== signature) sent.set(action, {signature, id:uid()});
      return sent.get(action).id;
    };
  };

  function welcome() {
    const title = guardian?.guardian || 'Tu historia continúa aquí.';
    const d = dialog(title, ''); d.classList.add('ludaria-welcome');
    const emailForms = config.emailRecovery ? `
      <form id="cloud-email-request" hidden>
        <h3>Recuperar por correo</h3><p>Escribe el nombre de tu personaje y el correo que verificaste.</p>
        ${nameInput}${emailInput}
        <button class="cloud-primary" type="submit">Enviar código</button>
      </form>
      <form id="cloud-email-reset" hidden>
        <h3>Elige una clave nueva</h3>
        <p>Si los datos coinciden, llegará un código de seis dígitos. Revisa también el correo no deseado. El código dura 15 minutos.</p>
        ${codeInput}${newKeyPair('Nueva clave personal', 'Confirma la nueva clave')}
        <button class="cloud-primary" type="submit">Guardar nueva clave</button>
        <button class="cloud-text-button" type="button" data-access-panel="email-request">Revisar los datos o pedir otro código</button>
      </form>` : '';
    d.innerHTML = `
      <div class="cloud-welcome-grid">
        <aside class="cloud-guardian">
          <div class="cloud-portrait" role="img" aria-label="${esc(title)}" style="background-position:${portraitIndex%4/3*100}% ${Math.floor(portraitIndex/4)/3*100}%"></div>
          <div class="cloud-guardian-copy"><span class="cloud-eyebrow">LUDARIA · TU AVENTURA CONTINÚA</span>
            <h2>${esc(title)}</h2><p>${esc(guardian?.purpose || 'Tu historia continúa aquí.')}</p>
            <span class="cloud-guardian-seal" aria-hidden="true">✦</span>
          </div>
        </aside>
        <section class="cloud-access">
          <div class="cloud-access-intro"><span class="cloud-eyebrow">EL UMBRAL DEL BUSCADOR</span><h3>Bienvenido a Ludaria</h3><p>Tu nombre y tu clave abren el mismo personaje en cada misión.</p></div>
          <nav class="cloud-access-tabs" aria-label="Opciones de acceso">
            <button type="button" data-access-panel="login" aria-pressed="true">Ya tengo personaje</button>
            <button type="button" data-access-panel="register" aria-pressed="false">Crear personaje</button>
          </nav>
          <form id="cloud-login">
            ${nameInput}<label>Clave personal<input name="key" type="password" autocomplete="current-password" required></label>
            <button class="cloud-primary" type="submit">Entrar a mi aventura <span aria-hidden="true">→</span></button>
            <button class="cloud-text-button" type="button" data-access-panel="recover">Recuperar clave</button>
          </form>
          <form id="cloud-register" hidden>
            <p>Elige una clave personal de seis dígitos.</p>${nameInput}
            <label>Personaje<select name="avatar"><option value="Kira">Kira</option><option value="Kael">Kael</option></select></label>
            ${newKeyPair('Elige tu clave personal', 'Confirma tu clave')}${config.emailRecovery ? emailInput : ''}
            <button class="cloud-primary" type="submit">Forjar mi personaje <span aria-hidden="true">✦</span></button>
          </form>
          ${config.emailRecovery ? `<nav class="cloud-access-tabs" data-email-methods aria-label="Cómo recuperar la clave" hidden>
            <button type="button" data-access-panel="email-request" aria-pressed="true">Por correo</button>
            <button type="button" data-access-panel="backup" aria-pressed="false">Con código de respaldo</button>
          </nav>` : ''}
          ${emailForms}
          <form id="cloud-recover" hidden>
            <h3>Recuperar con código de respaldo</h3>
            <p>Busca el código que comienza con <strong>RES-</strong> en el archivo de acceso que guardaste al crear tu personaje.</p>
            ${nameInput}<label>Código de respaldo<input name="recoveryCode" type="password" maxlength="31" autocomplete="off" placeholder="RES-…" required></label>
            ${newKeyPair('Nueva clave personal', 'Confirma la nueva clave')}
            <button class="cloud-primary" type="submit">Guardar nueva clave</button>
            <details class="cloud-recovery-help"><summary>No tengo mi código de respaldo</summary><p>Pide al facilitador que verifique tu identidad y renueve tu acceso. Tu personaje y su progreso se conservan.</p></details>
          </form>
          <button class="cloud-text-button" type="button" data-access-panel="login" data-return-to-login hidden>Volver al acceso</button>
          <p role="status" aria-live="polite" id="cloud-error"></p>
          <p class="cloud-access-note">✧ Tu bitácora conserva las decisiones de tu recorrido.</p>
        </section>
      </div>`;
    const tabs = d.querySelector('.cloud-access-tabs'), error = d.querySelector('#cloud-error');
    if (config.route === 'forja' && !config.market && document.getElementById('create-form')) {
      tabs.remove();
      d.querySelector('#cloud-login [type=submit]').textContent = 'Cargar mi personaje';
      const back = document.createElement('button'); back.type = 'button'; back.className = 'cloud-text-button'; back.textContent = 'Volver a la Forja';
      back.onclick = () => { d.close(); document.querySelector('[data-action=resume]').focus(); };
      d.querySelector('.cloud-access').append(back);
    }
    d.addEventListener('cancel', event => event.preventDefault());
    let busy = false, recoveryContact = null, requestId = requestWithId();
    function showPanel(panel) {
      if (panel === 'recover') panel = config.emailRecovery ? 'email-request' : 'backup';
      const formId = panel === 'backup' ? 'cloud-recover' : 'cloud-' + panel;
      const recovering = !['login', 'register'].includes(panel);
      d.classList.toggle('is-recovering', recovering);
      d.querySelectorAll('form').forEach(form => { form.hidden = form.id !== formId; });
      const methods = d.querySelector('[data-email-methods]');
      if (methods) {
        methods.hidden = !recovering;
        methods.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(panel.startsWith('email') ? button.dataset.accessPanel === 'email-request' : panel === button.dataset.accessPanel)));
      }
      if (tabs.isConnected) {
        tabs.hidden = recovering;
        tabs.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accessPanel === panel)));
      }
      d.querySelector('[data-return-to-login]').hidden = !recovering;
      const form = d.querySelector('#' + formId);
      if (recovering && form.elements.name && !form.elements.name.value) {
        form.elements.name.value = d.querySelector('#cloud-login').elements.name.value;
      }
      error.textContent = '';
      form.querySelector('input').focus();
    }
    d.querySelectorAll('[data-access-panel]').forEach(button => button.onclick = () => {
      if (button.closest('#cloud-email-reset')) requestId = requestWithId();
      showPanel(button.dataset.accessPanel);
    });

    d.addEventListener('submit', async event => {
      event.preventDefault(); if (busy) return;
      busy = true; d.querySelectorAll('button').forEach(button => { button.disabled = true; });
      const form = event.target, fields = form.elements;
      error.textContent = 'Comprobando…';
      try {
        let action;
        const data = {mission:config.route};
        const email = fields.email?.value.trim();
        if (form.id === 'cloud-email-request') {
          recoveryContact = {name:fields.name.value, email:email};
          await rpc({action:'enviarCodigoRecuperacion', data:recoveryContact, requestId:requestId('enviarCodigoRecuperacion', recoveryContact)});
          d.querySelector('#cloud-email-reset').reset();
          showPanel('email-reset');
          return;
        }
        if (form.id === 'cloud-login') action = 'entrar';
        else if (form.id === 'cloud-register') {
          action = 'registrar';
          data.class = fields.avatar.value;
        } else if (form.id === 'cloud-email-reset') {
          action = 'recuperarClavePorCorreo';
          Object.assign(data, recoveryContact, {code:fields.code.value});
        } else {
          action = 'recuperarClave';
          data.recoveryCode = fields.recoveryCode.value;
        }
        if (fields.name) data.name = fields.name.value;
        data.key = fields.key.value;
        if (fields.keyConfirm) {
          data.keyConfirm = fields.keyConfirm.value;
          if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escríbelas otra vez.');
        }
        const result = await rpc({action, data, requestId:requestId(action, data)});
        identityKey = result.key || data.key.trim().toUpperCase();
        identityBackup = result.recoveryCode || data.recoveryCode?.trim().toUpperCase() || '';
        adopt(result); form.reset(); d.close();
        if (result.key) keyReceipt(identityKey, identityBackup, {recovered:action.startsWith('recuperarClave'), email:action === 'registrar' ? email : ''});
        else finishWelcome();
      } catch (exception) { error.textContent = exception.message; }
      finally { busy = false; d.querySelectorAll('button').forEach(button => { button.disabled = false; }); }
    });
  }

  function emailSettings({email = '', currentKey = '', onVerified} = {}) {
    const d = dialog('Correo de recuperación', `
      <p>Verifica una dirección a la que tengas acceso. Podrás recibir un código para elegir una nueva clave.</p>
      <form data-email-send>
        ${emailInput}
        ${currentKey ? '' : '<label>Clave personal actual<input name="currentKey" type="password" maxlength="31" autocomplete="current-password" required></label>'}
        <button class="cloud-primary" type="submit">Enviar código de verificación</button>
      </form>
      <form data-email-confirm hidden>${codeInput}<button class="cloud-primary" type="submit">Verificar mi correo</button></form>
      <p role="status" data-email-status></p>
      <button type="button" data-email-close>Volver</button>`);
    d.classList.add('ludaria-email-settings');
    const sendForm = d.querySelector('[data-email-send]'), confirmForm = d.querySelector('[data-email-confirm]');
    const status = d.querySelector('[data-email-status]');
    const emailField = sendForm.elements.email;
    let sentTo = '', busy = false, requestId = requestWithId();
    emailField.value = email;
    d.querySelector('[data-email-close]').onclick = () => d.close();
    emailField.addEventListener('input', () => {
      if (emailField.value.trim().toLowerCase() !== sentTo) confirmForm.hidden = true;
    });
    if (!email) api('estadoCorreoRecuperacion').then(result => {
      if (!busy && !sentTo && d.isConnected) status.textContent = result.verified
        ? 'Tu correo está verificado. Puedes verificar otra dirección si quieres cambiarlo.'
        : 'Tu personaje aún no tiene un correo verificado.';
    }).catch(error => { if (!busy && d.isConnected) status.textContent = error.message; });
    d.addEventListener('submit', async event => {
      event.preventDefault(); if (busy) return;
      busy = true; d.querySelectorAll('button[type=submit]').forEach(button => { button.disabled = true; });
      const form = event.target;
      status.textContent = form === sendForm ? 'Enviando el código…' : 'Verificando el código…';
      try {
        if (form === sendForm) {
          const data = {email:emailField.value.trim().toLowerCase(), currentKey:currentKey || sendForm.elements.currentKey.value};
          const result = await api('enviarVerificacionCorreo', data, requestId('enviarVerificacionCorreo', data));
          if (sendForm.elements.currentKey) sendForm.elements.currentKey.value = '';
          if (!result.verified) {
            sentTo = data.email;
            requestId = requestWithId();
            confirmForm.reset();
            confirmForm.hidden = emailField.value.trim().toLowerCase() !== sentTo;
            if (!confirmForm.hidden) confirmForm.elements.code.focus();
            status.textContent = 'Revisa ' + sentTo + ' y escribe aquí el código. Dura 15 minutos.';
            return;
          }
        } else await api('confirmarCorreoRecuperacion', {email:sentTo, code:confirmForm.elements.code.value});
        status.textContent = 'Correo verificado. Ya puedes usarlo para recuperar tu clave.';
        sendForm.hidden = confirmForm.hidden = true;
        onVerified?.();
        d.querySelector('[data-email-close]').focus();
      } catch (error) { status.textContent = error.message; }
      finally { busy = false; d.querySelectorAll('button[type=submit]').forEach(button => { button.disabled = false; }); }
    });
  }
  function keyReceipt(key,recoveryCode,{review=false,recovered=false,email=''}={}) {
    const title = review ? 'Mi nombre y mi clave' : recovered ? 'Tu clave está renovada' : 'Tu identidad está forjada';
    const emailSetup = config.emailRecovery && (email || review);
    const d = dialog(title, `<p>Entra a cada misión con este mismo nombre y clave personal.</p>
      ${emailSetup ? `<section class="cloud-email-card">
        <p data-email-receipt>${email ? 'Verifica el correo que ingresaste para poder recuperar tu clave.' : 'Administra el correo con el que recuperas tu clave.'}</p>
        <button type="button" data-email-setup>${email ? 'Verificar mi correo' : 'Correo de recuperación'}</button>
      </section>` : ''}
      <label>Nombre de explorador<input readonly id="cloud-key-name"></label>
      <label>Tu clave personal<input type="password" readonly id="cloud-key-value"></label>
      ${recoveryCode ? '<label>Código de respaldo<input type="password" readonly id="cloud-recovery-value"></label><p>Guarda este código que empieza con RES-. Lo puedes usar en «Recuperar clave» para elegir una clave nueva.</p>' : ''}
      <button type="button" id="cloud-reveal-key" aria-pressed="false">Mostrar mis códigos</button>
      <div class="cloud-actions"><button id="cloud-copy-key">Copiar clave</button>
      ${recoveryCode ? '<button id="cloud-copy-recovery">Copiar código de respaldo</button>' : ''}
      <button id="cloud-download-key">Guardar mi acceso TXT</button>
      <button id="cloud-continue">${email ? 'Verificar más tarde y continuar' : 'Continuar mi aventura →'}</button></div>
      <p role="status" id="cloud-key-status"></p>`);
    const setup = d.querySelector('[data-email-setup]');
    if (setup) setup.onclick = () => emailSettings({email, currentKey:review ? '' : key, onVerified:() => {
      d.querySelector('[data-email-receipt]').textContent = 'Correo de recuperación verificado.';
      d.querySelector('#cloud-continue').textContent = 'Continuar mi aventura →';
      if (email) setup.hidden = true;
    }});
    d.addEventListener('cancel', event => event.preventDefault());
    d.querySelector('#cloud-key-name').value = profile.name; d.querySelector('#cloud-key-value').value = key;
    if(recoveryCode)d.querySelector('#cloud-recovery-value').value = recoveryCode;
    d.querySelector('#cloud-reveal-key').onclick = event => { const show = event.currentTarget.getAttribute('aria-pressed') !== 'true'; d.querySelectorAll('input[type=password],input[data-secret]').forEach(input => {input.dataset.secret='true';input.type=show?'text':'password';});event.currentTarget.setAttribute('aria-pressed',String(show));event.currentTarget.textContent=show?'Ocultar mis códigos':'Mostrar mis códigos'; };
    function copyCode(value,selector,message) {return async () => {try {await navigator.clipboard.writeText(value);d.querySelector('#cloud-key-status').textContent=message;}catch {const input=d.querySelector(selector);input.type='text';input.dataset.secret='true';input.focus();input.select();d.querySelector('#cloud-reveal-key').setAttribute('aria-pressed','true');d.querySelector('#cloud-reveal-key').textContent='Ocultar mis códigos';d.querySelector('#cloud-key-status').textContent='No se pudo copiar automáticamente. El código está visible y seleccionado para que lo copies.';}};}
    d.querySelector('#cloud-copy-key').onclick = copyCode(key,'#cloud-key-value','Clave copiada.');
    d.querySelector('#cloud-copy-recovery')?.addEventListener('click',copyCode(recoveryCode,'#cloud-recovery-value','Código de recuperación copiado.'));
    d.querySelector('#cloud-download-key').onclick = () => {
      const url = URL.createObjectURL(new Blob(['LUDARIA\nNombre: ' + profile.name + '\nClave personal elegida: ' + key + (recoveryCode?'\nCódigo de respaldo: '+recoveryCode:'')+'\nAcceso personal: no compartir.'], { type: 'text/plain' }));
      const a = document.createElement('a'); a.href = url; a.download = 'Mi-clave-Ludaria.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
      d.querySelector('#cloud-key-status').textContent = 'Descarga solicitada. Comprueba que guardaste el archivo.';
    };
    d.querySelector('#cloud-continue').onclick = () => { d.close(); if(!review)finishWelcome(); };
  }
  function finishWelcome() { stateText('Tu historia está al día'); resolveReady(profile); }
  async function loadMission() {
    const result = initialMission || await api('cargarMision', { mission: config.route });
    initialMission = null; missionRevision = result.revision;
    const snapshot = validateSnapshot(result.snapshot); lastSavedSnapshot = JSON.stringify(snapshot); return snapshot;
  }
  function saveMission(snapshot) {
    const serialized = JSON.stringify(snapshot);
    if (!pendingSnapshot && !failedSave && !saving && serialized === lastSavedSnapshot) return;
    pendingSnapshot = JSON.parse(serialized); stateText('Cuaderno pendiente de guardar');
    clearTimeout(saveTimer); saveTimer = setTimeout(flushMission, 1200);
  }
  function flushMission() {
    clearTimeout(saveTimer);
    if (flushTask) return flushTask;
    if (!failedSave && !pendingSnapshot) return Promise.resolve();
    flushTask = performSave();
    return flushTask;
  }
  async function performSave() {
    saving = true;
    try {
      while (failedSave || pendingSnapshot) {
        const job = failedSave || { snapshot: pendingSnapshot, id: uid(), revision: missionRevision };
        if (!failedSave) pendingSnapshot = null;
        failedSave = job; stateText('Guardando cuaderno…');
        const result = await rpc({ action: 'guardarMision', data: { mission: config.route, snapshot: job.snapshot }, requestId: job.id, access, expectedRevision: job.revision });
        missionRevision = result.revision; lastSavedSnapshot = JSON.stringify(job.snapshot); failedSave = null;
      }
      stateText('Cuaderno confirmado en tu bitácora');
    } catch (error) { stateText('Sin confirmar: ' + error.message); }
    finally {
      saving = false;
      flushTask = null;
      window.dispatchEvent(new CustomEvent('ludaria:savestatus', { detail: status?.textContent || '' }));
    }
  }
  async function advantage() { if(window.LudariaRPGUI){window.LudariaRPGUI.open();return;}
    try { const result = await api('ventaja', { id: 'ojo_artesano' }); dialog('Ojo del Artesano · Maestría 5', '<p>' + esc(result.text) + '</p><button onclick="this.closest(\'dialog\').close()">Continuar mi práctica</button>'); }
    catch (error) { stateText(error.message); }
  }
  window.LudariaCloud = { active: true, ready, api, openAccess: welcome,
    async registerCharacter({email = '', ...data}, requestId) {
      if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escríbelas otra vez.');
      const result = await rpc({action: 'registrar', data: {...data, mission: config.route}, requestId});
      identityKey = result.key || data.key; identityBackup = result.recoveryCode || '';
      adopt(result); keyReceipt(identityKey, identityBackup, {email}); return result;
    },
    notify: stateText, loadMission, saveMission, flushMission,
    get profile() { return profile; }, get hasPending() { return hasPending(); },
    registerPendingCheck(check) { pendingChecks.add(check); return () => pendingChecks.delete(check); },
    logout() { if (!hasPending() || confirm('Hay un cuaderno o ensayo sin confirmar. Copia o guarda tus notas antes de salir. ¿Cerrar el acceso?')) { forgetSession(); access = null; identityKey = ''; identityBackup = ''; location.reload(); } }
  };
  window.addEventListener('beforeunload', event => { if (hasPending()) { event.preventDefault(); event.returnValue = ''; } });
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '.ludaria-cloud-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:#102018;color:#f2ebdd;padding:10px 16px;border-bottom:1px solid #c9a66b;position:relative;z-index:30;font:14px system-ui}.ludaria-cloud-bar [data-cloud-identity]{min-width:0;max-width:100%;overflow-wrap:anywhere}.ludaria-cloud-bar [data-cloud-status]{flex:1;min-width:160px}.ludaria-cloud-bar button,.ludaria-cloud-dialog button{border:1px solid #59c36a;background:#163e2a;color:#f2ebdd;border-radius:8px;padding:10px 14px;cursor:pointer;font:inherit}.ludaria-cloud-dialog{box-sizing:border-box;max-width:560px;width:calc(100% - 32px);max-height:90vh;overflow:auto;background:#102018;color:#f2ebdd;border:1px solid #c9a66b;padding:28px;border-radius:18px;font:16px/1.5 system-ui}.ludaria-cloud-dialog::backdrop{background:#07120dee}.ludaria-cloud-dialog h2{font:28px Georgia;color:#c9a66b;margin:0 0 12px}.ludaria-cloud-dialog p{margin:12px 0}.ludaria-cloud-dialog label{display:block;margin:12px 0}.ludaria-cloud-dialog input,.ludaria-cloud-dialog select{display:block;width:100%;box-sizing:border-box;padding:12px;margin-top:5px;border:1px solid #53735d;border-radius:8px;background:#07120d;color:#f2ebdd;font:inherit}.ludaria-cloud-dialog summary{cursor:pointer;padding:16px 0;color:#8ed89a}.cloud-actions{display:flex;flex-wrap:wrap;gap:10px}.ludaria-cloud-dialog button:disabled{opacity:.5}.ludaria-cloud-bar button:focus-visible,.ludaria-cloud-dialog :focus-visible{outline:3px solid #c9a66b;outline-offset:3px}';
    style.textContent += `
      .ludaria-cloud-dialog [hidden]{display:none!important}
      .ludaria-welcome{max-width:920px;padding:0;border-color:#6b7650;border-radius:22px;box-shadow:0 30px 100px #0009}
      .ludaria-welcome::backdrop{background:radial-gradient(ellipse at top,#142d22ee,#030d08f5);backdrop-filter:blur(5px)}
      .cloud-welcome-grid{display:grid;grid-template-columns:36% 64%;min-height:540px}
      .cloud-guardian{background:linear-gradient(150deg,#204634,#0a2116);border-right:1px solid #b6965438;overflow:hidden;position:relative}
      .cloud-portrait{aspect-ratio:1;width:100%;background-image:url('https://nespinozagonzalez-hub.github.io/misiones/ludaria/assets/guardianes-v1.webp');background-size:400% 400%;background-repeat:no-repeat}
      .cloud-guardian-copy{padding:25px 24px 20px;position:relative;background:linear-gradient(#122e20,#0b2217)}
      .cloud-eyebrow{font:10px/1.6 system-ui;letter-spacing:1.8px;color:#c7ad6e;display:block}
      .ludaria-welcome .cloud-guardian h2{font:28px/1.13 Georgia;margin:12px 0;color:#f0dfac}
      .cloud-guardian-copy p{color:#ced9c7;font-size:14px;line-height:1.6}
      .cloud-guardian-seal{display:block;color:#c6a75e;font-size:28px;margin-top:18px}
      .cloud-access{padding:32px;background:radial-gradient(ellipse at top right,#213c2860,transparent 60%),#102018}
      .cloud-access h3{font:28px/1.15 Georgia;color:#f0e4c5;margin:10px 0 12px}
      .cloud-access-intro p{color:#bfcdbb;font-size:14px;margin:10px 0 22px}
      .ludaria-welcome.is-recovering .cloud-access-intro{display:none}
      .cloud-access-tabs{display:flex;gap:6px;border:1px solid #4d664238;border-radius:10px;background:#07160e;padding:4px;margin-bottom:20px}
      .cloud-access-tabs button{flex:1;font-size:13px;background:transparent;border-color:transparent;padding:10px 5px;color:#acbba6}
      .cloud-access-tabs button[aria-pressed=true]{background:#284b33;color:#f2ebd8;border-color:#627347}
      .cloud-access label{font-size:13px;color:#ced7c5;margin:14px 0}
      .cloud-access input,.cloud-access select{font-size:16px;background:#09170e;border-color:#3d5d43;padding:12px;border-radius:9px}
      .cloud-access .cloud-primary{width:100%;background:linear-gradient(130deg,#bd9c51,#dfbf72);border-color:#e2c275;color:#162218;font-weight:700;margin-top:9px;display:flex;align-items:center;justify-content:center;gap:15px;min-height:46px}
      .cloud-access .cloud-text-button{display:block;border:0;background:none;color:#cdbc86;text-decoration:underline;text-underline-offset:4px;padding:12px 0;font-size:13px}
      .cloud-access-note{font:12px/1.6 system-ui;color:#7f997d;border-top:1px solid #6b765034;padding-top:15px;margin-top:20px!important}
      .cloud-key-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
      .cloud-key-pair label,.cloud-key-pair input{min-width:0}
      #cloud-key-help,#cloud-recover>p,.cloud-recovery-help p{font-size:13px;color:#b7c8ac}
      .cloud-recovery-help summary{font-size:13px;padding:14px 0;color:#cdbc86}
      .cloud-email-card{padding:12px 16px;background:#183226;border:1px solid #688963;border-radius:10px;margin:12px 0}
      .cloud-email-card p{margin:0 0 8px}
      .ludaria-email-settings form label{margin-block:12px}
      .ludaria-email-settings [data-email-status]{min-height:1.4em;overflow-wrap:anywhere}
      #cloud-error:not(:empty){font-size:13px;color:#f1c481;padding:10px;background:#372c1760;border-radius:8px}
      @media(max-width:620px){.ludaria-welcome{width:calc(100% - 20px);max-height:calc(100dvh - 20px);border-radius:16px}.cloud-welcome-grid{display:block;min-height:0}.cloud-guardian{display:flex;align-items:center;border-right:0;border-bottom:1px solid #b6965438;padding:16px;gap:16px}.cloud-portrait{width:94px;flex:0 0 94px;border:1px solid #b69654;border-radius:50%}.cloud-guardian-copy{padding:0;background:none}.cloud-guardian-copy p,.cloud-guardian-seal{display:none}.ludaria-welcome .cloud-guardian h2{font-size:23px;margin:7px 0}.cloud-guardian .cloud-eyebrow{font-size:8px;letter-spacing:1px}.cloud-access{padding:22px}.cloud-access h3{font-size:26px}.cloud-key-pair{gap:10px}}
      @media(prefers-reduced-motion:reduce){.ludaria-welcome::backdrop{backdrop-filter:none}}
    `;
    style.textContent += '.cloud-loading-screen{position:fixed;inset:0;z-index:100;background:radial-gradient(ellipse at top,#173b29,#07120d 70%);display:grid;place-items:center;padding:20px;box-sizing:border-box}.cloud-loading-card{box-sizing:border-box;width:min(100%,520px);padding:36px;text-align:center;border:1px solid #b69654;border-radius:24px;background:#102018;color:#e8dfc8;box-shadow:0 24px 70px #0008;font:16px/1.6 system-ui}.cloud-loading-card img{object-fit:cover;border-radius:50%;border:1px solid #b69654;margin-bottom:20px}.cloud-loading-card h2{font:30px/1.2 Georgia;color:#dfbf72;overflow-wrap:anywhere}.cloud-loading-seal{display:block;font-size:44px;color:#dfbf72;margin-bottom:18px}.cloud-loading-track{height:4px;margin-top:24px;background:#284b33;border-radius:6px;overflow:hidden}.cloud-loading-track span{display:block;width:35%;height:100%;background:#dfbf72;animation:cloud-loading 1.8s ease-in-out infinite alternate}@keyframes cloud-loading{to{transform:translateX(180%)}}@media(prefers-reduced-motion:reduce){.cloud-loading-track span{animation:none;width:100%}}';
    document.head.append(style);
    bar = document.createElement('div'); bar.className = 'ludaria-cloud-bar';
    bar.innerHTML = '<strong data-cloud-identity>Ludaria</strong><span data-cloud-status role="status">Identificación central</span><button data-cloud-refresh>Actualizar perfil</button>' + (config.route !== 'forja' && config.route !== 'mision-0' ? '<button data-cloud-save>Guardar cuaderno</button>' : '<button data-cloud-access>Mi nombre y mi clave</button>') + '<button data-cloud-advantage>'+ (config.route==='forja'?'Examinar el sello de la Forja':'Ayudas del guardián')+'</button><button data-cloud-logout>Cerrar acceso</button>';
    document.body.prepend(bar); status = bar.querySelector('[data-cloud-status]');
    bar.querySelector('[data-cloud-refresh]').onclick = async () => {
      const button = bar.querySelector('[data-cloud-refresh]');
      if (button.disabled) return;
      button.disabled = true;
      try {
        await api('cargar');
        // Consultar atributos no confirma el cuaderno ni los ensayos pendientes.
        if (!hasPending()) stateText('Perfil actualizado · tu historia está al día');
      } catch (error) {
        const draftStatus = status.textContent;
        stateText('No se pudo actualizar el perfil: ' + error.message +
          (hasPending() ? ' · ' + draftStatus : ''));
      } finally { button.disabled = false; }
    };
    bar.querySelector('[data-cloud-save]')?.addEventListener('click', flushMission);
    bar.querySelector('[data-cloud-access]')?.addEventListener('click', () => {
      if (!profile) return;
      if (identityKey) keyReceipt(identityKey, identityBackup, {review:true});
      else if (config.emailRecovery) emailSettings();
      else dialog('Mi personaje', '<p>Estás conectado como <strong>'+esc(profile.name)+'</strong>.</p><p>Consulta tu clave en el archivo de acceso que guardaste.</p><button onclick="this.closest(\'dialog\').close()">Volver a mi aventura</button>');
    });
    bar.querySelector('[data-cloud-advantage]')?.addEventListener('click', advantage);
    bar.querySelector('[data-cloud-logout]').onclick = window.LudariaCloud.logout;
    if (config.route === 'forja' && !config.market && document.getElementById('create-form')) {
      bar.hidden = true; ready.then(() => { bar.hidden = false; });
    }
    const saved = previousSession();
    if (saved) {
      access = saved.access; stateText('Recuperando tu personaje…');
      const preview = document.createElement('section'); preview.id='cloud-session-preview'; preview.setAttribute('role','status');
      if(config.route==='forja'){
        preview.className='cloud-loading-screen';
        const avatar=['Kael','Kira'].includes(saved.class)?saved.class.toLowerCase():null;
        preview.innerHTML='<div class="cloud-loading-card">'+(avatar?'<img alt="" width="100" height="100" src="https://nespinozagonzalez-hub.github.io/misiones/forja/assets/'+avatar+'.webp">':'<span class="cloud-loading-seal" aria-hidden="true">✦</span>')+'<span class="cloud-eyebrow">'+(config.market?'EL MERCADITO DE MOCHI':'LA FORJA DEL BUSCADOR')+'</span><h2>Tu aventura continúa, '+esc(saved.name||'buscador')+'</h2><p>Recuperando tus atributos y tu progreso…</p><div class="cloud-loading-track" aria-hidden="true"><span></span></div></div>';
        document.body.append(preview);
      }

      rpc({action:'cargarInicio',access,data:{mission:config.route}}).then(result => {preview.remove();adopt(result);finishWelcome();}).catch(error => {
        preview.remove();
        forgetSession(); access = null;
        stateText('Vuelve a cargar tu personaje · '+error.message);
        if (!(config.route === 'forja' && !config.market && document.getElementById('create-form'))) welcome();
      });
    } else if (!(config.route === 'forja' && !config.market && document.getElementById('create-form'))) welcome();
  });
})();
