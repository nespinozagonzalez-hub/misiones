/** LUDARIA · Conexión central v0.4.4. Cliente compatible v0.4.3; rutina DEMO retirada. */
const LUDARIA_WEB = Object.freeze({
  pages: 'https://nespinozagonzalez-hub.github.io/misiones/',
  raw: 'https://raw.githubusercontent.com/nespinozagonzalez-hub/misiones/main/',
  routes: ['forja', 'mision-0'].concat(LudariaRPG.missions.map(function(m){return m.slug;})),
  maxCharacters: 300,
  sessionMs: 4 * 60 * 60 * 1000
});

/**
 * Ejecutar desde el editor si existe duda sobre qué proyecto conserva el paso 1.
 * Solo lee estado y nunca devuelve el secreto.
 */
function diagnosticarConexionLudaria() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  const bound = props.getProperty('LUDARIA_SHEET_ID');
  const secret = Boolean(props.getProperty('LUDARIA_PIN_PEPPER'));
  const target = Boolean(ss && ss.getId() === LUDARIA.sheetId);
  const people = target && ss.getSheetByName('Personajes');
  const rows = people && people.getLastRow() > 1
    ? people.getRange(2, 1, people.getLastRow() - 1, LUDARIA.headers.Personajes.length).getValues()
    : [];
  const participants = rows.filter(function (row) { return row[6] === 'PARTICIPANTE'; }).length;
  const demos = rows.filter(function (row) { return row[6] === 'DEMO'; }).length;
  let next;
  if (!target) {
    next = 'Abre la planilla privada y entra por Extensiones > Apps Script. Este proyecto no está vinculado a esa planilla.';
  } else if (!secret && rows.length) {
    next = 'Este proyecto no conserva el secreto original. No ejecutes la preparación ni borres filas; intenta restaurar o abrir el proyecto original.';
  } else if (bound && bound !== LUDARIA.sheetId) {
    next = 'Este proyecto está vinculado a otra planilla. No continúes aquí.';
  } else {
    next = 'El proyecto puede ejecutar prepararConexionLudaria sin regenerar el secreto ni sobrescribir personajes.';
  }
  const result = {
    ok: true,
    planillaCorrecta: target,
    proyectoVinculado: bound === LUDARIA.sheetId,
    secretoConservado: secret,
    personajes: rows.length,
    demos: demos,
    participantes: participants,
    puedePreparar: target && secret && (!bound || bound === LUDARIA.sheetId),
    siguientePaso: next
  };
  console.log(JSON.stringify(result));
  return result;
}

/** Ejecutar desde el editor con la cuenta propietaria, antes de implementar. */
function prepararConexionLudaria() {
  const active = Session.getActiveUser().getEmail();
  const effective = Session.getEffectiveUser().getEmail();
  if (!active || active !== effective || !SpreadsheetApp.getActiveSpreadsheet()) {
    throw new Error('Ejecuta esta preparación desde el editor, con la cuenta propietaria.');
  }
  const cache = cacheTemporal_();
  try { if (cache) cache.remove('ludaria-schema-v042-' + LUDARIA.sheetId); } catch (_) {}
  instalarLudaria_();
  sincronizarCatalogoRpg_(base_());
  const props = PropertiesService.getScriptProperties();
  props.setProperty('LUDARIA_WEB_ENABLED', 'true');
  // Autoriza UrlFetch al ejecutar en el editor. No se descargan datos de participantes.
  const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + 'forja/index.html');
  if (response.getResponseCode() !== 200) throw new Error('No se pudo comprobar la interfaz de Forja.');
  console.log('Conexión preparada. Implementa como aplicación web, ejecutada como propietario. La planilla sigue privada.');
  return { ok: true, version: '0.4.4' };
}

