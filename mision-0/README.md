# Misión 0: El Llamado de la Aventura

Entrada narrativa a **Buscadores de la Gamificación Perdida**, en el **Valle de los Ecos**. Formato HTML para GitHub Pages e incrustación en Genially. Proyecto personal de tesis: sin marca GamiAula.

## Instrumento y alcance

Las ocho preguntas conservan el texto del **Anexo D, p. 60**, del TFM de Nicolás Espinoza González. La narrativa usa el Anexo A, p. 57, y la apertura usa la ficha de sesión 1, p. 38. «Misión 0» es la denominación operativa pedida por el autor; la tesis describe esta sesión como apertura sin misión formal asociada.

Se añade identificación (nombre o alias y área docente), la posibilidad explícita de declarar «ninguno» en el ítem de selección, una presentación de la escala con extremos relativos y la recepción en Google Sheets. No se enseñan definiciones antes del diagnóstico, no hay soluciones, puntajes, rankings ni feedback de acierto/error. El reemplazo de Google Forms por HTML con Apps Script es una adaptación del soporte, no del contenido de los ocho ítems.

## Recorrido

1. El Llamado de la Aventura.
2. Las Brumas del Olvido: relato y cuatro fragmentos del Orbe.
3. Quienes cruzan el umbral: identificación.
4. Cuatro locaciones: ruta con ventanas de mentores.
5. Cinco atributos del Libro de Stats.
6. Códigos reales, decisiones y colaboración.
7. Forja externa: Kael y Kira, con mecánicas equivalentes.
8. Candado narrativo ORBE, opcional y sin recompensa oficial.
9. Instrucciones del diagnóstico.
10. Ocho preguntas dentro del HTML, con guardado de borrador.
11. Revisión, envío y recepción confirmada.
12. Entrada al Portal de la Aventura.

La apertura original contempla 90 minutos sincrónicos, incluyendo conversaciones, recorrido y trabajo en la Forja; el diagnóstico ocupa aproximadamente 20 minutos. No se limita el tiempo para responder.

## Activación

Consulta `Activar_Mision_0.md` y `Receptor_Mision_0.gs`, incluidos en el paquete del docente. La hoja receptora está creada. Falta desplegar el receptor en la cuenta del propietario y configurar su URL `/exec` en `config.js`.

`forgeUrl` está pendiente: la tesis no contiene un enlace directo a la Forja. Mientras no se configure, aparece una explicación para abrirla desde el Portal, sin inventar un destino. `attendanceCode` permanece vacío hasta que el facilitador decida compartir un código real. No se sincroniza el diagnóstico con el Libro de Stats.

## Envío y confirmación

El POST envía las respuestas a Apps Script. La respuesta opaca de `fetch(..., mode: 'no-cors')` nunca se interpreta como recepción. El cliente consulta un recibo JSONP de solo lectura con ID aleatorio y clave aleatoria de 256 bits; recibe únicamente una confirmación, sin nombres ni respuestas. El servidor guarda solo la huella de esa clave. La puerta final requiere ese recibo.

El ID y el contenido se conservan en los reintentos. El servidor valida el instrumento, campos, longitudes, selección y escala; usa bloqueo para evitar filas duplicadas y convierte los textos peligrosos para Sheets en literales. La hoja de cálculo mantiene sus permisos privados. El receptor público permite agregar respuestas y consultar únicamente el recibo de un envío conocido; no ofrece lectura pública de la hoja.

No es un control de acceso para otros sitios: esta puerta ordena la entrada dentro de Misión 0. El Portal/Genially externo no valida un recibo central de autenticación. El borrador depende del almacenamiento disponible en el navegador; abrir directamente la misión puede facilitarlo si el contexto incrustado restringe almacenamiento o solicitudes externas.

## Archivos

`index.html` y `presentacion.html`: entradas idénticas. `config.js`: URL del receptor, Forja y Portal. `app.js`: presentación. `transport.js`: envío y recibo. `instrumento.json` y `instrumento.js`: fuente común de las preguntas y columnas. `styles.css`: estilo. `assets/valle.webp`: ilustración. `preparar_publicacion.py`: genera versiones de CSS y JS para evitar revisiones en caché. `prueba.html`: marcos de escritorio y móvil para verificar incrustación.

Después de editar fuentes, ejecuta `python3 preparar_publicacion.py` y publica los archivos actualizados. Se mantienen las versiones anteriores para no romper páginas que aún las tienen en caché.

## Fuentes técnicas

- Apps Script, Web Apps: https://developers.google.com/apps-script/guides/web
- Content Service y JSONP de solo lectura: https://developers.google.com/apps-script/guides/content

## Incrustación

```html
<iframe src="https://nespinozagonzalez-hub.github.io/misiones/mision-0/presentacion.html" title="Misión 0: El Llamado de la Aventura" width="100%" height="850" style="border:0" allowfullscreen></iframe>
```

Activar el receptor y realizar un envío de prueba antes de aplicar el diagnóstico a participantes.
