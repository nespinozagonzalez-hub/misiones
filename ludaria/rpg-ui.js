/** Interacciones RPG. Solo se activan dentro de la aplicación central autenticada. */
(() => {
'use strict';
let cloud,route;
// Solo memoria de esta página: nunca se comparte identidad o respuestas entre iframes.
const drafts=new Map();
const pendingDraft=id=>{const draft=drafts.get(id);return draft&&(draft.saving||JSON.stringify(draft.data)!==draft.confirmed)?draft:null;};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function close(d){d.close();d.remove();}
function focusTitle(d){const heading=d.querySelector('h2');heading.tabIndex=-1;heading.focus();}
function modal(title,html){const opener=document.activeElement;const d=document.createElement('dialog');d.className='ludaria-cloud-dialog';d.innerHTML='<h2>'+esc(title)+'</h2>'+html;d.setAttribute('aria-label',title);document.body.append(d);d.addEventListener('close',()=>{d.remove();if(!document.querySelector('dialog[open]')&&opener?.isConnected)opener.focus();});d.showModal();return d;}
function showPending(id){const draft=pendingDraft(id);if(!draft)return;const d=modal('Tu ensayo pendiente','<p>Este texto sigue sin confirmar. Puedes conservar una copia aunque la ayuda no esté disponible ahora.</p><label>Ruta elegida<input data-rpg-draft-choice readonly></label><label>Mi ensayo<textarea data-rpg-draft-work readonly rows="5"></textarea></label><label>Mi motivo<textarea data-rpg-draft-reflection readonly rows="3"></textarea></label><button data-rpg-download>Guardar ensayo TXT</button><button data-rpg-close>Volver a mi recorrido</button>');
 d.querySelector('[data-rpg-draft-choice]').value=draft.data.choice;d.querySelector('[data-rpg-draft-work]').value=draft.data.work;d.querySelector('[data-rpg-draft-reflection]').value=draft.data.reflection;
 d.querySelector('[data-rpg-close]').onclick=()=>close(d);d.querySelector('[data-rpg-download]').onclick=()=>{const url=URL.createObjectURL(new Blob(['LUDARIA · ENSAYO SIN CONFIRMAR\nMisión: '+route+'\nRuta: '+draft.data.choice+'\n\nEnsayo:\n'+draft.data.work+'\n\nMotivo:\n'+draft.data.reflection],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='Ludaria-ensayo-pendiente.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);};focusTitle(d);
}
async function openPerk(id){
 const d=modal('El guardián abre su cuaderno','<p role="status">Consultando tus posibilidades…</p><button data-rpg-close>Volver</button>');d.querySelector('[data-rpg-close]').onclick=()=>close(d);
 try{
  const r=await cloud.api('ventaja',{id,mission:route});if(!d.isConnected||!d.open)return;const p=r.perk;
  const c=await cloud.api('catalogoRpg',{mission:route}),old=c.responses[id]||{};
  if(!d.isConnected||!d.open)return;
  d.setAttribute('aria-label',p.name);d.innerHTML='<h2>'+esc(p.name)+'</h2><p class="rpg-threshold">'+esc(LudariaRPG.attributes[p.attribute])+' '+p.minimum+' · '+esc(LudariaRPG.find(route)?.name||'Ludaria')+'</p><p>'+esc(r.text)+'</p>'+
    (p.kind==='accion'?'<form data-rpg-form><label>Ruta elegida<select name="choice" required><option value="">Elige cómo abordar el desafío</option>'+p.options.map(x=>'<option>'+esc(x)+'</option>').join('')+'</select></label><label>Mi ensayo o decisión<textarea name="work" maxlength="6000" rows="5"></textarea></label><label>¿Qué te llevó a elegir esta ruta? <small>Opcional</small><textarea name="reflection" maxlength="2000" rows="3"></textarea></label><button type="submit">Conservar esta decisión</button><p role="status" data-rpg-status></p></form>':'')+
    '<p class="rpg-note">Esta posibilidad amplía tu práctica. Las actividades y criterios de la misión se conservan.</p><button data-rpg-close>Continuar mi misión</button>';
  d.querySelector('[data-rpg-close]').onclick=()=>close(d);
  const f=d.querySelector('form');if(f){
   const initial={type:'decision',mission:route,id,choice:old.choice||'',work:old.work||'',reflection:old.reflection||'',expectedEventId:c.responseRevisions?.[id]||null};
   const draft=pendingDraft(id)||{data:initial,confirmed:JSON.stringify(initial),requestId:crypto.randomUUID(),signature:'',saving:false};
   drafts.set(id,draft);f.elements.choice.value=draft.data.choice;f.elements.work.value=draft.data.work;f.elements.reflection.value=draft.data.reflection;
   const compare=document.createElement('button');compare.type='button';compare.textContent='Comparar con la decisión confirmada';compare.dataset.rpgCompare='';f.append(compare);
   compare.onclick=async()=>{compare.disabled=true;try{const latest=await cloud.api('catalogoRpg',{mission:route});if(!d.isConnected||!d.open)return;const saved=latest.responses[id]||{},version=latest.responseRevisions?.[id]||null;const view=modal('La decisión confirmada','<p>Compara este registro con tu ensayo pendiente antes de volver a guardarlo.</p><label>Ruta confirmada<input data-rpg-current-choice readonly></label><label>Ensayo confirmado<textarea data-rpg-current-work readonly rows="5"></textarea></label><label>Motivo confirmado<textarea data-rpg-current-reflection readonly rows="3"></textarea></label><button data-rpg-rebase>Retomar mi ensayo tras comparar</button><button data-rpg-close>Volver sin cambiar mi ensayo</button>');view.querySelector('[data-rpg-current-choice]').value=saved.choice||'';view.querySelector('[data-rpg-current-work]').value=saved.work||'';view.querySelector('[data-rpg-current-reflection]').value=saved.reflection||'';view.querySelector('[data-rpg-close]').onclick=()=>close(view);view.querySelector('[data-rpg-rebase]').onclick=()=>{if(draft.saving)return;draft.data.expectedEventId=version;draft.requestId=crypto.randomUUID();draft.signature='';f.querySelector('[data-rpg-status]').textContent='Comparación realizada. Tu ensayo sigue pendiente; confirma cuando esté listo.';close(view);};focusTitle(view);}catch(error){f.querySelector('[data-rpg-status]').textContent=error.message;}finally{compare.disabled=false;}};
   const capture=()=>{draft.data={type:'decision',mission:route,id,choice:f.elements.choice.value,work:f.elements.work.value,reflection:f.elements.reflection.value,expectedEventId:draft.data.expectedEventId};};
   f.addEventListener('input',capture);f.addEventListener('change',capture);
   d.addEventListener('close',()=>{capture();if(JSON.stringify(draft.data)!==draft.confirmed||draft.saving)cloud.notify('Hay un ensayo sin confirmar. Reabre la ayuda del guardián para retomarlo.');});
   f.onsubmit=async e=>{e.preventDefault();if(draft.saving)return;capture();const data={...draft.data},signature=JSON.stringify(data);if(draft.signature&&draft.signature!==signature)draft.requestId=crypto.randomUUID();draft.signature=signature;const requestId=draft.requestId;
    const button=f.querySelector('button'),status=f.querySelector('[data-rpg-status]');button.disabled=true;draft.saving=true;status.textContent='Conservando tu decisión…';
    try{const result=await cloud.api('accionRpg',data,requestId);const unchanged=JSON.stringify(draft.data)===signature;draft.data.expectedEventId=result.event;draft.confirmed=JSON.stringify({...data,expectedEventId:result.event});status.textContent=unchanged?'Decisión confirmada en tu bitácora.':'Decisión confirmada; los cambios posteriores siguen pendientes.';}catch(error){status.textContent='Sin confirmar: '+error.message+' Tu texto permanece aquí y al reabrir esta ayuda.';}finally{draft.saving=false;button.disabled=false;}
   };
  }
  focusTitle(d);
 }catch(error){if(d.isConnected){d.querySelector('p').textContent=error.message;if(pendingDraft(id)){const b=document.createElement('button');b.textContent='Conservar mi ensayo pendiente';b.onclick=()=>{close(d);showPending(id);};d.querySelector('p').after(b);}}}
}
async function open(){
 const d=modal('El cuaderno del guardián','<p role="status">Revisando tus atributos actuales…</p><button data-rpg-close>Volver</button>');d.querySelector('button').onclick=()=>close(d);
 try{const r=await cloud.api('catalogoRpg',{mission:route});if(!d.isConnected||!d.open)return;d.innerHTML='<h2>'+esc(r.guardian)+'</h2><p>'+esc(r.purpose)+'</p><p>Estas posibilidades dependen de tus atributos actuales. Puedes consultar el catálogo completo con Mochi.</p><div class="rpg-perks">'+r.perks.map(p=>'<article><h3>'+esc(p.name)+'</h3><p>'+esc(LudariaRPG.attributes[p.attribute])+' '+r.skills[p.attribute]+' / umbral '+p.minimum+'</p><button data-rpg-open="'+esc(p.id)+'" '+(p.available?'':'disabled')+'>'+(p.available?(p.kind==='accion'?'Ensayar una ruta diferente':'Consultar apoyo'):'Disponible con '+esc(LudariaRPG.attributes[p.attribute])+' '+p.minimum)+'</button>'+(pendingDraft(p.id)?'<button data-rpg-recover="'+esc(p.id)+'">Conservar mi ensayo pendiente</button>':'')+'</article>').join('')+'</div>'+
  (!r.perks.length?'<p>Este umbral abre tu aventura. Tu registro inicial se conserva con el protocolo de diagnóstico previsto.</p>':'')+
  (r.egg?'<button class="rpg-seal" data-rpg-egg="'+esc(r.egg.id)+'" aria-label="Examinar el sello del guardián">◇ Examinar el sello del guardián</button>':'')+'<button data-rpg-close>Volver a mi recorrido</button>';
  d.querySelector('[data-rpg-close]').onclick=()=>close(d);d.querySelectorAll('[data-rpg-open]').forEach(b=>b.onclick=()=>{close(d);openPerk(b.dataset.rpgOpen);});
  d.querySelectorAll('[data-rpg-recover]').forEach(b=>b.onclick=()=>{close(d);showPending(b.dataset.rpgRecover);});
  d.querySelector('[data-rpg-egg]')?.addEventListener('click',async e=>{const b=e.currentTarget;b.disabled=true;try{const x=await cloud.api('accionRpg',{type:'easter',mission:route,id:b.dataset.rpgEgg});const note=document.createElement('p');note.className='rpg-lore';note.textContent=x.name+' · '+x.text;b.after(note);b.textContent='Sello descubierto · sin coste ni puntos';}catch(error){b.disabled=false;b.textContent='Volver a examinar · '+error.message;}});
  focusTitle(d);
 }catch(error){if(d.isConnected)d.querySelector('p').textContent=error.message;}
}
window.LudariaRPGUI={open,openPerk};
document.addEventListener('DOMContentLoaded',async()=>{
 if(!window.LudariaCloud?.active)return;cloud=window.LudariaCloud;route=window.LUDARIA_CLOUD_CONFIG.route;
 cloud.registerPendingCheck(()=>[...drafts.values()].some(draft=>draft.saving||JSON.stringify(draft.data)!==draft.confirmed));
 const style=document.createElement('style');style.textContent='.rpg-perks{display:grid;gap:12px;margin:18px 0}.rpg-perks article{padding:14px;border:1px solid #365b43;border-radius:12px;background:#0b1811}.rpg-perks h3{font:22px Georgia;color:#c9a66b;margin:0}.ludaria-cloud-dialog textarea{width:100%;box-sizing:border-box;background:#07120d;color:#f2ebdd;border:1px solid #53735d;border-radius:8px;padding:12px;font:inherit}.rpg-threshold,.rpg-note{font-size:14px;color:#8ed89a}.rpg-seal{margin:12px 0}.rpg-lore{border-left:3px solid #c9a66b;padding:12px;background:#0b1811}';document.head.append(style);
 await cloud.ready;
 // Consulta/entrada y borradores son evidencias distintas; no otorgan recompensas.
 try{await cloud.api('accionRpg',{type:'entrada',mission:route,market:window.LUDARIA_CLOUD_CONFIG.market===true});}catch(error){cloud.notify('El registro de entrada está sin confirmar. '+error.message);}
});
})();
