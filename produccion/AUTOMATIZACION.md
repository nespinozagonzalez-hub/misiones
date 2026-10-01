# Encargo programable · Continuar misiones de Ludaria

**Estado:** preparado, todavía sin activar. La creación de la tarea no se completó por el límite de tareas del plan. No hay un ID asignado.

Configuración propuesta: título «Continuar misiones de Ludaria»; zona horaria America/Santiago; inicio relativo cinco horas después de la activación; modalidad exact_schedule; repetición hasta completar la cola, entonces pausar esta tarea.

```ical
BEGIN:VEVENT
RRULE:FREQ=HOURLY;INTERVAL=5
END:VEVENT
```

`dtstart_offset_json`: `{"hours":5}`.

## Prompt listo para crear la tarea

Continúa la producción HTML de la tesis personal de Nicolás Espinoza González, «Buscadores de la Gamificación Perdida», en Ludaria. El usuario ha autorizado crear y publicar en serie las presentaciones restantes en su repositorio GitHub existente y recibir aquí un resumen y los iframes para incrustarlos en Genially. Ejecuta el trabajo; no te limites a enviar un recordatorio.

Al comenzar, usa GitHub para leer la rama main actual de nespinozagonzalez-hub/misiones y los archivos produccion/ESTADO.json, produccion/INSTRUCCIONES.md y produccion/RESUMEN_PARA_INCRUSTAR.md. Esas instrucciones y la tesis son la base durable. No dependas de que sobreviva un directorio local entre ejecuciones. Descarga desde el repositorio los archivos necesarios para retomar. Respeta cualquier corrección posterior del usuario.

Retoma la primera sesión no terminada en este orden: 7 La Gema Motivacional (gema-motivacional), 8 Los Planos del Arquitecto (planos-arquitecto), 9 El Yunque (yunque), 10 El Templado entre Pares (templado-pares), 11 El Reflejo del Diseño (reflejo-diseno), 12 El Pulido del Prototipo (pulido-prototipo), 13 El Espejo Compartido (espejo-compartido), 14 La Defensa del Orbe (defensa-orbe). Las sesiones anteriores quedan fuera del encargo. Reanuda un borrador existente antes de crear otro. Trabaja en serie y prioriza completar y verificar la misión actual antes de pasar a la siguiente.

Fuentes accesibles con la habilidad openai-library:library: tesis PDF libfile_268097aa09648191a2a106e4d5902679, «TFM Nicolás Espinoza Entrega Deposito .pdf», y matriz aprobada libfile_45dfc60b34008191b5316f853bb1de77, «Matriz_y_prompt_Genially_14_sesiones.md». Lee la ficha de la sesión en pp.42–49; antes de crear pautas, rúbricas o evaluación final lee los anexos correspondientes E–H, pp.58–66. Consulta la bibliografía y verifica en fuentes primarias la teoría que uses. Mantén citas APA, enlaces y límites de las afirmaciones. La matriz también se conserva en produccion/MATRIZ_14_SESIONES.md. No inventes criterios, instrumentos, respuestas, pesos o resultados.

Conserva el estilo aprobado de senda-ejemplos, claro-debate y tallado-mecanicas; para las principales usa también vetas-diseno como referencia. Fantasía sobria para docentes adultos: bosque oscuro #07120D, jade #59C36A, marfil #F2EBDD y oro #C9A66B, títulos serif y texto legible, paisajes ilustrados, HUD Ludaria, navegación por pantallas, progreso, pistas, reintentos y feedback explicativo. NO incluir GamiAula. Crea imágenes con la herramienta integrada cuando sean necesarias; diagramas precisos con código. Principales: contenidos de clase sincrónica y miniactividades. Secundarias: aplicación y talleres. Todas: 90 minutos sincrónicos, consigna/tiempo/producto claros, carga autónoma solo según la tesis. El facilitador conduce la clase; no simules sincronización del grupo.

Navegación, instrucciones y contenidos esenciales accesibles siempre; candados solo para recursos complementarios, con apertura acompañada y sin penalizaciones. Sin rankings públicos, códigos o XP inventados, autocalificación de textos abiertos, nuevos personajes o fragmentos no previstos. No reutilices el receptor de Misión 0 para otros datos, no simules envío al docente ni registro en Sheets. Cuando falte un enlace externo real deja una configuración clara y una alternativa local útil; informa la dependencia sin frenar todo el HTML.

Crea cada misión únicamente en su carpeta nueva. Preserva index.html global, misiones terminadas y cambios del usuario. Publica con GitHub a partir del head/tree frescos, sin force push. Guarda checkpoints durables de contenido, código, decisiones y próximo paso antes de agotar el contexto o finalizar una ejecución: borradores en produccion/borradores/<slug>/, estado honesto en ESTADO.json. Un archivo guardado o un commit no equivalen a una misión terminada. Si encuentras un bloqueo real, registra causa y paso de recuperación sin afirmar éxito.

Una entrega terminada exige revisión pedagógica, interacciones funcionales, persistencia local aislada, pruebas reales en navegador de escritorio, móvil y un iframe de 720px de alto, publicación GitHub Pages comprobada, fuentes y guía docente. Entrega HTML portátil, ZIP con assets/código, guía y captura de vista. Guarda los archivos de entrega con openai-library:library y conserva sus identificadores; el código ya respaldado por Git no requiere duplicación adicional. Actualiza ESTADO.json y RESUMEN_PARA_INCRUSTAR.md con pruebas, enlace publicado real, iframe individual y archivos. Informa aquí solo entregas nuevas verificadas, avances relevantes o bloqueos accionables; no repitas resúmenes vacíos.

Cuando las ocho sesiones estén terminadas y el resumen individual esté completo, entrega el resumen final con enlaces e iframes de cada una y pausa esta automatización «Continuar misiones de Ludaria» usando su ID registrado en ESTADO.json o resolviéndola con automations.peek. No modifiques otras automatizaciones. La recurrencia no elimina límites de uso; retoma el último checkpoint cuando la ejecución esté disponible.
