# Corrección de las entradas existentes · 11 de octubre de 2026

El propietario informó que Forja no mostraba clave y las misiones no pedían identificación.

## Causa observada

- En el Genially publicado, «Forja tu personaje» incrusta `https://nespinozagonzalez-hub.github.io/misiones/forja/`.
- Esa entrada real muestra «GUARDADO LOCAL». El archivo `ludaria/gateway-config.js` en main conserva `enabled: false` y `verified: false`.
- El mismo `/exec` central real sí muestra a Nara, guardiana de los nombres, con nombre de explorador, clave personal y creación de personaje.
- Las mejoras centrales existían, pero las entradas antiguas no las cargaban. La declaración de cierre anterior fue incompleta respecto de esos enlaces.

## Corrección

- Activar el gateway común para Forja/Mochi y las 13 misiones existentes.
- Actualizar la referencia de caché en las 23 entradas HTML existentes a `20261011-identidad1`.
- Conservar rutas, actividades, códigos y la implementación original. Misión 0 no se modifica.
- Verificar todas las variantes de URL existentes, la separación de Mochi y la exclusión del diagnóstico.
- No modificar el archivo Apps Script que el propietario está actualizando. SHA-256 de Código.gs y del TXT entregado: `7991e9a2103238544d817e75b5429b86d0ccae77b2277983cbb292d1d480ee00`.

## Comprobaciones

- Gateway, servidor general, servidor RPG, DOM de 13 misiones y 14 escenarios de resiliencia: aprobados localmente con dobles.
- Publicación, CI gráfico y comprobación de las entradas dentro de Genially: se documentarán tras la integración.
- Registro/recuperación con Google real y estado de la actualización de Apps Script: no confundir con resultados simulados.
