# Ludaria · recortes y encuadre de los ataques

26 de octubre de 2026. Corrección solicitada tras observar un brazo repetido al lanzar el ataque. Base: `6f3e09bc660f24bf69164d58b04f2f9bae4b4ba7`.

## Causa y cambio

Los atlas ilustrados no siguen una cuadrícula exacta: varios brazos, proyectiles y capas cruzan la división teórica de 512 píxeles. El desplazamiento de un fondo de tres columnas por dos filas podía mostrar fragmentos de otra pose. Además, una caja que cambiaba de escala entre retrato y ataque dificultaba mantener el encuadre.

La animación ahora dibuja cada pose por separado en un lienzo, con recortes propios y máscaras en las franjas compartidas. Limpia el fotograma anterior antes de dibujar el siguiente. Mantiene una escala y una línea de suelo por personaje en una superficie de 704 × 576, con margen para manos y proyectiles. El cambio entre retrato de respaldo y poses se hace sin fundido que superponga los dos cuerpos.

Se conservan las ilustraciones originales, sin regenerarlas ni alterar los atlas. Los recortes se realizan en la presentación mediante `sprite-frames.js`. La vista [sprites-revision.html](../defensa-orbe/sprites-revision.html) permite revisar las 18 poses detenidas, con el mismo código de dibujo que usa la batalla.

## Comprobaciones

- [x] 18 recortes válidos, sin desplazar un atlas de fondo.
- [x] Limpieza del lienzo entre fotogramas y línea de suelo alineada.
- [x] Revisión visual de las 18 poses, incluidos lanzamiento, continuación y recuperación.
- [x] Seis encuadres con poses dentro de su área y debajo del nombre; ataque móvil y de escritorio, preguntas/pistas, victoria, epílogo y conservación de datos simulados.
- [x] Respaldo estático si no carga el arte o el módulo de movimiento.
- [x] Movimiento reducido, pausa de efectos y detención al cerrar la batalla.
- [x] Preguntas, respuestas, reglas de combate, recompensas, cuentas e instrumentos conservados.
- [x] Las imágenes existentes y los 16 iframe se conservan.

Las pruebas de guardado usan servicios simulados; no se accede a la planilla real. Regresión completa aprobada: 22 programas funcionales y 5 de navegador en [CI 40320982073](https://github.com/nespinozagonzalez-hub/misiones/actions/runs/40320982073), sobre `06971b94e8abecaa8e912740a4169b025c3b1231`. [PR #31](https://github.com/nespinozagonzalez-hub/misiones/pull/31) integrado como `3b9fb0327267087ac1afff6c28c20a4cd350f8ba`. Publicación del código aprobada en [Pages 40321806150](https://github.com/nespinozagonzalez-hub/misiones/actions/runs/40321806150). En Chrome conectado se comprobaron las 18 poses cargadas y un ataque con contraataque, avanzando fotogramas sin superponer el retrato. [Captura pública de la revisión](evidencias/poses_corregidas_20261026.png).
