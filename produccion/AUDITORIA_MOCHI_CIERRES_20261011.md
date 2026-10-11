# Cierres con Mochi y animaciones de misión

11 de octubre de 2026. El propietario pidió una invitación de Mochi al final de cada misión, sin enlace, y mayor sensación de videojuego. Genially y las pruebas manuales finales permanecen a su cargo.

## Cambios

- Las 13 misiones centrales muestran a Mochi únicamente en su última pantalla. Se actualizaron sus 22 entradas HTML (index y presentación cuando existen).
- Imagen original de Mochi y mensaje: «Veeen a mejorar tu personaje. Usa tus puntos conmigo y descubre qué nuevas ayudas se abren para ti.» Se orienta a activar la runa en Forja y volver al mapa. La invitación no tiene enlaces ni botones y no acredita recompensas por llegar a la última pantalla.
- El saldo mostrado procede del perfil central confirmado. Sin perfil central no se inventa un saldo.
- Entrada breve de pantallas, aparición de Mochi y destellos finitos; las ayudas disponibles se distinguen visualmente de las bloqueadas. El botón de pausa existente y la preferencia de movimiento reducido tienen prioridad.
- Decisiones y secretos emiten una señal visual únicamente tras la confirmación del servidor. Las compras de Forja también emiten la señal después de confirmar; no se descuentan puntos con una animación.
- Misión 0 no cambia. Se conservan atributos, umbrales, XP, códigos, instrumentos y actividades. Los 16 iframes de la guía anterior conservan sus URLs; esta revisión no requiere nuevos enlaces.

## Verificación disponible

Servidor general/RPG, gateway24, Forja y recompensas aprobados con servicios ficticios. DOM de las 13 entradas aprobado, incluyendo aparición exclusiva al cierre, una sola invitación, ausencia de enlaces/botones y conservación de XP/puntos. Resiliencia14 aprobada, incluyendo ausencia de celebración cuando falla la comunicación.

Prueba gráfica ampliada para los 13 cierres móviles, carga de la imagen, ancho sin desbordamiento, pausa y un cierre dentro de iframe720px con movimiento reducido. Su ejecución y la publicación se registrarán al finalizar CI.

El guardado autenticado de la versión ampliada y el contenedor Genially requieren la prueba manual del propietario. Las pruebas con servicios ficticios no sustituyen esa comprobación.