function doGet(e) {
  const params = e && e.parameter || {};
  const route = params.mision || 'forja';
  if (!LUDARIA_WEB.routes.includes(route)) {
    return HtmlService.createHtmlOutput('<h1>Ruta todavía no conectada</h1><p>La presentación original sigue disponible en Genially.</p>');
  }
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('LUDARIA_WEB_ENABLED') !== 'true') {
    return HtmlService.createHtmlOutput('<h1>Conexión pendiente</h1><p>El propietario debe ejecutar prepararConexionLudaria desde el editor.</p>');
  }
  const cache = cacheTemporal_(), htmlKey = 'ludaria-html-v042-' + route;
  let html = null;
  try { html = cache && cache.get(htmlKey); } catch (_) {}
  if (!html) {
    const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + route + '/' + (LUDARIA_MISSION_ENTRIES[route] || 'index.html'));
    if (response.getResponseCode() !== 200) throw new Error('No se pudo cargar la presentación.');
    html = response.getContentText();
    try { if (cache && html.length < 30000) cache.put(htmlKey, html, 60); } catch (_) {}
  }
  const entry = params.entrada === 'mochi';
  html = html.replace(/<base\b[^>]*>/gi, '');
  const config = JSON.stringify({ route: route, market: entry, rpgVersion: LudariaRPG.version }).replace(/</g, '\\u003c');
  const insertion = '<base href="' + LUDARIA_WEB.pages + route + '/" target="_self">' +
    '<script>window.LUDARIA_CLOUD_CONFIG=' + config + ';window.FORJA_ENTRY=' + entry + ';</script>' +
    '<script>' + LUDARIA_CATALOG_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>' +
    '<script>' + LUDARIA_RPG_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>' +
    '<script>' + LUDARIA_CLIENT_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>' +
    '<script defer id="ludaria-access-scenery" src="../ludaria/access-scenery.js?v=20261012-acceso1"></script>';
  html = html.replace(/<head[^>]*>/i, function (head) { return head + insertion; });
  return HtmlService.createHtmlOutput(html).setTitle('Ludaria · ' + (entry ? 'Mercadito de Mochi' : route === 'forja' ? 'Forja del Buscador' : contextoRpg_(route).name))
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Único punto público para operaciones de participantes. No devuelve filas privadas. */
function ludariaApi(request) {
  LUDARIA_REQUEST_READS_ = {};
  try {
    return conBloqueo_(function () {
      if (PropertiesService.getScriptProperties().getProperty('LUDARIA_WEB_ENABLED') !== 'true') throw new Error('Conexión pendiente de activar.');
      if (!request || typeof request !== 'object' || JSON.stringify(request).length > 50000) throw new Error('Solicitud inválida.');
      limitePublico_();
      const ss = base_(), data = request.data || {};
      if (request.action === 'entrar') {
        const key = limpiarClave_(data.key);
        const result = identificarExplorador_(ss, data.name, key);
        if (!result.ok) return result;
        return inicioPerfil_(ss, respuestaPerfil_(ss, result.profile.id, tokenSesion_(result.profile.id)), data.mission);
      }
      if (request.action === 'registrar') return inicioPerfil_(ss, registrarPublico_(ss, request), data.mission);
      if (request.action === 'recuperarClave') return inicioPerfil_(ss, recuperarClavePublica_(ss, request), data.mission);
      const id = validarSesion_(request.access);
      const record = filas_(ss, 'Personajes').find(function (r) { return r[0] === id && r[8] === 'ACTIVO'; });
      if (!record) throw new Error('Acceso cerrado. Vuelve a identificarte.');
      if (request.action === 'cargarInicio') return inicioPerfil_(ss, respuestaPerfil_(ss, id), data.mission);
      if (request.action === 'cargar') return respuestaPerfil_(ss, id);
      if (request.action === 'cargarMision') {
        validarMision_(data.mission);
        const events = filas_(ss, 'Aventuras').filter(function (r) { return r[2] === id && r[3] === data.mission && r[5] === 'BORRADOR'; });
        const last = events.length ? events[events.length - 1] : null;
        return { ok: true, snapshot: last ? JSON.parse(last[6]).snapshot : null, revision: last ? last[0] : null };
      }
      if (request.action === 'guardarMision') return guardarMision_(ss, id, request);
      if (request.action === 'ventaja') return consultarVentajaRpg_(ss, id, request);
      if (request.action === 'catalogoRpg') return catalogoRpg_(ss,id,data.mission);
      if (request.action === 'accionRpg') return accionRpg_(ss,id,request);
      if (!['runa', 'compra', 'talento', 'redistribuir'].includes(request.action)) throw new Error('Acción no disponible.');
      validarSolicitud_(request.requestId);
      const signature = firma_(JSON.stringify({ action: request.action, data: data }));
      const moves = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
      const repeated = moves.find(function (r) { return r[0] === request.requestId; });
      if (repeated) {
        if (JSON.parse(repeated[4]).signature !== signature) throw new Error('Este identificador ya se usó para otra operación.');
        return respuestaPerfil_(ss, id);
      }
      const latest = moves[moves.length - 1];
      if (request.expectedRevision !== latest[0]) throw new Error('El perfil cambió. Actualízalo antes de confirmar.');
      const p = perfilActual_(ss, id), before = p.points, skillsBefore=Object.assign({},p.skills), xpBefore=p.xp;
      const reason=textoDecision_(data.reason,1000);
      let detail;
      if (request.action === 'runa') {
        const result = LudariaCore.redeem(p, data.code);
        detail = result.md.n;
      } else if (request.action === 'compra') {
        p.pending = cantidades_(data.quantities, 0, 9);
        LudariaCore.confirmSpend(p);
        detail = 'Compra con Mochi';
      } else if (request.action === 'talento') {
        if (!LudariaCore.unlock(p, data.key, data.tier)) throw new Error('Talento todavía no disponible.');
        detail = 'Talento revelado';
      } else {
        const target = cantidades_(data.skills, 1, 10);
        const budget = p.points + LUDARIA.attributes.reduce(function (sum, k) { return sum + p.skills[k] - 1; }, 0);
        const spent = LUDARIA.attributes.reduce(function (sum, k) { return sum + target[k] - 1; }, 0);
        if (spent > budget) throw new Error('La redistribución supera los puntos que has obtenido.');
        p.skills = target; p.points = budget - spent;
        p.nodes = p.nodes.filter(function (node) { const pieces = node.split('_'); return p.skills[pieces[0]] >= [3,5,8][Number(pieces[1])-1]; });
        detail = 'Redistribución de atributos';
      }
      delete p.pending;
      ss.getSheetByName('Movimientos').appendRow([request.requestId, new Date().toISOString(), id, request.action.toUpperCase(),
        JSON.stringify({ signature: signature, detail: detail, before: before, after: p.points, data: data, skillsBefore: skillsBefore, skillsAfter: Object.assign({},p.skills), xpBefore: xpBefore, xpAfter: p.xp, reason:reason, reasonSource:reason?'AUTOINFORME':'NO_DECLARADO' }), JSON.stringify(p)]);
      // El movimiento confirmado es la fuente de verdad. Una vista se puede reconstruir.
      try { actualizarVistas_(ss, record, p); } catch (_) { console.log('LUDARIA: vista derivada pendiente de reconstruir.'); }
      return respuestaPerfil_(ss, id);
    });
  } catch (error) { return { ok: false, message: error.message || 'No se pudo confirmar la operación.' }; }
  finally { LUDARIA_REQUEST_READS_ = null; }
}

