/** LUDARIA · Conexión central v0.2.0. Funciones privadas conservan el sufijo _. */
const LUDARIA_WEB = Object.freeze({
  pages: 'https://nespinozagonzalez-hub.github.io/misiones/',
  raw: 'https://raw.githubusercontent.com/nespinozagonzalez-hub/misiones/main/',
  routes: ['forja', 'vetas-diseno'],
  maxCharacters: 300,
  sessionMs: 4 * 60 * 60 * 1000
});

/** Ejecutar desde el editor con la cuenta propietaria, antes de implementar. */
function prepararConexionLudaria() {
  const active = Session.getActiveUser().getEmail();
  const effective = Session.getEffectiveUser().getEmail();
  if (!active || active !== effective || !SpreadsheetApp.getActiveSpreadsheet()) {
    throw new Error('Ejecuta esta preparación desde el editor, con la cuenta propietaria.');
  }
  instalarLudaria_();
  const props = PropertiesService.getScriptProperties();
  props.setProperty('LUDARIA_WEB_ENABLED', 'true');
  // Autoriza UrlFetch al ejecutar en el editor. No se descargan datos de participantes.
  const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + 'forja/index.html');
  if (response.getResponseCode() !== 200) throw new Error('No se pudo comprobar la interfaz de Forja.');
  console.log('Conexión preparada. Implementa como aplicación web, ejecutada como propietario. La planilla sigue privada.');
  return { ok: true, version: '0.2.0' };
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
  const response = UrlFetchApp.fetch(LUDARIA_WEB.raw + route + '/index.html');
  if (response.getResponseCode() !== 200) throw new Error('No se pudo cargar la presentación.');
  const entry = params.entrada === 'mochi';
  let html = response.getContentText();
  html = html.replace(/<base\b[^>]*>/gi, '');
  const config = JSON.stringify({ route: route, market: entry }).replace(/</g, '\\u003c');
  const insertion = '<base href="' + LUDARIA_WEB.pages + route + '/" target="_self">' +
    '<script>window.LUDARIA_CLOUD_CONFIG=' + config + ';window.FORJA_ENTRY=' + entry + ';</script>' +
    '<script>' + LUDARIA_CLIENT_SOURCE.replace(/<\/script/gi, '<\\/script') + '</script>';
  html = html.replace(/<head[^>]*>/i, function (head) { return head + insertion; });
  return HtmlService.createHtmlOutput(html).setTitle('Ludaria · ' + (entry ? 'Mercadito de Mochi' : route === 'forja' ? 'Forja del Buscador' : 'Las Vetas del Diseño'))
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Único punto público para operaciones de participantes. No devuelve filas privadas. */
function ludariaApi(request) {
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
        return respuestaPerfil_(ss, result.profile.id, tokenSesion_(result.profile.id));
      }
      if (request.action === 'registrar') return registrarPublico_(ss, request);
      const id = validarSesion_(request.access);
      const record = filas_(ss, 'Personajes').find(function (r) { return r[0] === id && r[8] === 'ACTIVO'; });
      if (!record) throw new Error('Acceso cerrado. Vuelve a identificarte.');
      if (request.action === 'cargar') return respuestaPerfil_(ss, id);
      if (request.action === 'cargarMision') {
        validarMision_(data.mission);
        const events = filas_(ss, 'Aventuras').filter(function (r) { return r[2] === id && r[3] === data.mission && r[5] === 'BORRADOR'; });
        const last = events.length ? events[events.length - 1] : null;
        return { ok: true, snapshot: last ? JSON.parse(last[6]).snapshot : null, revision: last ? last[0] : null };
      }
      if (request.action === 'guardarMision') return guardarMision_(ss, id, request);
      if (request.action === 'ventaja') return consultarVentaja_(ss, id, request);
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
      const p = perfilActual_(ss, id), before = p.points;
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
        JSON.stringify({ signature: signature, detail: detail, before: before, after: p.points, data: data }), JSON.stringify(p)]);
      // El movimiento confirmado es la fuente de verdad. Una vista se puede reconstruir.
      try { actualizarVistas_(ss, record, p); } catch (_) { console.log('LUDARIA: vista derivada pendiente de reconstruir.'); }
      return respuestaPerfil_(ss, id);
    });
  } catch (error) { return { ok: false, message: error.message || 'No se pudo confirmar la operación.' }; }
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
  const hex = firma_('alta|' + request.requestId + '|' + alias + '|' + data.class).slice(0, 24).toUpperCase();
  const key = 'LUD-' + hex.match(/.{6}/g).join('-');
  const existing = buscarPersonaje_(ss, alias);
  if (existing) {
    if (!iguales_(firma_(existing[0] + '|' + existing[4] + '|' + key), existing[5])) throw new Error('Ese nombre ya está registrado. Entra con tu clave o elige otro nombre.');
    asegurarCreacion_(ss, existing);
    const response = respuestaPerfil_(ss, existing[0], tokenSesion_(existing[0])); response.key = key; return response;
  }
  if (filas_(ss, 'Personajes').length >= LUDARIA_WEB.maxCharacters) throw new Error('Registro completo. Contacta al facilitador.');
  const record = crearPersonaje_(ss, data.name, key, data.class, 'PARTICIPANTE');
  actualizarVistas_(ss, record, perfilActual_(ss, record[0]));
  const response = respuestaPerfil_(ss, record[0], tokenSesion_(record[0])); response.key = key; return response;
}
function tokenSesion_(id) {
  const value = id + '.' + (Date.now() + LUDARIA_WEB.sessionMs) + '.' + Utilities.getUuid();
  return value + '.' + firma_('sesion|' + value);
}
function validarSesion_(token) {
  if (typeof token !== 'string' || token.length > 250) throw new Error('Identifícate con tu nombre y clave.');
  const parts = token.split('.'), value = parts.slice(0, 3).join('.');
  if (parts.length !== 4 || !iguales_(firma_('sesion|' + value), parts[3]) || !/^\d+$/.test(parts[1]) || Number(parts[1]) <= Date.now()) throw new Error('Tu sesión terminó. Vuelve a entrar con tu nombre y clave.');
  return parts[0];
}
function cantidades_(raw, min, max) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || Object.keys(raw).some(function (k) { return !LUDARIA.attributes.includes(k); })) throw new Error('Atributos inválidos.');
  const result = {};
  LUDARIA.attributes.forEach(function (key) { if (!Number.isInteger(raw[key]) || raw[key] < min || raw[key] > max) throw new Error('Cantidad inválida en ' + key + '.'); result[key] = raw[key]; });
  return result;
}
function respuestaPerfil_(ss, id, access) {
  const p = perfilActual_(ss, id), moves = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
  p.history = moves.slice(-1000).map(function (r) { const d = JSON.parse(r[4]); return { id: r[0], at: r[1], type: String(r[3]).toLowerCase(), detail: d.detail || 'Creación del personaje', before: d.before || 0, after: d.after || 0, cost: (d.before || 0) - (d.after || 0) }; });
  const result = { ok: true, profile: p, revision: moves[moves.length - 1][0], advantages: ventajasDisponibles_(p.skills) };
  if (access) result.access = access;
  return result;
}
function validarMision_(mission) { if (mission !== 'vetas-diseno') throw new Error('Esta misión aún no está conectada.'); }
function guardarMision_(ss, id, request) {
  const data = request.data; validarMision_(data.mission); validarSolicitud_(request.requestId);
  if (!data.snapshot || typeof data.snapshot !== 'object' || Array.isArray(data.snapshot) || JSON.stringify(data.snapshot).length > 40000) throw new Error('Borrador inválido o demasiado extenso.');
  const events = filas_(ss, 'Aventuras').filter(function (r) { return r[2] === id && r[3] === data.mission && r[5] === 'BORRADOR'; });
  const signature = firma_(JSON.stringify(data.snapshot));
  const repeated = events.find(function (r) { return r[0] === request.requestId; });
  if (repeated) { if (JSON.parse(repeated[6]).signature !== signature) throw new Error('Reintento distinto del original.'); return { ok: true, revision: repeated[0] }; }
  const revision = events.length ? events[events.length-1][0] : null;
  if (request.expectedRevision !== revision) throw new Error('El cuaderno cambió en otra sesión. Copia tu borrador y recarga antes de guardar.');
  ss.getSheetByName('Aventuras').appendRow([request.requestId, new Date().toISOString(), id, data.mission, '', 'BORRADOR', JSON.stringify({ signature: signature, snapshot: data.snapshot })]);
  return { ok: true, revision: request.requestId };
}
function consultarVentaja_(ss, id, request) {
  validarSolicitud_(request.requestId);
  if (request.data.id !== 'ojo_artesano' || !ventajasDisponibles_(perfilActual_(ss, id).skills).length) throw new Error('Ojo del Artesano requiere Maestría 5 actual.');
  const repeated = filas_(ss, 'Aventuras').some(function (r) { return r[0] === request.requestId && r[2] === id && r[5] === 'CONSULTA_VENTAJA'; });
  if (!repeated) ss.getSheetByName('Aventuras').appendRow([request.requestId, new Date().toISOString(), id, 'vetas-diseno', 'ojo_artesano', 'CONSULTA_VENTAJA', '{}']);
  return { ok: true, text: 'Dinámicas: experiencia global y relaciones. Mecánicas: reglas y procesos que hacen actuar. Componentes: representaciones concretas. Identifica la unidad de análisis y justifica según el contexto. Esta pauta no resuelve la actividad ni cambia su evaluación.' };
}
