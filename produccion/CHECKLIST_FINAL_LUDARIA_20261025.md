# Ludaria · checklist final y batalla con Lethon

25 de octubre de 2026. Encargo: reforzar la batalla y realizar un último repaso del repositorio sin perder datos. Base de esta edición: `4d3e81626acb4be9c956163f2c564a1e160c3c94`.

## Resultado y límites

La ceremonia anterior se amplía, por petición del autor, a una batalla narrativa por turnos. Tiene prólogo, cinco habilidades diferentes, combos, contraataques, escudo, recuperación, cuatro fragmentos, desaparición de Lethon y un epílogo ilustrado. Las cifras de combate son efímeras: no son atributos del personaje ni una medida de aprendizaje. El combate ocurre al final de la sesión 14, después de los instrumentos, sin modificar sus enunciados ni la rúbrica.

Se mantiene la arquitectura del TFM. Esta es una nueva versión de la presentación/interacción del cierre; no se presenta como idéntica a la ceremonia anterior. Su duración depende de las decisiones del participante y debe acompañarse dentro del cierre sin desplazar la evaluación. No se añaden tareas curriculares ni recompensas.

Las pruebas de servidor y cuentas utilizan datos ficticios y servicios aislados. No se inspeccionó ni escribió la planilla del curso. La verificación autenticada de escrituras en Google permanece pendiente; no se la sustituye por simulaciones.

## Checklist del repositorio

| Estado | Área revisada | Evidencia y alcance |
| --- | --- | --- |
| Revisado | Fuentes JavaScript y Apps Script | 168 archivos JS/CJS/GS versionados o nuevos pasan comprobación sintáctica. Incluye copias históricas; no implica ejecutar las versiones antiguas en producción |
| Revisado | Generación | `build.py` y `adapt-rpg.py` conservan el Código.gs y los 13 adaptadores sin diferencias |
| Revisado | Entradas activas | 26 entradas del inventario funcional, 53 scripts cargados y 356 referencias locales válidas, además de la vista independiente de revisión |
| Revisado | Rutas e incrustaciones | Contrato independiente de 16 iframe: rutas, queries, fragmentos, títulos y alturas conservados |
| Revisado | Recursos gráficos | 33 imágenes versionadas o nuevas decodificadas. Recursos anteriores conservados; dos imágenes nuevas para combate y victoria |
| Revisado | Apertura y diagnóstico | Ocho preguntas, receptor y transporte independientes intactos. Aviso de almacenamiento bloqueado y puerta de recepción cubiertos por las pruebas |
| Revisado | Forja | Creación, alias, Kael/Kira, clave, confirmación, recuperación, personajes antiguos y nombres largos cubiertos por las regresiones |
| Revisado | Progresión | Runas, XP, puntos, fragmentos, talentos, máximos y reliquias mantienen las reglas previas |
| Revisado | Mochi | Compras, saldo insuficiente, repetición de solicitudes, redistribución y retirada de ventajas al bajar del umbral comprobados con servidor simulado |
| Revisado | Identidad y aislamiento | Sesiones, recuperación, revocación, privacidad entre personajes y errores de comunicación cubiertos por las pruebas aisladas |
| Revisado | Cuadernos | Recuperación de pantalla, campos, borradores, conflictos entre sesiones, reintentos y edición durante guardado cubiertos por las regresiones |
| Revisado | Guardianes y ventajas | 13 guardianes, 39 ventajas, umbrales 3/5/8, decisiones y cinco secretos conservados |
| Revisado | Presentación | Acceso y diálogos adaptables, desplazamiento natural, foco, teclado, retratos y paisajes. Pruebas de navegador; no equivalen a comprobar físicamente todos los teléfonos |
| Revisado | Evaluación | Diagnóstico e instrumentos E/F/G/H y guiones existentes sin cambios. La batalla no califica respuestas ni modifica criterios |
| Revisado | Batalla | Cinco acciones con resultados diferentes; combo, bloqueo, curación, contraataques y reagrupación sin pérdida de fragmentos. Todas las habilidades permiten llegar al final |
| Revisado | Desenlace | Victoria, retirada visual de Lethon, cambio de paisaje, cuatro fragmentos y epílogo personalizado. La restauración reutiliza el guardado original |
| Revisado | Repetición/cancelación | Cerrar no escribe resultados de combate; repetir un cierre ya restaurado no crea otra escritura |
| Revisado | Sonido y movimiento | Efectos opcionales por gesto, apagados al entrar; se suspenden al ocultar/cerrar. Movimiento reducido y pausa de animaciones conservados |
| Revisado | Integridad | No cambian Apps Script, API, secretos, receptores, catálogos, códigos, costes, identificadores, claves de almacenamiento, guiones ni instrumentos |
| Revisado | Revisión independiente | `defensa-orbe/revision.html` usa datos ficticios, sin cliente de cuentas, solicitudes a Google o almacenamiento de progreso |
| Pendiente de comprobación real | Escrituras autenticadas | Confirmar en el entorno real, con un personaje autorizado, guardado y recuperación. No se crearon cuentas reales para esta auditoría |
| Pendiente de configuración docente | Formularios/canales externos | Hay URL vacías previstas como configurables. Las alternativas locales se mantienen; guardar un cuaderno no equivale a entregar un formulario |
| Pendiente de comprobación física | Dispositivos concretos | Teclado, pantalla completa y reproducción sonora deben contrastarse en los teléfonos/tablets reales del grupo |

