# La Forja del Buscador · Ludaria

Una aplicación, dos puertas. Kael y Kira tienen las mismas reglas; sus retratos son ilustraciones originales. El Mercadito permanece fuera de la navegación normal: se abre desde Mochi en el mapa, usando `?entrada=mochi`. No es una restricción de seguridad: quien conozca la URL puede abrirlo.

## Enlaces para Genially

- Forja: https://nespinozagonzalez-hub.github.io/misiones/forja/
- Mochi: https://nespinozagonzalez-hub.github.io/misiones/forja/?entrada=mochi

Insertar como contenido externo/iframe. Recomendación: 1100 × 760 o mayor en escritorio; en móvil se adapta y permite desplazamiento vertical. Si el visor bloquea el almacenamiento, abrir la misma URL en una pestaña independiente. Usar siempre la misma instalación y navegador para compartir el personaje entre ambas puertas.

## Qué conserva

Las 14 runas existentes, sus recompensas, los cinco atributos y el progreso antiguo se conservan. El guardado antiguo `buscadores_gamiaula_v1` se migra al nuevo formato local y se mantiene un respaldo. La migración automática solo puede leer datos del mismo origen: si la Forja antigua estaba en otra dirección, exportar e importar su JSON. Kael y Kira comienzan con 1 en cada atributo. La XP sube de nivel y nunca se gasta. Los puntos sí se gastan: 1 punto compra +1 en un atributo, hasta 10. Los talentos se revelan gratuitamente en los umbrales 3, 5 y 8. Las compras se confirman en conjunto y se registran en la Bitácora; no generan nuevos códigos.

## Estado de conexión

La versión GitHub funciona en **modo local**: no escribe datos en Sheets. El indicador lo dice explícitamente. Los archivos de Apps Script incluidos preparan una versión centralizada de **la misma interfaz**, sin duplicar diseños. La conexión no queda activada hasta que el propietario implemente el script y coloque su URL en Genially. No se ha creado ni publicado una hoja de participantes.

## Activar Google Sheets

1. Crear una hoja **privada** nueva llamada “Ludaria · Forja y Mochi”. No reutilizar el receptor de Misión 0.
2. Abrir Extensiones → Apps Script. Crear `Code.gs`, `Domain.gs` y un archivo HTML llamado `Forja`; pegar respectivamente el contenido de `apps-script/Code.gs`, `apps-script/Domain.gs` y `apps-script/Forja.html`.
3. Seleccionar y ejecutar `setupForja_` desde el editor. Autorizar con la cuenta propietaria de la hoja. Se crean Personajes, Movimientos, Panel, Migraciones y Catalogo. No publicar la hoja ni compartirla con los estudiantes.
4. Implementar → Nueva implementación → Aplicación web. Ejecutar como propietario; acceso conforme a las políticas de tu institución (para un curso abierto, “Cualquier persona” cuando esté permitido). Copiar la URL terminada en `/exec`.
5. En Genially, cambiar la entrada de la Forja a esa URL y la de Mochi a esa misma URL más `?entrada=mochi`. Ambas deben utilizar el **mismo despliegue**; no mezclar la Forja local con el Mercadito conectado. La interfaz mostrará “Conectada a Sheets”.
6. Prueba con un personaje ficticio: crea, activa una runa, compra, recarga y confirma que Panel y Movimientos reflejan el saldo. Repite una compra con saldo insuficiente y un código duplicado: deben rechazarse. Verifica también el acceso desde una ventana sin la sesión del propietario.
7. Opcional: poner esa URL en `config.js` (`cloudUrl`) para que la versión local ofrezca un enlace a la versión conectada. No copiar ninguna clave o ID privado al repositorio.

Las funciones administrativas terminan en `_`, por lo que no se exponen mediante `google.script.run`. Ejecutarlas solo desde el editor. Si el resumen Panel falla, ejecutar `reconstruirPanel_`; el registro Movimientos sigue siendo la fuente de verdad. Catalogo es una tabla informativa: editar sus precios no cambia las reglas; estas permanecen 1:1 en Domain.gs.

## Recuperación y privacidad

Descargar personaje produce una copia JSON privada. En modo conectado incluye una clave de acceso: no compartirla ni subirla a GitHub/Drive público. Es un acceso por posesión de clave, no una identificación institucional. El servidor almacena un hash, valida compras, bloquea operaciones simultáneas y deduplica reintentos. Los códigos de las misiones se mantienen compartidos como en la Forja anterior: no son contraseñas ni prueba de evaluación.

Para migrar un personaje local al sistema central: crear primero un acceso conectado, importar la copia antigua y esperar revisión. La solicitud queda en Migraciones sin acreditar puntos automáticamente. El facilitador verifica el progreso, configura `NUMERO_FILA` en `aprobarMigracion_` y la ejecuta. La aprobación **reemplaza** el estado conectado con el antiguo revisado: revisar compras posteriores antes de aprobar. El registro histórico no se borra.

La hoja puede almacenar nombres y progreso educativo; usar seudónimos, limitar accesos y fijar una política de conservación. Una hoja pública no es necesaria. Este diseño es para un curso/cohorte pequeño y está sujeto a las cuotas de Apps Script; no sustituye un sistema de identidad o una plataforma comercial. No modificar ni borrar manualmente Movimientos.

## Archivos

`index.html`, `styles.css`, `app.js`, `core.js`, `config.js`: interfaz compartida. `assets/`: 13 recursos WebP optimizados. `apps-script/`: implementación central preparada. La descarga independiente `Forja-Ludaria.html` lleva los recursos integrados y funciona localmente, pero no conecta a Sheets. Para conservar su personaje usar siempre el mismo archivo/navegador o exportar una copia.

Soporta teclado, etiquetas accesibles, foco de diálogos, vistas móviles y reducción de movimiento. No introduce efectos de combate ni ventajas pedagógicas por personaje.

Documentación oficial: https://developers.google.com/apps-script/guides/html/communication · https://developers.google.com/apps-script/guides/web · https://developers.google.com/apps-script/reference/lock/lock-service

## Revelación de recompensas · 5 de octubre de 2026

`rewards.js` y `rewards.css` presentan las runas confirmadas con sello, partículas jade y doradas, contadores de XP y puntos, progreso de nivel, nuevas reliquias y fragmentos efectivamente recuperados. Las subidas de nivel tienen su propio aviso; la restauración une visualmente cuatro fragmentos solo cuando el personaje registra las cuatro regiones y la defensa final. Los canjes con Mochi y los talentos muestran las mejoras confirmadas.

La ventana permite continuar o cerrar en cualquier momento; «Ver sin animación» muestra todos los valores finales inmediatamente. Respeta el control general de animaciones y la preferencia de movimiento reducido del dispositivo. Los efectos son finitos, sin audio automático, y se cancelan al cerrar o cambiar de pestaña. La presentación recibe una instantánea del estado anterior y el perfil confirmado; nunca escribe XP, puntos, atributos ni almacenamiento.

Los enlaces y los iframes actuales siguen siendo válidos. La plantilla `apps-script/Forja.html` incluye el mismo módulo y estilos; un despliegue de Apps Script ya existente requiere actualizar esa plantilla y volver a implementar para incorporar esta versión.

Pruebas: `node forja/tests.cjs` y `node forja/rewards.test.cjs`. La segunda suite recorre las 14 runas y comprueba niveles, fragmentos, restauración, pausa, reducción de movimiento, cierre, compras, talentos, datos inválidos, duplicados y relectura del perfil.
