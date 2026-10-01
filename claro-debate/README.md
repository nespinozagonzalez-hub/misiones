# El Claro del Debate

Segunda misión secundaria del Bosque de los Conceptos y sesión 4 de **Buscadores de la Gamificación Perdida**. Cierre del módulo 1 con el Archivista Théol, atributo Sabiduría y Fragmento I del Orbe del Saber.

Formato HTML aprobado a partir de La Senda de los Ejemplos: fantasía sobria, bosque verde oscuro, oro, marfil, fondos originales, controles discretos y actividades que sostienen el objetivo pedagógico.

## Ficha y alcance

La ficha original de la tesis (tabla 5, pp. 40–41) define una misión secundaria de 90 minutos sincrónicos para contrastar mitos y evidencia, utilizando síntesis cuantitativas, condiciones de efectividad y límites. Los equipos se posicionan ante afirmaciones y defienden su lectura; el mentor sintetiza y cierra el módulo. La matriz de presentaciones añade votación inicial, revelado de evidencia y segunda votación.

Esta presentación adapta esa ficha a doce pantallas. Los tres candados son práctica formativa local y revelan pautas; no crean nuevos objetos oficiales, Códigos del Saber ni experiencia numérica.

| Pantalla | Actividad | Minutos |
|---|---|---:|
| 1 | El Claro del Debate: entrar en la misión | 3 |
| 2 | Encargo de Théol y reglas | 5 |
| 3 | Primera postura ante cuatro afirmaciones | 8 |
| 4 | Tres lecturas y sus límites | 10 |
| 5 | Ronda 1: promesa absoluta; candado Alcance | 7 |
| 6 | Ronda 2: participación y aprendizaje | 7 |
| 7 | Ronda 3: componentes; candado Inferencia | 7 |
| 8 | Ronda 4: experiencias diferentes | 7 |
| 9 | Debate entre equipos y revisión | 12 |
| 10 | Secuencia del argumento; candado Argumento | 8 |
| 11 | Comparación de posturas y síntesis | 10 |
| 12 | Reflexión, formulario externo y Fragmento I | 6 |
| **Total** | | **90** |

## Abrir y editar

Abre `index.html` con los archivos de esta carpeta. No requiere dependencias, instalación ni compilación. El paquete descargable incluye también `El_Claro_del_Debate.html`, una copia de un único archivo con estilos, código e imágenes integrados.

- `app.js`: guion de las doce pantallas, votos, candados, diálogo, temporizador y registro.
- `content.js`: afirmaciones, lecturas, referencias, actividades cerradas y configuración del formulario.
- `styles.css`: diseño compartido con la primera misión y estilos propios del debate.
- `assets/claro.webp`: ilustración nueva del claro.
- `assets/archivo.webp`: mesa del archivista reutilizada de la misión anterior para mantener continuidad.
- `prueba-incrustacion.html`: dos marcos para comprobar escritorio y móvil.
- `PROMPT.md`: especificación de autoría para conservar el formato en siguientes misiones.

Los textos y votos son del equipo que utiliza el navegador. No son una votación agregada de la clase. La clave de guardado es `gamiaula_claro_debate_v1`; no comparte ni sobrescribe el progreso de La Senda. Reiniciar borra únicamente esta misión. En un marco que restrinja almacenamiento, se puede explorar y copiar el registro.

Las posturas iniciales se conservan al revelar la lectura de cada ronda. Las segundas posturas pueden revisarse. Ninguna postura, extensión de texto o cambio de opinión se califica automáticamente. La pauta de argumentación exige conversación y revisión humana.

## Candados

1. **Alcance:** elegir la conclusión que reconoce una tendencia media y exige revisarla en cada diseño y contexto; respuesta correcta = opción 2.
2. **Inferencia:** clasificar un ejemplo ficticio. Respuestas: registro observado; interpretación posible; conclusión no sostenida.
3. **Argumento:** construir afirmación → evidencia → límite → decisión. Es una pauta didáctica de esta misión, no una ley universal de argumentación.

Hay dos pistas por candado, reintentos y apertura acompañada. Esta última se muestra como tal y no se registra como respuesta correcta automática. Los contenidos esenciales y la navegación siguen disponibles.

## Cierre del módulo

El Fragmento I es un cierre narrativo activado después de la puesta en común con Théol. No depende de una calificación automática de textos. La aplicación distingue reflexión guardada, sellos de práctica y cierre narrativo. El cierre no actualiza la Forja, el Libro de Stats ni los códigos existentes.

El formulario de módulo ya pertenece al sistema de la tesis. No se inventó un enlace: cuando se tenga su URL real, reemplazar `closingFormUrl:null` en `content.js` por una URL HTTPS. Hasta entonces la pantalla 12 indica que el facilitador compartirá el formulario.

## Publicación e incrustación

Carpeta independiente `claro-debate/` en el repositorio existente `nespinozagonzalez-hub/misiones`. No modificar el portal ni la misión anterior.

```html
<iframe
  src="https://nespinozagonzalez-hub.github.io/misiones/claro-debate/"
  title="El Claro del Debate — misión interactiva"
  width="100%"
  height="880"
  style="border:0; display:block;"
  allow="fullscreen"
  allowfullscreen>
</iframe>
```

La presentación se adapta al ancho del marco. Las pantallas largas permiten desplazamiento vertical. Si el marco restringe descargas, la bitácora ofrece un campo seleccionable para copiar el registro; también puede abrirse la misión directamente. Si se aplica un sandbox, comprobar permisos de scripts, descargas y pantalla completa. La integración específica en Genially se realiza con su recurso de contenido externo.

## Referencias de las lecturas

- Sailer, M., & Homner, L. (2020). The gamification of learning: A meta-analysis. *Educational Psychology Review, 32*, 77–112. https://doi.org/10.1007/s10648-019-09498-w
- Bai, S., Hew, K. F., & Huang, B. (2020). Does gamification improve student learning outcome? Evidence from a meta-analysis and synthesis of qualitative data in educational contexts. *Educational Research Review, 30*, 100322. https://doi.org/10.1016/j.edurev.2020.100322
- Zainuddin, Z., Chu, S. K. W., Shujahat, M., & Perera, C. J. (2020). The impact of gamification on learning and instruction: A systematic review of empirical evidence. *Educational Research Review, 30*, 100326. https://doi.org/10.1016/j.edurev.2020.100326

Síntesis y actividades didácticas propias; no se reproducen artículos completos. Los números g y sus intervalos representan diferencias estandarizadas; no porcentajes. Los participantes de las categorías no deben sumarse porque los conjuntos pueden solaparse.

## Fondo nuevo

Creado con la herramienta de imágenes de ChatGPT, usando el bosque aprobado de La Senda como referencia de estilo. Prompt: claro antiguo con árboles enormes, mesa circular y bancos de piedra cubiertos de musgo a la derecha; luz verde suave y luciérnagas doradas; mitad izquierda oscura para títulos HTML; fantasía pictórica sobria para docentes adultos; sin personajes, letras, interfaz ni logotipos. Optimizado a WebP e integrado en el repositorio.
