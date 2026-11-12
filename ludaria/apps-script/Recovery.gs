/** Recuperación por correo. Solo se conserva la firma del correo y de los códigos. */
const LUDARIA_EMAIL_TTL = 15 * 60 * 1000;
const LUDARIA_EMAIL_ERROR = 'Revisa el nombre, el correo y el último código. Puedes solicitar otro si venció.';
const LUDARIA_EMAIL_DISABLED = 'La recuperación por correo no está disponible. Puedes usar tu código de respaldo.';

function correoHabilitado_() {
  return PropertiesService.getScriptProperties().getProperty('LUDARIA_EMAIL_RECOVERY_ENABLED') === 'true';
}

/** El propietario autoriza el envío desde el editor. Esta función no envía correos. */
function activarRecuperacionPorCorreoLudaria() {
  const email = Session.getActiveUser().getEmail();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!email || email !== Session.getEffectiveUser().getEmail() || !ss || ss.getId() !== LUDARIA.sheetId) {
    throw new Error('Abre Apps Script desde la planilla de Ludaria con la cuenta propietaria.');
  }
  base_();
  const available = MailApp.getRemainingDailyQuota();
  if (available < 1) throw new Error('Google no tiene cuota de envío disponible hoy.');
  PropertiesService.getScriptProperties().setProperty('LUDARIA_EMAIL_RECOVERY_ENABLED', 'true');
  return {ok:true, enviosDisponibles:available};
}

function correoValido_(raw) {
  const email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(email)) {
    throw new Error('Escribe un correo válido al que tengas acceso.');
  }
  return email;
}

function correoGuardado_(id) {
  const property = 'LUDARIA_CORREO_' + id;
  const raw = PropertiesService.getScriptProperties().getProperty(property);
  return {property:property, raw:raw, value:JSON.parse(raw || '{}')};
}

function versionAcceso_(id) {
  return PropertiesService.getScriptProperties().getProperty('LUDARIA_ACCESS_VERSION_' + id);
}

function limitarEnviosCorreo_(props, id, emailDigest, mode, now) {
  const key = 'LUDARIA_CORREO_ENVIOS';
  const recent = JSON.parse(props.getProperty(key) || '[]').filter(function (entry) {
    return now - entry.at < 60 * 60 * 1000;
  });
  const related = recent.filter(function (entry) { return entry.id === id || entry.email === emailDigest; });
  if (recent.length >= 24 || related.length >= 5) throw new Error('Alcanzaste el límite de envíos. Inténtalo más tarde.');
  if (related.some(function (entry) { return entry.mode === mode && now - entry.at < 60 * 1000; })) {
    throw new Error('Espera un minuto antes de solicitar otro código.');
  }
  recent.push({id:id, email:emailDigest, mode:mode, at:now});
  props.setProperty(key, JSON.stringify(recent));
}

function enviarCodigoCorreo_(saved, id, email, emailDigest, mode, requestId) {
  const props = PropertiesService.getScriptProperties(), now = Date.now(), version = versionAcceso_(id);
  const previous = saved.value[mode];
  if (previous && previous.requestId === requestId && previous.email === emailDigest && previous.version === version && previous.expires > now) return;
  limitarEnviosCorreo_(props, id, emailDigest, mode, now);
  const code = String(parseInt(firma_('codigo-correo|' + Utilities.getUuid()).slice(0, 12), 16) % 1000000).padStart(6, '0');
  const proof = {
    email:emailDigest, digest:firma_([mode,id,emailDigest,code].join('|')),
    expires:now + LUDARIA_EMAIL_TTL, failures:0, requestId:requestId, version:version
  };
  const next = Object.assign({}, saved.value);
  next[mode] = proof;
  props.setProperty(saved.property, JSON.stringify(next));
  const subject = mode === 'verify' ? 'Verifica tu correo en Ludaria' : 'Recupera tu clave de Ludaria';
  try {
    MailApp.sendEmail(email, subject, 'Tu código es ' + code + '. Escríbelo en Ludaria antes de 15 minutos. Si tú no lo solicitaste, puedes ignorar este mensaje.', {name:'Ludaria'});
  } catch (_) {
    if (saved.raw) props.setProperty(saved.property, saved.raw); else props.deleteProperty(saved.property);
    throw new Error('No se pudo enviar el correo. Puedes intentarlo más tarde o usar tu código de respaldo.');
  }
}