/** El perfil y el cuaderno se recuperan en una sola llamada. No modifica progreso. */
function inicioPerfil_(ss, result, mission) {
  if (!result.ok || !mission || !LudariaRPG.missions.some(function(m){return m.slug===mission;})) return result;
  const events = filas_(ss, 'Aventuras').filter(function(r){return r[2]===result.profile.id && r[3]===mission && r[5]==='BORRADOR';});
  const last = events.length ? events[events.length-1] : null;
  result.initialMission = {mission:mission, snapshot:last ? JSON.parse(last[6]).snapshot : null, revision:last ? last[0] : null};
  return result;
}

function limitePublico_() {
  const props = PropertiesService.getScriptProperties(), minute = Math.floor(Date.now() / 60000);
  let record = JSON.parse(props.getProperty('LUDARIA_WEB_RATE') || 'null');
  if (!record || record.minute !== minute) record = { minute: minute, count: 0 };
  if (record.count >= 300) throw new Error('Muchos accesos simultáneos. Espera un minuto y vuelve a intentar.');
  record.count++; props.setProperty('LUDARIA_WEB_RATE', JSON.stringify(record));
}
function validarSolicitud_(id) { if (typeof id !== 'string' || !/^[a-f0-9-]{32,40}$/i.test(id)) throw new Error('Identificador de solicitud inválido.'); }
function limpiarClave_(key) { return typeof key === 'string' ? key.trim().toUpperCase() : ''; }
function claveValida_(key) { return typeof key === 'string' && (/^\d{6}$/.test(key) || /^LUD(?:-[A-F0-9]{6}){4}$/.test(key)); }
function registrarPublico_(ss, request) {
  validarSolicitud_(request.requestId);
  const data = request.data || {}, alias = normalizarAlias_(data.name);
  if (!['Kael', 'Kira'].includes(data.class)) throw new Error('Selecciona Kael o Kira.');
  const key = claveElegida_(data.key, data.keyConfirm);
  const props = PropertiesService.getScriptProperties(), receiptProperty = 'LUDARIA_ALTA_' + firma_('alias|' + alias);
  const signature = firma_(JSON.stringify({alias:alias,avatar:data.class,key:key}));
  const receipt = JSON.parse(props.getProperty(receiptProperty) || 'null');
  const existing = buscarPersonaje_(ss, alias);
  let record;
  if (existing) {
    if (existing[8] !== 'ACTIVO' || !receipt || receipt.requestId !== request.requestId || !iguales_(receipt.signature, signature) ||
        !iguales_(firma_(existing[0] + '|' + existing[4] + '|' + key), existing[5])) throw new Error('Ese nombre ya está registrado. Entra con tu clave o elige otro nombre.');
    asegurarCreacion_(ss, existing);
    record = existing;
  } else {
    if (filas_(ss, 'Personajes').length >= LUDARIA_WEB.maxCharacters) throw new Error('Registro completo. Contacta al facilitador.');
    props.setProperty(receiptProperty, JSON.stringify({requestId:request.requestId,signature:signature}));
    record = crearPersonaje_(ss, data.name, key, data.class, 'PARTICIPANTE');
  }
  const recoveryCode = codigoRespaldo_(request.requestId, record[0]);
  props.setProperty('LUDARIA_RESPALDO_' + record[0], JSON.stringify({digest:firma_('respaldo|' + record[0] + '|' + recoveryCode)}));
  actualizarVistas_(ss, record, perfilActual_(ss, record[0]));
  const response = respuestaPerfil_(ss, record[0], tokenSesion_(record[0])); response.key = key; response.recoveryCode = recoveryCode; return response;
}
function claveElegida_(key, confirmation) {
  const clean = limpiarClave_(key);
  if (!/^\d{6}$/.test(clean)) throw new Error('Elige una clave personal de seis dígitos.');
  if (clean !== limpiarClave_(confirmation)) throw new Error('Las claves no coinciden. Escríbelas otra vez.');
  return clean;
}
function codigoRespaldo_(requestId, id) {
  const hex = firma_('respaldo-alta|' + requestId + '|' + id).slice(0,24).toUpperCase();
  return 'RES-' + hex.match(/.{6}/g).join('-');
}
/** Recuperación con prueba privada de respaldo; nunca revela la clave anterior. */
function recuperarClavePublica_(ss, request) {
  validarSolicitud_(request.requestId);
  const data = request.data || {}, alias = normalizarAlias_(data.name), key = claveElegida_(data.key, data.keyConfirm);
  const code = limpiarClave_(data.recoveryCode), records = filas_(ss, 'Personajes');
  const index = records.findIndex(function(r){return r[2] === alias && r[8] === 'ACTIVO';});
  const props = PropertiesService.getScriptProperties(), attemptProperty = claveIntentos_(alias) + '_RESPALDO', now = Date.now();
  let attempts = JSON.parse(props.getProperty(attemptProperty) || 'null');
  if (!attempts || now - attempts.start >= LUDARIA.attemptWindowMs) attempts = {start:now,failures:0};
  if (attempts.failures >= LUDARIA.maxAttempts) throw new Error('Espera unos minutos antes de intentar recuperar la clave nuevamente.');
  const previous = index < 0 ? null : records[index].slice(), property = previous && 'LUDARIA_RESPALDO_' + previous[0];
  const backupRaw = property && props.getProperty(property), backup = JSON.parse(backupRaw || 'null');
  if (!previous || !backup || !/^RES(?:-[A-F0-9]{6}){4}$/.test(code) || !iguales_(backup.digest, firma_('respaldo|' + previous[0] + '|' + code))) {
    if (previous) {attempts.failures++; props.setProperty(attemptProperty, JSON.stringify(attempts));}
    throw new Error('Revisa el nombre y el código de recuperación. Si no lo tienes, pide ayuda al facilitador.');
  }
  const signature = firma_(JSON.stringify({alias:alias,key:key,code:code}));
  if (backup.requestId === request.requestId) {
    if (!iguales_(backup.signature, signature)) throw new Error('Esta solicitud ya se usó para otro cambio de clave.');
    const response = respuestaPerfil_(ss, previous[0], tokenSesion_(previous[0])); response.key = key; return response;
  }
  const next = previous.slice(), versionProperty = 'LUDARIA_ACCESS_VERSION_' + previous[0], previousVersion = props.getProperty(versionProperty);
  next[4] = Utilities.getUuid(); next[5] = firma_(previous[0] + '|' + next[4] + '|' + key);
  const row = ss.getSheetByName('Personajes').getRange(index + 2, 1, 1, LUDARIA.headers.Personajes.length);
  try {
    row.setValues([next]); props.setProperty(versionProperty, request.requestId);
    props.setProperty(property, JSON.stringify({digest:backup.digest,requestId:request.requestId,signature:signature}));
    registrarEventoRpg_(ss, previous[0], request, 'RECUPERACION_ACCESO', 'forja', '', {source:'RESPALDO',previousSessionsRevoked:true});
  } catch(error) {
    row.setValues([previous]); props.setProperty(property, backupRaw);
    if (previousVersion) props.setProperty(versionProperty, previousVersion); else props.deleteProperty(versionProperty);
    throw error;
  }
  props.deleteProperty(attemptProperty); props.deleteProperty(claveIntentos_(alias));
  const response = respuestaPerfil_(ss, previous[0], tokenSesion_(previous[0])); response.key = key; return response;
}
function tokenSesion_(id) {
  const version = PropertiesService.getScriptProperties().getProperty('LUDARIA_ACCESS_VERSION_' + id);
  const nonce = (version ? version + '~' : '') + Utilities.getUuid();
  const value = id + '.' + (Date.now() + LUDARIA_WEB.sessionMs) + '.' + nonce;
  return value + '.' + firma_('sesion|' + value);
}
function validarSesion_(token) {
  if (typeof token !== 'string' || token.length > 250) throw new Error('Identifícate con tu nombre y clave.');
  const parts = token.split('.'), value = parts.slice(0, 3).join('.');
  if (parts.length !== 4 || !iguales_(firma_('sesion|' + value), parts[3]) || !/^\d+$/.test(parts[1]) || Number(parts[1]) <= Date.now()) throw new Error('Tu sesión terminó. Vuelve a entrar con tu nombre y clave.');
  const version = PropertiesService.getScriptProperties().getProperty('LUDARIA_ACCESS_VERSION_' + parts[0]);
  if (version && !parts[2].startsWith(version + '~')) throw new Error('El facilitador renovó tu acceso. Entra con tu nueva clave personal.');
  return parts[0];
}

