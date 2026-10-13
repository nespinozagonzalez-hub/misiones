> **Actualización de auditoría:** v0.4.1 añade consulta del nombre/clave en Forja y Mochi, copia del respaldo con alternativa al portapapeles y recuperación compacta. PR #16 conserva esa recuperación en las entradas de misión, presenta los 13 guardianes con sus paisajes y deja en «Ya tengo un personaje» de la Forja solo «Cargar mi personaje» y «Volver a la Forja». El 12 de octubre el /exec original comenzó a servir v0.4.1 (Código.gs SHA-256 `600fc8e1cae58f0de69f9bb4be9c99ab26f33cc22fee71ac2f9e8c47c2704d49`). El código v0.4.3 agrega continuidad, ventajas inmediatas y ventana de carga, pero requiere actualizar la misma implementación; falta acreditar escrituras autenticadas. Este documento conserva la descripción de v0.4.0. Evidencia actual: AUDITORIA_ACTUAL.md y FLUIDEZ_V043.md.

# Bienvenida y acceso v0.4.0 · 11 de octubre de 2026

El propietario pidió una imagen del guardián en la bienvenida, que cada usuario elija su código personal y una opción para recuperar la clave.

## Resultado

- Bienvenida con retrato correspondiente a Nara, cada uno de los 13 guardianes, Aster o Mochi. Diseño de dos columnas en escritorio y cabecera compacta en móvil; formularios con opciones «Ya tengo personaje», «Crear personaje» y «Recuperar clave».
- Al crear el personaje, el usuario escribe y confirma una clave de seis dígitos. El servidor valida ambas. Las claves LUD antiguas continúan sirviendo para entrar.
- La confirmación muestra nombre, clave elegida y un código privado de recuperación RES. Los códigos aparecen ocultos y pueden mostrarse, copiarse o guardarse en un TXT.
- «Recuperar clave» requiere nombre y código RES para elegir una nueva clave. Conserva el ID, personaje, cuadernos, atributos, XP, puntos, runas y movimientos; revoca las sesiones anteriores. El respaldo sigue válido tras la recuperación propia.
- Si falta el respaldo o el personaje es anterior a esta versión, la interfaz explica la recuperación asistida. `recuperarClaveLudaria` permanece disponible solo al facilitador desde el proyecto original; su renovación invalida el respaldo anterior.
- No se agregan columnas ni se publican datos de la planilla. Se conservan secreto y propiedades existentes. Las nuevas propiedades contienen verificadores y firmas, sin claves ni códigos de recuperación en texto.

## Instalación realizada

Este cambio modificó el archivo completo `ludaria/Code-Ludaria-Conectado.gs`, generado mediante `python ludaria/build.py` desde los fuentes. El 12 de octubre el cliente v0.4.1 fue detectado en el mismo /exec. v0.4.3 es una corrección posterior: actualizar únicamente ese proyecto e implementación; conservar la URL, propiedades, secreto y datos existentes.

GitHub Pages por sí solo no reemplaza el cliente incrustado en la versión desplegada de Apps Script. La nueva bienvenida ya está disponible a través de los iframe originales. No cambiar los iframe de Genially ni el receptor independiente de Misión 0. El gateway se conserva activo.

`ludaria/vista-bienvenida.html` permite ver el diseño publicado sin crear personajes ni consultar la planilla. Es una vista de diseño; sus formularios no llaman al servidor.

## Comprobaciones

`test-access.cjs` verifica formato/confirmación, reintentos de alta, respaldo privado, cinco intentos fallidos, rechazo de nombres inexistentes sin revelar su existencia, recuperación idempotente, credenciales antiguas revocadas, compatibilidad LUD, conservación de perfil/cuaderno y rollback si la auditoría falla. El workflow vuelve a comprobar todos los adaptadores, RPG, DOM, resiliencia, escritorio, móvil e iframe con servicios simulados. El cliente de esta versión ya está instalado en Apps Script; la comprobación autenticada real de escrituras sigue pendiente.

## Arte visual

`ludaria/assets/guardianes-v1.webp`: atlas de 16 retratos, creado con la herramienta integrada de imágenes y optimizado para la web. Se usa por posiciones CSS sin modificar ni sustituir los retratos originales del personaje Kael/Kira.

Prompt: atlas cuadrado de 4 × 4 retratos de Nara, Iria, Elian, Liora, Brina, Rokan, Savia, Daren, Ferna, Neris, Eira, Mael, Arel, Oria, Aster y Mochi; fantasía pictórica de bosque esmeralda, iluminación verde y oro, rostros expresivos, celdas iguales sin márgenes ni textos. El prompt completo y la imagen original forman parte de la generación de esta conversación.
