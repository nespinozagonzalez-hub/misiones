/** Presentación del acceso: conserva formularios, eventos y conexión existentes. */
(() => {
  'use strict';
  const config=window.LUDARIA_CLOUD_CONFIG;
  if(!config || window.LUDARIA_ACCESS_SCENERY)return;
  const scenes={forja:'../forja/assets/bosque.webp','pergaminos-dispersos':'assets/paisaje.webp','senda-ejemplos':'assets/bosque.webp','claro-debate':'assets/claro.webp','vetas-diseno':'assets/cantera.webp','tallado-mecanicas':'assets/taller.webp','gema-motivacional':'assets/gema.webp','planos-arquitecto':'assets/forja.webp',yunque:'assets/forja.webp','templado-pares':'assets/forja.webp','reflejo-diseno':'assets/santuario.webp','pulido-prototipo':'assets/santuario.webp','espejo-compartido':'assets/santuario.webp','defensa-orbe':'assets/paisaje.webp'};
  if(!scenes[config.route])return;
  window.LUDARIA_ACCESS_SCENERY=true;
  const routes=Object.keys(scenes),index=routes.indexOf(config.route),forja=config.route==='forja';
  const mission=window.LudariaRPG?.find(config.route);
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../ludaria/access-scenery.css?v=20261026-ayudas1',document.baseURI);document.head.append(css);
  const aid=document.createElement('script');aid.src=new URL('../ludaria/guardian-aid.js?v=20261026-ayudas1',document.baseURI);document.head.append(aid);
  const esc=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function polish(d){
    if(config.market)return;
    if(d.dataset.accessScenery || !d.querySelector('#cloud-login'))return;
    d.dataset.accessScenery=config.route;
    d.classList.add('ludaria-welcome','ludaria-access-scene');
    d.style.setProperty('--access-landscape','url("'+new URL(scenes[config.route],document.baseURI).href+'")');
    const title=mission?.guardian || d.querySelector('h2')?.textContent || 'Guardián de Ludaria';
    if(!d.querySelector('.cloud-welcome-grid')){
      const grid=document.createElement('div');grid.className='cloud-welcome-grid';
      grid.innerHTML='<aside class="cloud-guardian"><div class="cloud-portrait" role="img" aria-label="Retrato de '+esc(title)+'"></div><div class="cloud-guardian-copy"><span class="cloud-eyebrow">BUSCADORES DE LA GAMIFICACIÓN PERDIDA</span><h2>'+esc(title)+'</h2><p>'+esc(mission?.purpose)+'</p></div></aside><section class="cloud-access"><div class="cloud-access-intro"><span class="cloud-eyebrow">LUDARIA · EL UMBRAL DEL BUSCADOR</span><h3></h3><p></p></div></section>';
      const panel=grid.querySelector('.cloud-access');
      d.querySelectorAll('form').forEach(f=>{f.hidden=f.id!=='cloud-login';panel.append(f);});
      const error=d.querySelector('#cloud-error');if(error)panel.append(error);
      const back=[...d.querySelectorAll('button')].find(b=>b.textContent==='Volver a la Forja');if(back)panel.append(back);
      d.replaceChildren(grid);
    }
    d.querySelector('.cloud-access-tabs')?.remove();
    const register=d.querySelector('#cloud-register');if(register)register.hidden=true;
    const portrait=d.querySelector('.cloud-portrait');
    portrait.style.backgroundPosition=(index%4/3*100)+'% '+(Math.floor(index/4)/3*100)+'%';
    d.querySelector('.cloud-access-intro h3').textContent=forja?'Carga tu personaje':mission?.name || 'Tu siguiente misión';
    d.querySelector('.cloud-access-intro p').textContent=forja?'Vuelve a tu historia con el nombre y el código que creaste en la Forja.':'El guardián te espera. Identifícate con el mismo nombre y código que creaste en la Forja.';
    const login=d.querySelector('#cloud-login');
    for(const [name,label]of [['name','Nombre de tu personaje'],['key','Código de identificación']]){
      const input=login.elements[name],wrapper=input?.closest('label');
      if(wrapper?.firstChild?.nodeType===3)wrapper.firstChild.textContent=label;
      if(input)input.placeholder=name==='name'?'El nombre que elegiste':'Tu código personal';
    }
    const submit=login.querySelector('[type=submit],button');submit.classList.add('cloud-primary');submit.textContent=forja?'Cargar mi personaje':'Entrar a la misión →';
    if(forja){
      d.querySelector('[data-access-panel=recover]')?.remove();
      const recovery=d.querySelector('#cloud-recover');if(recovery)recovery.hidden=true;
    }
    if(!d.querySelector('.cloud-access-note')){const note=document.createElement('p');note.className='cloud-access-note';note.textContent='Un personaje. Una historia. El mismo acceso durante todo el viaje.';d.querySelector('.cloud-access').append(note);}
    if(d.open && !d.contains(document.activeElement))login.elements.name.focus({preventScroll:true});
  }
  const root=document,scan=()=>root.querySelectorAll('.ludaria-cloud-dialog').forEach(polish);
  const observer=new MutationObserver(scan);observer.observe(root.body,{childList:true,subtree:true});window.addEventListener('pagehide',()=>observer.disconnect());scan();
})();
