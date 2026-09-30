/* Síntesis didácticas propias de fuentes verificadas; las funciones posibles son interpretación. */
window.SENDA_CASES = {
  a: {
    label: 'Expediente A', title: 'Cuando el avance se vuelve visible',
    authors: 'Barata, Gama, Jorge y Gonçalves · 2013',
    context: 'Producción de contenidos multimedia · educación superior · Portugal',
    summary: 'Un curso universitario incorporó puntos de experiencia, niveles, insignias, desafíos y una clasificación. El estudio comparó tres ediciones previas con dos ediciones gamificadas.',
    observations: [
      {title:'Puntos y niveles',text:'La fuente documenta puntos de experiencia y niveles en el curso.',inference:'Podrían hacer visible una trayectoria de avance. Reconocer el elemento no demuestra su efecto.',id:'progress'},
      {title:'Desafíos',text:'El diseño incorporó desafíos vinculados con las actividades del curso.',inference:'Podrían organizar la participación alrededor de tareas concretas.',id:'challenges'},
      {title:'Lo que se observó',text:'Los autores informaron mayor participación en los foros y proactividad.',inference:'Este resultado pertenece al contexto estudiado; no garantiza que copiar el diseño produzca lo mismo.',id:'results'}
    ],
    limit: 'La comparación entre ediciones no aísla todas las diferencias entre grupos. Los autores reconocen límites y resultados no uniformes.',
    source: 'https://doi.org/10.1145/2583008.2583010',
    reading: 'https://www.researchgate.net/publication/259821680_Improving_Participation_and_Learning_with_Gamification',
    citation: 'Barata, G., Gama, S., Jorge, J., & Gonçalves, D. (2013). Improving participation and learning with gamification. Proceedings of the First International Conference on Gameful Design, Research, and Applications, 10–17. https://doi.org/10.1145/2583008.2583010'
  },
  b: {
    label: 'Expediente B', title: 'Cuando las recompensas no bastan',
    authors: 'Hanus y Fox · 2015',
    context: 'Cursos universitarios de comunicación · Estados Unidos',
    summary: 'Durante un semestre de 16 semanas, un curso utilizó insignias y una clasificación y otro mantuvo el mismo currículo sin esos elementos. Se recogieron datos en cuatro momentos.',
    observations: [
      {title:'Insignias',text:'El curso gamificado incluía tareas para obtener insignias.',inference:'Una insignia podría reconocer un logro; también podría percibirse como presión. Hay que observar su uso.',id:'badges'},
      {title:'Clasificación',text:'Una tabla permitía comparar el progreso entre estudiantes.',inference:'La visibilidad podría favorecer comparación social. Su efecto depende del diseño y del contexto.',id:'ranking'},
      {title:'Lo que se observó',text:'El grupo gamificado mostró menor motivación, satisfacción y percepción de capacidad con el tiempo.',inference:'El estudio invita a revisar este diseño; no demuestra que toda gamificación sea perjudicial.',id:'results'}
    ],
    limit: 'Se estudió una combinación concreta de elementos en dos grupos. No permite atribuir el resultado a una sola insignia ni generalizarlo a todos los diseños.',
    source: 'https://doi.org/10.1016/j.compedu.2014.08.019',
    reading: 'https://itl2tlfa16.wordpress.com/wp-content/uploads/2016/08/hanusfox_15.pdf',
    citation: 'Hanus, M. D., & Fox, J. (2015). Assessing the effects of gamification in the classroom: A longitudinal study on intrinsic motivation, social comparison, satisfaction, effort, and academic performance. Computers & Education, 80, 152–161. https://doi.org/10.1016/j.compedu.2014.08.019'
  }
};