/** Solo el facilitador propietario, desde el editor del proyecto vinculado. */
function recuperarClaveLudaria() {
  comprobarFacilitador_();
  const ui = SpreadsheetApp.getUi();
  const answer = ui.prompt('Recuperar acceso a Ludaria', 'Nombre de explorador cuya identidad has verificado. Su progreso se conserva.', ui.ButtonSet.OK_CANCEL);
  if (answer.getSelectedButton() !== ui.Button.OK) return {ok:false,cancelled:true};
  const name = answer.getResponseText();
  const confirm = ui.alert('Renovar clave personal', 'Se asignará una nueva clave y se cerrarán los accesos anteriores de este personaje. No se cambian sus puntos, XP, atributos ni cuadernos. ¿Confirmar?', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return {ok:false,cancelled:true};
  const result = renovarAccesoExplorador_(name);
  // La clave se muestra al propietario en la hoja, nunca en registros de ejecución.
  ui.alert('Clave personal renovada', 'Explorador: ' + result.name + '\nNueva clave: ' + result.key + '\nEntrégala únicamente a este participante. Guarda esta clave antes de cerrar.', ui.ButtonSet.OK);
  return {ok:true,personaje:result.id};
}
function comprobarFacilitador_() {
  const active = Session.getActiveUser().getEmail(), effective = Session.getEffectiveUser().getEmail();
  const bound = SpreadsheetApp.getActiveSpreadsheet();
  if (!active || active !== effective || !bound || bound.getId() !== LUDARIA.sheetId) throw new Error('Esta función requiere al facilitador propietario desde el editor del proyecto original.');
  if (!PropertiesService.getScriptProperties().getProperty('LUDARIA_PIN_PEPPER')) throw new Error('Falta el secreto original. No se renovó ninguna clave.');
}
function renovarAccesoExplorador_(name) {
  comprobarFacilitador_();
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const ss = base_(), alias = normalizarAlias_(name), records = filas_(ss, 'Personajes');
    const index = records.findIndex(function(row){return row[2] === alias;});
    if (index < 0 || records[index][8] !== 'ACTIVO') throw new Error('No hay un personaje activo con ese nombre.');
    const previous = records[index].slice(), next = previous.slice();
    const requestId = Utilities.getUuid();
    const hex = firma_('recuperacion|' + requestId + '|' + previous[0]).slice(0,24).toUpperCase();
    const key = 'LUD-' + hex.match(/.{6}/g).join('-');
    next[4] = Utilities.getUuid(); next[5] = firma_(previous[0] + '|' + next[4] + '|' + key);
    const props = PropertiesService.getScriptProperties(), property = 'LUDARIA_ACCESS_VERSION_' + previous[0];
    const previousVersion = props.getProperty(property);
    const row = ss.getSheetByName('Personajes').getRange(index + 2, 1, 1, LUDARIA.headers.Personajes.length);
    try {
      row.setValues([next]); props.setProperty(property, requestId);
      registrarEventoRpg_(ss, previous[0], {requestId:requestId}, 'RECUPERACION_ACCESO', 'forja', '', {source:'FACILITADOR',previousSessionsRevoked:true});
    } catch(error) {
      row.setValues([previous]);
      if (previousVersion) props.setProperty(property, previousVersion); else props.deleteProperty(property);
      throw error;
    }
    props.deleteProperty(claveIntentos_(alias));
    props.deleteProperty('LUDARIA_RESPALDO_' + previous[0]);
    return {id:previous[0],name:previous[1],key:key};
  } finally { lock.releaseLock(); }
}
function cantidades_(raw, min, max) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || Object.keys(raw).some(function (k) { return !LUDARIA.attributes.includes(k); })) throw new Error('Atributos inválidos.');
  const result = {};
  LUDARIA.attributes.forEach(function (key) { if (!Number.isInteger(raw[key]) || raw[key] < min || raw[key] > max) throw new Error('Cantidad inválida en ' + key + '.'); result[key] = raw[key]; });
  return result;
}
function respuestaPerfil_(ss, id, access) {
  const p = perfilActual_(ss, id), moves = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
  p.history = moves.slice(-1000).map(function (r) { const d = JSON.parse(r[4]); return { id: r[0], at: r[1], type: String(r[3]).toLowerCase(), detail: d.detail || 'Creación del personaje', before: d.before || 0, after: d.after || 0, cost: (d.before || 0) - (d.after || 0), skillsBefore:d.skillsBefore||null, skillsAfter:d.skillsAfter||null, reason:d.reason||'', reasonSource:d.reasonSource||'NO_DECLARADO' }; });
  const result = { ok: true, profile: p, revision: moves[moves.length - 1][0], advantages: ventajasDisponibles_(p.skills) };
  if (access) result.access = access;
  return result;
}
function validarMision_(mission) { if (!LudariaRPG.missions.some(function(m){return m.slug===mission;})) throw new Error('Esta misión aún no está conectada.'); }
function guardarMision_(ss, id, request) {
  const data = request.data; validarMision_(data.mission); validarSolicitud_(request.requestId);
  if (!data.snapshot || typeof data.snapshot !== 'object' || Array.isArray(data.snapshot) || JSON.stringify(data.snapshot).length > 40000) throw new Error('Borrador inválido o demasiado extenso.');
  validarCuadernoRpg_(data.mission,data.snapshot);
  const events = filas_(ss, 'Aventuras').filter(function (r) { return r[2] === id && r[3] === data.mission && r[5] === 'BORRADOR'; });
  const signature = firma_(JSON.stringify(data.snapshot));
  const repeated = events.find(function (r) { return r[0] === request.requestId; });
  if (repeated) { if (JSON.parse(repeated[6]).signature !== signature) throw new Error('Reintento distinto del original.'); return { ok: true, revision: repeated[0] }; }
  const revision = events.length ? events[events.length-1][0] : null;
  if (request.expectedRevision !== revision) throw new Error('El cuaderno cambió en otra sesión. Copia tu borrador y recarga antes de guardar.');
  ss.getSheetByName('Aventuras').appendRow([request.requestId, new Date().toISOString(), id, data.mission, '', 'BORRADOR', JSON.stringify({ signature: signature, snapshot: data.snapshot })]);
  return { ok: true, revision: request.requestId };
}
function consultarVentaja_(ss,id,request){return consultarVentajaRpg_(ss,id,request);}

