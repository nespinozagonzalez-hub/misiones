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
    try { sessionStorage.setItem(sessionKey, JSON.stringify({access,expires,name:profile.name})); } catch (_) {}
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
  function welcome() {
    const title = guardian?.guardian || 'Tu historia continúa aquí.';
    const newKey = (label,name) => '<label>'+label+'<input name="'+name+'" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="new-password" aria-describedby="cloud-key-help" required></label>';
    const d = dialog(title, ''); d.classList.add('ludaria-welcome');
    d.innerHTML = '<div class="cloud-welcome-grid"><aside class="cloud-guardian"><div class="cloud-portrait" role="img" aria-label="Retrato de '+esc(title)+'" style="background-position:'+(portraitIndex%4/3*100)+'% '+(Math.floor(portraitIndex/4)/3*100)+'%"></div><div class="cloud-guardian-copy"><span class="cloud-eyebrow">LUDARIA · TU AVENTURA CONTINÚA</span><h2>'+esc(title)+'</h2><p>'+esc(guardian?.purpose || 'Tu historia continúa aquí.')+'</p><span class="cloud-guardian-seal" aria-hidden="true">✦</span></div></aside><section class="cloud-access"><div class="cloud-access-intro"><span class="cloud-eyebrow">EL UMBRAL DEL BUSCADOR</span><h3>Bienvenido a Ludaria</h3><p>Tu nombre y tu clave abren el mismo personaje en cada misión.</p></div><nav class="cloud-access-tabs" aria-label="Opciones de acceso"><button type="button" data-access-panel="login" aria-pressed="true">Ya tengo personaje</button><button type="button" data-access-panel="register" aria-pressed="false">Crear personaje</button></nav><form id="cloud-login"><label>Nombre de explorador<input name="name" maxlength="32" autocomplete="username" required></label><label>Clave personal<input name="key" type="password" autocomplete="current-password" required></label><button class="cloud-primary" type="submit">Entrar a mi aventura <span aria-hidden="true">→</span></button><button class="cloud-text-button" type="button" data-access-panel="recover">Recuperar clave</button></form><form id="cloud-register" hidden><p id="cloud-key-help">Elige una clave de seis dígitos que puedas recordar. No uses la contraseña de otro servicio.</p><label>Nombre de explorador<input name="name" maxlength="32" autocomplete="nickname" required></label><label>Personaje<select name="avatar"><option value="Kira">Kira</option><option value="Kael">Kael</option></select></label><div class="cloud-key-pair">'+newKey('Elige tu clave personal','key')+newKey('Confirma tu clave','keyConfirm')+'</div><button class="cloud-primary" type="submit">Forjar mi personaje <span aria-hidden="true">✦</span></button></form><form id="cloud-recover" hidden><h3>Recuperar clave</h3><p>Usa el código de recuperación que guardaste al crear tu personaje y elige una nueva clave de seis dígitos.</p><label>Nombre de explorador<input name="name" maxlength="32" autocomplete="username" required></label><label>Código de recuperación<input name="recoveryCode" type="password" maxlength="31" autocomplete="off" placeholder="RES-…" required></label><div class="cloud-key-pair">'+newKey('Nueva clave personal','key')+newKey('Confirma tu nueva clave','keyConfirm')+'</div><button class="cloud-primary" type="submit">Guardar nueva clave</button><details class="cloud-recovery-help"><summary>No tengo mi código de recuperación</summary><p>Pide al facilitador que verifique tu identidad y renueve tu acceso. Tu personaje, tus puntos y tu cuaderno se conservan.</p><p>Si creaste tu personaje antes de que existieran estos códigos, también puedes recuperarlo con su ayuda.</p></details><button class="cloud-text-button" type="button" data-access-panel="login">Volver al acceso</button></form><p role="status" aria-live="polite" id="cloud-error"></p><p class="cloud-access-note">✧ Tu bitácora conserva las decisiones de tu recorrido.</p></section></div>';
    if (config.route === 'forja' && !config.market && document.getElementById('create-form')) {
      d.querySelector('.cloud-access-tabs').remove();
      d.querySelector('[data-access-panel=recover]').remove();
      d.querySelector('#cloud-login [type=submit]').textContent = 'Cargar mi personaje';
      const back = document.createElement('button'); back.type = 'button'; back.className = 'cloud-text-button'; back.textContent = 'Volver a la Forja';
      back.onclick = () => { d.close(); document.querySelector('[data-action=resume]').focus(); };
      d.querySelector('.cloud-access').append(back);
    }
    d.addEventListener('cancel', event => event.preventDefault());
    let busy = false, registrationId = uid(), registrationSignature = '', recoveryId = uid(), recoverySignature = '';
    d.querySelectorAll('[data-access-panel]').forEach(button => button.onclick = () => {
      const panel = button.dataset.accessPanel;
      d.classList.toggle('is-recovering',panel === 'recover');
      d.querySelectorAll('form').forEach(form => { form.hidden = form.id !== 'cloud-'+panel; });
      d.querySelectorAll('.cloud-access-tabs button').forEach(tab => tab.setAttribute('aria-pressed',String(tab.dataset.accessPanel === panel)));
      d.querySelector('#cloud-error').textContent = '';
      d.querySelector('#cloud-'+panel+' input').focus();
    });
    d.addEventListener('submit', async event => {
      event.preventDefault(); if (busy) return;
      busy = true; d.querySelectorAll('button').forEach(button => { button.disabled = true; });
      const form = event.target, error = d.querySelector('#cloud-error'); error.textContent = 'Comprobando…';
      try {
        let result;
        if (form.id === 'cloud-login') result = await rpc({ action: 'entrar', data: { name: form.elements.name.value, key: form.elements.key.value, mission: config.route } });
        else if (form.id === 'cloud-register') {
          const data = { name: form.elements.name.value, class: form.elements.avatar.value, mission: config.route, key: form.elements.key.value, keyConfirm: form.elements.keyConfirm.value }, signature = JSON.stringify(data);
          if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escríbelas otra vez.');
          if (registrationSignature && registrationSignature !== signature) registrationId = uid();
          registrationSignature = signature;
          result = await rpc({ action: 'registrar', data, requestId: registrationId });
        } else {
          const data = { name: form.elements.name.value, mission: config.route, recoveryCode: form.elements.recoveryCode.value, key: form.elements.key.value, keyConfirm: form.elements.keyConfirm.value }, signature = JSON.stringify(data);
          if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escríbelas otra vez.');
          if (recoverySignature && recoverySignature !== signature) recoveryId = uid();
          recoverySignature = signature;
          result = await rpc({action:'recuperarClave',data,requestId:recoveryId});
        }
        identityKey = result.key || form.elements.key.value.trim().toUpperCase();
        identityBackup = result.recoveryCode || form.elements.recoveryCode?.value.trim().toUpperCase() || '';
        adopt(result); form.reset(); d.close();
        if (result.key) keyReceipt(identityKey,identityBackup,{recovered:form.id === 'cloud-recover'}); else finishWelcome();
      } catch (exception) { error.textContent = exception.message; }
      finally { busy = false; d.querySelectorAll('button').forEach(button => { button.disabled = false; }); }
    });
  }
  function keyReceipt(key,recoveryCode,{review=false,recovered=false}={}) {
    const title = review ? 'Mi nombre y mi clave' : recovered ? 'Tu clave está renovada' : 'Tu identidad está forjada';
    const d = dialog(title, '<p>Entra a cada misión con este mismo nombre y clave personal.</p><label>Nombre de explorador<input readonly id="cloud-key-name"></label><label>Tu clave personal<input type="password" readonly id="cloud-key-value"></label>'+(recoveryCode?'<label>Código de recuperación<input type="password" readonly id="cloud-recovery-value"></label><p>Guarda tu código de recuperación en un lugar privado. Te permite elegir una clave nueva si olvidas la actual.</p>':'<p>Si necesitas recuperar tu clave, usa el código de recuperación de tu archivo guardado o pide ayuda al facilitador.</p>')+'<button type="button" id="cloud-reveal-key" aria-pressed="false">Mostrar mis códigos</button><div class="cloud-actions"><button id="cloud-copy-key">Copiar clave</button>'+(recoveryCode?'<button id="cloud-copy-recovery">Copiar recuperación</button>':'')+'<button id="cloud-download-key">Guardar mi acceso TXT</button><button id="cloud-continue">Continuar mi aventura →</button></div><p role="status" id="cloud-key-status"></p>');
    d.addEventListener('cancel', event => event.preventDefault());
    d.querySelector('#cloud-key-name').value = profile.name; d.querySelector('#cloud-key-value').value = key;
    if(recoveryCode)d.querySelector('#cloud-recovery-value').value = recoveryCode;
    d.querySelector('#cloud-reveal-key').onclick = event => { const show = event.currentTarget.getAttribute('aria-pressed') !== 'true'; d.querySelectorAll('input[type=password],input[data-secret]').forEach(input => {input.dataset.secret='true';input.type=show?'text':'password';});event.currentTarget.setAttribute('aria-pressed',String(show));event.currentTarget.textContent=show?'Ocultar mis códigos':'Mostrar mis códigos'; };
    function copyCode(value,selector,message) {return async () => {try {await navigator.clipboard.writeText(value);d.querySelector('#cloud-key-status').textContent=message;}catch {const input=d.querySelector(selector);input.type='text';input.dataset.secret='true';input.focus();input.select();d.querySelector('#cloud-reveal-key').setAttribute('aria-pressed','true');d.querySelector('#cloud-reveal-key').textContent='Ocultar mis códigos';d.querySelector('#cloud-key-status').textContent='No se pudo copiar automáticamente. El código está visible y seleccionado para que lo copies.';}};}
    d.querySelector('#cloud-copy-key').onclick = copyCode(key,'#cloud-key-value','Clave copiada.');
    d.querySelector('#cloud-copy-recovery')?.addEventListener('click',copyCode(recoveryCode,'#cloud-recovery-value','Código de recuperación copiado.'));
    d.querySelector('#cloud-download-key').onclick = () => {
      const url = URL.createObjectURL(new Blob(['LUDARIA\nNombre: ' + profile.name + '\nClave personal elegida: ' + key + (recoveryCode?'\nCódigo de recuperación: '+recoveryCode:'')+'\nAcceso personal: no compartir.'], { type: 'text/plain' }));
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
    async registerCharacter(data, requestId) {
      if (data.key !== data.keyConfirm) throw Error('Las claves no coinciden. Escríbelas otra vez.');
      const result = await rpc({action: 'registrar', data: {...data, mission: config.route}, requestId});
      identityKey = result.key || data.key; identityBackup = result.recoveryCode || '';
      adopt(result); keyReceipt(identityKey, identityBackup); return result;
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
      #cloud-error:not(:empty){font-size:13px;color:#f1c481;padding:10px;background:#372c1760;border-radius:8px}
      @media(max-width:620px){.ludaria-welcome{width:calc(100% - 20px);max-height:calc(100dvh - 20px);border-radius:16px}.cloud-welcome-grid{display:block;min-height:0}.cloud-guardian{display:flex;align-items:center;border-right:0;border-bottom:1px solid #b6965438;padding:16px;gap:16px}.cloud-portrait{width:94px;flex:0 0 94px;border:1px solid #b69654;border-radius:50%}.cloud-guardian-copy{padding:0;background:none}.cloud-guardian-copy p,.cloud-guardian-seal{display:none}.ludaria-welcome .cloud-guardian h2{font-size:23px;margin:7px 0}.cloud-guardian .cloud-eyebrow{font-size:8px;letter-spacing:1px}.cloud-access{padding:22px}.cloud-access h3{font-size:26px}.cloud-key-pair{gap:10px}}
      @media(prefers-reduced-motion:reduce){.ludaria-welcome::backdrop{backdrop-filter:none}}
    `;
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
    bar.querySelector('[data-cloud-access]')?.addEventListener('click',() => {if(profile&&identityKey)keyReceipt(identityKey,identityBackup,{review:true});else if(profile)dialog('Mi personaje', '<p>Estás conectado como <strong>'+esc(profile.name)+'</strong>.</p><p>Tu clave no se conserva en este navegador. Puedes consultarla en tu archivo de acceso.</p><button onclick="this.closest(\'dialog\').close()">Volver a mi aventura</button>');});
    bar.querySelector('[data-cloud-advantage]')?.addEventListener('click', advantage);
    bar.querySelector('[data-cloud-logout]').onclick = window.LudariaCloud.logout;
    if (config.route === 'forja' && !config.market && document.getElementById('create-form')) {
      bar.hidden = true; ready.then(() => { bar.hidden = false; });
    }
    const saved = previousSession();
    if (saved) {
      access = saved.access; stateText('Recuperando tu personaje…');
      rpc({action:'cargarInicio',access,data:{mission:config.route}}).then(result => {adopt(result);finishWelcome();}).catch(error => {
        forgetSession(); access = null;
        stateText('Vuelve a cargar tu personaje · '+error.message);
        if (!(config.route === 'forja' && !config.market && document.getElementById('create-form'))) welcome();
      });
    } else if (!(config.route === 'forja' && !config.market && document.getElementById('create-form'))) welcome();
  });
})();
