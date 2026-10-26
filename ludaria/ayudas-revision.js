/** Revisión visual sin cuenta: no realiza solicitudes ni escrituras. */
(() => {
  'use strict';
  const selected = new URLSearchParams(location.search).get('mision');
  const mission = LudariaRPG.find(selected) || LudariaRPG.find('gema-motivacional');
  window.LUDARIA_CLOUD_CONFIG = {route:mission.slug};
  const select = document.getElementById('review-mission');
  for (const item of LudariaRPG.missions) { const option = new Option(item.name, item.slug); select.add(option); }
  select.value = mission.slug;
  select.onchange = () => { location.search = '?mision=' + encodeURIComponent(select.value); };
  const profile = {name:'Buscador de muestra',class:'Kael',points:0,xp:0,skills:{}};
  function skills() { for (const key of Object.keys(LudariaRPG.attributes)) profile.skills[key] = Number(document.getElementById('review-level').value); }
  skills();
  window.LudariaCloud = {active:true,profile,ready:Promise.resolve(),registerPendingCheck(){},notify(){},async api(action,data) {
    if (action === 'catalogoRpg') return {...mission,skills:profile.skills,perks:mission.perks.map(p=>({...p,available:profile.skills[p.attribute]>=p.minimum})),responses:{},capabilities:{omitAdvantage:false}};
    if (action === 'ventaja') { const perk = mission.perks.find(p=>p.id===data.id); if (!perk || profile.skills[perk.attribute] < perk.minimum) throw Error('Ayuda por desbloquear. Mejora tu atributo con Mochi.'); return {perk,text:perk.text,catalog:{responses:{}}}; }
    if (action === 'accionRpg' && data.type === 'entrada') return {};
    throw Error('Vista de revisión: las decisiones no se guardan.');
  }};
  document.getElementById('review-level').onchange = () => {skills();dispatchEvent(new Event('ludaria:profile'));};
  document.getElementById('review-hero').onchange = e => {profile.class=e.target.value;};
  document.getElementById('review-next').onclick = () => {const counter=document.getElementById('page-count');counter.textContent=({'1 / 12':'5 / 12','5 / 12':'9 / 12','9 / 12':'1 / 12'})[counter.textContent];document.querySelector('#stage .scene-content').replaceChildren();};
  document.querySelector('[data-cloud-advantage]').onclick = () => window.LudariaRPGUI.open();
  document.getElementById('review-loading').onclick = () => {
    const opener=document.activeElement,preview=document.createElement('dialog');preview.id='cloud-session-preview';preview.className='cloud-loading-screen';preview.setAttribute('aria-label','Vista de la ventana de carga');
    preview.innerHTML='<div class="cloud-loading-card"><img alt="" width="100" height="100"><span class="cloud-eyebrow">EL MERCADITO DE MOCHI</span><h2>Tu aventura continúa, Buscador</h2><p>Recuperando tus atributos y tu progreso…</p><div class="cloud-loading-track" aria-hidden="true"><span></span></div><p class="review-loading-note">Vista de revisión: no se está recuperando ninguna cuenta.</p><button class="review-loading-close" type="button">Volver a las ayudas</button></div>';
    preview.querySelector('img').src=new URL('../forja/assets/'+profile.class.toLowerCase()+'.webp',document.baseURI).href;
    preview.querySelector('button').onclick=()=>preview.close();preview.addEventListener('close',()=>{preview.remove();opener.focus();});document.body.append(preview);preview.showModal();preview.querySelector('button').focus();
  };
})();
