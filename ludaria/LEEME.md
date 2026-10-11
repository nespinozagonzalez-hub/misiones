# Ludaria · conexión central v0.4.1

La base del paso 1 ya está instalada. Este piloto utiliza **el mismo proyecto Apps Script y la misma planilla privada**. Conserva las propiedades del proyecto, el secreto y los personajes existentes.

## Activar una sola vez

0. Si no estás seguro de haber abierto el proyecto original, pega el código completo, guarda y ejecuta primero `diagnosticarConexionLudaria`. Revisa el registro de ejecución. Continúa únicamente si `puedePreparar` es `true`. Esta función no escribe ni muestra el secreto.
1. En el proyecto donde ejecutaste `iniciarLudaria`, sustituye TODO el contenido de `Código.gs` por `Code-Ludaria-Conectado.gs`. No crees otro proyecto ni pegues dos versiones juntas.
2. Guarda y ejecuta `prepararConexionLudaria` desde el editor con la cuenta propietaria. Autoriza los permisos solicitados. No ejecuta pruebas sobre personajes reales ni borra registros.
3. La URL /exec ya está entregada. Ve a **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar** para actualizar la implementación existente y conservar el mismo enlace.
4. Recargar el Genially y comprobar la bienvenida con retrato, la creación con clave elegida y la recuperación. Las rutas originales ya están activas; no cambies los iframe.

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

Las 23 entradas HTML de Forja y las 13 misiones posteriores al diagnóstico navegan al mismo `/exec`, conservando las URL originales de GitHub. El gateway está activo; Forja, Mochi y los 13 guardianes se comprobaron dentro del Genially real. La prueba autenticada de guardado/recuperación se verifica por separado. Las direcciones centrales entregadas también siguen siendo válidas.

**Esta versión sí modifica Código.gs.** Reemplaza el archivo completo anterior por el de v0.4.1 y actualiza la misma implementación. GitHub Pages no reemplaza el cliente incrustado en Apps Script. Misión 0 conserva su receptor independiente.

## Identidad y progreso

El participante elige y confirma una **clave personal de seis dígitos**, que usará con su nombre en todas las misiones. Recibe además un **código de recuperación RES** privado; puede guardar ambos en un TXT. El servidor guarda verificadores, nunca las credenciales en texto. Los alias equivalentes identifican el mismo personaje. Las claves LUD anteriores siguen entrando. Las runas de recompensa siguen siendo distintas de la clave personal.

La bienvenida muestra el retrato de cada guardián. «Recuperar clave» permite escribir nombre y código RES para elegir una nueva clave, conservando íntegro el progreso y revocando sesiones anteriores. Si no tiene el respaldo o su cuenta es anterior a v0.4.1, el facilitador puede renovar el acceso con `recuperarClaveLudaria` desde el editor del proyecto original. Esta renovación invalida el respaldo anterior. No se recupera un personaje solo con conocer su nombre.

El perfil y el cuaderno se recuperan desde el servidor. La sesión vive en memoria cuatro horas; cerrar o recargar requiere identificación. No depende de compartir localStorage entre iframes. Ver [el detalle de esta versión](../produccion/BIENVENIDA_Y_CLAVES_20261011.md).

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
node ludaria/test-access.cjs
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

## Auditoría total v0.4.1

Las 13 misiones recuperan la pantalla guardada aunque el iframe original termine en #pantalla-1. La práctica nueva admite enlaces a otras pantallas. Los adaptadores mantienen el /exec al navegar y su generación se valida como repetible.

Forja y Mochi permiten consultar el nombre y la clave usada desde «Mi nombre y mi clave». Se mantiene solo en memoria de esta sesión; cerrar el acceso la descarta. Consultarla no confirma notas ni ensayos pendientes. El guardado compartido espera las solicitudes simultáneas y conserva las ediciones posteriores a un fallo. Misión 0 muestra un aviso si localStorage está bloqueado, manteniendo su instrumento y receptor originales.

La revisión programada es cada cinco horas. Consulta produccion/AUDITORIA_ACTUAL.md para alcance y límites.
