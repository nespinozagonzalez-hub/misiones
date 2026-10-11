# Adaptadores por misión · inventario del 11 de octubre de 2026

Inventario generado desde las entradas efectivamente enlazadas en el catálogo, no desde archivos app.js que pueden estar fuera de uso. No amplía las rutas del servidor ni acredita integración.

| Sesión | Entrada ya incrustada | Aplicación cargada | Estado |
| --- | --- | --- | --- |
| 1 | mision-0/presentacion.html | app.d8f7de9958.js | Receptor original independiente; excluido |
| 2 | pergaminos-dispersos/presentacion.html | app.participantes-1a36e9e09e.js | Adaptación pendiente; sin habilitar servidor |
| 3 | senda-ejemplos/index.html | app.participantes-85ed383dfe.js | Adaptación pendiente; sin habilitar servidor |
| 4 | claro-debate/presentacion.html | app.participantes-0a1f81fd6b.js | Adaptación pendiente; sin habilitar servidor |
| 5 | vetas-diseno/presentacion.html | app.central-d10b770f97.js | Piloto preparado, pendiente Google |
| 6 | tallado-mecanicas/presentacion.html | app.participantes-d6063a033c.js | Adaptación pendiente; sin habilitar servidor |
| 7 | gema-motivacional/presentacion.html | app.participantes-842e7eec9b.js | Adaptación pendiente; sin habilitar servidor |
| 8 | planos-arquitecto/presentacion.html | app.participantes-dbd5e90942.js | Adaptación pendiente; sin habilitar servidor |
| 9 | yunque/presentacion.html | app.participantes-b5d0315b5c.js | Adaptación pendiente; sin habilitar servidor |
| 10 | templado-pares/presentacion.html | app.participantes-f2772ba5ef.js | Adaptación pendiente; sin habilitar servidor |
| 11 | reflejo-diseno/index.html | app.participantes-55d01e3f15.js | Adaptación pendiente; sin habilitar servidor |
| 12 | pulido-prototipo/index.html | app.participantes-f4354f3172.js | Adaptación pendiente; sin habilitar servidor |
| 13 | espejo-compartido/index.html | app.participantes-1d02df0a66.js | Adaptación pendiente; sin habilitar servidor |
| 14 | defensa-orbe/presentacion.html | app.participantes-1a36e9e09e.js | Adaptación pendiente; sin habilitar servidor |

## Contrato de la siguiente adaptación

- [x] Identificar los archivos que carga realmente cada entrada.
- [ ] Después de validar el piloto real, iniciar por Los Pergaminos Dispersos.
- [ ] Esperar `LudariaCloud.ready` y cargar el borrador autenticado antes del primer render y guardado.
- [ ] Validar versión y campos del borrador; ante error de lectura, detener el guardado y ofrecer copia, sin reemplazarlo por un estado vacío.
- [ ] En modo central usar `loadMission`/`saveMission`; excluir localStorage y conservar las versiones del servidor.
- [ ] Comprobar dos personas, dos sesiones, conflictos y reintentos; conservar instrumentos y recompensas.
- [ ] Registrar por separado pruebas con dobles y Google/Genially reales.

Misión 0 conserva su receptor original. Las ventajas de otros atributos siguen pendientes de diseño y pruebas; este inventario no las activa.
