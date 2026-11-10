/** Momentos pedagógicos de la mochila. Los atributos y las acciones siguen en el catálogo RPG. */
((root) => {
  'use strict';

  const at = (page, label, tab) => ({page, label, tab});
  const item = (art, effect, benefit, ...moments) => ({art, effect, benefit, moments});
  const missions = {
    'mision-0': {
      phases: [[1, 'Inicio'], [4, 'Explora'], [9, 'Diagnóstico'], [12, 'Entrada']]
    },
    'pergaminos-dispersos': {
      phases: [[1, 'Explora'], [4, 'Distingue'], [8, 'Clasifica'], [12, 'Transfiere']],
      gear: {
        'pergaminos-dispersos_0': item('brujula', 'Tres claves para clasificar', 'Compara propósito, función del juego y vínculo con la actividad.', at(9, 'Mesa de clasificación')),
        'pergaminos-dispersos_1': item('pergamino', 'Dos lecturas del mismo caso', 'Contrasta la evidencia de cada hipótesis y qué dato te haría cambiar de opinión.', at(10, 'Las fronteras también se discuten')),
        'pergaminos-dispersos_2': item('prisma', 'Pon a prueba tu criterio', 'Propón un caso fronterizo y explica hasta dónde sirve tu clasificación.', at(11, 'Puesta en común con Théol'))
      }
    },
    'senda-ejemplos': {
      phases: [[1, 'Explora'], [5, 'Examina'], [8, 'Contrasta'], [11, 'Registra']],
      gear: {
        'senda-ejemplos_0': item('lupa', 'Separa evidencia e interpretación', 'Vincula un elemento observado con su función y con lo que la fuente permite afirmar.', at(6, 'Las huellas del diseño')),
        'senda-ejemplos_1': item('pergamino', 'Dos explicaciones para una decisión', 'Compara qué lectura sostienen el objetivo, el contexto y la fuente.', at(8, 'La niebla de las conclusiones')),
        'senda-ejemplos_2': item('corazon', 'Una pregunta de otra pareja', 'Pide que contrasten tu interpretación y registra qué revisarías.', at(10, 'Una segunda mirada puede cambiar tu lectura'))
      }
    },
    'claro-debate': {
      phases: [[1, 'Explora'], [4, 'Lee'], [9, 'Argumenta'], [11, 'Sintetiza']],
      gear: {
        'claro-debate_0': item('brujula', 'Tres roles para conversar', 'Alterna quién argumenta, quién pide evidencia y quién sintetiza.', at(3, '¿Dónde se sitúa tu primera mirada?')),
        'claro-debate_1': item('escudo', 'Una objeción para afinar tu postura', 'Ensaya otra postura o reconstruye el argumento de un par.', at(9, 'Escucha una objeción')),
        'claro-debate_2': item('pergamino', 'Dos fuentes bajo la misma lupa', 'Compara contextos, indicadores y límites antes de concluir.', at(4, 'Tres fuentes. Preguntas más precisas'))
      }
    },
    'vetas-diseno': {
      phases: [[1, 'Explora'], [4, 'Distingue'], [8, 'Clasifica'], [12, 'Aplica']],
      gear: {
        'vetas-diseno_0': item('lupa', 'Identifica qué estás analizando', 'Distingue experiencia, regla y representación según su función.', at(8, 'El Observatorio del Agua')),
        ojo_artesano: item('brujula', 'Una guía rápida de los tres niveles', 'Consulta cómo distinguir dinámicas, mecánicas y componentes al clasificar.', at(9, 'Clasificar las vetas')),
        'vetas-diseno_2': item('prisma', 'Dos combinaciones para un propósito', 'Prueba variantes que mantengan la mecánica y explica qué experiencia buscas.', at(13, 'La prueba de Maestría'))
      }
    },
    'tallado-mecanicas': {
      phases: [[1, 'Elige'], [4, 'Observa'], [6, 'Analiza'], [9, 'Contrasta']],
      gear: {
        'tallado-mecanicas_0': item('pergamino', 'Cuatro pasos para reconstruir el bucle', 'Sigue el estado, la acción, la respuesta y la siguiente decisión.', at(6, 'Una acción vuelve a comenzar')),
        'tallado-mecanicas_1': item('martillo', 'Cambia una regla y contrasta el efecto', 'Ensaya otra regla de turno o de información y comprueba tu predicción.', at(4, 'Bajo la lupa del tallador')),
        'tallado-mecanicas_2': item('escudo', 'Detecta quién puede quedar fuera', 'Prueba la regla desde la posición de quien se rezaga y de quien domina.', at(8, 'Cuando la regla desvía el propósito'))
      }
    },
    'gema-motivacional': {
      gear: {
        'gema-motivacional_0': {
          ...item('pocion', '3 preguntas para leer el caso', 'Detecta si hay elección, apoyo para avanzar y sentido de pertenencia.', at(4, 'La clasificación pública'), at(8, 'Diagnóstico', 'tab-0')),
          title: 'Poción de enfoque'
        },
        'gema-motivacional_1': {
          ...item('prisma', '2 formas de abordar el dilema', 'Compara dar más opciones con ofrecer más apoyo o fortalecer al equipo.', at(6, 'Los puntos arbitrarios'), at(8, 'Rediseño', 'tab-1')),
          title: 'Prisma de contraste'
        },
        'gema-motivacional_2': {
          ...item('corazon', '1 prueba de inclusión', 'Ensaya una forma de participar sin competir ni exponerse.', at(8, 'Contraste', 'tab-2'), at(9, 'Contrastar el nuevo diseño')),
          title: 'Corazón del cuidado'
        }
      }
    },
    'planos-arquitecto': {
      phases: [[1, 'Explora'], [4, 'Define'], [7, 'Conecta'], [12, 'Diseña']],
      gear: {
        'planos-arquitecto_0': item('brujula', 'Une objetivo, acción y evidencia', 'Comprueba que la actividad produzca la evidencia que necesitas.', at(5, 'D2 · Acciones que dejan huella')),
        'planos-arquitecto_1': item('prisma', 'Dos versiones de la experiencia', 'Compara una variante con elección de ruta y otra con colaboración.', at(8, 'D5 · La experiencia lúdica')),
        'planos-arquitecto_2': item('pergamino', 'Recorre el bucle como jugador', 'Ubica un paso donde falte información útil para tomar la siguiente decisión.', at(7, 'D4 · Probar, recibir y volver'))
      }
    },
    'yunque': {
      phases: [[1, 'Prepara'], [4, 'Construye'], [8, 'Comprueba'], [9, 'Registra']],
      gear: {
        'yunque_0': item('martillo', 'Cuatro piezas para dar forma a tu misión', 'Alinea propósito, acción, evidencia y feedback con la narrativa.', at(5, 'Dar forma a una misión')),
        'yunque_1': item('prisma', 'Dos maneras de organizar el avance', 'Contrasta una versión con recursos limitados y otra con cooperación.', at(6, 'Diseñar cómo se avanza')),
        'yunque_2': item('corazon', 'Prueba tu prototipo con un par', 'Observa dónde necesita una explicación y elige un ajuste concreto.', at(8, 'Una prueba de coherencia'))
      }
    },
    'templado-pares': {
      phases: [[1, 'Acuerda'], [4, 'Revisa'], [6, 'Ajusta'], [8, 'Cierra']],
      gear: {
        'templado-pares_0': item('pergamino', 'Tres pasos para dar feedback', 'Acuerda una evidencia, una pregunta y una sugerencia antes del intercambio.', at(3, 'La pauta que compartimos')),
        'templado-pares_1': item('corazon', 'Aclara o contrasta dos sugerencias', 'Registra qué comprendiste y qué incorporarías al diseño.', at(6, 'Escuchar las dos miradas')),
        'templado-pares_2': item('escudo', 'Elige qué sugerencia aplicar primero', 'Compara la evidencia y el efecto de cada sugerencia sobre el objetivo.', at(7, 'Volver al canvas'))
      }
    },
    'reflejo-diseno': {
      phases: [[1, 'Explora'], [4, 'Lee'], [10, 'Aplica'], [11, 'Acuerda']],
      gear: {
        'reflejo-diseno_0': item('espejo', 'Sostén tu valoración con evidencia', 'Vincula un descriptor con un hecho observable del caso.', at(10, 'Un caso ante el espejo')),
        'reflejo-diseno_1': item('prisma', 'Compara dos niveles de la rúbrica', 'Justifica cada lectura con su descriptor y decide cuál sostienes.', at(11, 'Acuerdos de interpretación')),
        'reflejo-diseno_2': item('lupa', 'Detecta una conclusión sin sustento', 'Reformula qué puedes afirmar e identifica qué evidencia falta.', at(9, 'Motivación y ética'))
      }
    },
    'pulido-prototipo': {
      phases: [[1, 'Reúne'], [3, 'Autoevalúa'], [5, 'Ajusta'], [7, 'Planifica']],
      gear: {
        'pulido-prototipo_0': item('brujula', 'Elige qué mejora atender primero', 'Relaciona cada cambio con un criterio, una evidencia y una acción posible.', at(5, 'Elegir qué pulir primero')),
        'pulido-prototipo_1': item('prisma', 'Impacto frente a viabilidad', 'Compara el aporte pedagógico y la facilidad de realizar el ajuste.', at(6, 'Tallado de la nueva versión')),
        'pulido-prototipo_2': item('martillo', 'Ensaya una alternativa tecnológica', 'Conserva el objetivo y la evidencia al sustituir un componente.', at(8, 'Plan de implementación · condiciones'))
      }
    },
    'espejo-compartido': {
      phases: [[1, 'Prepara'], [4, 'Presenta'], [5, 'Escucha'], [6, 'Ajusta']],
      gear: {
        'espejo-compartido_0': item('corazon', 'Organiza el feedback que escuchas', 'Registra una fortaleza, una pregunta y una sugerencia respaldadas.', at(5, 'Retroalimentación cruzada')),
        'espejo-compartido_1': item('espejo', 'Decide qué responder a un par', 'Profundiza su pregunta o fundamenta la decisión que conservarías.', at(6, 'Lo que defiendo y lo que reviso')),
        'espejo-compartido_2': item('martillo', 'De una sugerencia a un cambio comprobable', 'Define el próximo ajuste y qué evidencia mostraría su efecto.', at(7, 'El cuarto fragmento'))
      }
    },
    'defensa-orbe': {
      phases: [[1, 'Retoma'], [5, 'Entrega'], [7, 'Reflexiona'], [12, 'Restaura']],
      gear: {
        'defensa-orbe_0': item('pergamino', 'Cuatro pasos para defender tu diseño', 'Explica necesidad, decisión, evidencia y límite de tu prototipo.', at(5, 'Entrega final del prototipo')),
        'defensa-orbe_1': item('escudo', 'Ensaya cómo responder una objeción', 'Sostén una decisión con evidencia o identifica qué te falta comprobar.', at(6, 'La mirada del facilitador')),
        'defensa-orbe_2': item('orbe', 'Lleva tu diseño a otro contexto', 'Decide qué conservar, qué adaptar y cómo comprobar si resulta pertinente.', at(12, 'La restauración del Orbe'))
      }
    }
  };

  if (typeof module === 'object' && module.exports) module.exports = missions;
  else root.LudariaMissionJourney = missions;
})(globalThis);
