/** La Forja conserva su bienvenida y sus tarjetas; el acceso es secundario. */
(() => {
  'use strict';
  const cloud = window.LudariaCloud;
  const form = document.getElementById('create-form');
  if (!cloud?.active || !form || window.FORJA_ENTRY) return;
  const access = document.getElementById('creation-access');
  const status = document.getElementById('creation-status');
  access.hidden = false;
  for (const name of ['key', 'keyConfirm']) form.elements[name].required = true;
  let legacyDialog = null, welcomeObserver = null, busy = false, requestId = crypto.randomUUID(), signature = '';
  function preserveWelcome() {
    if (cloud.openAccess || cloud.profile) return;
    const d = document.querySelector('.ludaria-cloud-dialog[open]');
    if (!d || !d.querySelector('#cloud-login')) return;
    legacyDialog = d; welcomeObserver?.disconnect();
    // Compatibilidad con la implementación anterior: conserva sus manejadores
    // de acceso y quita únicamente la barrera modal delante de la Forja.
    d.addEventListener('close', e => {if(!cloud.profile){e.stopImmediatePropagation();d.hidden=true;}}, {capture:true});
    const back=document.createElement('button');back.type='button';back.textContent='Volver a la Forja';back.onclick=()=>d.close();d.append(back);
    d.close(); d.hidden = true;
    document.querySelector('.ludaria-cloud-bar').hidden = true;
  }
  if (!cloud.openAccess) {
    welcomeObserver = new MutationObserver(preserveWelcome);
    welcomeObserver.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['open']});
  }
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', preserveWelcome);
  else preserveWelcome();
  cloud.ready.then(() => {
    welcomeObserver?.disconnect();
    document.querySelector('.ludaria-cloud-bar').hidden = false;
    form.reset();
  });
  document.querySelector('[data-action=resume]').addEventListener('click', () => {
    if (cloud.openAccess) cloud.openAccess();
    else if (legacyDialog) { legacyDialog.hidden = false; legacyDialog.showModal(); }
  });
  form.addEventListener('submit', async e => {
    e.preventDefault(); e.stopImmediatePropagation();
    if (busy) return;
    const data = {name:form.querySelector('#name').value.trim(), class:form.querySelector('[name=avatar]:checked')?.value,
      key:form.elements.key.value, keyConfirm:form.elements.keyConfirm.value};
    if (!data.name || !data.class) return;
    if (!/^\d{6}$/.test(data.key)) {status.textContent='Elige una clave de seis dígitos.';return;}
    if (data.key !== data.keyConfirm) {status.textContent='Las claves no coinciden. Escríbelas otra vez.';return;}
    if (!cloud.registerCharacter) {
      const old = legacyDialog?.querySelector('#cloud-register');
      if (!old?.elements.key || !old.elements.keyConfirm) {
        status.textContent='La Forja ya está restaurada. Falta actualizar la implementación existente de Apps Script para registrar tu clave elegida. Tu personaje aún no se ha creado.';
        return;
      }
      old.elements.name.value=data.name;old.elements.avatar.value=data.class;
      old.elements.key.value=data.key;old.elements.keyConfirm.value=data.keyConfirm;
      old.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
      const error=legacyDialog.querySelector('#cloud-error');
      status.textContent=error.textContent;
      new MutationObserver(() => {status.textContent=error.textContent;}).observe(error,{childList:true,subtree:true,characterData:true});
      return;
    }
    const next=JSON.stringify(data);if(signature&&signature!==next)requestId=crypto.randomUUID();signature=next;
    busy=true;const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='Forjando tu identidad…';
    try {await cloud.registerCharacter(data,requestId);status.textContent='Tu identidad está forjada. Guarda tu acceso para continuar.';}
    catch(error) {status.textContent=error.message;}
    finally {busy=false;button.disabled=false;}
  });
})();
