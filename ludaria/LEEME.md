# Ludaria · conexión central · piloto v0.2.0

La base del paso 1 ya está instalada. Este piloto utiliza **el mismo proyecto Apps Script y la misma planilla privada**. Conserva las propiedades del proyecto, el secreto y los personajes existentes.

## Activar una sola vez

1. En el proyecto donde ejecutaste `iniciarLudaria`, sustituye TODO el contenido de `Código.gs` por `Code-Ludaria-Conectado.gs`. No crees otro proyecto ni pegues dos versiones juntas.
2. Guarda y ejecuta `prepararConexionLudaria` desde el editor con la cuenta propietaria. Autoriza los permisos solicitados. No ejecuta pruebas sobre personajes reales ni borra registros.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como **yo / propietario**. Para el acceso dentro de Genially sin inicio de sesión Google, seleccionar **Cualquier persona**, si tu cuenta permite esa opción. La hoja permanece restringida. Si tu institución no permite acceso anónimo, debemos adaptar la entrada; no publicar la planilla como alternativa.
4. Copia la URL terminada en `/exec` y envíala en la conversación. El paso está pendiente hasta que exista ese enlace y se compruebe realmente.

El código de las interfaces de esta versión debe estar publicado en `main` antes de la prueba real. La rama y el PR mantienen el trabajo revisable; la guía de producción registra su estado. El servidor carga únicamente rutas autorizadas de este repositorio, sin URLs aportadas por usuarios.

## Entradas para Genially

Usar la URL real del despliegue como base. No publicar estos marcadores como si fueran enlaces comprobados.

| Pantalla | Ruta |
| --- | --- |
| Inicio y Forja | `/exec` |
| Mercadito de Mochi | `/exec?entrada=mochi` |
| Las Vetas del Diseño | `/exec?mision=vetas-diseno` |

Recomendación de iframe: ancho 100%, altura 850 para Forja/Mochi y 720 para Vetas, borde 0 y permiso de pantalla completa. Genially conserva únicamente la incrustación.

## Identidad y progreso

El participante puede crear su personaje desde la entrada central. El servidor genera un ID interno y una clave personal `LUD-…`, disponible para copiar o descargar. No se guarda la clave en texto en la planilla. En cada misión usa **nombre de explorador + clave**; mayúsculas, tildes y espacios equivalentes identifican el mismo alias. Un alias ya registrado requiere su clave. Las runas de recompensa se conservan y son distintas de la clave personal.

El perfil y el cuaderno se recuperan desde el servidor. La sesión vive en memoria durante cuatro horas; cerrar o recargar requiere identificación. No depende de compartir `localStorage` entre iframes. Si pierde la clave, la recuperación por parte del facilitador queda pendiente de una herramienta administrativa; el sistema no crea automáticamente otro personaje con el mismo nombre.

Las compras se validan sobre el saldo actual. El cliente muestra el resultado después de confirmarlo; el ID de solicitud evita repetir cobros. Redistribuir atributos conserva el total de puntos obtenidos, la XP, las runas y los movimientos. Los talentos activos y las ventajas se ajustan a los atributos actuales. Las copias de personajes locales requieren revisión antes de migrar: no se acreditan saldos aportados por el navegador.

El piloto Ojo del Artesano requiere Maestría 5 actual. Ofrece una pauta de análisis, sin respuestas automáticas ni cambios de evaluación. Forja muestra una demostración antes de invertir. Los apoyos de los otros atributos siguen pendientes de conexión.

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
npm install --no-save playwright@1.62.1
npx playwright install --with-deps chromium
node ludaria/test-browser.cjs
```

Las pruebas locales usan dobles de Apps Script y nunca el Sheet de participantes. El workflow ejecuta la segunda pasada en navegador y guarda capturas. Pasar esas pruebas no demuestra que el despliegue real funcione. Las cuotas de Apps Script y el límite preventivo de 300 personajes acotan este piloto a un curso; el contador global de solicitudes es un límite de carga, no una defensa completa contra abuso.

Referencias oficiales: [Apps web](https://developers.google.com/apps-script/guides/web), [comunicación con el servidor](https://developers.google.com/apps-script/guides/html/communication), [incrustación](https://developers.google.com/apps-script/reference/html/x-frame-options-mode).
