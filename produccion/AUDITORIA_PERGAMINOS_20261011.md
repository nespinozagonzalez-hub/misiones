# Adaptador de Pergaminos · 11 de octubre de 2026

Base: PR #2, rama derivada `codex/ludaria-pergaminos-adapter`.

## Cambios y checklist

- [x] Mantener `pergaminos-dispersos` en modo local cuando se abre desde Pages.
- [x] Preparar espera de identidad central antes del primer render.
- [x] Recuperar una bitácora versionada antes de permitir nuevos guardados.
- [x] Rechazar una recuperación fallida sin reemplazar el registro por un estado vacío.
- [x] Usar `LudariaCloud.loadMission` y `saveMission` cuando el HTML sea servido por Apps Script.
- [x] Evitar lectura y escritura en `localStorage` en modo central.
- [x] Conservar descarga, copia, respuestas abiertas y revisión humana.
- [x] Conservar versiones previas al iniciar una nueva práctica central.
- [ ] Habilitar `pergaminos-dispersos` como ruta del servidor solo después de validar Forja–Mochi–Vetas con Google real.
- [ ] Ejecutar dos sesiones y dos personajes contra Sheets real.
- [ ] Verificar dentro de Genially en móvil y escritorio.

## Diagnóstico del proyecto de Apps Script

Se añadió `diagnosticarConexionLudaria`, función de solo lectura. Informa si el editor actual está asociado a la planilla correcta, si conserva el vínculo y el secreto del paso 1 y cuántos registros DEMO/PARTICIPANTE existen. Nunca devuelve el secreto.

Si el proyecto conserva las propiedades, indica que puede ejecutarse `prepararConexionLudaria`. Si es un proyecto nuevo con filas existentes, se detiene y pide recuperar el original; no rota secretos, no borra DEMO ni modifica progreso.

## Evidencia reproducible

- `python ludaria/build.py`
- `node --check pergaminos-dispersos/app.participantes-1a36e9e09e.js`
- `node ludaria/test-server.cjs`: diagnóstico, seguridad y regresión del piloto OK con dobles.
- `node ludaria/test-pergaminos-adapter.cjs`: recuperación, guardado, bloqueo de `localStorage` y móvil de 390 px. Se ejecuta en GitHub; no valida Google real.

La ruta no se añadió a `LUDARIA_WEB.routes` ni a `validarMision_`. Por tanto, el adaptador queda preparado pero inaccesible desde la API real hasta superar el piloto.
