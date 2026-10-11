# Auditoría de guardianes y atributos · 11 de octubre de 2026

## Resultado comprobado

La versión v0.3.0 contiene 13 guardianes diferentes y 39 apoyos/acciones, con efectos concretos vinculados a cinco atributos en umbrales 3/5/8. Incluye descripción previa con Mochi, compra y redistribución con motivos opcionales y valores antes/después, acciones con ruta/ensayo/reflexión, guardado por personaje y misión y cinco secretos sin recompensas adicionales.

Primera pasada funcional: test-server.cjs, test-rpg-server.cjs y test-gateway.cjs aprobados. Comprueban identidad y sesión, saldos, duplicados, conflictos entre sesiones, presupuesto de redistribución, XP conservada, comprobación actual de atributos, aislamiento de jugadores, decisiones repetibles sin duplicados y agregados privados. Los 24 escenarios del gateway pasan con servicios ficticios.

Segunda pasada DOM: test-rpg-dom.cjs aprobado con jsdom 26.1.0. Ejecuta las entradas HTML reales mediante doGet y los adaptadores cargados por ellas; comprueba los 13 guardianes, las 39 ventajas, decisiones/reflexiones, recuperación del cuaderno tras recargar, pantallas posteriores, el catálogo de la Forja y los cinco secretos. localStorage permanece bloqueado. No es una prueba gráfica ni prueba Google real.

Comprobación real de Genially: la portada y el Portal de la Aventura abren en el navegador. «Forja tu personaje» contiene https://nespinozagonzalez-hub.github.io/misiones/forja/ y muestra GUARDADO LOCAL. Esta incrustación todavía debe cambiarse a la entrada central /exec. No se ingresaron credenciales ni se alteró Genially.

## Pendiente y bloqueo concreto

La publicación de la rama fue rechazada por revisión automática: requiere autorización explícita para enviar el código y la documentación al repositorio público nespinozagonzalez-hub/misiones. No se reintentó mediante otro mecanismo. La rama se conserva localmente y no existe un PR nuevo publicado por esta ampliación.

Las pruebas Playwright están preparadas para escritorio, 390px, marco local 720px y las 13 entradas. No se ejecutaron con el nuevo código: falta el ejecutable Chromium local; su descarga no produjo un archivo válido y el CI remoto requiere publicar la rama. No declarar esas pruebas aprobadas. El piloto anterior tiene evidencia independiente y no valida esta ampliación.

Falta publicar las interfaces, actualizar la implementación existente de Apps Script, comprobar continuidad/registro de ventajas y decisiones en Google real, actualizar los iframes de Genially y verificar el contenedor real. gateway-config.js permanece enabled:false y verified:false.

Matriz completa y orden mínimo de activación: ATRIBUTOS_GUARDIANES_DECISIONES.md. Se conservan códigos, XP/puntos, instrumentos originales y receptor de Misión 0. La revisión cada tres horas debe avanzar únicamente las acciones autorizadas y evitar repetir avisos de bloqueo sin novedades.

## Revisión posterior: resiliencia de ventanas

Se corrigieron pérdida de borrador al cerrar, solicitudes duplicadas tras respuesta perdida y foco al cargar/cerrar ayudas. Diez escenarios nuevos pasan en DOM, con regresión del servidor, gateway y 13 misiones aprobada. Evidencias y límites: `AUDITORIA_RESILIENCIA_RPG_20261011.md`; seguimiento: `CHECKLIST_CONEXION_RPG.md`. Chromium sigue ausente: la pasada gráfica de esta ampliación no está aprobada. El código continúa local y no se actualizó Google ni Genially.
