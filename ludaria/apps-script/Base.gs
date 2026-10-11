const LUDARIA = Object.freeze({
  sheetId: PropertiesService.getScriptProperties().getProperty('LUDARIA_SHEET_ID') || (SpreadsheetApp.getActiveSpreadsheet() && SpreadsheetApp.getActiveSpreadsheet().getId()),
  version: '0.1.0',
  maxAttempts: 5,
  attemptWindowMs: 15 * 60 * 1000,
  attributes: ['sabiduria', 'maestria', 'creacion', 'evaluacion', 'camaraderia'],
  headers: {
    Personajes: ['ID', 'Nombre', 'Alias normalizado', 'Personaje', 'Sal PIN', 'Verificador PIN', 'Tipo', 'Creado', 'Estado'],
    Progreso: ['ID', 'Nombre', 'Personaje', 'Nivel', 'XP', 'Puntos', 'Sabiduría', 'Maestría', 'Creación', 'Evaluación', 'Camaradería', 'Ventajas disponibles JSON', 'Actualizado'],
    Movimientos: ['Solicitud', 'Fecha', 'ID', 'Acción', 'Detalle JSON', 'Perfil JSON'],
    CatalogoAtributos: ['Clave', 'Atributo', 'Descripción', 'Inicial', 'Máximo', 'Coste por mejora', 'Umbrales de talento'],
    CatalogoVentajas: ['ID', 'Atributo', 'Mínimo', 'Misión', 'Nombre', 'Descripción', 'Estado de integración'],
    Aventuras: ['Evento', 'Fecha', 'ID', 'Misión', 'Ventaja', 'Acción', 'Detalle JSON'],
    Reflexiones: ['Evento', 'Fecha', 'ID', 'Contexto', 'Reflexión'],
    Panel: ['ID', 'Nombre', 'Tipo', 'Nivel', 'XP', 'Puntos', 'Atributo predominante', 'Ventajas disponibles', 'Movimientos', 'Actualizado'],
    Pruebas: ['Ejecución', 'Fecha', 'Comprobación', 'Resultado', 'Detalle']
  }
});

/** Solo editor. Repetible: conserva datos y secreto, y valida cabeceras. */
function instalarLudaria_() {
  return conBloqueo_(function () {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (!active || active.getId() !== LUDARIA.sheetId) {
      throw new Error('Abre Extensiones > Apps Script desde la planilla LUDARIA indicada.');
    }
    const props = PropertiesService.getScriptProperties();
    const bound = props.getProperty('LUDARIA_SHEET_ID');
    if (bound && bound !== LUDARIA.sheetId) throw new Error('Este proyecto ya está vinculado a otra planilla.');
    // Revisar TODAS las pestañas antes de modificar cualquiera.
    Object.keys(LUDARIA.headers).forEach(function (name) {
      const sheet = active.getSheetByName(name);
      if (sheet && sheet.getLastRow()) validarCabecera_(sheet, LUDARIA.headers[name]);
    });
    if (!props.getProperty('LUDARIA_PIN_PEPPER')) {
      if (active.getSheetByName('Personajes') && active.getSheetByName('Personajes').getLastRow() > 1) {
        throw new Error('Falta el secreto original. No se regenerará sobre personajes existentes.');
      }
      props.setProperty('LUDARIA_PIN_PEPPER', Utilities.getUuid() + Utilities.getUuid());
    }
    props.setProperty('LUDARIA_SHEET_ID', LUDARIA.sheetId);
    Object.keys(LUDARIA.headers).forEach(function (name) {
      const headers = LUDARIA.headers[name];
      const sheet = active.getSheetByName(name) || active.insertSheet(name);
      if (!sheet.getLastRow()) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setBackground('#163e2a').setFontColor('#ffffff').setFontWeight('bold');
      sheet.autoResizeColumns(1, headers.length);
    });
    const catalog = active.getSheetByName('CatalogoAtributos');
    if (catalog.getLastRow() === 1) catalog.getRange(2, 1, 5, 7).setValues([
      ['sabiduria', 'Sabiduría', 'Comprender qué es y qué no es gamificación.', 1, 10, 1, '3 / 5 / 8'],
      ['maestria', 'Maestría', 'Relacionar dinámicas, mecánicas y componentes.', 1, 10, 1, '3 / 5 / 8'],
      ['creacion', 'Creación', 'Convertir ideas en experiencias y prototipos.', 1, 10, 1, '3 / 5 / 8'],
      ['evaluacion', 'Evaluación', 'Revisar diseños con criterios pedagógicos.', 1, 10, 1, '3 / 5 / 8'],
      ['camaraderia', 'Camaradería', 'Colaborar y compartir saberes con el grupo.', 1, 10, 1, '3 / 5 / 8']
    ]);
    const advantages = active.getSheetByName('CatalogoVentajas');
    if (advantages.getLastRow() === 1) advantages.appendRow([
      'ojo_artesano', 'maestria', 5, 'vetas-diseno', 'Ojo del Artesano',
      'Consultar un esquema de apoyo para distinguir dinámicas, mecánicas y componentes.',
      'Piloto pendiente de integrar en la misión'
    ]);
    props.setProperty('LUDARIA_SCHEMA_VERSION', LUDARIA.version);
    SpreadsheetApp.flush();
    console.log('LUDARIA: instalación completada. Ahora ejecuta probarLudaria_.');
    return { ok: true, version: LUDARIA.version, sheets: Object.keys(LUDARIA.headers).length };
  });
}