function verificarCodigoCorreo_(saved, id, mode, emailDigest, code, message) {
  const proof = saved.value[mode];
  if (!proof || proof.expires <= Date.now() || proof.failures >= LUDARIA.maxAttempts ||
      proof.version !== versionAcceso_(id) || !iguales_(proof.email, emailDigest)) throw new Error(message);
  if (!/^\d{6}$/.test(code) || !iguales_(proof.digest, firma_([mode,id,emailDigest,code].join('|')))) {
    proof.failures++;
    PropertiesService.getScriptProperties().setProperty(saved.property, JSON.stringify(saved.value));
    throw new Error(message);
  }
}

function enviarVerificacionCorreo_(ss, record, request) {
  validarSolicitud_(request.requestId);
  const data = request.data || {}, id = record[0], email = correoValido_(data.email);
  const result = identificarExplorador_(ss, record[1], limpiarClave_(data.currentKey));
  if (!result.ok) throw new Error(result.message);
  const saved = correoGuardado_(id), digest = firma_('correo|' + email);
  if (iguales_(saved.value.email, digest)) return {ok:true, verified:true};
  enviarCodigoCorreo_(saved, id, email, digest, 'verify', request.requestId);
  return {ok:true, verified:false};
}

function confirmarCorreoRecuperacion_(id, data) {
  const saved = correoGuardado_(id), digest = firma_('correo|' + correoValido_(data.email));
  // Si la confirmación anterior se guardó, el mismo correo ya es recuperable.
  if (iguales_(saved.value.email, digest)) return {ok:true, verified:true};
  verificarCodigoCorreo_(saved, id, 'verify', digest, limpiarClave_(data.code), 'Revisa el último código del correo o solicita uno nuevo.');
  PropertiesService.getScriptProperties().setProperty(saved.property, JSON.stringify({email:digest}));
  return {ok:true, verified:true};
}

function enviarCodigoRecuperacion_(ss, request) {
  validarSolicitud_(request.requestId);
  const data = request.data || {}, email = correoValido_(data.email);
  const record = buscarPersonaje_(ss, normalizarAlias_(data.name));
  if (record && record[8] === 'ACTIVO') {
    const id = record[0], saved = correoGuardado_(id), digest = firma_('correo|' + email);
    if (iguales_(saved.value.email, digest)) {
      try { enviarCodigoCorreo_(saved, id, email, digest, 'reset', request.requestId); }
      catch (_) { /* La respuesta pública es la misma aunque no se envíe. */ }
    }
  }
  return {ok:true};
}

function recuperarClavePorCorreo_(ss, request) {
  validarSolicitud_(request.requestId);
  const data = request.data || {}, alias = normalizarAlias_(data.name), email = correoValido_(data.email);
  const key = claveElegida_(data.key, data.keyConfirm), code = limpiarClave_(data.code);
  const records = filas_(ss, 'Personajes');
  const index = records.findIndex(function (r) { return r[2] === alias && r[8] === 'ACTIVO'; });
  if (index < 0) throw new Error(LUDARIA_EMAIL_ERROR);
  const previous = records[index].slice(), id = previous[0], saved = correoGuardado_(id);
  const digest = firma_('correo|' + email), proof = saved.value.reset;
  if (!iguales_(saved.value.email, digest) || !proof || proof.expires <= Date.now()) throw new Error(LUDARIA_EMAIL_ERROR);
  const signature = firma_(JSON.stringify({alias:alias, email:digest, key:key, code:code}));
  if (proof.used) {
    if (proof.used === request.requestId && versionAcceso_(id) === request.requestId && iguales_(proof.signature, signature)) {
      return respuestaClaveRenovada_(ss, id, key);
    }
    throw new Error(LUDARIA_EMAIL_ERROR);
  }
  verificarCodigoCorreo_(saved, id, 'reset', digest, code, LUDARIA_EMAIL_ERROR);
  const next = {email:digest, reset:{expires:proof.expires, used:request.requestId, signature:signature}};
  return reemplazarClavePublica_(ss, index, previous, request, key, 'CORREO', saved.property, saved.raw, next);
}
