# Ludaria · conexión central v0.3.0

La base del paso 1 ya está instalada. Este piloto utiliza **el mismo proyecto Apps Script y la misma planilla privada**. Conserva las propiedades del proyecto, el secreto y los personajes existentes.

## Activar una sola vez

0. Si no estás seguro de haber abierto el proyecto original, pega el código completo, guarda y ejecuta primero `diagnosticarConexionLudaria`. Revisa el registro de ejecución. Continúa únicamente si `puedePreparar` es `true`. Esta función no escribe ni muestra el secreto.
1. En el proyecto donde ejecutaste `iniciarLudaria`, sustituye TODO el contenido de `Código.gs` por `Code-Ludaria-Conectado.gs`. No crees otro proyecto ni pegues dos versiones juntas.
2. Guarda y ejecuta `prepararConexionLudaria` desde el editor con la cuenta propietaria. Autoriza los permisos solicitados. No ejecuta pruebas sobre personajes reales ni borra registros.
3. La URL /exec ya está entregada. Ve a **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar** para actualizar la implementación existente y conservar el mismo enlace.
4. Comprobar el nuevo despliegue real y las incrustaciones de Genially antes de habilitar las rutas públicas.

El código de las interfaces de esta versión debe estar publicado en `main` antes de la prueba real. La rama y el PR mantienen el trabajo revisable; la guía de producción registra su estado. El servidor carga únicamente rutas autorizadas de este repositorio, sin URLs aportadas por usuarios.

## Entradas para Genially

Usar la URL real del despliegue como base. No publicar estos marcadores como si fueran enlaces comprobados.

| Pantalla | Ruta |
| --- | --- |
| Inicio y Forja | `/exec` |
| Mercadito de Mochi | `/exec?entrada=mochi` |
| Las Vetas del Diseño | `/exec?mision=vetas-diseno` |

Recomendación de iframe: ancho 100%, altura 850 para Forja/Mochi y 720 para Vetas, borde 0 y permiso de pantalla completa. Genially conserva únicamente la incrustación.

### Compatibilidad con los enlaces existentes

Las 23 entradas HTML de Forja y las 13 misiones posteriores al diagnóstico ahora tienen activa la navegación al mismo `/exec`. Los iframes antiguos de GitHub conservan su URL: Forja abre su registro central, `?entrada=mochi` abre Mochi y cada misión abre su guardián. Las direcciones centrales entregadas también siguen siendo válidas.

Este arreglo solo activa las entradas y actualiza la versión de sus archivos compartidos para evitar caché anterior. **No modifica Código.gs**: el archivo completo entregado para actualizar el proyecto original sigue siendo válido. Actualizar la implementación activa con ese archivo continúa siendo necesario para las últimas funciones del servidor. Misión 0 conserva su receptor independiente.

## Identidad y progreso

El participante puede crear su personaje desde la entrada central. El servidor genera un ID interno y una clave personal `LUD-…`, disponible para copiar o descargar. No se guarda la clave en texto en la planilla. En cada misión usa **nombre de explorador + clave**; mayúsculas, tildes y espacios equivalentes identifican el mismo alias. Un alias ya registrado requiere su clave. Las runas de recompensa se conservan y son distintas de la clave personal.

El perfil y el cuaderno se recuperan desde el servidor. La sesión vive en memoria durante cuatro horas; cerrar o recargar requiere identificación. No depende de compartir `localStorage` entre iframes. Si pierde la clave, el propietario ejecuta `recuperarClaveLudaria` desde el editor del mismo proyecto, confirma el nombre y recibe una nueva clave en un diálogo de la hoja. Se conserva el progreso, se invalidan las claves y sesiones anteriores y se registra `RECUPERACION_ACCESO` sin escribir la clave en la planilla ni en el registro de ejecución. No se crea otro personaje ni se ofrece recuperación pública sin intervención del facilitador.

Las compras se validan sobre el saldo actual. El cliente muestra el resultado después de confirmarlo; el ID de solicitud evita repetir cobros. Redistribuir atributos conserva el total de puntos obtenidos, la XP, las runas y los movimientos. Los talentos activos y las ventajas se ajustan a los atributos actuales. Las copias de personajes locales requieren revisión antes de migrar: no se acreditan saldos aportados por el navegador.

El piloto Ojo del Artesano requiere Maestría 5 actual. Ofrece una pauta de análisis, sin respuestas automáticas ni cambios de evaluación. Forja muestra una demostración antes de invertir. El catálogo v0.3.0 incluye 39 apoyos y acciones para las 13 misiones posteriores a la apertura. Consulta [la matriz completa](../produccion/ATRIBUTOS_GUARDIANES_DECISIONES.md). Las compras y redistribuciones conservan atributos antes/después y motivos opcionales; las rutas RPG conservan decisiones y reflexiones.

Las Vetas guarda versiones del borrador en `Aventuras`, separadas por ID y misión. Un cambio desde otra sesión se detecta y se rechaza antes de sobrescribir. Se muestran estados pendiente/guardando/confirmado. No se acredita una evaluación ni se entregan runas por guardar. El receptor del diagnóstico de Misión 0 se conserva independiente.

## Comprobación real pendiente

- Crear un personaje ficticio y conservar su clave.
- Abrir Mochi desde otro iframe/dispositivo e identificarlo con el mismo nombre y clave.
- Activar una runa real de prueba, comprar y comprobar `Movimientos`/`Progreso`; rechazar la repetición y el saldo insuficiente.
- Llegar a Maestría 5, consultar el apoyo de Vetas y recuperar una nota al abrir de nuevo.
- Redistribuir a Maestría 1 y comprobar que el apoyo deja de estar disponible.
- Repetir en móvil, escritorio, Genially y una ventana sin la sesión propietaria.

## Pruebas reproducibles

```sh
python ludaria/build.py
node ludaria/test-server.cjs
node ludaria/test-rpg-server.cjs
# Para la comprobación DOM: npm install --no-save jsdom@26.1.0
node ludaria/test-rpg-dom.cjs
node ludaria/test-rpg-resilience.cjs
npm install --no-save playwright@1.62.1
npx playwright install --with-deps chromium
node ludaria/test-browser.cjs
node ludaria/test-rpg-browser.cjs
```

Las pruebas locales usan dobles de Apps Script y nunca el Sheet de participantes. El workflow ejecuta la segunda pasada en navegador y guarda capturas. Pasar esas pruebas no demuestra que el despliegue real funcione. Las cuotas de Apps Script y el límite preventivo de 300 personajes acotan este piloto a un curso; el contador global de solicitudes es un límite de carga, no una defensa completa contra abuso.

Referencias oficiales: [Apps web](https://developers.google.com/apps-script/guides/web), [comunicación con el servidor](https://developers.google.com/apps-script/guides/html/communication), [incrustación](https://developers.google.com/apps-script/reference/html/x-frame-options-mode).

## Corrección adicional de decisiones

El ensayo conserva la revisión desde la que se editó. Si cambia en otra sesión, el envío se rechaza sin reemplazarlo. El botón «Comparar con la decisión confirmada» permite revisar el registro actual; «Retomar mi ensayo tras comparar» conserva tu borrador y prepara otra confirmación. No equivale a guardado ni evaluación. Evidencia: `produccion/AUDITORIA_CONFLICTOS_RPG_20261011.md`.
