# Las Vetas del Diseño

Misión principal del módulo 2, sesión 5 de **Buscadores de la Gamificación Perdida**, proyecto de tesis de Nicolás Espinoza. Lugar: Cantera de los Elementos. Mentora: Maestra Bryn. Atributo: Maestría.

## Uso en clase

Clase sincrónica de 90 minutos, con 45 minutos autónomos previos previstos en la tesis. El docente anuncia la pantalla y conduce la conversación; cada participante navega en su dispositivo. No hay sincronización de sala, clasificación pública, puntuación oficial ni envío automático de respuestas.

La guía docente, accesible desde el libro de la cabecera, incluye tiempo, intervención, producto y respuesta a dudas para cada pantalla. Su temporizador es opcional: se pausa al cerrar, no avanza pantallas ni penaliza.

14 pantallas: entrada, encargo, detonante, pirámide, dinámicas, mecánicas, componentes, caso didáctico, clasificación en equipos, casos dudosos, Toda, dos lentes, micro desafío y cierre. Tiempos: 3 + 4 + 4 + 7 + 5 + 6 + 5 + 9 + 16 + 6 + 9 + 5 + 8 + 3 = 90 minutos.

Las actividades son formativas. Los tres candados abren pautas complementarias; permiten pistas, revisión y apertura acompañada. La navegación y el contenido esencial están disponibles siempre. “Resuelta” y “acompañada” son estados de práctica, no aprobaciones oficiales.

## Contenido y fuentes

La ficha de la sesión 5 de la tesis establece la pirámide de Werbach y Hunter (2012), la taxonomía de Toda et al. (2019), la clasificación justificada en equipos y un micro desafío individual. Los casos y diálogos de este prototipo son propios y se identifican como tales.

Se distinguen la propuesta de taxonomía de ICALT (2019a; DOI 10.1109/ICALT.2019.00028) y su ampliación en Smart Learning Environments (2019b; DOI 10.1186/s40561-019-0106-1). La ampliación contiene **cinco dimensiones y 21 elementos**, incluida la dimensión ecológica, donde se ubica la presión de tiempo. No se presupone una correspondencia uno a uno con los niveles DMC. La pirámide es un dibujo propio en CSS, no una figura copiada.

Werbach y Hunter (2015) apoyan la coherencia del sistema; Black y Wiliam (2009) respaldan el uso formativo de respuestas para ajustar la enseñanza. La bibliografía completa, los enlaces primarios y los límites de las afirmaciones están en “Fuentes”. La ampliación de Toda se distribuye bajo CC BY 4.0; las traducciones, síntesis y ejemplos aquí son propios.

Esta misión no entrega el Fragmento II del Orbe: el cierre del módulo corresponde a La Gema Motivacional. Tampoco inventa códigos, XP ni registros de La Forja.

## Datos y cierre oficial

El cuaderno guarda notas y decisiones bajo `ludaria_vetas_diseno_v1` en localStorage. Si el navegador bloquea el almacenamiento, el registro sigue descargable durante la sesión. Es independiente de la misión 0 y de las otras misiones. El reinicio solo borra esta clave.

El docente recoge las respuestas abiertas mediante el registro TXT o su canal de clase; no se califican por coincidencias de palabras. El cuaderno también permite ver el registro completo en pantalla y copiarlo manualmente si el navegador o la incrustación limitan las descargas o el portapapeles. En `config.js`, `closingFormUrl` está vacío hasta que exista el formulario real de cierre. Se informa al participante que el docente compartirá ese formulario y el código. El receptor de la misión 0 no se utiliza para esta misión.

## Publicación e incrustación

Entradas: `index.html` y `presentacion.html`. Sin dependencias externas, sonidos automáticos ni CDN. `content.js` contiene el guion, bibliografía y actividades; `app.js` la interacción; `styles.css` la estética; `assets/cantera.webp` la ilustración.

Después de modificar CSS o JS, ejecuta `python3 preparar_publicacion.py` y sube también los recursos con hash que genera. Conserva los archivos de otras misiones. `prueba.html` ofrece marcos de escritorio y móvil para revisar la incrustación.

```html
<iframe
  src="https://nespinozagonzalez-hub.github.io/misiones/vetas-diseno/presentacion.html"
  title="Las Vetas del Diseño · Misión principal 2"
  width="100%"
  height="720"
  style="border:0;"
  allow="fullscreen"
  allowfullscreen>
</iframe>
```

El marco debe permitir desplazamiento en pantallas de taller y en móvil. Recomendado en Genially: área 16:9 amplia. Si modificas el formulario de cierre, añade su HTTPS real a `config.js` y prepara de nuevo la publicación.

## Imagen

Ilustración generada para el prototipo: una cantera antigua junto al bosque de Ludaria, vetas minerales esmeralda, arco de piedra y luz cálida; espacio oscuro a la izquierda para texto. Sin texto, logotipos ni personajes nuevos. Es un recurso visual narrativo, no evidencia histórica ni un diagrama científico. El prompt se conserva en `PROMPT.md`.
