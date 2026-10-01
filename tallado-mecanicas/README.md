# El Tallado de Mecánicas

Sesión 6 · misión secundaria 1 · módulo 2 · Cantera de los Elementos · Maestra Bryn · Maestría.

Taller de **Buscadores de la Gamificación Perdida**, basado en la ficha de la sesión 6 de la tesis de Nicolás Espinoza González, tabla 7, p. 42. Objetivo: deconstruir un juego conocido para revelar su arquitectura interna.

Diez pantallas para 90 minutos sincrónicos y propuesta de 45 minutos de trabajo autónomo. Parejas que eligen un juego conocido, analizan tres escalas, describen un bucle y contrastan su interpretación con otra pareja. La cantidad de pantallas y los recursos interactivos son decisiones de producción.

## Abrir e incrustar

Publicación: https://nespinozagonzalez-hub.github.io/misiones/tallado-mecanicas/presentacion.html

```html
<iframe src="https://nespinozagonzalez-hub.github.io/misiones/tallado-mecanicas/presentacion.html" title="El Tallado de Mecánicas · Misión secundaria 1 del módulo 2" width="100%" height="720" style="border:0;" allow="fullscreen" allowfullscreen></iframe>
```

Anuncia cada pantalla en clase para que el grupo avance contigo. La navegación no exige resolver candados. Los candados revelan pautas complementarias; tienen pistas, revisión y apertura acompañada. El HTML es adaptable a móviles; en una incrustación pequeña algunas actividades usan desplazamiento vertical.

## Recursos

- Tablero de cuatro en línea para dos personas en el mismo dispositivo: gravedad, turnos, victoria horizontal/vertical/diagonal, empate, deshacer y secuencia de ejemplo.
- Tres lentes para observar reglas, acciones, estado y experiencia.
- Práctica DMC, ordenamiento de bucle y caso ficticio de coherencia.
- Plantilla editable, pautas, fuentes y guía docente dentro de la misión.
- Temporizador opcional para el intercambio. Nunca avanza la presentación por sí solo.
- Registro completo visible para copiar o descargar como TXT.

## Archivos y edición

`content.js` contiene textos, instrucciones, tiempos y fuentes. `app.js` implementa la interacción. `game.js` contiene el motor de la demostración. `styles.css` conserva el estilo de las secundarias. `assets/taller.webp` contiene la ilustración original.

Después de editar, ejecuta `python3 preparar_publicacion.py`. Genera recursos con hash para evitar mezclar versiones de caché y actualiza `index.html` y `presentacion.html`. Publica la carpeta completa. Conserva versiones antiguas de recursos en el servidor mientras puedan existir entradas HTML en caché.

## Borradores y uso en clase

Los textos se guardan únicamente en el navegador mediante `ludaria_tallado_mecanicas_v1`. No hay envío de respuestas, agregación de dispositivos ni actualización de la Forja o del Libro de Stats. Si el navegador o la incrustación restringe almacenamiento o descargas, usa el registro visible para copiar. En dispositivos compartidos, conserva el registro antes de reiniciar la misión.

Los sellos indican práctica local, no una calificación. Las respuestas abiertas se revisan entre pares y con el facilitador. El facilitador entrega los códigos reales por colaboración a través del sistema existente. El Fragmento II corresponde a La Gema Motivacional.

## Fuentes y autoría

Werbach y Hunter (2012, 2015) orientan el análisis de diseño; Sicart (2008) complementa la relación entre acciones y reglas. Hasbro es la fuente de reglas del modelo clásico. Referencias completas, enlaces y límites están integrados en la presentación.

La secuencia de cinco pasos del bucle, los casos, las síntesis y el tablero son elaboraciones didácticas propias. No se atribuye ese ciclo literal a los autores. El análisis del juego completo usa las tres escalas como lente: los soportes materiales del modelo no se presentan como nuevas categorías canónicas de DMC.

Ilustración original de Ludaria creada con la herramienta integrada de generación de imágenes; el prompt se conserva en `PROMPT.md`. No se usan imágenes o logotipos del juego comercial. No se utiliza la marca GamiAula.
