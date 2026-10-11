# Publicación y verificación de entradas de Ludaria

11 de octubre de 2026. Evidencia histórica de PR #4 y de la instalación versión 2. El estado posterior a PR #7 está en `CONEXION_LUDARIA.md` y `AUDITORIA_CONTINUIDAD_20261011.md`. Las correcciones de PR #5/#6/#7 no se han acreditado como instaladas en Google. Genially conserva los iframe originales.

## Publicado

- PR #4 integrado en main: 0c52ecd4c2aec7a42ce8df0cb00ea4db156ef5d8. Integra las preparaciones de #2 y #3, cerradas como sustituidas.
- GitHub Pages: workflow 38142041656, success sobre ese commit.
- Apps Script: Código.gs v0.3 guardado y comparado íntegramente con la fuente generada. prepararConexionLudaria terminó correctamente en el proyecto original. diagnosticarConexionLudaria confirmó planilla correcta, vínculo y secreto conservados.
- Misma implementación web: Google confirmó la versión 2, 11 de octubre, 10:09 hora de Chile. No se creó otro proyecto, no se regeneró el secreto ni se cambiaron acceso o propietario.
- 13 guardianes, 39 ayudas/acciones, cinco secretos sin XP, bitácoras por persona/misión, historial antes/después y motivo opcional.

## Correcciones y pruebas

Se corrigió el cierre tardío de ventanas para que no dupliquen contenido ni roben el foco. Las misiones centrales conservan su dirección al cambiar de pantalla: un fragmento relativo resolvía contra la base de recursos y salía de la conexión al recargar. El modo central guarda la pantalla en el cuaderno; el modo local conserva su navegación.

Workflow 38141839213 aprobado sobre 8c3a062e81014404a0a1347c2c14eff4f406070d. Pasaron servidor general, servidor RPG, 24 escenarios de gateway, DOM de 13 misiones/39 ventajas, 13 casos de resiliencia y todas las pruebas Chromium. Recorrido móvil 390px, escritorio, foco/Escape, recuperación tras recargas y marcos locales de 720px. Capturas revisadas. Estas pruebas de operaciones utilizan servicios y personajes ficticios.

## Google real

Comprobadas visualmente las 13 URLs centrales: cada entrada carga el guardián correcto dentro del contenedor de Apps Script. Comprobadas también Forja, Mochi y la presentación original de Misión 0. Esto acredita carga de entradas, no recuperación autenticada ni escrituras de participantes.

La comprobación autenticada de guardado permanece pendiente. El broker seguro no validó el formulario anidado de Ludaria; no se introdujeron claves mediante otra vía ni se alteraron personajes durante esta revisión. La entrada de Vetas queda preparada para acceso manual a un personaje de prueba.

## Pendiente

- Comprobar guardado/recuperación y decisiones con un personaje de prueba en Google real; compras, redistribución y retirada de ayudas en la nueva versión.
- Ensayar las 16 incrustaciones originales en un Genially de prueba publicado, sin reemplazarlas ni modificar el Genially del propietario.
- Gateway continúa enabled:false y verified:false. Las URL GitHub originales mantienen modo local; la guía vigente conserva sus bloques originales. Las URL centrales directas son alternativas para ensayo independiente.
- Fuente vigente: main. El proyecto original recibió la versión 2 aquí documentada; las mejoras posteriores requieren actualizar la misma implementación. Los paquetes locales anteriores son históricos.

Guías Word/PDF de incrustación actualizadas sin cambiar actividades ni instrumentos; TXT complementario con 16 bloques completos. La revisión debe partir del HEAD real y del estado vigente; no asumir que esta instalación histórica contiene cambios posteriores. No pedir otro proyecto ni sustituir las URL originales.
