# Implementación de navegación, ventajas contextuales y decisiones · 11/10/2026

## Garantía de las incrustaciones
- Se **conservan** las URL originales `https://nespinozagonzalez-hub.github.io/misiones/.../` y los archivos `index.html` / `presentacion.html`.
- El gateway está en el mismo repositorio, pero permanece **enabled:false / verified:false**. No redirigir los iframe del usuario mientras falte validación real en Genially.
- La Misión 0 no puede redirigirse a Apps Script, aunque alguien la incluya accidentalmente en el listado: queda protegida en configuración, lógica y prueba.
- Los enlaces directos `/exec?mision=...` son una opción ya publicada; no es necesario ni prudente sustituir de forma masiva los iframe mientras se prueba la ruta estable.
- El proyecto Apps Script y la planilla privada existentes se conservan. Esta rama no instala ni publica una nueva versión del proyecto Google.

## Funciones implementadas en la rama
- Cierre narrativo de Mochi en última pantalla de cada una de las 13 misiones posteriores a la apertura, sin enlazar, gastar ni acreditar puntos.
- Distintivos visuales, transición leve, accesibilidad para detener movimientos y pantalla pequeña.
- Una opción de guardián se presenta *dentro de cada tramo* del recorrido. Cada misión usa sus tres ventajas originales (atributos y umbrales 3/5/8). El apoyo extra es opcional y no sustituye las tareas, rúbricas, herramientas e instrumentos E/F/G/H.
- El jugador identificado puede pulsar «Seguir sin esta ayuda»: el servidor comprueba su atributo actual, la misión, el ID de ventaja y la página, y registra `OMISION_VENTAJA` de forma idempotente. La omisión no quita XP, puntos ni acceso a la actividad.
- La nueva señal es **explícita**: observar una tarjeta, pasar de pantalla o tener una ventaja bloqueada no constituye una omisión.
- `analizarDecisionesLudaria` suma las omisiones por ayuda, sin imprimir nombres ni texto de respuestas; no equivale a inferir motivos.
- Mensajes y opciones de la tarjeta se muestran solo tras identificar al personaje central. El modo local anterior no inventa registros.
- Un mensaje de confirmación de omisión no desaparece al actualizarse el perfil sin cambios en atributos.

## Pruebas y límites
- Se ampliaron los ensayos de gateway, las 13 interfaces DOM, guardado de omisiones idempotentes y bloqueo de intentos inválidos.
- El archivo completo `ludaria/Code-Ludaria-Conectado.gs` se recompiló como entregable del mismo proyecto original, pero **no se publicó automáticamente**.
- Las ejecuciones CI están vinculadas al PR #5. Si una prueba falla, no fusionar ni instalar.
- Las pruebas locales y Chromium de CI emplean servicios ficticios y no confirman el guardado en Google real.
- Quedan pendientes: validar un personaje de prueba autorizado en Google, comprobar las 16 incrustaciones reales en Genially y activar el gateway únicamente si ese flujo funciona en desktop/móvil y la URL principal del iframe permanece estable.

## Siguiente ciclo de calidad
1. Corregir errores reproducibles en CI. Repetir servidor, DOM, navegación móvil y iframe con movimiento reducido.
2. Confirmar el tratamiento de la navegación ante diálogos abiertos y restauración de página.
3. Hacer un ensayo completo de continuidad del mismo personaje en la implementación original de Google, sin revelar claves.
4. Probar redirección del iframe viejo en un Genially de ensayo publicado, sin tocar el Genially original.
5. Revisar indicadores pedagógicos y exportación anonimizada para el análisis doctoral antes de uso con participantes.
