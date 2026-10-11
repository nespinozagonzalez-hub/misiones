# Implementación de navegación, ventajas contextuales y decisiones · 11/10/2026

Estado posterior a PR #7: consultar `CONEXION_LUDARIA.md` y `AUDITORIA_CONTINUIDAD_20261011.md`. Pages y CI aprobados; las correcciones posteriores a versión 2 están en código, pendientes de instalar en el mismo Apps Script. La guía conserva los 16 bloques originales de GitHub Pages y una prueba CI los protege. No modificar Genially ni activar gateway sin ensayo real de identidad y guardado.

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

## Continuación sobre las mismas misiones
- No se añaden sesiones ni se cambian slugs, rutas o iframe. Misión 0 permanece intacta.
- Corregido: consultar el perfil no sustituye el aviso de notas o ensayos pendientes por una confirmación de guardado.
- Corregido: pulsar Guardar sin cuaderno pendiente no inventa una nueva confirmación.
- El cierre con Mochi muestra si quedan notas sin confirmar. Tras la respuesta de guardado muestra cuaderno confirmado, distinguiéndolo de entrega y evaluación.
- Pruebas locales aprobadas: servidor general, servidor RPG (13 guardianes / 39 ventajas), 24 escenarios de gateway, 14 escenarios de resiliencia y DOM de las 13 misiones con comprobaciones de avisos pendientes y confirmados.
- Las pruebas de navegador del nuevo cambio quedan sujetas al CI del PR correspondiente. El cliente integrado en Código.gs requiere actualizar la misma implementación de Google para recibir esta corrección; el archivo actualizado en GitHub no publica Apps Script por sí solo.

## Cierre de identidad y recuperación
- La creación central solicita nombre y Kael/Kira; asigna automáticamente una clave LUD, con copia y descarga TXT. Las runas de recompensa son independientes.
- `recuperarClaveLudaria` es una herramienta del propietario desde el editor del mismo proyecto: solicita nombre y confirmación en la hoja abierta. No es una operación de la API pública.
- Recuperar renueva el verificador de acceso y revoca las sesiones anteriores del personaje. No modifica ID, perfil, puntos, XP, atributos, runas, movimientos o cuadernos; los demás personajes permanecen activos.
- Registra RECUPERACION_ACCESO sin la nueva clave. Si el registro de evidencia falla, restaura verificador y versión de sesión. La clave solo se muestra al facilitador en un diálogo, nunca en logs ni hojas.
- Pruebas específicas: acceso anónimo rechazado, nombre inexistente, nueva clave, invalidación de acceso anterior, aislamiento entre personajes, conservación de progreso, fallo de auditoría y cancelación sin cambios.
- Actualización requerida: pegar el código completo en el proyecto original, diagnosticar, preparar y editar la implementación existente seleccionando Nueva versión. Se conserva el mismo /exec y no se crean misiones nuevas.
