/** Entrada estable: navegación del iframe actual, sin fetch/CORS ni credenciales en URL. */
(() => {
  'use strict';
  const config = window.LUDARIA_GATEWAY;
  if (!config || config.enabled !== true || config.verified !== true ||
      window.LUDARIA_CLOUD_CONFIG || window.google?.script?.run) return;
  if (location.origin !== 'https://nespinozagonzalez-hub.github.io') return;
  const current = new URL(location.href);
  if (current.searchParams.get('prueba') === '1') return;
  const match = current.pathname.match(/^\/misiones\/(forja|vetas-diseno)\/(?:index\.html|presentacion\.html)?$/);
  if (!match || !Array.isArray(config.routes) || !config.routes.includes(match[1])) return;
  // Solo una URL de implementación Apps Script /exec sin query, fragmento o usuario.
  if (typeof config.deployment !== 'string' ||
      !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,}\/exec$/.test(config.deployment)) return;
  const target = new URL(config.deployment);
  if (match[1] !== 'forja') target.searchParams.set('mision', match[1]);
  if (match[1] === 'forja' && (current.searchParams.get('entrada') === 'mochi' || current.searchParams.get('mochi') === '1')) {
    target.searchParams.set('entrada', 'mochi');
  }
  if (/^#pantalla-(?:[1-9]|1[0-4])$/.test(current.hash)) target.hash = current.hash;
  // No reenviar PIN, clave, token, nombre, URLs arbitrarias ni estado del navegador.
  location.replace(target.href);
})();
