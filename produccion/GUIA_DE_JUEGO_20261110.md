# Guía de juego en las misiones · 10 de noviembre de 2026

Auditoría de experiencia de juego sobre las 14 etapas, la Forja y el portal, y extensión del piloto de La Gema Motivacional al resto del recorrido. No cambia contenidos evaluativos, instrumentos, recompensas, datos ni Apps Script.

## Qué se añadió

`ludaria/mission-route.js` y `ludaria/mission-route.css` se cargan en 12 misiones. La Gema conserva su guía propia y Misión 0 queda sin cambios.

| Elemento | Comportamiento |
|---|---|
| Ruta de hitos | Cuatro tramos por misión, con el tramo actual en dorado y los recorridos en verde. Cada hito lleva al inicio de su tramo. El conteo usa las pantallas visitadas que ya registra cada misión. |
| «Ahora» | Marca la consigna de acción de la pantalla. No aparece en portadas ni en pantallas de lectura. |
| Momento de juego | «Explora libre», «Tú eliges» o «Prueba y ajusta» junto a la consigna, con una indicación propia de esa actividad. |

La Defensa del Orbe muestra solo la ruta. Los instrumentos E, F y G quedan sin indicaciones añadidas.

## Tramos por misión

| Misión | Tramos |
|---|---|
| Los Pergaminos Dispersos | Prepara 1–3 · Explora 4–8 · Clasifica 9–11 · Cierra 12–14 |
| La Senda de los Ejemplos | Recupera 1–4 · Investiga 5–9 · Contrasta 10 · Cierra 11–12 |
| El Claro del Debate | Toma postura 1–3 · Lee 4–8 · Debate 9–10 · Cierra 11–12 |
| Las Vetas del Diseño | Entra 1–3 · Explora 4–7 · Clasifica 8–12 · Cierra 13–14 |
| El Tallado de Mecánicas | Elige 1–3 · Desarma 4–6 · Talla 7–8 · Cierra 9–10 |
| Los Planos del Arquitecto | Entra 1–3 · Decide 4–9 · Compara 10–11 · Crea 12–14 |
| El Yunque | Recupera 1–3 · Forja 4–7 · Contrasta 8 · Cierra 9–10 |
| El Templado entre Pares | Prepara 1–3 · Revisa 4–5 · Ajusta 6–7 · Cierra 8–9 |
| El Reflejo del Diseño | Entra 1–3 · Recorre 4–9 · Aplica 10–11 · Cierra 12 |
| El Pulido del Prototipo | Reúne 1–3 · Autoevalúa 4–5 · Ajusta 6–8 · Cierra 9 |
| El Espejo Compartido | Prepara 1–3 · Presenta 4 · Retroalimenta 5 · Cierra 6–7 |
| La Defensa del Orbe | Recuerda 1–4 · Entrega 5–6 · Valora 7–11 · Restaura 12 |

Los nombres de tramo y las indicaciones de cada pantalla se editan en la tabla `ROUTES` de `ludaria/mission-route.js`.

## Correcciones de la auditoría

- El Pulido del Prototipo y El Espejo Compartido conservaban el desplazamiento al cambiar de pantalla. En móvil la pantalla nueva aparecía a mitad de página. Ahora empieza arriba.
- La tabla de «Clasificar exige mirar el contexto» en Las Vetas recortaba su segunda columna en teléfonos. Ahora se ajusta al ancho.
- El Reflejo del Diseño usaba imperativos en «vosotros» en ocho consignas. Pasan a «ustedes», como el resto de Ludaria.
- La portada de la Forja en móvil dejaba el texto sobre la zona clara de la ilustración. Ahora tiene fondo oscuro uniforme.
- En la creación del personaje, los retratos empujaban la clave y el botón de inicio fuera del marco de 850 px. Nombre, elección y clave quedan visibles.

## Comprobación

`ludaria/test-mission-route.cjs` recorre 135 pantallas de 12 misiones en modo local, con red externa bloqueada. Comprueba cuatro hitos, un solo tramo actual, 90 consignas «Ahora», 76 momentos de juego, navegación por hitos, inicio de pantalla en móvil y la tabla de Las Vetas a 320 px. Se suma a los 28 programas anteriores, que siguen aprobados.

Las pruebas usan servicios simulados. La comprobación en `/exec` y en Genially se hace después de integrar en `main`, porque Apps Script lee las entradas desde esa rama.

## Pendiente

- [ ] Validar en clase si las etiquetas ayudan a ubicarse sin explicación adicional.
- [ ] Revisar la redacción de las preguntas formativas de las demás misiones por contexto, acción y evidencia esperada.
- [ ] Llevar la mochila de ventajas de La Gema a las demás misiones.
- [ ] Revisar título, contador y transiciones en el editor de Genially.

## Marco de pestaña propia

Al abrir una misión, la Forja o Mochi desde su enlace de GitHub Pages en una pestaña propia, `ludaria/gateway.js` lleva a `ludaria/marco.html`. Esa página aloja la misma implementación `/exec` en un marco a pantalla completa, para que el aviso «Un usuario de Google Apps Script creó esta aplicación» no ocupe la parte superior y la dirección visible siga siendo de Ludaria. Dentro de Genially u otro iframe se conserva la navegación directa ya comprobada.

El marco solo abre la implementación declarada en `gateway-config.js` y las rutas de su lista. No reenvía nombre, clave ni otros parámetros. Un enlace `/exec` abierto directamente sigue mostrando el aviso de Google: para compartir, usar los enlaces de GitHub Pages del catálogo.

- [ ] Comprobar en un navegador real, después de integrar en `main`, que el aviso no aparece y que la sesión de la pestaña se conserva al pasar entre misiones.
