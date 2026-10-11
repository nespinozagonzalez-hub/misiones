"""Genera un único Code.gs para actualizar el mismo proyecto ya instalado."""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
parts = [
    '/** LUDARIA v0.2.0. Sustituye Código.gs en el MISMO proyecto del paso 1.\n'
    ' * Conserva propiedades, secretos y registros. No crear un proyecto nuevo.\n'
    ' * Ejecuta prepararConexionLudaria y luego implementa como aplicación web. */',
    (root / 'forja/core.js').read_text(),
    (root / 'ludaria/apps-script/Base.gs').read_text(),
    (root / 'ludaria/apps-script/Web.gs').read_text(),
    'const LUDARIA_CLIENT_SOURCE = ' + json.dumps((root / 'ludaria/client.js').read_text(), ensure_ascii=True) + ';',
]
out = root / 'ludaria/Code-Ludaria-Conectado.gs'
out.write_text('\n\n'.join(parts) + '\n')
print(out)
