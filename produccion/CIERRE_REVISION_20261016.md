# Ludaria · informe final de revisión y mejoras

16 de octubre de 2026. Proyecto: **Buscadores de la Gamificación Perdida**. El propietario pidió una última auditoría, resolver los ajustes justificados y cerrar la revisión periódica. Base revisada: `2d6d151babbbc8579c695b5518a81ecfe2de0c4f`; la publicación de cierre conserva su historial en el PR y GitHub Actions.

## Dictamen

La experiencia mantiene sus 14 sesiones, 13 guardianes, 39 ventajas con umbrales 3/5/8 y cinco secretos. No se encontró una regresión en las funciones de participantes cubiertas por las pruebas. La bienvenida con retratos, clave elegida, recuperación RES, claves LUD antiguas, sesión, cuadernos, recompensas y ayudas se conservan.

Se encontró y corrigió una rutina histórica de editor que no formaba parte de los recorridos del participante. **Cerrar la revisión no significa certificar escrituras autenticadas que no se han probado.** El único cambio ejecutable de este cierre está preparado en el paquete v0.4.4; el cliente Google comprobado sigue siendo v0.4.3.

## Ajustes finales realizados

| Hallazgo | Decisión y resultado | Alcance |
| --- | --- | --- |
| La rutina `probarLudaria_` guardaba un PIN DEMO en una propiedad en texto. Además, una comprobación del piloto ya no representaba el catálogo actual. | Reproducido con servicios simulados. La rutina se retiró: devuelve un aviso y no crea DEMO, escribe hojas, modifica propiedades ni emite registros. Una regresión verifica la ausencia de efectos. | Código v0.4.4 preparado; instalación pendiente del propietario. No se accedió al valor de una propiedad real. |
| Las guías seguían ordenando revisiones periódicas hasta nueva indicación. | La indicación de cierre del 16 de octubre sustituye esas órdenes. Se actualizan conexión, auditoría, estado, instrucciones y archivo histórico de automatización. | Documentación de cierre. No cambia la disponibilidad de Ludaria. |
| Era fácil confundir versión del paquete, cliente instalado y validación autenticada. | El estado distingue paquete v0.4.4 preparado, cliente público v0.4.3 y escrituras reales pendientes. | Informe y metadatos. |

No se alteraron contenido pedagógico, instrumentos, rúbricas, recompensas, nombres de personajes, ID, XP, puntos, runas, cuadernos, secreto, atlas, paisajes, Genially ni los 16 bloques originales de iframe. Misión 0 conserva su diagnóstico y receptor independiente, fuera del gateway. Se mantiene `enabled:true / verified:true`.

## Comprobaciones y límites

| Área | Evidencia | Qué no acredita |
| --- | --- | --- |
| Fuentes y generación | Código.gs y 13 adaptadores reproducibles; sintaxis; 26 entradas, 51 scripts y 323 referencias locales. | Despliegue en Google. |
| Iframe | Contrato independiente de 16 rutas, queries, fragmentos, títulos y alturas. | Edición o una nueva sesión autenticada en Genially. |
| Identidad y seguridad | Clave elegida y confirmada, alias equivalentes, límites de intentos, compatibilidad LUD, RES, revocación, aislamiento y rollback con servicios simulados. | Recuperación de un personaje real o escritura en su hoja. |
| Reglas | Forja/Mochi, recompensas, saldo insuficiente, máximo de atributos, reintentos idempotentes, 39 ventajas y retirada al bajar la STAT. | Movimientos reales del curso. |
| Continuidad | Sesión de pestaña, acceso manual con storage bloqueado, cuadernos, ediciones durante guardado, conflictos y conservación de borradores. | Continuidad entre todos los dispositivos o políticas de cookies de terceros. |
| Presentación | Navegador de escritorio, móvil de 390 px, iframe de 720 px, foco, nombres largos y movimiento reducido en la suite gráfica de CI. | Una auditoría WCAG exhaustiva o pruebas físicas en todos los teléfonos. |
| Vista de diseño | 16 contextos y 48 envíos simulados; red de scripts/API interceptada, sin perfil ni credenciales persistidas. | Escrituras reales en Google. |
| Servicio público | 16 entradas y seis recursos críticos HTTP 200 coincidentes con el código; 15 rutas del `/exec` original con marcadores de cliente v0.4.3. | Que el paquete v0.4.4 esté instalado o que se haya guardado un dato autenticado. |

