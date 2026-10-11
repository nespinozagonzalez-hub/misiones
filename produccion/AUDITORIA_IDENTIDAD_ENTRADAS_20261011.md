# Identificación activa en las entradas originales · 11 de octubre de 2026

## Solicitud vigente

El propietario informó que Forja no mostraba código ni las misiones pedían identificación. Pidió corregir esas mismas entradas mientras él actualiza el script de la planilla. La corrección debe permitirle probar la experiencia conectada; conservar el modo local impediría cumplir su petición.

## Causa y cambio concurrente

Forja y las misiones incrustaban sus direcciones originales de GitHub. El gateway estaba desactivado, aunque el /exec sí mostraba las interfaces centrales. PR #9 activó la navegación, aprobó CI completo 38158661315 y fue publicado por Pages 38158920841 como 200a5bf8e4fc94adce7f5aed29a0bd19aa529500.

Mientras se verificaba el recorrido real, la revisión concurrente 6fcef08 volvió a poner ambos indicadores en false por una instrucción anterior de la revisión programada. Esa instrucción se actualizó conforme a la solicitud vigente y las comprobaciones siguientes. Esta corrección conserva el contrato de los 16 iframe originales, restaura la conexión activa y diferencia la verificación de entrada del guardado autenticado. No se modificó Genially.

## Comprobación real en el Genially del propietario

Se recorrió https://view.genially.com/6a20358bb9a35a317680bfae mediante sus controles visibles, sin editarlo ni introducir claves. Los atributos src siguieron apuntando a GitHub; dentro de cada iframe se cargó la misma implementación original de Apps Script.

| Entrada | Guardián observado | Nombre y clave visibles |
| --- | --- | --- |
| Forja | Nara, guardiana de los nombres | Sí; creación de nombre y Kael/Kira disponible |
| Mochi | Mochi, custodio de las posibilidades | Sí |
| Pergaminos | Iria, custodio del archivo | Sí |
| Senda | Elian, rastreador de huellas | Sí |
| Claro | Liora, guardiana de las voces | Sí |
| Vetas | Brina, centinela de la cantera | Sí |
| Tallado | Rokan, tallador de rutas | Sí |
| Gema | Savia, guardiana de las facetas | Sí |
| Planos | Daren, custodio de los planos | Sí |
| Yunque | Ferna, guardiana de las chispas | Sí |
| Templado | Neris, mediadora del taller | Sí |
| Reflejo | Eira, custodio de los criterios | Sí |
| Pulido | Mael, pulidor del santuario | Sí |
| Espejo | Arel, guardiana del encuentro | Sí |
| Defensa | Oria, guardiana de la bóveda | Sí |

Esta prueba confirma navegación real y presentación de identificación. No acredita autenticación, creación, recuperación o escritura de datos de un personaje real. Las operaciones de registro, clave generada, cuaderno y recuperación pasan con servicios simulados; la prueba autenticada real queda para la comprobación manual del propietario tras actualizar el script.

## Alcance de esta corrección

- Gateway activo para las 23 entradas HTML existentes de Forja/Mochi y las 13 misiones; caché 20261011-identidad2.
- Los 16 iframe originales, sus rutas, queries, fragmentos, alturas y títulos permanecen iguales. Se conserva la prueba de ese contrato.
- Misión 0 no se modifica ni redirige. No se alteran actividades, puntos, códigos, registros o secretos.
- Código.gs y el TXT entregado no cambian: SHA-256 7991e9a2103238544d817e75b5429b86d0ccae77b2277983cbb292d1d480ee00.
- La revisión programada conserva ahora las entradas activas y continúa comprobando el guardado real por separado. Una falta de prueba autenticada no es un fallo de carga que justifique devolver las entradas al modo local.
