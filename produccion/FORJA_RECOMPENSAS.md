# Forja · Revelación de recompensas RPG

Actualización solicitada por Nicolás el 5 de octubre de 2026.

Implementación publicada en `main`: `4c61e1355e474eae77af76d08a25c174d138d847`. GitHub Pages completó con éxito el despliegue `37338078860`.

## Comportamiento

Runas confirmadas: sello, luz jade y dorada, partículas finitas, contadores de XP y puntos, barra de nivel y nuevas reliquias. Una subida de nivel destaca el nivel anterior y el nuevo. El fragmento muestra su región cuando las tres misiones del módulo quedan registradas. La restauración del Orbe une cuatro fragmentos y presenta el cierre solo cuando se cumple la condición real del personaje. Las compras y talentos también muestran sus mejoras confirmadas.

`rewards.js` recibe una instantánea previa y el perfil confirmado. No cambia reglas, códigos, XP, puntos, atributos ni almacenamiento. `core.js` permanece intacto. `apps-script/Forja.html` incluye la misma presentación; el despliegue conectado, si existe, requiere actualizar la plantilla y volver a implementar. No se desplegó una aplicación Google ni se enviaron datos a Sheets en esta revisión.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Lógica de la Forja | 10 grupos de pruebas existentes aprobados |
| Nueva presentación | 6 grupos aprobados: 14 runas, niveles, fragmentos, cierre, compras, talentos, duplicados, pausa y limpieza |
| Navegador real, modo `prueba=1` | 14 runas activadas una vez; código repetido rechazado sin ventana de recompensa |
| Total del recorrido | 570 XP, 49 puntos, nivel 6, 12 misiones, 4 fragmentos y Orbe restaurado |
| Compra real de prueba | +2 Sabiduría y +1 Creación; gasto de 3 puntos; saldo 46; XP sin cambios |
| Talento real de prueba | Sabiduría I activado; saldo 46 conservado |
| Recarga | 570 XP, saldo 46, Sabiduría 3, Creación 2, talentos y cuatro fragmentos conservados |
| Iframe 375 × 720 | Sin desbordamiento horizontal en documento o ventana; imágenes de recompensa cargadas |
| Iframe 1280 × 720 | Ventana adaptable con desplazamiento vertical; sin desbordamiento horizontal |
| Teclado | Activación con Enter, cierre con Escape y foco recuperado |
| Animación opcional | «Ver sin animación» muestra valores finales; pausa global produce ventana estática; preferencia de reducción comprobada en la suite |

Captura real: `Forja_recompensas_RPG_20261005.jpg`, Library `libfile_a2a637172dcc8191b1c68aa7928bb1ba`.

Los enlaces de Forja y Mochi se mantienen. Los iframes existentes reciben esta versión al recargarse.
