"""Versiona los scripts y prepara una entrada estable para incrustar."""
from pathlib import Path
import hashlib
import re

root = Path(__file__).parent
html = (root/'index.html').read_text()
for name in ('content','app'):
    source = root/f'{name}.js'
    digest = hashlib.sha256(source.read_bytes()).hexdigest()[:10]
    versioned = f'{name}.{digest}.js'
    (root/versioned).write_bytes(source.read_bytes())
    html = re.sub(r'<script src="'+name+r'(?:\.[a-f0-9]+)?\.js(?:\?[^\"]*)?"></script>', '<script src="'+versioned+'"></script>', html)
(root/'index.html').write_text(html)
(root/'presentacion.html').write_text(html)
print('Preparada: presentacion.html')
