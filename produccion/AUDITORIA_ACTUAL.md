# Auditoría total · Ludaria v0.4.1

11–12 de octubre de 2026. Encargo vigente: revisar y actualizar todas las misiones, Forja y Mochi, continuar hasta dejarlo armado y mantener revisiones cada cinco horas. Esta auditoría sustituye el estado inicial del 4 de octubre; su contenido anterior permanece en el historial Git.

## Actualización publicada del 12 de octubre

- PR #16 fue integrado como `227053d8d7d96c67f885bbee314de98d769e8a36`, sin PR abiertos al cerrar esta revisión.
- La Forja conserva la creación visual con Kael/Kira, nombre y clave. Su opción «Ya tengo un personaje» muestra únicamente «Cargar mi personaje» y «Volver a la Forja».
- Las 13 misiones presentan paisaje, retrato de su guardián y acceso mediante el mismo nombre/código, conservando formularios, eventos, actividades y recompensas.
- CI `38196210522` aprobó los 26 pasos, incluidos servidor, acceso/recuperación, 13 adaptadores, escritorio, móvil e iframe. Pages `38196426658` publicó el mismo HEAD correctamente.
- Las 16 URL originales se consultaron de nuevo y respondieron HTTP 200. La prueba contractual mantiene rutas, queries, fragmentos, títulos y alturas.
- Código.gs vigente: SHA-256 `600fc8e1cae58f0de69f9bb4be9c99ab26f33cc22fee71ac2f9e8c47c2704d49`. Requiere reemplazar el archivo y actualizar la MISMA implementación para aparecer en `/exec`.

## Correcciones realizadas

| Área | Problema comprobado | Corrección |
| --- | --- | --- |
| 13 misiones | El fragmento original #pantalla-1 podía reemplazar la página recuperada. La prueba fallaba al reabrir el campo de una página posterior. | La bitácora recuperada tiene prioridad al iniciar. Una práctica nueva admite enlaces profundos; navegar no abandona el /exec. |
| Generación de adaptadores | Regenerar desde fuentes antiguas podía perder la protección de la URL central. | adapt-rpg.py incorpora la protección y la recuperación de página; CI comprueba que generar de nuevo no deja diferencias. |
| Guardado compartido | Una segunda llamada a guardar podía resolverse antes de confirmar la solicitud en curso. | Espera compartida de la confirmación; las ediciones durante el envío o tras un fallo se conservan y reintentan sin duplicar. |
| Forja y Mochi | Tras entrar no había un acceso directo al nombre y la clave usada. | «Mi nombre y mi clave», con valores ocultos y disponibles solo durante esta sesión. Consultarlos no confirma ensayos pendientes. |
| Clave y respaldo | Copiar podía fallar si el marco bloqueaba el portapapeles. | Alternativa visible y seleccionada; botón para copiar el código de recuperación. Se conserva la descarga TXT. |
| Recuperación | Cabecera repetida ocupaba espacio en móvil. | Formulario compacto y columnas de clave que no desbordan. |
| Nombres largos | Un alias sin espacios podía desbordar el encabezado. | Ajuste del nombre en la barra y la ficha del personaje; caso de 32 caracteres en navegador. |
| Misión 0 | El almacenamiento bloqueado no avisaba de que el borrador/comprobante se perdería al cerrar. | Aviso persistente para copiar el registro. Instrumento, receptor y transporte originales conservados. |
| Continuidad | Instrucciones antiguas todavía pedían desactivar el gateway o revisar cada tres horas. | Estado vigente consistente: gateway activo, iframe conservados, revisión cada cinco horas y Apps Script original pendiente de actualizar. |
| Acceso visual | Las misiones no igualaban la entrada de la Forja y la carga secundaria ofrecía opciones adicionales. | Paisaje y guardián por misión; nombre/código comunes. En la Forja, cargar o volver son las dos únicas acciones de esa pantalla. |

## Alcance de las pruebas

- Inventario: 26 entradas HTML, 51 scripts activos y 323 referencias locales; sintaxis y recursos presentes.
- Contrato de los 16 iframe originales: rutas, queries, fragmentos, alturas y títulos conservados. Misión 0 excluida del gateway.
- Forja y recompensas: 14 runas, 49 puntos, 570 XP, cuatro fragmentos, duplicados, saldo insuficiente, máximo 10, talentos, migración y pausa de animaciones.
- Servidor central y acceso: alias equivalentes, clave elegida/confirmada, alta repetible, respaldo privado, recuperación, revocación de sesiones, privacidad, rollback y conservación de XP, puntos y cuadernos.
- Cliente: guardados simultáneos, edición mientras se guarda, caída de comunicación, reintento del mismo envío y consulta de nombre/clave sin perder avisos pendientes.
- 13 adaptadores: guardianes, 39 apoyos/acciones, cinco secretos, cuadernos, todas las pantallas y recarga usando el fragmento original #pantalla-1.
- Diagnóstico: 12 pantallas y ocho preguntas, puerta cerrada hasta recibo, respuesta POST opaca sin falso éxito, aviso de almacenamiento bloqueado. Receptor, instrumento y transporte protegidos por SHA-256.
- Navegador: escritorio, móvil, marco de 720 px, claves/recuperación, compras, cuadernos, nombres largos, Misión 0 independiente, foco y movimiento reducido.

Las pruebas de servidor, DOM y navegador usan servicios simulados/interceptados. No crean personajes ni envían respuestas a la planilla real. CI debe aprobar la versión final antes de fusionar; después se verifica Pages. El detalle de cada ejecución se conserva en GitHub Actions.

## Comprobación pública real y límite pendiente

El 12 de octubre el /exec original respondió HTTP 200 con la bienvenida v0.4.1 en Forja, Mochi y las 13 rutas de misión. Se detectaron el atlas de guardianes, el adaptador visual, «Cargar mi personaje», «Volver a la Forja» y «Recuperar clave»; «Voy a crear mi personaje» ya no aparece. Esto acredita la instalación del cliente nuevo en la misma URL.

No volver a reemplazar Código.gs ni crear otra implementación mientras no exista una corrección posterior. Conservar el /exec, personajes, propiedades, secreto e iframe de Genially.

Permanece pendiente comprobar un personaje de prueba autorizado: conservar su respaldo, recuperar la clave, abrir una misión desde su iframe original, guardar y reabrir el mismo cuaderno, comprar con Mochi y contrastar el movimiento en la hoja. Hasta hacerlo, no afirmar que la escritura autenticada de v0.4.1 está verificada en Google real. Los recursos externos opcionales siguen requiriendo sus enlaces institucionales; las alternativas locales no confirman una recepción externa.

## Retomar y mantener

La revisión existente está activa cada cinco horas. Consultar main fresco, PR, CI y Pages y este informe antes de cambiar código. Los apuntes históricos no justifican desactivar el gateway ni regresar a claves automáticas. Mantener el diseño de guardianes, clave elegida, recuperación y las correcciones de esta auditoría. No crear nuevos proyectos Apps Script ni regenerar secretos.
