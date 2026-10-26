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
- [x] Respaldo estático si no carga el arte o el módulo de movimiento.
- [x] Movimiento reducido, pausa de efectos y detención al cerrar la batalla.
- [x] Preguntas, respuestas, reglas de combate, recompensas, cuentas e instrumentos conservados.
- [x] Las imágenes existentes y los 16 iframe se conservan.

Las pruebas de guardado usan servicios simulados; no se accede a la planilla real. El informe se completa con la regresión de navegador y publicación verificadas en el PR de esta corrección.