Las pruebas no crearon cuentas ni enviaron datos a la planilla del curso. La verificación visual anterior de Forja, Mochi y los 13 guardianes en Genially sigue siendo evidencia de identificación y navegación; no se la presenta como prueba nueva de escritura.

## Estado por capas

| Capa | Estado al cierre |
| --- | --- |
| Código | Mantenimiento v0.4.4 preparado, con la utilidad histórica retirada y la interfaz de participantes intacta. Archivo: [`ludaria/Code-Ludaria-Conectado.gs`](../ludaria/Code-Ludaria-Conectado.gs). |
| GitHub Pages | Publica las entradas originales y los recursos del repositorio. La publicación del cierre se verifica tras fusionar el PR. Pages no instala Código.gs en Google. |
| Apps Script | Cliente público v0.4.3 comprobado en la misma implementación. La corrección v0.4.4 aún requiere al propietario. |
| Google/Genially autenticado | Pendiente comprobar cuaderno, compra, ventaja, recuperación RES y movimientos con un personaje autorizado. No se simula ese resultado como real. |

Paquete preparado v0.4.4 SHA-256: `35583c8482761b60fbb9c448a524aa19702a8c0963dd318f287c8cda5882c7c1`.

Paquete del cliente público v0.4.3 SHA-256 histórico: `00438e9601b9432fcb53ae8d4d583c0c67e1c7dd248adebf95ead99183a81ea0`.

## Único paso de instalación del mantenimiento

El propietario debe reemplazar el Código.gs completo en el **mismo proyecto original** y actualizar la **misma implementación `/exec`**. No crear otro proyecto, cambiar de planilla, regenerar el secreto ni repetir la preparación. No hay que cambiar ningún iframe.

Si una ejecución antigua dejó `LUDARIA_DEMO_PIN`, eliminar únicamente esa propiedad desde la configuración del proyecto, sin mostrar/copiar su valor. No borrar otras propiedades ni personajes DEMO o participantes. El nuevo paquete impide que la rutina retirada vuelva a crear esa credencial. La revisión no consultó ni borró propiedades reales; no se afirma que la limpieza esté hecha.

## Mejoras posteriores recomendadas

| Prioridad | Mejora | Motivo y condición |
| --- | --- | --- |
| Antes de certificar el circuito real | Prueba acompañada con un personaje autorizado: entrar, continuar entre misiones, guardar/recuperar una nota, comprar una STAT, consultar su ventaja, bajar el atributo y recuperar por RES. Contrastar los movimientos en Sheet. | Es la evidencia pendiente de mayor valor. No reemplazarla por CI ni crear cuentas sin autorización. |
| Antes de ampliar a varios cursos | Planificar almacenamiento, concurrencia y defensa ante abuso por grupo. | El límite preventivo es 300 personajes y 300 solicitudes globales por minuto; no es una defensa completa contra abuso. No escalar suponiendo que esos valores garantizan capacidad. |
| Cuando se conozcan los canales del curso | Configurar los enlaces externos institucionales de entrega/feedback y ensayar su recepción. | Las alternativas locales son útiles, pero no prueban entrega externa. No inventar URLs ni destinos. |
| Después de una primera cohorte | Usabilidad con 3–5 participantes en teléfonos reales y revisión manual de accesibilidad. | Priorizar obstáculos observados de teclado, lectura, retorno y comprensión de ventajas. No añadir pantallas o efectos sin evidencia de necesidad. |

No se recomienda otro rediseño visual en este cierre: la estética bosque/jade/oro, los retratos y el recorrido ya son consistentes, y una nueva capa visual introduciría validación adicional sin resolver el pendiente principal.

## Cierre

La revisión periódica se cierra a petición del propietario. Ludaria sigue disponible con sus entradas y guardianes activos. Las tareas pendientes anteriores quedan entregadas con su responsable y alcance; no se reanudarán revisiones automáticas sin un nuevo encargo.
