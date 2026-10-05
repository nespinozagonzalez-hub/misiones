'use strict';
(() => {
const KEY = 'gamiaula_senda_ejemplos_v1';
const C = window.SENDA_CASES;
const titles = ['La Senda de los Ejemplos','El encargo de Théol','Recupera el concepto','Aprende a mirar','Expediente A','Candado de las Huellas','Expediente B','Candado de las Evidencias','Candado del Criterio','El encuentro entre buscadores','Tu cuaderno de hallazgos','La senda continúa'];
const sealNames = ['Huellas','Evidencias','Criterio'];
const fieldNames = {a:'Caso A · elemento, función y evidencia',b:'Caso B · elemento, función y evidencia',compare:'Una diferencia que importa',transfer:'Una decisión para mi aula',peer:'Una pregunta recibida y el ajuste que hice',exit:'Una afirmación que quiero contrastar'};
const defaults = () => ({version:1,page:0,visited:[0],seals:['pending','pending','pending'],hints:[0,0,0],seen:[],selections:[],classify:{},phrase:{},recall:{},pairs:{},fields:{},timer:{left:600,running:false},recallDone:false,pairsDone:false,finalRecorded:false});
let storageOK = true, state = defaults(), feedback = {}, opener = null, toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if(saved && saved.version === 1) {
    state = {...state,...saved};
    state.page = Number.isInteger(state.page) && state.page>=0 && state.page<12 ? state.page : 0;
    state.seals = Array.isArray(state.seals) && state.seals.length===3 ? state.seals.map(x=>['solved','assisted'].includes(x)?x:'pending') : defaults().seals;
    for(const key of ['visited','seen','selections']) if(!Array.isArray(state[key])) state[key] = [];
    for(const key of ['classify','phrase','recall','pairs','fields']) if(!state[key] || typeof state[key]!=='object' || Array.isArray(state[key])) state[key]={};
    if(!Array.isArray(state.hints)) state.hints=[0,0,0];
    if(!state.timer || !Number.isFinite(state.timer.left)) state.timer=defaults().timer;
    state.timer.running=false;
  }
} catch(e) {storageOK=false;}
const $ = id => document.getElementById(id);
const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save = () => {try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){storageOK=false;}};
const statusName = x => x==='solved'?'Resuelto':x==='assisted'?'Apertura acompañada':'Por resolver';
const toast = message => {clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3600);};
const action = (id,label,extra='',secondary=false) => `<button class="button ${secondary?'secondary':''}" data-action="${id}" ${extra}>${label}</button>`;
const field = (id,rows=3,placeholder='Escribe con tus palabras…') => `<label class="field" for="field-${id}">${fieldNames[id]}<textarea id="field-${id}" data-field="${id}" rows="${rows}" maxlength="6000" placeholder="${placeholder}">${esc(state.fields[id])}</textarea></label>`;
const opt = (value,label,current) => `<option value="${value}" ${current===value?'selected':''}>${label}</option>`;
const select = (group,key,options,label) => `<select data-group="${group}" data-key="${key}" aria-label="${label}">${opt('','Elegir…',state[group][key])}${options.map(([v,l])=>opt(v,l,state[group][key])).join('')}</select>`;
const fb = key => feedback[key]?`<div class="feedback ${feedback[key].kind||''}" role="status">${feedback[key].text}</div>`:'';
const setFeedback = (key,text,kind='') => {feedback[key]={text,kind};render(false);};
const heading = (n,title,description='',minutes=null) => `<div class="section-title"><div><span class="eyebrow">${n}</span><h2>${title}</h2></div>${minutes?`<span class="time-label">${minutes} min · en parejas</span>`:''}</div>${description?`<p class="lead">${description}</p>`:''}`;
const lockGlyph = (opened=false) => `<div class="lock-glyph" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="10" y="21" width="28" height="22" rx="3"/><path d="${opened?'M17 21v-7a8 8 0 0 1 15-4':'M16 21v-7a8 8 0 0 1 16 0v7'}"/><circle cx="24" cy="30" r="2"/><path d="M24 32v5"/></svg></div>`;
const lockPanel = i => {
  const opened=state.seals[i]!=='pending';
  return `<aside class="lock-panel ${opened?'open':''}">${lockGlyph(opened)}<div class="lock-meta"><span class="eyebrow">CANDADO ${['I','II','III'][i]}</span><h3>${sealNames[i]}</h3></div><p>${opened?statusName(state.seals[i]):['Encuentra los elementos que deja ver el expediente.','Distingue qué sabemos y qué estamos suponiendo.','Relaciona el diseño con el propósito de aprendizaje.'][i]}</p>${opened?action('reward','Consultar lo revelado',`data-seal="${i}"`,true):'<span class="note">Pistas y reintentos disponibles</span>'}</aside>`;
};
const lockActions = i => `<div class="actions">${action('check-lock','Abrir el candado',`data-seal="${i}"`)}<button class="text-button" data-action="hint" data-seal="${i}">Pedir una pista</button><button class="text-button" data-action="case-modal" data-case="${i===1?'b':'a'}">Consultar el expediente</button></div>${fb('lock'+i)}<p class="note"><button class="text-button" data-action="assist" data-seal="${i}">Resolver con el facilitador</button> · El contenido de la clase sigue disponible.</p>`;
const casePage = key => {
  const c=C[key];return `<section class="scene"><div class="scene-content wide">${heading(c.label+' · LECTURA DE HUELLAS',c.title)}<div class="split"><div><div class="case-badge">${c.authors}</div><div class="case-context">${c.context}</div><div class="case-panel"><p class="case-summary">${c.summary}</p><p class="note">Síntesis didáctica del estudio. Las funciones posibles se presentan como interpretación.</p></div><div class="evidence-actions">${c.observations.map((x,i)=>`<button class="evidence-card ${state.seen.includes(key+x.id)?'seen':''}" data-action="clue" data-case="${key}" data-clue="${i}"><small>${state.seen.includes(key+x.id)?'EXPLORADO':'PISTA '+String(i+1).padStart(2,'0')}</small><strong>${x.title}</strong></button>`).join('')}</div><div class="source-line"><a href="${c.source}" target="_blank" rel="noopener noreferrer">Consultar la publicación</a><button class="text-button" data-action="source" data-case="${key}">Referencia y límites</button></div></div><div class="side-note">${key==='a'?'Un elemento deja una huella. Una buena lectura explica qué actividad organiza.':'Dos diseños pueden compartir elementos y producir experiencias diferentes.'}<div class="header-rule"></div><p style="font:15px/1.6 Trebuchet MS,Arial,sans-serif">Exploren las tres pistas. Registren un elemento y la evidencia que lo describe.</p>${action('notebook','Anotar un hallazgo','',true)}</div></div></div></section>`;
};
const choiceHTML=(key,idx,text,selected,mark=String.fromCharCode(65+idx))=>`<button class="choice ${selected?'selected':''}" data-action="${key}" data-option="${idx}" aria-pressed="${selected}"><span class="choice-mark" aria-hidden="true">${selected&&key==='toggle'?'✓':mark}</span><span>${text}</span></button>`;
const classifications = [
 ['El curso incluía tareas para obtener insignias.','fact'],
 ['La clasificación permitía comparar el progreso.','fact'],
 ['Una clasificación podría aumentar la presión por compararse.','interpretation'],
 ['Una insignia podría ser vivida como reconocimiento o como exigencia.','interpretation'],
 ['Las insignias causaron, por sí solas, todo el resultado.','unsupported'],
 ['Toda gamificación perjudica a todos los estudiantes.','unsupported']
];
const pages = [
 () => `<section class="scene"><div class="cover-content"><span class="eyebrow">BOSQUE DE LOS CONCEPTOS · MISIÓN SECUNDARIA 1</span><h1 class="cover-title">La Senda<br>de los <span>Ejemplos</span></h1><p class="lead">Las Brumas del Olvido han confundido las huellas del juego. Dos experiencias reales. Tres candados. Una mirada más profunda.</p><div class="actions">${action('begin','Comenzar la misión')}<button class="text-button" data-action="map">Explorar el recorrido</button></div><div class="cover-meta"><span class="small-line"></span><span>Archivista Théol</span><span>Sabiduría</span></div>${state.visited.length>1?'<p class="note">Tu recorrido anterior está guardado en este navegador.</p>':''}</div><span class="media-note">LUDARIA · EL CONOCIMIENTO DEJA HUELLAS</span></section>`,
 () => `<section class="scene"><div class="scene-content wide">${heading('EL ENCARGO DEL ARCHIVISTA','No basta con ver.<br>Hay que comprender.')}<div class="mentor">«Encontrar puntos o insignias es solo el comienzo. Descubramos qué hacen dentro de la experiencia y qué evidencia sostiene nuestra lectura».<small>ARCHIVISTA THÉOL</small></div><div class="three-column">${[['I','Huellas','Reconoce elementos descritos en un caso.'],['II','Evidencias','Separa lo observado de lo interpretado.'],['III','Criterio','Justifica una decisión para tu aula.']].map(x=>`<div class="panel"><span class="num">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div><p class="note">Analicen en parejas y contrasten con otra pareja. Las pistas ayudan a revisar; no restan puntos. Los sellos registran esta práctica local.</p></div></section>`,
 () => `<section class="scene"><div class="scene-content wide">${heading('UN ECO DE LOS PERGAMINOS','Recupera el concepto','Antes de analizar los casos, reconstruye esta distinción.')}<div class="phrase">La gamificación incorpora ${select('recall','element',[['elements','elementos'],['games','juegos completos']],'Qué incorpora la gamificación')} del diseño de juegos en contextos que ${select('recall','context',[['not','no son'],['always','siempre son']],'Tipo de contexto')} juegos.</div><div class="actions">${action('recall-check','Comprobar la frase')}<button class="text-button" data-action="recall-hint">Escuchar un eco de Théol</button></div>${fb('recall')}${state.recallDone?'<p class="note"><span class="pill">Distinción recuperada</span> Ahora busca cómo se integra cada elemento en la actividad.</p>':''}<div class="header-rule"></div><p class="side-note">Algo divertido puede acompañar una clase. El diseño gamificado requiere una relación entre elementos, acciones y propósito.</p></div></section>`,
 () => `<section class="scene"><div class="scene-content wide">${heading('EL INSTRUMENTO DEL BUSCADOR','Cuatro preguntas<br>para aprender a mirar','Relaciona cada criterio con lo que necesitas buscar.')}<div class="split"><div class="panel">${[['objective','Objetivo'],['activity','Actividad'],['element','Elemento'],['evidence','Evidencia']].map(([key,label])=>`<div class="pair-row"><strong>${label}</strong>${select('pairs',key,[['activity','La acción que realiza el participante'],['evidence','La descripción que sostiene el análisis'],['objective','El aprendizaje que se busca'],['element','Un rasgo del diseño de juegos']],'Relacionar '+label)}</div>`).join('')}<div class="actions">${action('pairs-check','Revisar las relaciones')}</div>${fb('pairs')}</div><div class="side-note">«Un indicador muestra tareas completadas» es una descripción.<div class="header-rule"></div>«Podría ayudar a reconocer el avance» es una interpretación. Merece ser comprobada.</div></div></div></section>`,
 () => casePage('a'),
 () => `<section class="scene"><div class="scene-content wide">${heading('PRIMER UMBRAL','Las huellas del diseño','Marca los tres elementos de esta lista documentados en el expediente A.',10)}<div class="split challenge-split"><div><div class="options">${['Puntos de experiencia','Niveles','Batallas entre avatares','Desafíos','Dados para decidir la nota'].map((x,i)=>choiceHTML('toggle',i,x,state.selections.includes(i))).join('')}</div>${lockActions(0)}</div>${lockPanel(0)}</div></div></section>`,
 () => casePage('b'),
 () => `<section class="scene"><div class="scene-content wide">${heading('SEGUNDO UMBRAL','La niebla de las conclusiones','Clasifica: descripción documentada, interpretación posible o afirmación no sostenida.',10)}<div class="split challenge-split"><div>${classifications.map(([text],i)=>`<div class="classification"><span><span class="card-number">${i+1}.</span>${text}</span>${select('classify',String(i),[['fact','Documentado'],['interpretation','Interpretación'],['unsupported','No sostenido']],'Clasificar afirmación '+(i+1))}</div>`).join('')}${lockActions(1)}</div>${lockPanel(1)}</div></div></section>`,
 () => `<section class="scene"><div class="scene-content wide">${heading('TERCER UMBRAL','La clave no es copiar.<br>Es decidir con criterio.','Reconstruye el principio que permite adaptar una experiencia.',12)}<div class="split challenge-split"><div><div class="phrase" style="margin-top:0">Parto del ${select('phrase','goal',[['prize','premio'],['objective','objetivo']],'Punto de partida')}; elijo una actividad y un elemento pertinente; justifico con ${select('phrase','proof',[['evidence','evidencia'],['taste','preferencia personal']],'Base de la justificación')}; reviso cómo funciona en mi ${select('phrase','place',[['context','contexto'],['ranking','ranking']],'Dónde se comprueba el diseño')}.</div>${lockActions(2)}<details><summary>Comparar antes de decidir</summary><table class="comparison"><thead><tr><th>Pregunta</th><th>Caso A</th><th>Caso B</th></tr></thead><tbody><tr><th>¿Qué organiza el diseño?</th><td>Una trayectoria con puntos, niveles y desafíos.</td><td>Tareas para obtener insignias y una comparación visible.</td></tr><tr><th>¿Qué debo revisar?</th><td>La relación entre participación y aprendizaje.</td><td>Cómo se vive la recompensa y la comparación.</td></tr></tbody></table><p class="note">Estas preguntas orientan la interpretación; no prueban efectos por sí mismas.</p></details></div>${lockPanel(2)}</div></div></section>`,
 () => `<section class="scene"><div class="scene-content wide">${heading('EL ENCUENTRO ENTRE BUSCADORES','Una segunda mirada<br>puede cambiar tu lectura.','Comparte tu interpretación con otra pareja y busca una evidencia que la sostenga.')}<div class="split"><div class="steps">${[['01','Comparte','Presenta un elemento, su función posible y la evidencia.'],['02','Pregunta','La otra pareja pregunta: «¿Dónde se observa?» o «¿Qué otra explicación sería posible?».'],['03','Ajusta','Revisa la interpretación y formula una sugerencia concreta.']].map(x=>`<div class="step"><span class="num">${x[0]}</span><div><strong>${x[1]}</strong><p>${x[2]}</p></div></div>`).join('')}<div>${field('peer',2)}</div></div><div class="timer-box"><span class="eyebrow">TIEMPO DE EXPLORACIÓN</span><div id="timer" class="timer">${timerText()}</div><div class="actions">${action('timer-toggle',state.timer.running?'Pausar':'Iniciar','',true)}<button class="text-button" data-action="timer-reset">Reiniciar</button></div><p class="note">El tiempo orienta la conversación. Al terminar, puedes seguir trabajando.</p></div></div></div></section>`,
 () => `<section class="scene"><div class="scene-content wide">${heading('EL CUADERNO DE HALLAZGOS','Que la evidencia<br>acompañe tu decisión.','Registra lo observado y lo que adaptarías a tu asignatura.')}<div class="work-grid">${field('a')}${field('b')}${field('compare')}${field('transfer')}</div><div class="actions">${action('download','Descargar mi registro')}${action('review-notes','Revisar con una pauta','',true)}</div><p id="saved-note" class="note">${storageOK?'Tus textos se guardan en este navegador.':'El almacenamiento no está disponible. Descarga el registro para conservarlo.'} Traslada estos hallazgos a tu bitácora habitual.</p></div></section>`,
 () => `<section class="scene"><div class="scene-content">${heading('LA SENDA CONTINÚA','Ahora puedes leer<br>más allá de la apariencia.')}<p class="lead">Reconoce el elemento. Explica su función. Sostén tu lectura con evidencia. Revisa su pertinencia en tu contexto.</p><div class="final-seals">${sealNames.map((name,i)=>`<div class="final-seal ${state.seals[i]}"><strong>${name}</strong><small>${statusName(state.seals[i])}</small></div>`).join('')}</div><div style="margin-top:24px">${field('exit',2,'¿Qué afirmación sobre gamificación quisieras contrastar con evidencia?')}</div><div class="actions">${action('finish','Guardar mi cierre')}${action('download','Descargar la bitácora','',true)}</div>${state.finalRecorded?'<p class="note"><span class="pill">Cierre registrado</span> Este registro conserva tu reflexión; su valoración corresponde al facilitador.</p>':''}<div class="header-rule"></div><p class="note">Próximo encuentro: <strong>El Claro del Debate</strong>. Allí cerraremos el módulo y recuperaremos su fragmento del Orbe.</p><button class="text-button" data-action="sources" style="margin-top:15px">Fuentes de los expedientes</button></div></section>`
];
function timerText(){const value=Math.max(0,Math.floor(state.timer.left));return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;}
function render(focus=false){
  document.body.classList.toggle('is-cover',state.page===0);
  $('world').classList.toggle('archive',[3,4,5,6,7,8,9,10].includes(state.page));
  $('stage').innerHTML=pages[state.page]();
  $('seal-status').innerHTML=state.seals.map((status,i)=>`<button class="seal-dot ${status}" data-action="seal-info" data-seal="${i}" aria-label="${sealNames[i]}: ${statusName(status)}" title="${sealNames[i]}: ${statusName(status)}">${['I','II','III'][i]}</button>`).join('');
  $('page-number').textContent=String(state.page+1).padStart(2,'0')+' / 12';
  $('route-dots').innerHTML=titles.map((t,i)=>`<button class="route-dot ${state.visited.includes(i)?'visited':''} ${state.page===i?'current':''}" data-action="go" data-page="${i}" title="${i+1}. ${t}" aria-label="${i+1}. ${t}" ${state.page===i?'aria-current="step"':''}></button>`).join('');
  $('previous').disabled=state.page===0;$('next').disabled=state.page===11;
  $('next-label').textContent=state.page===0?'Entrar':'Siguiente';
  if(focus){$('stage').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
function go(page){
  if(!Number.isInteger(page)||page<0||page>11)return;
  state.page=page;if(!state.visited.includes(page))state.visited.push(page);save();
  try{history.replaceState(null,'','#pantalla-'+(page+1));}catch(e){}
  render(true);
}
function showModal(title,body){
  if(!$('modal').open){
    opener=document.activeElement;
    if(!opener || opener===document.body || opener===document.documentElement) opener=document.querySelector('#stage [data-action]');
  }
  $('modal-body').innerHTML=`<h2 id="modal-title">${title}</h2>${body}`;
  if(!$('modal').open)$('modal').showModal();
  $('modal').querySelector('[data-action="close"]').focus();
}
function closeModal(){if($('modal').open)$('modal').close();}
$('modal').addEventListener('close',()=>{if(opener&&document.contains(opener))opener.focus();});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
function reward(i){
  const content=[
    '<p>Una huella solo tiene sentido dentro de la actividad que organiza.</p><ul class="reward-list"><li><strong>Puntos de experiencia:</strong> hacen visible una acumulación; hay que revisar qué acciones se reconocen.</li><li><strong>Niveles:</strong> pueden representar una trayectoria; el aprendizaje debe sostener el avance.</li><li><strong>Desafíos:</strong> articulan una tarea que merece esfuerzo y una oportunidad de feedback.</li></ul><p class="note">Estas funciones son propuestas de interpretación para analizar el caso, no efectos garantizados.</p>',
    '<p>Antes de aceptar una conclusión, formula tres preguntas.</p><ul class="reward-list"><li>¿Qué se observó o se midió realmente?</li><li>¿En qué contexto y con qué participantes?</li><li>¿Qué otra explicación podría existir?</li></ul><p class="note">La fuente describe una experiencia. Nuestra interpretación debe reconocer sus límites.</p>',
    '<p>Una decisión defendible conecta cuatro aspectos.</p><ul class="reward-list"><li>Un objetivo de aprendizaje concreto.</li><li>Una actividad que permita trabajar ese objetivo.</li><li>Un elemento que organice o acompañe la actividad.</li><li>Una evidencia para revisar qué ocurrió al implementarlo.</li></ul><p class="note">Utiliza esta pauta para conversar con otra pareja. La valoración del texto abierto es humana.</p>'
  ];
  if(state.seals[i]==='pending'){showModal('La ayuda sigue sellada','<p>Resuelve el desafío para revelar esta pauta o trabaja su apertura con el facilitador.</p>'+action('close','Volver al desafío'));return;}
  showModal('Sello de '+sealNames[i],`<span class="pill">${statusName(state.seals[i])}</span><div style="margin-top:20px">${content[i]}</div>`);
}
function unlock(i,status='solved'){
  const first=state.seals[i]==='pending';state.seals[i]=status;save();render(false);
  if(first)toast('Sello de '+sealNames[i]+' abierto. Una nueva pauta está disponible.');
  reward(i);
}
function checkLock(i){
  if(i===0){
    const answer=[...new Set(state.selections)].sort((a,b)=>a-b);
    if(JSON.stringify(answer)==='[0,1,3]'){feedback.lock0={text:'Las tres huellas están documentadas. Ahora explica qué acciones organiza cada una.'};unlock(0);}
    else {
      const wrong=answer.filter(x=>![0,1,3].includes(x));
      setFeedback('lock0',wrong.length?'Las batallas entre avatares y los dados para decidir la nota no aparecen en la síntesis de este caso. Revisa las pistas; no los supongas por su aspecto lúdico.':'Falta reconocer todas las huellas de esta lista. Busca un sistema de avance y una forma de organizar las tareas.','error');
    }
  }else if(i===1){
    const wrong=classifications.map((x,n)=>state.classify[n]===x[1]?null:n).filter(x=>x!==null);
    if(!wrong.length){feedback.lock1={text:'Distinguiste las descripciones, las interpretaciones y las conclusiones que van más allá de la fuente.'};unlock(1);}
    else {
      const tips=wrong.slice(0,3).map(n=>`<strong>Tarjeta ${n+1}:</strong> ${classifications[n][1]==='fact'?'Describe algo que el expediente informa.':classifications[n][1]==='interpretation'?'Propone una explicación posible: no afirma que esté demostrada.':'Atribuye causalidad exclusiva o generaliza a toda gamificación.'}`);
      setFeedback('lock1',tips.join('<br>')+`<br>Revisa ${wrong.length} ${wrong.length===1?'relación':'relaciones'}.`,'error');
    }
  }else if(i===2){
    if(state.phrase.goal==='objective'&&state.phrase.proof==='evidence'&&state.phrase.place==='context'){
      feedback.lock2={text:'Objetivo, evidencia y contexto orientan la adaptación. El sello corresponde a esta frase; la calidad de tu proyecto se revisará con criterios.'};unlock(2);
    }else setFeedback('lock2','Piensa qué deseas que se aprenda, con qué sostienes tu decisión y dónde revisarás su funcionamiento. Copiar premios o posiciones no responde esas preguntas.','error');
  }
}
function hint(i){
  state.hints[i]=(state.hints[i]||0)+1;save();
  const tips=[
    ['Busca elementos descritos, no rasgos que imaginas que tendría un juego.','En el expediente A se nombran un sistema de acumulación, una trayectoria y tareas desafiantes.'],
    ['¿La afirmación describe, interpreta o asegura más de lo que la fuente permite?','Las expresiones «podría» señalan una posibilidad; «por sí solas», «toda» y «todos» pueden exceder este estudio.'],
    ['Empieza por lo que se busca aprender y termina por dónde vas a probar el diseño.','La secuencia es: aprendizaje buscado → justificación fundamentada → lugar de aplicación.']
  ];setFeedback('lock'+i,`<strong>Pista ${Math.min(state.hints[i],2)}.</strong> ${tips[i][Math.min(state.hints[i]-1,1)]}`,'hint');
}
function caseModal(key){
  const c=C[key];showModal(c.title,`<p class="case-badge">${c.authors}</p><p class="case-context">${c.context}</p><p>${c.summary}</p>${c.observations.map(x=>`<h3>${x.title}</h3><p>${x.text}</p><p class="note"><strong>Interpretación posible:</strong> ${x.inference}</p>`).join('')}<h3>Límites</h3><p>${c.limit}</p><div class="source-line"><a href="${c.source}" target="_blank" rel="noopener noreferrer">Publicación original</a></div>`);
}
function notebook(){
  showModal('Tu cuaderno de la misión',`<p>Conserva tus hallazgos y trasládalos a la bitácora del proyecto.</p>${Object.keys(fieldNames).map(id=>field(id,2)).join('')}<div class="actions">${action('download','Descargar mi registro')}${action('review-notes','Consultar la pauta','',true)}</div><p class="note">${storageOK?'Guardado local en este navegador.':'Descarga el registro para conservarlo: el almacenamiento está restringido.'} Las respuestas no se envían automáticamente al docente.</p>`);
}
function download(){
  const text=['BUSCADORES DE LA GAMIFICACIÓN PERDIDA','La Senda de los Ejemplos · Misión secundaria 1 del Bosque de los Conceptos','Fecha: '+new Date().toLocaleDateString('es-CL'),'','SELLOS DE PRÁCTICA',...sealNames.map((n,i)=>`${n}: ${statusName(state.seals[i])} · pistas consultadas: ${state.hints[i]||0}`),'',...Object.entries(fieldNames).flatMap(([id,title])=>[title.toUpperCase(),state.fields[id]||'(Sin registro)','','']), 'Los sellos corresponden a las actividades cerradas. Este registro no sustituye la valoración del facilitador.','','FUENTES',C.a.citation,'',C.b.citation].join('\n');
  const blob=new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob);
  showModal('Tu bitácora está lista',`<p>Descarga tu registro para conservarlo y compartirlo con el facilitador.</p><div class="actions"><a class="button" href="${url}" download="Bitacora_Senda_de_los_Ejemplos.txt">Descargar archivo TXT</a></div><label class="field" for="export-text" style="margin-top:24px">También puedes seleccionar y copiar tu registro<textarea id="export-text" rows="10" readonly>${esc(text)}</textarea></label><p class="note">Si la descarga está restringida al incrustar la misión, abre la experiencia en una pestaña o copia este texto.</p>`);
  setTimeout(()=>URL.revokeObjectURL(url),300000);
}
function handle(actionName,el){
  const i=Number(el.dataset.seal);
  switch(actionName){
    case 'begin':go(1);break;
    case 'go':closeModal();go(Number(el.dataset.page));break;
    case 'close':closeModal();break;
    case 'map':showModal('Los pasos de la senda',`<p>Consulta cualquier pantalla. Los candados revelan ayudas de análisis; las instrucciones permanecen accesibles.</p><div class="modal-grid" style="margin-top:22px">${titles.map((t,n)=>`<button class="map-item ${n===state.page?'current':''}" data-action="go" data-page="${n}"><span>${String(n+1).padStart(2,'0')}</span>${t}</button>`).join('')}</div><div class="actions"><button class="text-button" data-action="reset-ask">Reiniciar esta misión</button></div>`);break;
    
    case 'notebook':notebook();break;
    case 'fullscreen':if(!document.fullscreenElement){if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>toast('Usa el botón de pantalla completa del marco o del navegador.'));else toast('Usa la opción de pantalla completa de tu navegador.');}else document.exitFullscreen?.();break;
    case 'recall-check':if(state.recall.element==='elements'&&state.recall.context==='not'){state.recallDone=true;save();setFeedback('recall','La distinción está recuperada: incorporamos elementos del diseño de juegos a otra actividad. Ahora observemos su función.');}else setFeedback('recall','Revisa la diferencia entre un juego completo y elementos de su diseño. ¿El contexto debe convertirse necesariamente en un juego?','error');break;
    case 'recall-hint':setFeedback('recall','No necesitas trasladar un juego completo. Pregúntate qué tomas de su diseño y dónde lo incorporas.','hint');break;
    case 'pairs-check':if(['objective','activity','element','evidence'].every(k=>state.pairs[k]===k)){state.pairsDone=true;save();setFeedback('pairs','Las cuatro miradas se complementan: qué se aprende, qué se hace, qué diseño se reconoce y dónde se observa.');}else setFeedback('pairs','Revisa las relaciones. El objetivo dice qué se busca aprender; la evidencia ofrece una descripción concreta, no una opinión.','error');break;
    case 'clue':{const key=el.dataset.case,x=C[key].observations[Number(el.dataset.clue)],id=key+x.id;if(!state.seen.includes(id))state.seen.push(id);save();render(false);showModal(x.title,`<span class="pill">Evidencia del expediente ${key.toUpperCase()}</span><p style="margin-top:20px">${x.text}</p><h3>Una función posible</h3><p>${x.inference}</p><p class="note">Explica con tus palabras la relación entre elemento, actividad y propósito.</p><div class="actions">${action('notebook','Anotar en mi cuaderno')}${action('close','Volver al expediente','',true)}</div>`);break;}
    case 'case-modal':caseModal(el.dataset.case);break;
    case 'source':{const c=C[el.dataset.case];showModal('Fuente y límites',`<p>${c.citation}</p><h3>Qué permite sostener</h3><p>${c.limit}</p><div class="actions"><a class="button secondary" href="${c.source}" target="_blank" rel="noopener noreferrer">Abrir publicación</a><a class="button secondary" href="${c.reading}" target="_blank" rel="noopener noreferrer">Consultar el texto</a></div>`);break;}
    case 'sources':showModal('Las fuentes de la senda',`<p>Los expedientes son síntesis didácticas de estas investigaciones. La ambientación de Ludaria acompaña el análisis; no representa el entorno de los estudios.</p>${['a','b'].map(k=>`<h3>${C[k].label}</h3><p>${C[k].citation}</p><p><a href="${C[k].source}" target="_blank" rel="noopener noreferrer">Consultar publicación original</a></p>`).join('')}<p class="note">Diseño de la prueba: equipo GamiAula. Fondos originales generados para esta experiencia.</p>`);break;
    case 'toggle':{const n=Number(el.dataset.option);state.selections=state.selections.includes(n)?state.selections.filter(x=>x!==n):[...state.selections,n];delete feedback.lock0;save();const nextFocus=el.dataset.option;render(false);document.querySelector(`[data-action="toggle"][data-option="${nextFocus}"]`)?.focus({preventScroll:true});break;}
    case 'check-lock':checkLock(i);break;
    case 'hint':hint(i);break;
    case 'reward':reward(i);break;
    case 'seal-info':if(state.seals[i]==='pending')showModal('Candado de '+sealNames[i],`<p>Este sello se abre en la pantalla ${[6,8,9][i]}. Su reto está ligado al análisis de los casos.</p><div class="actions">${action('go','Ir al desafío',`data-page="${[5,7,8][i]}"`)}${action('close','Seguir aquí','',true)}</div>`);else reward(i);break;
    case 'assist':showModal('Una apertura acompañada',`<p>Conversen el reto con el facilitador. Al continuar, se revelará la pauta y el sello quedará registrado como «Apertura acompañada».</p><p class="note">Esto no se registrará como una respuesta correcta automática.</p><div class="actions">${action('assist-confirm','Abrir con acompañamiento',`data-seal="${i}"`)}${action('close','Volver a intentar','',true)}</div>`);break;
    case 'assist-confirm':unlock(i,'assisted');break;
    case 'timer-toggle':state.timer.running=!state.timer.running;save();render(false);break;
    case 'timer-reset':state.timer={left:600,running:false};save();render(false);break;
    case 'review-notes':showModal('Revisar tu interpretación','<p>Lee tu registro con otra pareja. Puedes responder estas preguntas sin necesidad de coincidir en todo.</p><ul class="reward-list"><li>¿Nombraste un elemento concreto?</li><li>¿Explicaste la actividad que organiza y una función posible?</li><li>¿Señalaste una evidencia del caso?</li><li>¿Reconociste un límite o una explicación alternativa?</li><li>¿Tu propuesta para el aula tiene un objetivo y algo que observar?</li></ul><p class="note">Esta pauta ayuda a revisar. La extensión del texto y las palabras clave no califican su calidad.</p><div class="actions">'+action('notebook','Volver al cuaderno')+'</div>');break;
    case 'download':download();break;
    case 'finish':state.finalRecorded=true;save();render(false);toast('Cierre guardado. Descarga tu bitácora para conservarla y compartirla.');break;
    case 'reset-ask':showModal('Volver al inicio',`<p>Se borrarán las respuestas, las pistas y los sellos de esta misión en este navegador. Antes puedes descargar tu registro.</p><div class="actions">${action('download','Descargar mi registro','',true)}${action('reset-confirm','Reiniciar esta misión')}</div>`);break;
    case 'reset-confirm':state=defaults();feedback={};try{localStorage.removeItem(KEY);}catch(e){}closeModal();go(0);toast('La misión está lista para una nueva exploración.');break;
  }
}
document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(el&&!el.disabled)handle(el.dataset.action,el);});
document.addEventListener('change',e=>{if(e.target.dataset.group){const {group,key}=e.target.dataset;state[group][key]=e.target.value;save();}});
document.addEventListener('input',e=>{if(e.target.dataset.field){state.fields[e.target.dataset.field]=e.target.value;save();const n=$('saved-note');if(n)n.textContent=storageOK?'Texto guardado en este navegador. Traslada tus hallazgos a la bitácora habitual.':'Descarga tu registro para conservarlo: el almacenamiento no está disponible.';}});
$('previous').addEventListener('click',()=>go(state.page-1));$('next').addEventListener('click',()=>go(state.page+1));
document.addEventListener('keydown',e=>{if($('modal').open||e.target.closest('input,textarea,select,button,a'))return;if(e.key==='ArrowRight'){e.preventDefault();go(state.page+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(state.page-1);}});
setInterval(()=>{if(state.timer.running&&state.timer.left>0){state.timer.left--;if($('timer'))$('timer').textContent=timerText();if(state.timer.left===0){state.timer.running=false;save();toast('Terminó el tiempo de referencia. La conversación puede continuar.');if(state.page===9)render(false);}}},1000);
window.addEventListener('beforeunload',save);
for(let n=0;n<12;n++){const f=document.createElement('i');f.className='fly';f.style.cssText=`left:${13+n*7}%;top:${20+(n*17)%68}%;animation-delay:${-n*1.2}s;animation-duration:${8+(n%4)*3}s`; $('fireflies').appendChild(f);}
const hash=location.hash.match(/^#pantalla-(\d+)$/);if(hash&&+hash[1]>=1&&+hash[1]<=12)state.page=+hash[1]-1;
if(!state.visited.includes(state.page))state.visited.push(state.page);
render();save();if(!storageOK)toast('Puedes completar la misión y descargar tu registro; el guardado local está restringido.');
})();

