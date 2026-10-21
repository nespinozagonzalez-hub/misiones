# Laboratorio Pyxel — GamiAula

Prototipo inicial **Forja Pixel**: un minijuego de batalla RPG para probar la creación de experiencias de gamificación con el motor [Pyxel](https://github.com/kitao/pyxel).

## Ejecutar la prueba

Abrir el lanzador oficial (sin instalar Python):

https://kitao.github.io/pyxel/web/launcher/?run=nespinozagonzalez-hub/misiones/lab-pyxel-gamiaula/laboratorio-pyxel/forja_pixel&gamepad=enabled

El código fuente está en `forja_pixel.py`. El juego se carga mediante el launcher oficial desde la rama experimental `lab-pyxel-gamiaula` de este repositorio.

## Controles

- **Computador:** flechas izquierda/derecha para elegir criatura; flechas arriba/abajo para seleccionar alternativa; Z, Enter o espacio para confirmar; teclas 1, 2 y 3 para seleccionar una respuesta.
- **Móvil/tablet compatible:** habilitar el gamepad virtual desde el launcher, usar la cruceta y confirmar con el botón A.
- **Ratón:** clic en una respuesta durante los combates.

## Cómo funciona

1. Seleccionar a **Aster (Luz)** o **Bruma (Hielo)**.
2. Enfrentar tres guardianes con elementos diferentes.
3. Responder situaciones pedagógicas de criterio; los aciertos producen ataques y los errores provocan contraataques.
4. Las ventajas de afinidad causan más daño y otorgan más XP.
5. Completar las salas para ganar.

## Alcance de la prueba

- Esta es una prueba funcional de lógica y código; aún **no está validada en navegadores reales** ni conectada con un servidor de seguimiento.
- No usa datos reales ni perfiles de estudiantes, ni guarda progreso en Google Sheets.
- No se modificaron archivos de la rama `main`; el juego vive en esta rama separada.
- Próximo paso posible: integrar sprites artísticos, diálogos, misiones, bancos de preguntas editables, accesibilidad, pruebas móviles y sincronización con un servicio autorizado.

Pyxel se distribuye bajo licencia MIT. El juego es código original preparado para la prueba técnica.