/** Vista derivada para revisión docente. No altera los cuadernos ni su historial. */
function actualizarResumenCuadernosLudaria() {
  if (!Session.getActiveUser().getEmail() || Session.getActiveUser().getEmail() !== Session.getEffectiveUser().getEmail() || !SpreadsheetApp.getActiveSpreadsheet()) {
    throw new Error('Actualiza el resumen desde el editor con la cuenta propietaria.');
  }
  return conBloqueo_(function () {
    const ss = base_(), names = {}, latest = {};
    filas_(ss, 'Personajes').forEach(function(r){names[r[0]]=r[1];});
    filas_(ss, 'Aventuras').forEach(function(r){if(r[5]==='BORRADOR')latest[r[2]+'|'+r[3]]=r;});
    const headers = ['ID personaje','Nombre','Misión','Índice de página (base 0)','Último guardado','Estado','Revisión','Respuestas actuales'];
    const rows = Object.keys(latest).sort().map(function(key){
      const r = latest[key], snapshot = JSON.parse(r[6]).snapshot;
      const fields = snapshot.fields || {tarjetas:snapshot.cards,nota:snapshot.note};
      const text = Object.keys(fields).map(function(k){const v=fields[k];return k+': '+(typeof v==='string'?v:JSON.stringify(v));}).join('\n');
      return [r[2],names[r[2]]||'Personaje no encontrado',r[3],snapshot.page,r[1],'Confirmado',r[0],text].map(function(v){return typeof v==='string' && /^[=+@-]/.test(v) ? "'"+v : v;});
    });
    let sheet = ss.getSheetByName('CuadernosActuales');
    if (sheet && sheet.getLastRow()) validarCabecera_(sheet,headers);
    if (!sheet) sheet=ss.insertSheet('CuadernosActuales');
    const oldCount=sheet.getLastRow();
    sheet.getRange(1,1,1,headers.length).setValues([headers]).setBackground('#163e2a').setFontColor('#ffffff').setFontWeight('bold');
    if(rows.length)sheet.getRange(2,1,rows.length,headers.length).setValues(rows);
    if(oldCount>rows.length+1)sheet.getRange(rows.length+2,1,oldCount-rows.length-1,headers.length).clearContent();
    sheet.setFrozenRows(1);
    console.log('Resumen actualizado: '+rows.length+' cuadernos confirmados. El historial se conserva.');
    return {ok:true,cuadernos:rows.length,actualizado:new Date().toISOString()};
  });
}
