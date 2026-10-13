# Auditoría total · Ludaria v0.4.1

11 de octubre de 2026. Encargo vigente: revisar y actualizar todas las misiones, Forja y Mochi, continuar hasta dejarlo armado y mantener revisiones cada cinco horas. Esta auditoría sustituye el estado inicial del 4 de octubre; su contenido anterior permanece en el historial Git.

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

## Alcance de las pruebas

- Inventario: 26 entradas HTML, 50 scripts activos y 322 referencias locales; sintaxis y recursos presentes.
- Contrato de los 16 iframe originales: rutas, queries, fragmentos, alturas y títulos conservados. Misión 0 excluida del gateway.
- Forja y recompensas: 14 runas, 49 puntos, 570 XP, cuatro fragmentos, duplicados, saldo insuficiente, máximo 10, talentos, migración y pausa de animaciones.
- Servidor central y acceso: alias equivalentes, clave elegida/confirmada, alta repetible, respaldo privado, recuperación, revocación de sesiones, privacidad, rollback y conservación de XP, puntos y cuadernos.
- Cliente: guardados simultáneos, edición mientras se guarda, caída de comunicación, reintento del mismo envío y consulta de nombre/clave sin perder avisos pendientes.
- 13 adaptadores: guardianes, 39 apoyos/acciones, cinco secretos, cuadernos, todas las pantallas y recarga usando el fragmento original #pantalla-1.
- Diagnóstico: 12 pantallas y ocho preguntas, puerta cerrada hasta recibo, respuesta POST opaca sin falso éxito, aviso de almacenamiento bloqueado. Receptor, instrumento y transporte protegidos por SHA-256.
- Navegador: escritorio, móvil, marco de 720 px, claves/recuperación, compras, cuadernos, nombres largos, Misión 0 independiente, foco y movimiento reducido.

Las pruebas de servidor, DOM y navegador usan servicios simulados/interceptados. No crean personajes ni envían respuestas a la planilla real. CI debe aprobar la versión final antes de fusionar; después se verifica Pages. El detalle de cada ejecución se conserva en GitHub Actions.

## Comprobación pública real y límite pendiente

El /exec original respondió durante esta revisión. Forja mostró Nara con nombre/clave y la bienvenida anterior; Mochi respondió con su ruta de mercado. Los retratos y la clave elegida pertenecen a la nueva versión del Código.gs y no se instalan por publicar GitHub Pages.

El archivo completo v0.4.1 debe reemplazar Código.gs en el MISMO proyecto y actualizar la MISMA implementación: guardar, ejecutar prepararConexionLudaria y **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar**. Conservar el /exec, personajes, propiedades y secreto. No reemplazar los iframe de Genially.

Después de instalar: comprobar un personaje de prueba autorizado, conservar su respaldo, recuperar la clave, abrir una misión desde su iframe original, guardar y reabrir el mismo cuaderno, comprar con Mochi y contrastar el movimiento en la hoja. Hasta hacerlo, no afirmar que la escritura autenticada de v0.4.1 está verificada en Google real. Los recursos externos opcionales siguen requiriendo sus enlaces institucionales; las alternativas locales no confirman una recepción externa.

## Retomar y mantener

La revisión existente está activa cada cinco horas. Consultar main fresco, PR, CI y Pages y este informe antes de cambiar código. Los apuntes históricos no justifican desactivar el gateway ni regresar a claves automáticas. Mantener el diseño de guardianes, clave elegida, recuperación y las correcciones de esta auditoría. No crear nuevos proyectos Apps Script ni regenerar secretos.
