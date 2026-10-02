from pathlib import Path
import hashlib,re
p=Path(__file__).resolve().parent
s=(p/'index.html').read_text()
for name in ['styles.css','content.js','config.js','app.js']:
 data=(p/name).read_bytes();stem,ext=name.rsplit('.',1)
 hashed=f'{stem}.{hashlib.sha256(data).hexdigest()[:10]}.{ext}'
 (p/hashed).write_bytes(data)
 s=re.sub(rf'{stem}(?:\.[a-f0-9]{{10}})?\.{ext}',hashed,s)
(p/'index.html').write_text(s)
(p/'presentacion.html').write_text(s)
print('Recursos preparados')