/** Solo editor. Crea un único personaje DEMO; nunca acredita puntos de misiones. */
function probarLudaria_() {
  return conBloqueo_(function () {
    const ss = base_();
    const props = PropertiesService.getScriptProperties();
    const pin = props.getProperty('LUDARIA_DEMO_PIN') ||
      ('000000' + (parseInt(Utilities.getUuid().replace(/-/g, '').slice(0, 10), 16) % 1000000)).slice(-6);
    props.setProperty('LUDARIA_DEMO_PIN', pin);
    const alias = 'Explorador Demo Ludaria';
    const existing = buscarPersonaje_(ss, normalizarAlias_(alias));
    if (existing && existing[6] !== 'DEMO') throw new Error('El alias de prueba pertenece a un personaje real.');
    const record = existing || crearPersonaje_(ss, alias, pin, 'Kira', 'DEMO');
    asegurarCreacion_(ss, record);
    const attemptKey = claveIntentos_(normalizarAlias_(alias));
    const previousAttempts = props.getProperty(attemptKey);
    props.deleteProperty(attemptKey); // Solo la cuenta DEMO para una prueba repetible.
    const run = Utilities.getUuid();
    const results = [];
    const check = function (name, passed, detail) {
      results.push([run, new Date().toISOString(), name, passed ? 'OK' : 'ERROR', detail]);
    };
    try {
      const original = perfilActual_(ss, record[0]);
      const auth = identificarExplorador_(ss, '  EXPLORADOR   DEMO LUDARIA  ', pin);
      check('Identificación central con mayúsculas y espacios', auth.ok && auth.profile.id === record[0], 'Consulta el perfil guardado en Movimientos.');
      check('Acentos equivalentes', normalizarAlias_('  NÍCOLAS  del Bosque ') === normalizarAlias_('nicolas del bosque'), 'No utiliza coincidencias aproximadas.');
      const wrongPin = pin === '000000' ? '000001' : '000000';
      const wrong = identificarExplorador_(ss, alias, wrongPin);
      check('PIN incorrecto rechazado', !wrong.ok && !wrong.profile, 'No devuelve atributos ni datos del personaje.');
      const absent = identificarExplorador_(ss, 'personaje inexistente ' + run.slice(0, 8), pin);
      check('Personaje inexistente rechazado', !absent.ok && !absent.profile, 'Mismo mensaje para credenciales incorrectas.');
      for (let i = 1; i < LUDARIA.maxAttempts; i++) identificarExplorador_(ss, alias, wrongPin);
      const blocked = identificarExplorador_(ss, alias, pin);
      check('Límite de intentos', !blocked.ok && blocked.error === 'ESPERA', 'Cinco fallos bloquean temporalmente ese alias.');
      props.deleteProperty(attemptKey);
      const low = ventajasDisponibles_(original.skills);
      const simulated = Object.assign({}, original.skills, { maestria: 5 });
      check('Ventaja condicionada al atributo', low.length === 0 && ventajasDisponibles_(simulated).some(function (v) { return v.id === 'ojo_artesano'; }), 'Maestría 5 se simula en memoria; no modifica el personaje.');
      check('Ventaja desaparece al bajar el atributo', ventajasDisponibles_(Object.assign({}, simulated, { maestria: 4 })).length === 0, 'Se calcula con atributos actuales, no con desbloqueos históricos.');
      const final = perfilActual_(ss, record[0]);
      check('Pruebas sin alterar progreso', JSON.stringify(final) === JSON.stringify(original), 'Conserva puntos, XP, atributos e historial del personaje DEMO.');
      check('PIN no guardado en texto', record[5] !== pin && /^[a-f0-9]{64}$/.test(record[5]), 'Se guarda un verificador con sal y secreto privado del proyecto.');
      actualizarVistas_(ss, record, final);
      ss.getSheetByName('Pruebas').getRange(ss.getSheetByName('Pruebas').getLastRow() + 1, 1, results.length, 5).setValues(results);
      SpreadsheetApp.flush();
      if (results.some(function (r) { return r[3] !== 'OK'; })) throw new Error('Alguna prueba falló. Revisa la pestaña Pruebas.');
      console.log('LUDARIA: ' + results.length + '/' + results.length + ' pruebas OK. Base privada preparada; conexión con Genially pendiente.');
      return { ok: true, checks: results.length, demoId: record[0] };
    } finally {
      if (previousAttempts) props.setProperty(attemptKey, previousAttempts);
      else props.deleteProperty(attemptKey);
    }
  });
}

