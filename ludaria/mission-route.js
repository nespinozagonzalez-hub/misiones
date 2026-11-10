/** Ruta de hitos, consigna «Ahora» y momentos de juego de las misiones.
 * Extiende el piloto de La Gema Motivacional al resto del recorrido.
 * Solo orienta: no evalúa, no guarda datos y no concede puntos, XP ni runas.
 * Lee la pantalla actual y las pantallas visitadas desde #route-dots. */
(() => {
  'use strict';
  const EXPLORA = 'explora', ELIGE = 'elige', PRUEBA = 'prueba';
  const MODES = {
    explora: { label: 'Explora libre', hint: 'Exploración libre' },
    elige: { label: 'Tú eliges', hint: 'Decisión del jugador' },
    prueba: { label: 'Prueba y ajusta', hint: 'Experimentación guiada' }
  };
  // phases: [nombre, primera pantalla, última pantalla]. now: pantallas con una consigna de acción.
  // moves: pantalla -> [momento, indicación]. Las pantallas se cuentan desde 1.
  const ROUTES = {
    'pergaminos-dispersos': {
      name: 'Ruta de los Pergaminos',
      phases: [['Prepara', 1, 3], ['Explora', 4, 8], ['Clasifica', 9, 11], ['Cierra', 12, 14]],
      now: [2, 8, 9, 10, 11, 13, 14],
      moves: {
        2: [ELIGE, 'Elige la duda conceptual que quieres llevar a tu equipo.'],
        8: [PRUEBA, 'Responde, contrasta y vuelve a intentarlo. La pista y la apertura acompañada siguen disponibles.'],
        9: [ELIGE, 'Decidan el orden de los casos y el rasgo que sostiene cada clasificación antes de contrastar.'],
        10: [PRUEBA, 'Propongan una lectura, contrástenla y ajusten lo que haga falta.'],
        11: [ELIGE, 'Elijan qué clasificación dudosa presentar y qué evidencias mostrar.'],
        13: [ELIGE, 'Esta respuesta es tuya: decide con tus palabras qué rasgo la sostiene.']
      }
    },
    'senda-ejemplos': {
      name: 'Ruta de la Senda',
      phases: [['Recupera', 1, 4], ['Investiga', 5, 9], ['Contrasta', 10, 10], ['Cierra', 11, 12]],
      now: [3, 4, 6, 8, 9, 10, 11],
      moves: {
        3: [PRUEBA, 'Arma la frase, compruébala y ajústala las veces que necesites.'],
        4: [PRUEBA, 'Relaciona, revisa y corrige. Equivocarte aquí forma parte de la práctica.'],
        5: [EXPLORA, 'Abre las pistas del expediente en el orden que prefieras y anota un hallazgo.'],
        6: [PRUEBA, 'Marca, abre el candado y vuelve a intentarlo. Puedes pedir una pista o consultar el expediente.'],
        7: [EXPLORA, 'Abre las pistas del expediente en el orden que prefieras y anota un hallazgo.'],
        8: [PRUEBA, 'Clasifica, comprueba y ajusta. La pista y el expediente siguen disponibles.'],
        9: [PRUEBA, 'Reconstruye el principio, comprueba y corrige si hace falta.'],
        10: [ELIGE, 'Elijan qué interpretación compartir y qué evidencia la sostiene.'],
        11: [ELIGE, 'Decide qué adaptarías a tu asignatura y por qué.']
      }
    },
    'claro-debate': {
      name: 'Ruta del Claro',
      phases: [['Toma postura', 1, 3], ['Lee', 4, 8], ['Debate', 9, 10], ['Cierra', 11, 12]],
      now: [3, 4, 5, 6, 7, 8, 9, 10, 11],
      moves: {
        3: [ELIGE, 'Registren una postura por afirmación. Esta votación no tiene corrección automática.'],
        4: [EXPLORA, 'Abran las tres fuentes en el orden que prefieran.'],
        5: [ELIGE, 'Tomen postura antes de revelar la evidencia. Después decidan qué conservar o matizar.'],
        6: [ELIGE, 'Tomen postura antes de revelar la evidencia. Después decidan qué conservar o matizar.'],
        7: [ELIGE, 'Tomen postura antes de revelar la evidencia. Después decidan qué conservar o matizar.'],
        8: [ELIGE, 'Tomen postura antes de revelar la evidencia. Después decidan qué conservar o matizar.'],
        9: [ELIGE, 'Elijan qué afirmación defender y qué objeción quieren responder.'],
        10: [PRUEBA, 'Ordenen la pauta, comprueben y deshagan pasos las veces que necesiten.'],
        11: [ELIGE, 'Decidan qué acuerdos, matices y preguntas quedan en la síntesis.']
      }
    },
    'vetas-diseno': {
      name: 'Ruta de las Vetas',
      phases: [['Entra', 1, 3], ['Explora', 4, 7], ['Clasifica', 8, 12], ['Cierra', 13, 14]],
      now: [3, 4, 8, 9, 10, 13],
      moves: {
        3: [ELIGE, 'Elige una opción, comparte el porqué y vuelve a mirarla después de conversar.'],
        4: [EXPLORA, 'Abre los tres estratos en el orden que prefieras.'],
        5: [EXPLORA, 'Abre las dinámicas que te interesen. El catálogo completo queda a un clic.'],
        6: [EXPLORA, 'Abre las mecánicas que te interesen. El catálogo completo queda a un clic.'],
        7: [EXPLORA, 'Abre los componentes que te interesen. El catálogo completo queda a un clic.'],
        8: [PRUEBA, 'Decide, contrasta y vuelve a intentarlo. La pista sigue disponible.'],
        9: [PRUEBA, 'Clasifiquen, anoten una duda y contrasten después con la pauta.'],
        11: [EXPLORA, 'Abre las cinco dimensiones en el orden que prefieras.'],
        12: [PRUEBA, 'Decide, contrasta y avanza a la siguiente decisión cuando quieras.'],
        13: [PRUEBA, 'Revisa cada decisión; puedes corregir y volver a intentarlo.']
      }
    },
    'tallado-mecanicas': {
      name: 'Ruta del Tallado',
      phases: [['Elige', 1, 3], ['Desarma', 4, 6], ['Talla', 7, 8], ['Cierra', 9, 10]],
      now: [3, 4, 5, 6, 7, 8, 9],
      moves: {
        3: [ELIGE, 'Elijan el juego que van a desarmar. Tiene que ser uno que ambos conozcan bien.'],
        4: [EXPLORA, 'Jueguen con libertad: prueben jugadas, deshagan y vacíen el tablero cuando quieran.'],
        5: [PRUEBA, 'Clasifiquen, comprueben y ajusten. Pueden pedir una pista.'],
        6: [PRUEBA, 'Ordenen el ciclo, comprueben y deshagan pasos las veces que necesiten.'],
        7: [ELIGE, 'Decidan qué relación de su juego explicar y qué ciclo describir.'],
        8: [PRUEBA, 'Decidan un ajuste, comprueben y vuelvan a intentarlo si hace falta.'],
        9: [ELIGE, 'Elijan qué pregunta llevar a la otra pareja.']
      }
    },
    'planos-arquitecto': {
      name: 'Ruta de los Planos',
      phases: [['Entra', 1, 3], ['Decide', 4, 9], ['Compara', 10, 11], ['Crea', 12, 14]],
      now: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      moves: {
        3: [EXPLORA, 'Abran las seis decisiones en el orden que prefieran.'],
        4: [PRUEBA, 'Elijan, revisen y vuelvan a intentarlo. Pueden pedir una pista.'],
        5: [PRUEBA, 'Elijan, revisen y vuelvan a intentarlo. Pueden pedir una pista.'],
        6: [EXPLORA, 'Consulten el modelo y anoten qué necesitan conocer de su propio grupo.'],
        7: [EXPLORA, 'Recorran los cuatro pasos del bucle en el orden que quieran.'],
        8: [ELIGE, 'Elijan por dónde empezar a explorar. Las dos posibilidades necesitan contraste.'],
        9: [EXPLORA, 'Consulten el modelo y justifiquen un recurso para su proyecto.'],
        10: [EXPLORA, 'Abran las ventanas de los marcos que quieran ampliar.'],
        11: [EXPLORA, 'Recorran las decisiones del ejemplo en el orden que prefieran.'],
        12: [ELIGE, 'El canvas es suyo: definan su objetivo y las conductas que esperan observar.'],
        13: [ELIGE, 'Elijan qué relación de su canvas quieren que revise otra pareja.'],
        14: [ELIGE, 'Acuerden cómo continuar antes de El Yunque.']
      }
    },
    'yunque': {
      name: 'Ruta del Yunque',
      phases: [['Recupera', 1, 3], ['Forja', 4, 7], ['Contrasta', 8, 8], ['Cierra', 9, 10]],
      now: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      moves: {
        3: [ELIGE, 'Decide qué parte de tu prototipo desarrollarás primero.'],
        4: [ELIGE, 'La narrativa es tuya: elige la invitación y el desafío que dan sentido a tu clase.'],
        5: [ELIGE, 'Decide qué harán tus estudiantes y qué evidencia quedará.'],
        6: [ELIGE, 'Decide cómo se avanza y cómo se revisa un intento.'],
        7: [ELIGE, 'Selecciona solo los componentes que necesitas y justifica su función.'],
        8: [PRUEBA, 'Elige, revisa y vuelve a intentarlo. Después regresa a tu propia misión.'],
        9: [ELIGE, 'Decide cuál será tu próximo paso.']
      }
    },
    'templado-pares': {
      name: 'Ruta del Templado',
      phases: [['Prepara', 1, 3], ['Revisa', 4, 5], ['Ajusta', 6, 7], ['Cierra', 8, 9]],
      now: [2, 3, 4, 5, 6, 7, 8, 9],
      moves: {
        3: [EXPLORA, 'Abre los criterios en el orden que prefieras. Puedes ensayar un comentario antes de la ronda.'],
        4: [ELIGE, 'Tu mirada cuenta: marca un nivel por criterio y elige qué comentar.'],
        5: [ELIGE, 'Elige la mayor fortaleza del diseño y una sugerencia concreta.'],
        6: [ELIGE, 'Decide qué observaciones necesitas aclarar con quienes revisaron tu canvas.'],
        7: [ELIGE, 'Decide qué ajustar. También puedes mantener una decisión si argumentas su propósito.']
      }
    },
    'reflejo-diseno': {
      name: 'Ruta del Reflejo',
      phases: [['Entra', 1, 3], ['Recorre', 4, 9], ['Aplica', 10, 11], ['Cierra', 12, 12]],
      now: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      moves: {
        4: [EXPLORA, 'Abre las cinco caras en el orden que prefieras.'],
        10: [ELIGE, 'Elijan un nivel por criterio y sosténganlo con evidencia del caso.'],
        11: [ELIGE, 'Decidan qué acuerdos dejar por escrito para aplicar la rúbrica.']
      }
    },
    'pulido-prototipo': {
      name: 'Ruta del Pulido',
      phases: [['Reúne', 1, 3], ['Autoevalúa', 4, 5], ['Ajusta', 6, 8], ['Cierra', 9, 9]],
      now: [2, 3, 5, 6, 7, 8, 9],
      moves: {
        2: [EXPLORA, 'Recorre los cinco criterios y localiza la evidencia de tu prototipo.'],
        4: [ELIGE, 'Elige en cada criterio el nivel que tu evidencia permite sostener.'],
        5: [ELIGE, 'Decide qué pulir primero. Uno o dos criterios bastan.'],
        6: [ELIGE, 'El ajuste es tuyo: decide qué cambia y qué evidencia esperas observar.'],
        9: [ELIGE, 'Elige la consulta que quieres hacerle al facilitador.']
      }
    },
    'espejo-compartido': {
      name: 'Ruta del Espejo',
      phases: [['Prepara', 1, 3], ['Presenta', 4, 4], ['Retroalimenta', 5, 5], ['Cierra', 6, 7]],
      now: [2, 3, 4, 5, 6, 7],
      moves: {
        3: [ELIGE, 'Elige la pregunta que quieres poner a consideración del grupo.'],
        5: [ELIGE, 'Elige qué fortaleza destacar y qué sugerencia ofrecer.'],
        6: [ELIGE, 'La decisión final es tuya: elige a qué observación responder y cuál será tu siguiente ajuste.']
      }
    },
    // El cierre conserva los instrumentos E, F y G sin indicaciones añadidas junto a sus ítems.
    'defensa-orbe': {
      name: 'Ruta de la Bóveda',
      phases: [['Recuerda', 1, 4], ['Entrega', 5, 6], ['Valora', 7, 11], ['Restaura', 12, 12]],
      now: [],
      moves: {}
    }
  };

  const slug = (window.LUDARIA_CLOUD_CONFIG && window.LUDARIA_CLOUD_CONFIG.route) ||
    (new URL(document.baseURI).pathname.match(/\/([a-z0-9-]+)\/(?:[a-z-]+\.html)?$/) || [])[1];
  const route = ROUTES[slug];
  const stage = document.getElementById('stage');
  const dotsBox = document.getElementById('route-dots');
  if (!route || !stage || !dotsBox || document.getElementById('ludaria-ruta')) return;

  const rail = document.createElement('nav');
  rail.id = 'ludaria-ruta';
  rail.className = 'ld-route';
  rail.setAttribute('aria-label', route.name);
  rail.innerHTML = '<p class="ld-route-heading"><strong></strong><span></span></p><ol class="ld-milestones">' +
    route.phases.map((phase, index) => '<li><button type="button" class="ld-milestone" data-phase="' + index + '">' +
      '<span class="ld-milestone-mark" aria-hidden="true">' + (index + 1) + '</span>' +
      '<span class="ld-milestone-copy"><strong></strong><small></small></span></button></li>').join('') + '</ol>';
  rail.querySelector('.ld-route-heading strong').textContent = route.name;
  route.phases.forEach((phase, index) => {
    rail.querySelectorAll('.ld-milestone-copy strong')[index].textContent = phase[0];
  });
  stage.before(rail);
  document.body.dataset.ludariaRuta = '1';

  const dots = () => [...dotsBox.querySelectorAll('.route-dot')];
  const isCurrent = dot => dot.classList.contains('current') || dot.classList.contains('active') ||
    ['page', 'step', 'true'].includes(dot.getAttribute('aria-current'));

  rail.addEventListener('click', event => {
    const button = event.target.closest('.ld-milestone');
    if (!button) return;
    const target = dots()[route.phases[Number(button.dataset.phase)][1] - 1];
    if (target) target.click();
  });

  function updateRail(list, page) {
    const current = route.phases.findIndex(phase => page >= phase[1] && page <= phase[2]);
    rail.querySelector('.ld-route-heading span').textContent = current < 0 ? '' : 'Tramo ' + (current + 1) + ' de ' + route.phases.length + ' · ' + route.phases[current][0];
    rail.querySelectorAll('.ld-milestone').forEach((button, index) => {
      const phase = route.phases[index], total = phase[2] - phase[1] + 1;
      const seen = list.slice(phase[1] - 1, phase[2]).filter(dot => dot.classList.contains('visited') || isCurrent(dot)).length;
      const done = seen >= total;
      if (index === current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      button.classList.toggle('is-complete', done);
      const note = done ? 'Tramo recorrido' : seen + ' de ' + total + (total === 1 ? ' pantalla' : ' pantallas');
      button.querySelector('small').textContent = note;
      button.setAttribute('aria-label', 'Tramo ' + (index + 1) + ', ' + phase[0] + '. ' + note + '. Ir al inicio del tramo.');
    });
  }

  function decorateStage(page) {
    const lead = stage.querySelector('.lead');
    if (lead && route.now.includes(page) && !lead.querySelector('.ld-now') && lead.textContent.trim()) {
      const now = document.createElement('strong');
      now.className = 'ld-now';
      now.textContent = 'Ahora';
      lead.prepend(now, ' ');
    }
    const move = route.moves[page];
    const anchor = lead || stage.querySelector('.section-title');
    if (!move || !anchor || stage.querySelector('.ld-move')) return;
    const note = document.createElement('p');
    note.className = 'ld-move ld-move-' + move[0];
    const label = document.createElement('strong');
    label.className = 'ld-move-label';
    label.textContent = MODES[move[0]].label;
    label.title = MODES[move[0]].hint;
    note.append(label, ' ' + move[1]);
    anchor.after(note);
  }

  let queued = false, lastPage = null;
  function refresh() {
    queued = false;
    const list = dots();
    const index = list.findIndex(isCurrent);
    if (index < 0) return;
    // Una pantalla nueva empieza arriba: algunas misiones conservaban el desplazamiento anterior.
    if (lastPage !== null && lastPage !== index && rail.getBoundingClientRect().top < 0) window.scrollTo(0, 0);
    lastPage = index;
    updateRail(list, index + 1);
    decorateStage(index + 1);
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(refresh);
  }
  new MutationObserver(schedule).observe(dotsBox, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-current'] });
  new MutationObserver(schedule).observe(stage, { childList: true });
  schedule();
})();
