# Pruebas · Los Planos del Arquitecto

Fecha UTC: 2026-10-02. Versión 20261002b.

## Revisión pedagógica
Tesis tabla 9 p.43 y matriz aprobada: 6D, ejemplo completo, objetivo y conductas del canvas personal, revisión rápida entre pares. Catorce pantallas y 90 minutos sincrónicos; 60 autónomos, sin carga añadida. Caso ficticio y plantilla educativa identificados como elaboración didáctica, sin inventar instrumentos o resultados. Fuentes primarias: programa de Werbach y entrevista original de ambos autores de 2012; página de Chou; texto original de Toda ICALT 2019. APA y límites explícitos.

## Navegador real
- Chrome: 14 pantallas en iframe 1280 × 720. Cada vista inicial: viewport y scrollHeight 720, sin desbordamiento horizontal.
- Chrome: 14 pantallas en iframe 375 × 800. Sin desbordamiento horizontal; desplazamiento vertical deliberado.
- Revisión visual del modelo, tabla y fichas móviles. Caption accesible corregido a sr-only: caja 1 × 1, sin rótulo visual sobre el HUD. Versión corregida abierta y publicada.
- Seis ventanas del canvas verificadas, modelo completo con las seis decisiones y explicaciones, cierre Escape y devolución de foco.
- Práctica Propósito: intento vacío, error, pista y respuesta revisada correcta. Evidencia: apertura acompañada y respuesta correcta. Pautas muestran el tipo de apertura; no bloquean el canvas.
- Cuatro ventanas del bucle y dos hipótesis de experiencia verificadas. Ventanas de 6D, Octalysis y Toda probadas.
- Anotación en D5, objetivo y conductas escritos. Pestañas con ArrowRight/Home/End; foco en pestaña seleccionada. Registro fiel con caracteres < > mostrados como texto.
- Recarga restaura objetivo, conductas, anotaciones y práctica. Cuaderno completo con nueve campos.
- Temporizador de 6 min desciende y pausa; tras recarga permaneció pausado en 05:25. No avanza la pantalla.
- Entrada y registro del canvas en móvil; ventana de Octalysis sin desbordamiento horizontal.
- Registro visible, copia con alternativa manual y solicitud TXT activadas. El evento de descarga no se confirmó en el marco de pruebas; no se afirma recepción de un TXT por ese navegador. El registro visible y el HTML portátil conservan una alternativa útil.
- Dependencia de canvas externo mostrada de forma clara; no envío simulado. Reinicio desde diálogo y limpieza de datos de prueba.
- Portada real abierta, URL final comprobada y captura guardada.

## Publicación
Commit de código feca18da75fbec22258c0029dfd443bae4f301da. Pages acción 36950485929: success. URL: https://nespinozagonzalez-hub.github.io/misiones/planos-arquitecto/presentacion.html?v=20261002b#pantalla-1

## Verificación estática
Node --check de app/content/config. Catorce pantallas, suma 90 min, seis decisiones. Entradas idénticas y referencias locales existentes. Clave aislada ludaria_planos_arquitecto_v1. HTML portátil con CSS, JS e imagen incrustados. Sin llamadas al receptor de Misión 0 ni modificación del portal.

## Dependencia pendiente
URL HTTPS real en canvasExterno de config.js. Alternativa local completa: seis decisiones, pregunta del par, ajuste y continuidad, con registro visible copiable. Los datos abiertos requieren revisión humana.
