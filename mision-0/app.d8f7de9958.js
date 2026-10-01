(() => {
  'use strict';
  const KEY='ludaria_mision0_anexod_v1', model=window.LUDARIA_INSTRUMENT, config=window.LUDARIA_CONFIG;
  const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const titles=['El Llamado de la Aventura','Las Brumas del Olvido','Quienes cruzan el umbral','La ruta por Ludaria','El Libro de Stats','Códigos y colaboración','Forja tu personaje','El eco del Orbe','Nuestro punto de inicio','Tu registro inicial','La puerta de Ludaria','El Bosque nos espera'];
  const blank=()=>({page:0,visited:[0],question:0,name:'',area:'',answers:{q1:'',q2:'',q3:[],q3None:false,q4:'',q5:'',q6:'',q7:null,q8:''},introLock:false,payload:null,receipt:null});
  let state=blank(),busy=false,toastTimer,modalOpener;
  try {const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&saved.answers){state={...state,...saved,answers:{...state.answers,...saved.answers}};state.page=Math.min(11,Math.max(0,Number(state.page)||0));if(!state.receipt&&state.page===11)state.page=10;}}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  const answered=q=>q==='q3'?state.answers.q3.length>0||state.answers.q3None:q==='q7'?Number.isInteger(state.answers.q7)&&state.answers.q7>=1&&state.answers.q7<=5:typeof state.answers[q]==='string'&&state.answers[q].trim().length>0;
  const count=()=>model.questions.filter(q=>answered(q.id)).length;
  const goButton=(page,label,extra='')=>`<button class="button ${extra}" data-action="go" data-page="${page}">${label}</button>`;
  const intro=(eyebrow,title,lead)=>`<span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${lead?`<p class="lead">${lead}</p>`:''}`;
  const external=(url,label)=>`<a class="button" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true"> ↗</span></a>`;
  const sphere=()=>`<div class="orb-art" role="img" aria-label="El Orbe del Saber dividido en cuatro fragmentos"><div class="orb-ring"></div>${[0,1,2,3].map((n)=>`<i class="orb-piece orb-piece-${n}"></i>`).join('')}<span>ORBE DEL SABER</span></div>`;
  const locationData=[
    ['Bosque de los Conceptos','Archivista Théol','Sabiduría','Sesiones 2–4','Los Pergaminos Dispersos','Explorarás los conceptos y contrastarás ejemplos para construir una primera mirada.'],
    ['Cantera de los Elementos','Maestra Bryn','Maestría','Sesiones 5–7','Las Vetas del Diseño','Observarás cómo se organizan las experiencias y qué decisiones dan forma al recorrido.'],
    ['Forja del Arquitecto','Forjador Ondal','Creación','Sesiones 8–10','Los Planos del Arquitecto','Darás forma a una propuesta vinculada a tu propia práctica docente.'],
    ['Santuario del Espejo','Guardiana Mira','Evaluación','Sesiones 11–13','El Reflejo del Diseño','Revisarás tu propuesta, escucharás a tus pares y prepararás su presentación.']
  ];
  function pageContent(p) {
    if(p===0)return `<div class="cover-content"><span class="eyebrow">VALLE DE LOS ECOS · MISIÓN 0</span><h1>El Llamado<br>de la <em>Aventura</em></h1><p class="lead">Una travesía para diseñar experiencias de aprendizaje con sentido. El primer paso comienza con lo que ya traes contigo.</p><div class="actions">${goButton(1,'Escuchar el llamado')}${goButton(9,'Ir al diagnóstico','secondary')}</div><div class="cover-meta"><span class="small-line"></span><span>Tu historia comienza aquí</span></div></div><span class="media-note">LUDARIA · EL UMBRAL DE LA AVENTURA</span>`;
    if(p===1)return `<div class="split"><div>${intro('UN REINO ENTRE LA MEMORIA Y LA BRUMA','Algo se ha perdido.<br><em>Alguien debe buscarlo.</em>','Ludaria preservaba el conocimiento lúdico en el Orbe del Saber. Hasta que Lethon, el Devorador del Saber, extendió las Brumas del Olvido.')}<div class="steps"><div class="step"><span class="num">I</span><div><strong>Los pergaminos callan.</strong><p>Las letras se desvanecen y los mapas pierden sus caminos.</p></div></div><div class="step"><span class="num">II</span><div><strong>El Orbe se fragmenta.</strong><p>Cuatro piezas quedan dispersas en los rincones del reino.</p></div></div><div class="step"><span class="num">III</span><div><strong>El llamado llega hasta ti.</strong><p>Recorreremos Ludaria para reunir sus fragmentos antes que Lethon.</p></div></div></div></div>${sphere()}</div>`;
    if(p===2)return `<div class="split"><div>${intro('QUIENES CRUZAN EL UMBRAL','Toda aventura<br>comienza con <em>una voz.</em>','Registra cómo quieres que te identifiquemos y desde qué área docente te sumas.')}<div class="identity-fields"><label class="field">Nombre o alias<input data-field="name" type="text" maxlength="120" autocomplete="name" value="${esc(state.name)}" ${state.payload?'disabled':''}></label><label class="field">Asignatura o área docente<input data-field="area" type="text" maxlength="160" value="${esc(state.area)}" ${state.payload?'disabled':''}></label></div><p class="small-note">Esta identificación acompañará tu diagnóstico. No creamos tu personaje aquí: lo harás en la Forja.</p></div><div class="mentor"><p>Comparte con el grupo una experiencia de aula que te gustaría mejorar.</p><span class="mentor-signature">Una primera conversación · Camaradería</span></div></div>`;
    if(p===3)return `<div class="wide-content">${intro('CUATRO LOCACIONES · UN PROPÓSITO COMPARTIDO','Nuestra ruta<br>por <em>Ludaria.</em>','Cada tramo nos acercará a una pieza del Orbe. Abre cada locación para conocer a quien te acompañará.')}<div class="realm-map">${locationData.map((d,i)=>`<button class="realm-card realm-${i}" data-action="realm" data-index="${i}"><span class="realm-num">0${i+1}</span><span class="eyebrow">${d[3]}</span><strong>${d[0]}</strong><small>${d[1]}</small><span class="realm-thread" aria-hidden="true"></span></button>`).join('')}</div><div class="route-destination"><span>Inicio: Valle de los Ecos</span><span>Cierre: Bóveda del Orbe · Sesión 14</span></div></div>`;
    if(p===4)return `<div class="wide-content">${intro('EL LIBRO DE STATS','Cinco atributos.<br><em>Tu recorrido toma forma.</em>','Los atributos reflejan el avance de tu personaje. En esta apertura, Camaradería nos recuerda que viajamos juntos.')}<div class="attribute-grid">${['Sabiduría','Maestría','Creación','Evaluación','Camaradería'].map((x,i)=>`<button class="attribute-card ${i===4?'featured':''}" data-action="attribute" data-index="${i}"><span aria-hidden="true">${['I','II','III','IV','V'][i]}</span><strong>${x}</strong><small>${i===4?'Atributo de la apertura':'Abre para explorar'}</small></button>`).join('')}</div><p class="small-note">El Libro de Stats se gestiona en la herramienta del personaje. Este diagnóstico no otorga una calificación.</p></div>`;
    if(p===5)return `<div class="wide-content">${intro('CÓDIGOS, DECISIONES Y COLABORACIÓN','Aprender deja huellas.<br><em>Compartir abre caminos.</em>','Los Códigos del Saber registran tu avance por asistir, completar misiones y colaborar.')}<div class="three-column"><div class="panel"><span class="num">01</span><h3>Misiones</h3><p>Las principales organizan el recorrido. Las secundarias son oportunidades opcionales de exploración.</p></div><div class="panel"><span class="num">02</span><h3>Runas</h3><p>Canjea los códigos reales del programa en la herramienta existente para mejorar tus atributos.</p></div><div class="panel"><span class="num">03</span><h3>Mercadito</h3><p>Mochi atiende en el Valle de los Ecos. Allí se conectan tus decisiones y las mejoras del personaje.</p></div></div><div class="mentor"><p>El aprendizaje se observa en lo que produces; los códigos registran tu avance.</p></div></div>`;
    if(p===6)return `<div class="split"><div>${intro('PREPARA TU IDENTIDAD DE BUSCADOR','Forja tu personaje.<br><em>Elige tu presencia.</em>','Kael y Kira tienen mecánicas equivalentes. Tu elección cambia el avatar con el que vivirás la aventura.')}<div class="avatar-names"><div><span>KAEL</span><small>Buscador</small></div><div><span>KIRA</span><small>Buscadora</small></div></div><div class="actions">${config.forgeUrl?external(config.forgeUrl,'Abrir la Forja'):`<button class="button" data-action="forge-help">Cómo abrir la Forja</button>`}</div></div><div class="panel"><div class="steps"><div class="step"><span class="num">1</span><div><strong>Abre la Forja.</strong><p>Utiliza el acceso de creación del personaje en el Portal de la Aventura.</p></div></div><div class="step"><span class="num">2</span><div><strong>Elige Kael o Kira.</strong><p>Ambas opciones recorren las mismas misiones.</p></div></div><div class="step"><span class="num">3</span><div><strong>Registra y vuelve.</strong><p>Conserva tu personaje y regresa a esta presentación para completar el diagnóstico.</p></div></div></div></div></div>`;
    if(p===7)return `<div class="split"><div>${intro('UNA PRIMERA INTERACCIÓN','Escucha el eco.<br><em>Abre una pequeña puerta.</em>','Una práctica para familiarizarte con los candados de la aventura.')}<p class="phrase">Nuestra travesía busca restaurar el Orbe del <strong class="gold">Saber</strong>.</p><p class="lead">La inscripción deja una pista: <span class="rune-word">ORBE</span>.</p><p class="small-note">Puedes continuar sin resolver este candado. Su contraseña es local y no mejora atributos.</p></div><div class="lock-panel ${state.introLock?'solved':''}"><div class="lock-glyph" aria-hidden="true">${state.introLock?'✧':'◇'}</div><div class="lock-meta"><span class="eyebrow">CANDADO DEL UMBRAL</span><h3>${state.introLock?'El eco respondió.':'Una pista a la vista.'}</h3></div><p>${state.introLock?'Bienvenido al Valle de los Ecos.':'Escribe la palabra destacada para revelar un mensaje.'}</p><button class="button" data-action="intro-lock">${state.introLock?'Ver el mensaje':'Explorar el candado'}</button></div></div>`;
    if(p===8)return `<div class="split"><div>${intro('ANTES DE PARTIR','Tu punto de inicio<br><em>merece ser escuchado.</em>','El diagnóstico recoge tus conocimientos previos, experiencias y expectativas. Nos ayudará a ajustar el acompañamiento.')}<div class="actions">${goButton(9,'Abrir mi registro')}</div></div><div class="panel"><h3>Responde a tu ritmo.</h3><ul class="complete-list"><li>Ocho preguntas del instrumento inicial.</li><li>Respuestas individuales y con palabras propias.</li><li>Sin consultar lecturas ni buscar definiciones.</li><li>Si no lo sabes o no tienes experiencia, puedes indicarlo.</li><li>Sin nota, ranking ni feedback de acierto o error.</li></ul><p class="small-note">Tus respuestas se enviarán a Nicolás Espinoza, responsable del proyecto, para orientar el acompañamiento.</p></div></div>`;
    if(p===9)return diagnostic();
    if(p===10)return review();
    return `<div class="split"><div>${intro('EL UMBRAL ESTÁ ABIERTO','El Bosque<br><em>nos espera.</em>','Tu registro inicial fue recibido. Los Pergaminos Dispersos marcarán el comienzo del primer módulo.')}<div class="receipt-card"><span class="eyebrow">RECEPCIÓN CONFIRMADA</span><strong>${esc(state.name)}</strong><p>Ocho respuestas registradas · Anexo D</p><small>ID ${esc(state.receipt?.id)}</small></div><div class="actions">${external(config.portalUrl,'Entrar al Portal de la Aventura')}<button class="button secondary" data-action="notebook">Ver mi registro</button></div><p class="small-note">El facilitador compartirá la lectura previa y el mini-código real por asistencia.${config.attendanceCode?' Código: '+esc(config.attendanceCode)+'.':''}</p></div>${sphere()}</div>`;
  }
  function diagnostic() {
    const q=model.questions[state.question];
    const locked=!!state.payload, a=state.answers;
    let field='';
    if(q.type==='text')field=`<textarea id="answer" data-answer="${q.id}" maxlength="2000" aria-label="${esc(q.label)}" placeholder="Escribe con tus palabras. Puedes indicar que no lo sabes o que no tienes experiencia." ${locked?'disabled':''}>${esc(a[q.id])}</textarea><p class="small-note">Hasta 2000 caracteres. Tu respuesta permanece sin calificar.</p>`;
    if(q.type==='multiple')field=`<fieldset class="element-choices"><legend class="sr-only">Elementos que conoce</legend>${model.elements.map(x=>`<label class="element-choice"><input type="checkbox" data-element="${x}" ${a.q3.includes(x)?'checked':''} ${locked?'disabled':''}><span>${x[0].toUpperCase()+x.slice(1)}</span></label>`).join('')}<label class="element-choice none-choice"><input type="checkbox" data-none ${a.q3None?'checked':''} ${locked?'disabled':''}><span>No conozco ninguno de los elementos de la lista</span></label></fieldset><p class="small-note">Puedes marcar varios elementos. Si no conoces ninguno, indícalo en la última opción.</p>`;
    if(q.type==='scale')field=`<fieldset class="scale-choices"><legend class="sr-only">Comodidad de 1 a 5</legend>${[1,2,3,4,5].map(n=>`<label class="scale-choice"><input type="radio" name="comfort" data-scale="${n}" value="${n}" ${a.q7===n?'checked':''} ${locked?'disabled':''}><span>${n}</span></label>`).join('')}</fieldset><div class="scale-labels"><span>Menor comodidad</span><span>Mayor comodidad</span></div>`;
    return `<div class="diagnostic-layout"><aside class="diagnostic-sidebar"><span class="eyebrow">TU REGISTRO INICIAL</span><h2>Ocho voces.<br><em>Tu primera huella.</em></h2><p>${count()} de 8 preguntas respondidas.</p><div class="question-progress" aria-hidden="true"><span style="width:${count()/8*100}%"></span></div><nav class="question-tabs" aria-label="Preguntas del diagnóstico">${model.questions.map((x,i)=>`<button data-action="question" data-index="${i}" class="${i===state.question?'active':''} ${answered(x.id)?'answered':''}" aria-label="Pregunta ${i+1}${answered(x.id)?', respondida':''}" aria-current="${i===state.question?'step':'false'}">${i+1}</button>`).join('')}</nav><p class="small-note">El progreso indica respuestas registradas, sin valorar su contenido.</p><button class="quiet gold" data-action="go" data-page="2">${esc(state.name||'Añadir mi identificación')}</button>${locked?'<p class="small-note">Este registro está listo para confirmar. Se conserva igual al reintentar.</p>':''}</aside><section class="question-card" aria-labelledby="question-title"><span class="eyebrow">PREGUNTA ${state.question+1} / 8</span><h3 id="question-title">${esc(q.label)}</h3>${field}<div class="actions">${state.question>0?`<button class="button secondary" data-action="question" data-index="${state.question-1}">Anterior</button>`:''}${state.question<7?`<button class="button" data-action="question-next">Guardar y seguir</button>`:goButton(10,'Revisar mi registro')}</div></section></div>`;
  }
  function review() {
    const done=count()===8&&state.name.trim()&&state.area.trim();
    const configured=window.LudariaTransport.validUrl(config.receiverUrl);
    const receipt=state.receipt;
    return `<div class="wide-content review-layout">${intro('LA PUERTA DE LUDARIA','Tu primera huella.<br><em>Una puerta por abrir.</em>',receipt?'La hoja confirmó la recepción de tu diagnóstico. Tu entrada está preparada.':'Revisa tu registro y envíalo para abrir la entrada al recorrido.')}<div class="review-grid"><div><div class="identity-review"><strong>${esc(state.name||'Falta tu nombre o alias')}</strong><span>${esc(state.area||'Falta tu área docente')}</span></div><div class="answer-review">${model.questions.map((q,i)=>`<details><summary><span>${i+1}</span>${esc(q.label)}<small>${answered(q.id)?'Respondida':'Pendiente'}</small></summary><p>${esc(q.id==='q3'?(state.answers.q3None?'Ninguno de los elementos de la lista':state.answers.q3.join(', ')):state.answers[q.id]??'')||'Aún sin respuesta.'}</p>${goButton(9,'Revisar esta pregunta','secondary') .replace('data-page="9"',`data-page="9" data-question="${i}"`)}</details>`).join('')}</div></div><aside class="door-panel ${receipt?'opened':''}"><div class="door-symbol" aria-hidden="true"><span></span></div><span class="eyebrow">DIAGNÓSTICO INICIAL</span><h3>${receipt?'La puerta está abierta.':`${count()} de 8 respuestas`}</h3><p>${receipt?'Tu registro fue recibido por la hoja del proyecto.':'Completar las ocho preguntas y enviarlas abre este umbral.'}</p>${receipt?goButton(11,'Cruzar el umbral'):`<button class="button" data-action="send" ${!done||!configured||busy?'disabled':''}>${busy?'Esperando confirmación…':state.payload?'Reintentar el mismo envío':'Enviar y abrir la puerta'}</button>`}<div id="send-status" class="small-note" role="status">${!configured?'Recepción en preparación. El docente activará la conexión antes de aplicar el diagnóstico.':!done?'Completa tu identificación y las preguntas pendientes.':busy?'Tus respuestas están en camino. Esperamos el recibo de la hoja.':receipt?'Recepción confirmada.':'Tus respuestas llegarán a Nicolás Espinoza para orientar el acompañamiento.'}</div>${!receipt&&state.payload&&!busy?'<button class="quiet gold" data-action="confirm">Comprobar recepción</button>':''}<button class="quiet gold" data-action="notebook">Ver o copiar mi registro</button></aside></div></div>`;
  }
  function render(focus=true) {
    document.body.dataset.scene=[0,1,3,6,11].includes(state.page)?'valle':'archive';
    $('#stage').innerHTML=pageContent(state.page);
    $('#page-count').textContent=`${String(state.page+1).padStart(2,'0')} / 12`;
    $('#route-dots').innerHTML=titles.map((x,i)=>`<button class="route-dot ${state.visited.includes(i)?'visited':''} ${state.page===i?'current':''}" data-action="go" data-page="${i}" aria-label="${i+1}. ${x}" ${i===11&&!state.receipt?'disabled':''}></button>`).join('');
    $('#previous').disabled=state.page===0||busy;
    $('#next').disabled=busy||(state.page===10&&!state.receipt)||(state.page===11);
    $('#next-label').textContent=state.page===0?'Entrar':state.page===9?'Revisar':state.page===10?'Cruzar el umbral':state.page===11?'Recorrido preparado':'Siguiente';
    updateStatus();save();if(focus)$('#stage').focus({preventScroll:true});
  }
  function updateStatus() {
    $('#seal-status').innerHTML=`<button class="seal-dot ${state.visited.length>1?'solved':''}" data-action="map" aria-label="Explorar el recorrido">I</button><button class="seal-dot ${count()===8?'solved':''}" data-action="go" data-page="9" aria-label="Registro inicial: ${count()} de 8 preguntas">II</button><button class="seal-dot ${state.receipt?'solved':''}" data-action="go" data-page="10" aria-label="Puerta: ${state.receipt?'abierta':'pendiente de recepción'}">III</button>`;
  }
  function go(page,question) {
    if(busy){toast('Espera la confirmación del envío.');return;}
    if(page===11&&!state.receipt){toast('Envía el diagnóstico y espera la recepción para abrir la puerta.');page=10;}
    state.page=page;if(question!==undefined)state.question=question;if(!state.visited.includes(page))state.visited.push(page);
    if($('#modal').open)$('#modal').close();
    render();history.replaceState(null,'',`#pantalla-${page+1}`);window.scrollTo({top:0,behavior:'instant'});
  }
  function toast(message) {$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4500);}
  function modal(title,html) {
    if(!$('#modal').open)modalOpener=document.activeElement;
    $('#modal-body').innerHTML=`<h2 id="modal-title">${title}</h2>${html}`;
    if(!$('#modal').open)$('#modal').showModal();
    $('#modal [data-action="close"]').focus();
  }
  function recordText() {
    return ['BUSCADORES DE LA GAMIFICACIÓN PERDIDA','Misión 0: El Llamado de la Aventura','Instrumento: Anexo D · '+model.version,'Nombre o alias: '+state.name,'Área docente: '+state.area,'Estado: '+(state.receipt?'Recepción confirmada · '+state.receipt.id:'Borrador / envío no confirmado'),'',...model.questions.flatMap((q,i)=>[(i+1)+'. '+q.label,q.id==='q3'?(state.answers.q3None?'Ninguno de los elementos de la lista':state.answers.q3.join(', ')):String(state.answers[q.id]??''),''])].join('\n');
  }
  function notebook() {modal('Tu registro inicial',`<p>Conserva una copia de tus respuestas. El borrador se guarda en este navegador cuando el almacenamiento está disponible.</p><textarea id="record-text" readonly aria-label="Registro completo">${esc(recordText())}</textarea><div class="actions"><button class="button" data-action="copy-record">Copiar registro</button><button class="button secondary" data-action="download">Preparar archivo TXT</button></div>`);}
  function payload() {
    const bytes=crypto.getRandomValues(new Uint8Array(32));
    return {version:model.version,id:crypto.randomUUID(),receiptToken:Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''),name:state.name.trim(),area:state.area.trim(),answers:JSON.parse(JSON.stringify(state.answers))};
  }
  async function send(checkOnly=false) {
    if(busy)return;
    if(count()!==8||!state.name.trim()||!state.area.trim()){toast('Completa tu identificación y las ocho preguntas.');return;}
    if(!window.LudariaTransport.validUrl(config.receiverUrl)){toast('El docente aún debe activar la recepción del diagnóstico.');return;}
    if(!state.payload)state.payload=payload();
    busy=true;render(false);
    try {
      state.receipt=await window.LudariaTransport[checkOnly?'confirm':'send'](config.receiverUrl,state.payload);
      busy=false;save();render();toast('La hoja confirmó la recepción. La puerta está abierta.');
    } catch(error) {
      busy=false;save();render(false);
      const message=error.message.startsWith('SERVER_')?'No se pudo registrar este envío. Conserva la copia y contacta al facilitador.':'No hemos podido confirmar la recepción. Conservamos tus respuestas; puedes comprobarla o reintentar el mismo envío.';
      $('#send-status').textContent=message;toast(message);
    }
  }
  document.addEventListener('input',e=>{
    if(state.payload)return;
    const field=e.target.dataset.field,answer=e.target.dataset.answer;
    if(field)state[field]=e.target.value;
    if(answer)state.answers[answer]=e.target.value;
    save();updateStatus();
    if(answer){const n=count();$('.diagnostic-sidebar > p').textContent=`${n} de 8 preguntas respondidas.`;$('.question-progress span').style.width=n/8*100+'%';const tab=$(`[data-action="question"][data-index="${state.question}"]`);tab.classList.toggle('answered',answered(answer));tab.setAttribute('aria-label',`Pregunta ${state.question+1}${answered(answer)?', respondida':''}`);}
  });
  document.addEventListener('change',e=>{
    if(state.payload)return;
    if(e.target.dataset.element){const set=new Set(state.answers.q3);e.target.checked?set.add(e.target.dataset.element):set.delete(e.target.dataset.element);state.answers.q3=model.elements.filter(x=>set.has(x));if(set.size)state.answers.q3None=false;render(false);}
    if(e.target.hasAttribute('data-none')){state.answers.q3None=e.target.checked;if(e.target.checked)state.answers.q3=[];render(false);}
    if(e.target.dataset.scale){state.answers.q7=Number(e.target.dataset.scale);save();updateStatus();render(false);}
  });
  document.addEventListener('click',async e=>{
    const el=e.target.closest('[data-action]');if(!el)return;
    const a=el.dataset.action;
    if(busy&&!['close','notebook','copy-record','download','fullscreen'].includes(a)){toast('Espera la confirmación del envío.');return;}
    if(a==='go')go(Number(el.dataset.page),el.dataset.question!==undefined?Number(el.dataset.question):undefined);
    else if(a==='close')$('#modal').close();
    else if(a==='map')modal('La entrada a Ludaria',`<div class="modal-grid">${titles.map((x,i)=>`<button class="map-item ${state.page===i?'current':''}" data-action="go" data-page="${i}" ${i===11&&!state.receipt?'disabled':''}><span>${String(i+1).padStart(2,'0')}</span>${x}</button>`).join('')}</div><p class="small-note">El recorrido y el diagnóstico siempre están disponibles. La puerta final se abre con la recepción del registro.</p><button class="button secondary" data-action="reset-ask">Empezar otro registro</button>`);
    else if(a==='realm'){const d=locationData[Number(el.dataset.index)];modal(d[0],`<span class="eyebrow">${d[3]} · ${d[2]}</span><p class="mentor">${d[1]}</p><h3>${d[4]}</h3><p>${d[5]}</p><p class="small-note">El cierre de esta locación recuperará un fragmento del Orbe.</p>`);}
    else if(a==='attribute'){const names=['Sabiduría','Maestría','Creación','Evaluación','Camaradería'];const notes=['Acompaña la exploración del Bosque de los Conceptos.','Acompaña el recorrido por la Cantera de los Elementos.','Acompaña la construcción en la Forja del Arquitecto.','Acompaña la revisión en el Santuario del Espejo.','Acompaña la participación, la escucha y la colaboración entre buscadores.'];const n=Number(el.dataset.index);modal(names[n],`<p>${notes[n]}</p><p class="small-note">Los códigos reales del programa se canjean en la herramienta del personaje.</p>`);}
    else if(a==='forge-help')modal('Abre la Forja del personaje','<p>En el Portal de la Aventura, utiliza la sección «Forja tu personaje». Elige Kael o Kira y vuelve aquí al terminar.</p><p class="small-note">Si estás siguiendo una sesión en directo, el facilitador compartirá el acceso.</p>');
    else if(a==='intro-lock'){if(state.introLock)modal('Bienvenido al Valle de los Ecos','<p>El eco reconoce el Orbe del Saber. Cada locación nos acercará a uno de sus fragmentos.</p>');else modal('El candado del umbral','<p>La pista está escrita en la presentación: <strong class="gold">ORBE</strong>.</p><label class="field">Contraseña del candado<input id="rune-input" type="text" autocomplete="off" maxlength="20"></label><div class="actions"><button class="button" data-action="rune-check">Abrir</button><button class="button secondary" data-action="close">Continuar sin resolver</button></div><p id="rune-feedback" role="status"></p>');}
    else if(a==='rune-check'){if($('#rune-input').value.trim().toUpperCase()==='ORBE'){state.introLock=true;save();render(false);modal('Bienvenido al Valle de los Ecos','<p>El eco reconoce el Orbe del Saber. Cada locación nos acercará a uno de sus fragmentos.</p><p class="small-note">La contraseña abre este mensaje y no otorga puntos ni códigos.</p>');}else $('#rune-feedback').textContent='Revisa la palabra destacada: ORBE.';}
    else if(a==='question'){state.question=Number(el.dataset.index);render(false);$('#question-title').focus?.();}
    else if(a==='question-next'){const q=model.questions[state.question];if(!answered(q.id)){toast('Escribe una respuesta o indica que no lo sabes antes de seguir.');return;}state.question=Math.min(7,state.question+1);render(false);}
    else if(a==='send')await send(false);
    else if(a==='confirm')await send(true);
    else if(a==='notebook')notebook();
    else if(a==='copy-record'){try{await navigator.clipboard.writeText(recordText());toast('Registro copiado.');}catch{$('#record-text').focus();$('#record-text').select();toast('Seleccionamos el registro. Copia con Ctrl+C o Cmd+C.');}}
    else if(a==='download'){const blob=new Blob([recordText()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);modal('Conserva tu registro',`<p>Guarda una copia de tus respuestas y su estado de recepción.</p><a class="button" href="${url}" download="Mi_registro_inicial_Ludaria.txt">Descargar archivo TXT</a>`);$('#modal').addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});}
    else if(a==='reset-ask')modal('Empezar otro registro','<p>Se eliminará el borrador de este navegador. Una respuesta ya recibida en la hoja seguirá registrada.</p><div class="actions"><button class="button" data-action="reset-confirm">Empezar otro registro</button><button class="button secondary" data-action="close">Conservar mi registro</button></div>');
    else if(a==='reset-confirm'){state=blank();$('#modal').close();go(0);toast('El Valle está listo para una nueva entrada.');}
    else if(a==='fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Abre la presentación directamente para ampliar la vista.');}}
  });
  $('#previous').addEventListener('click',()=>go(Math.max(0,state.page-1)));
  $('#next').addEventListener('click',()=>go(Math.min(11,state.page+1)));
  $('#modal').addEventListener('close',()=>{if(modalOpener?.isConnected)modalOpener.focus();});
  document.addEventListener('keydown',e=>{if($('#modal').open||e.target.matches('input,textarea,select'))return;if(e.key==='ArrowRight'&&!$('#next').disabled)go(Math.min(11,state.page+1));if(e.key==='ArrowLeft'&&!$('#previous').disabled)go(Math.max(0,state.page-1));});
  for(let i=0;i<15;i++){const f=document.createElement('i');f.className='fly';f.style.cssText=`left:${8+(i*47)%84}%;top:${15+(i*31)%68}%;animation-delay:${-i*.8}s`;$('#fireflies').append(f);}
  render(false);
})();