## Las 14 sesiones

| Sesión | Experiencia | Comprobación |
| --- | --- | --- |
| 1 | El Llamado de la Aventura | Diagnóstico, navegación y transporte independiente; sin cambios del instrumento |
| 2 | Los Pergaminos Dispersos | Entrada, tres ventajas, cuaderno, clasificación y retorno a pantalla recuperada |
| 3 | La Senda de los Ejemplos | Casos, entrada, ventajas, cuaderno y navegación |
| 4 | El Claro del Debate | Posturas, bitácora, entrada, ayudas y cierre de módulo |
| 5 | Las Vetas del Diseño | 18 tarjetas, Ojo del Artesano, recuperación y retirada de ayuda por atributo |
| 6 | El Tallado de Mecánicas | Plantillas, juego existente, ayudas, cuaderno y navegación |
| 7 | La Gema Motivacional | Facetas, dilemas, cuaderno, ayudas y cierre |
| 8 | Los Planos del Arquitecto | Canvas, ayudas, registro y navegación |
| 9 | El Yunque | Prototipo, campos, ayudas, cuaderno y cierre con Mochi |
| 10 | El Templado entre Pares | Dos revisiones, pauta H, ayudas y cuaderno |
| 11 | El Reflejo del Diseño | Rúbrica, criterios, evidencias, ayudas y cuaderno |
| 12 | El Pulido del Prototipo | Autoevaluación, ajustes y plan; ayudas y registro |
| 13 | El Espejo Compartido | Presentación y feedback, ayudas, cuaderno y Fragmento IV |
| 14 | La Defensa del Orbe | Recogida de evidencias y evaluación intactas; batalla, victoria, epílogo y restauración original |

Las comprobaciones de las 13 entradas posteriores al diagnóstico recorren pantallas, ayudas y cuadernos en móvil, escritorio y un iframe local de 720 px. Son pruebas con servicios simulados, no una nueva sesión de participantes reales en Genially.

## Canales externos que requieren una decisión docente

| Ubicación | Configuración todavía vacía | Alternativa existente |
| --- | --- | --- |
| Defensa del Orbe | postest, entregaPrototipo, autoevaluacion, valoracion | Campos del cuaderno y entrega por el canal real indicado por el facilitador |
| Gema Motivacional y Vetas | formulario/canal de cierre | Registro en el cuaderno y cierre acompañado |
| Planos y Yunque | canvas, bitácora externos | Herramientas editables del recurso |
| Templado entre Pares | canvas y canal externo de coevaluación | Pautas locales conservadas |
| Reflejo y Pulido | rúbrica, caso, prototipo y plan externos | Instrumentos/campos internos |
| Espejo Compartido | prototipo, plantilla y canal de feedback | Registro y pauta dentro de la experiencia |

Los campos heredados `cloudUrl`/`assetBase` de Forja vacíos no demuestran una desconexión: la entrada activa sigue usando el gateway y la implementación central existentes. Los archivos históricos de configuración no cargados tampoco sustituyen la configuración activa. No se inventaron enlaces ni se apuntó al receptor de Misión 0.

## Pruebas de esta edición

- 20 programas funcionales locales aprobados, incluido el nuevo motor de combate.
- Prueba gráfica del cierre en 1280×900, 768×1024, 1024×768, 390×844, 320×568 y 844×390: prólogo, actores, barras, controles, batalla, victoria, epílogo, cancelación y repetición.
- Comparación antes/después de identidad, movimientos, respuestas y reflexiones en el servidor simulado; solo cambia la restauración existente al confirmar el cierre.
- Regresión completa aprobada: 20 programas funcionales y 5 de navegador en [CI 40246575014](https://github.com/nespinozagonzalez-hub/misiones/actions/runs/40246575014), sobre `9a02433acc60a76936190ae0e4f67b927fc9bc39`. [PR #29](https://github.com/nespinozagonzalez-hub/misiones/pull/29) integrado como `c910aa2d4e8851d398190d94ed4ee66cd47a5187`. Incluye la reagrupación con foco de teclado y fragmentos conservados. La publicación web se comprueba por separado del resultado de CI.

## Continuidad y datos

Los turnos de combate viven solo en memoria. Salir de la batalla inicia un nuevo encuentro al volver, pero conserva el progreso del curso. Reagruparse conserva los fragmentos de ese encuentro. No hay una migración de cuentas ni una nueva economía. La escritura final sigue el circuito existente de `s.open` y el estado confirmado del cuaderno; una respuesta de red fallida mantiene el aviso de pendiente.

La vista de revisión se abre en [revisión del cierre](https://nespinozagonzalez-hub.github.io/misiones/defensa-orbe/revision.html). El curso conserva los iframe habituales.
