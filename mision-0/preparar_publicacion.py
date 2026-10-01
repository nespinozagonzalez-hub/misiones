from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parent
html=(root/'index.html').read_text()
for stem,suffix in [('styles','css'),('config','js'),('instrumento','js'),('transport','js'),('app','js')]:
    data=(root/f'{stem}.{suffix}').read_bytes()
    name=f'{stem}.{hashlib.sha256(data).hexdigest()[:10]}.{suffix}'
    (root/name).write_bytes(data)
    html=re.sub(rf'{stem}(?:\.[a-f0-9]{{10}})?\.{suffix}',name,html)
(root/'index.html').write_text(html)
(root/'presentacion.html').write_text(html)
print('Publicación preparada.')