/** Todo lo que sigue es privado; las funciones terminadas en _ no se exponen a google.script.run. */
function conBloqueo_(work) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { return work(); } finally { lock.releaseLock(); }
}
function validarCabecera_(sheet, headers) {
  const actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (JSON.stringify(actual) !== JSON.stringify(headers) || sheet.getLastColumn() > headers.length) {
    throw new Error('La pestaña ' + sheet.getName() + ' tiene otra estructura. No se sobrescribió.');
  }
}
function base_() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('LUDARIA_SHEET_ID') !== LUDARIA.sheetId || !props.getProperty('LUDARIA_PIN_PEPPER')) {
    throw new Error('Primero ejecuta instalarLudaria_.');
  }
  const ss = SpreadsheetApp.openById(LUDARIA.sheetId);
  Object.keys(LUDARIA.headers).forEach(function (name) {
    const sheet = ss.getSheetByName(name);
    if (!sheet) throw new Error('Falta la pestaña ' + name + '. Ejecuta instalarLudaria_.');
    validarCabecera_(sheet, LUDARIA.headers[name]);
  });
  return ss;
}
function filas_(ss, name) {
  const sheet = ss.getSheetByName(name);
  return sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, LUDARIA.headers[name].length).getValues();
}
function normalizarAlias_(raw) {
  if (typeof raw !== 'string' || raw.length > 100) throw new Error('Nombre inválido.');
  const name = raw.normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 32 || !/^[A-Za-z0-9\u00C0-\u024F][A-Za-z0-9\u00C0-\u024F .'-]*$/.test(name)) throw new Error('Usa un nombre de 2 a 32 caracteres, con letras y números.');
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function buscarPersonaje_(ss, alias) {
  const matches = filas_(ss, 'Personajes').filter(function (r) { return r[2] === alias; });
  if (matches.length > 1) throw new Error('Alias duplicado en el registro. Requiere revisión del propietario.');
  return matches[0] || null;
}
function firma_(value) {
  const secret = PropertiesService.getScriptProperties().getProperty('LUDARIA_PIN_PEPPER');
  if (!secret) throw new Error('Falta el secreto del proyecto.');
  return Utilities.computeHmacSha256Signature(value, secret, Utilities.Charset.UTF_8).map(function (b) {
    return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
  }).join('');
}
function iguales_(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}
function claveIntentos_(alias) { return 'LUDARIA_AUTH_' + firma_('alias|' + alias); }
function perfilInicial_(id, name, avatar) {
  const skills = {};
  LUDARIA.attributes.forEach(function (key) { skills[key] = 1; });
  return { id: id, name: name, class: avatar, skills: skills, points: 0, xp: 0, level: 1, codes: [], missions: [], nodes: [], achs: ['primer_paso'], version: 3 };
}
/** Invocar únicamente con bloqueo adquirido. Registro recuperable si falla la vista derivada. */
function crearPersonaje_(ss, name, pin, avatar, type) {
  const alias = normalizarAlias_(name);
  if (!claveValida_(pin)) throw new Error('Clave personal inválida.');
  if (!['Kael', 'Kira'].includes(avatar) || !['DEMO', 'PARTICIPANTE'].includes(type)) throw new Error('Tipo de personaje inválido.');
  if (buscarPersonaje_(ss, alias)) throw new Error('Ese nombre de explorador ya existe.');
  const id = Utilities.getUuid(), salt = Utilities.getUuid(), at = new Date().toISOString();
  const cleanName = name.normalize('NFKC').trim().replace(/\s+/g, ' ');
  const record = [id, cleanName, alias, avatar, salt, firma_(id + '|' + salt + '|' + pin), type, at, 'ACTIVO'];
  ss.getSheetByName('Personajes').appendRow(record);
  asegurarCreacion_(ss, record);
  return record;
}
function asegurarCreacion_(ss, record) {
  const found = filas_(ss, 'Movimientos').some(function (r) { return r[2] === record[0]; });
  if (!found) ss.getSheetByName('Movimientos').appendRow([
    'crear-' + record[0], record[7], record[0], 'CREACION', JSON.stringify({ tipo: record[6] }),
    JSON.stringify(perfilInicial_(record[0], record[1], record[3]))
  ]);
}
function perfilActual_(ss, id) {
  const movements = filas_(ss, 'Movimientos').filter(function (r) { return r[2] === id; });
  if (!movements.length) throw new Error('Personaje sin perfil confirmado.');
  const p = JSON.parse(movements[movements.length - 1][5]);
  if (p.id !== id || !p.skills || LUDARIA.attributes.some(function (key) {
    return !Number.isInteger(p.skills[key]) || p.skills[key] < 1 || p.skills[key] > 10;
  }) || !Number.isInteger(p.points) || p.points < 0 || !Number.isInteger(p.xp) || p.xp < 0) {
    throw new Error('El perfil guardado requiere revisión.');
  }
  return p;
}
/** Invocar únicamente con bloqueo adquirido. Sin sesiones ni credenciales en URLs. */
function identificarExplorador_(ss, name, pin) {
  let alias;
  try { alias = normalizarAlias_(name); } catch (_) { return { ok: false, error: 'CREDENCIALES', message: 'Revisa tu nombre de explorador y PIN.' }; }
  const props = PropertiesService.getScriptProperties();
  const key = claveIntentos_(alias), now = Date.now();
  let attempts = JSON.parse(props.getProperty(key) || 'null');
  if (!attempts || now - attempts.start >= LUDARIA.attemptWindowMs) attempts = { start: now, failures: 0 };
  if (attempts.failures >= LUDARIA.maxAttempts) return { ok: false, error: 'ESPERA', message: 'Espera unos minutos antes de intentarlo nuevamente.' };
  const record = buscarPersonaje_(ss, alias);
  const validPin = claveValida_(pin);
  const candidate = firma_((record ? record[0] + '|' + record[4] : 'inexistente|sin-sal') + '|' + (validPin ? pin : 'invalido'));
  if (!record || record[8] !== 'ACTIVO' || !validPin || !iguales_(candidate, record[5])) {
    // No crear una clave persistente por cada alias inventado; el acceso público aún no está implementado.
    if (record) { attempts.failures++; props.setProperty(key, JSON.stringify(attempts)); }
    return { ok: false, error: 'CREDENCIALES', message: 'Revisa tu nombre de explorador y PIN.' };
  }
  props.deleteProperty(key);
  asegurarCreacion_(ss, record);
  const profile = perfilActual_(ss, record[0]);
  return { ok: true, profile: profile, advantages: ventajasDisponibles_(profile.skills) };
}
/** Regla piloto; el apoyo todavía no existe dentro de la misión publicada. */
function ventajasDisponibles_(skills) {
  return Number.isInteger(skills.maestria) && skills.maestria >= 5 ? [{
    id: 'ojo_artesano', attribute: 'maestria', minimum: 5, mission: 'vetas-diseno',
    name: 'Ojo del Artesano', integration: 'PILOTO'
  }] : [];
}
function escribirVista_(ss, name, id, values) {
  const existing = filas_(ss, name).findIndex(function (r) { return r[0] === id; });
  const sheet = ss.getSheetByName(name);
  sheet.getRange(existing < 0 ? sheet.getLastRow() + 1 : existing + 2, 1, 1, values.length).setValues([values]);
}
function actualizarVistas_(ss, record, p) {
  const at = new Date().toISOString(), advantages = ventajasDisponibles_(p.skills);
  escribirVista_(ss, 'Progreso', p.id, [p.id, p.name, p.class, p.level, p.xp, p.points].concat(
    LUDARIA.attributes.map(function (k) { return p.skills[k]; }), [JSON.stringify(advantages), at]
  ));
  const best = Math.max.apply(null, LUDARIA.attributes.map(function (k) { return p.skills[k]; }));
  const dominant = LUDARIA.attributes.filter(function (k) { return p.skills[k] === best; }).join(', ');
  escribirVista_(ss, 'Panel', p.id, [p.id, p.name, record[6], p.level, p.xp, p.points, dominant,
    advantages.map(function (a) { return a.name + ' (piloto)'; }).join(', '),
    filas_(ss, 'Movimientos').filter(function (r) { return r[2] === p.id; }).length, at]);
}
