"""Adaptadores centrales de las entradas reales. Conserva originales y modo local."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'produccion/CATALOGO_14_SESIONES.json').read_text())
sources=json.loads((root/'ludaria/mission-sources.json').read_text())
entries={'mision-0':'presentacion.html'}
for m in manifest:
 if m['s']==1: continue # Diagnóstico conserva su receptor y protocolo propios.
 folder=root/m['slug']
 entry=Path(m['url'].split('?')[0]).name or 'index.html'
 if not (folder/entry).is_file():entry='index.html'
 html=(folder/entry).read_text()
 source=re.findall(r'<script[^>]+src="([^"]+)"',html)
 app=sources[m['slug']]
 txt=(folder/app).read_text()
 if m['slug'] not in ['pergaminos-dispersos','vetas-diseno']:
  # Carga explícita antes de cualquier acceso o guardado; no intercepta localStorage.
  txt=re.sub(r'\(\s*\(\s*\)\s*=>\s*\{','(async () => {',txt,count=1)
  prefix="\nconst cloud=window.LudariaCloud; let centralSnapshot=null;\nif(cloud?.active){await cloud.ready;try{centralSnapshot=await cloud.loadMission();}catch(error){const stage=document.getElementById('stage')||document.querySelector('main');if(stage){stage.textContent='No se pudo recuperar tu cuaderno. '+error.message+' Conserva tus notas y vuelve a intentarlo.';}return;}}\n"
  pos=txt.index('{',txt.index('(async'))+1
  txt=txt[:pos]+prefix+txt[pos:]
  txt=re.sub(r"JSON\.parse\(localStorage\.getItem\((KEY|K)\)(?:\s*\|\|\s*'null')?\)",lambda x:"(cloud?.active ? centralSnapshot : "+x.group(0)+")",txt)
  state='s' if m['slug'] in ['templado-pares','defensa-orbe'] else 'state'
  if 'function save()' in txt:
   txt=txt.replace('function save(){','function save(){if(cloud?.active){cloud.saveMission('+state+');return;}',1)
  else:
   txt=re.sub(r'const save\s*=\s*\(\)\s*=>\s*\{',lambda x:x.group(0)+'if(cloud?.active){cloud.saveMission('+state+');return;}',txt,count=1)
  txt=re.sub(r'localStorage\.removeItem\((KEY|K)\);?',lambda x:'if(!cloud?.active){'+x.group(0).rstrip(';')+';}',txt)
  if 'cloud.saveMission' not in txt:raise RuntimeError('Falta save '+m['slug'])
 # Texto válido para ambas modalidades; el indicador central confirma cada guardado.
 if m['slug'] not in ['pergaminos-dispersos','vetas-diseno']:
  replacements={
   'Tu recorrido está guardado en este navegador.':'Puedes retomar el recorrido desde tu cuaderno.',
   'recorrido anterior guardado en este navegador':'recorrido anterior conservado en tu cuaderno',
   'Tus textos se guardan en este navegador.':'Comprueba la confirmación del guardado antes de cerrar.',
   'Texto guardado en este navegador.':'Comprueba la confirmación del guardado.',
   'Guardado local en este navegador.':'Comprueba la confirmación del guardado.',
   'Borrador guardado en este navegador.':'Comprueba la confirmación del borrador.',
   'Borrador local guardado.':'Comprueba la confirmación del borrador.',
   'guardado en este navegador':'conservado en tu cuaderno',
   'Guardado local disponible.':'Comprueba la confirmación del guardado.',
   'Guardado local.':'Comprueba la confirmación del guardado.',
   'Este registro queda en tu dispositivo;':'Comprueba que el registro esté conservado;',
   'Datos de este navegador.':'Respuestas de este cuaderno.',
   'de este equipo en este navegador':'de este equipo',
   'al equipo que usa este navegador':'al equipo que elabora este cuaderno',
   'Este registro permanece en este navegador y no se envía automáticamente.':'Este cuaderno conserva tu trabajo. La entrega formal sigue el canal acordado con el facilitador.',
   'No se envió este registro desde la presentación.':'La entrega formal sigue el canal acordado con el facilitador.',
   'Este registro no se ha enviado desde el HTML.':'La entrega formal sigue el canal acordado con el facilitador.',
   'Esta presentación no envía respuestas.':'La entrega formal sigue el canal acordado con el facilitador.',
   'y no se envía a ningún servicio.':'y requiere revisión humana.',
   'Esta acción elimina de este navegador':'Esta acción reemplaza en la práctica actual',
   'Este registro conserva prototipo y avance en el navegador.':'Este cuaderno reúne tu prototipo y sus avances.',
   'no se envía desde el HTML.':'la entrega formal sigue el canal acordado.',
   'Borrador local por dispositivo.':'Cuaderno del personaje.',
   'Sin envío ni autocalificación.':'La entrega formal sigue el canal acordado. Revisión humana.',
   'Anotación local editable. No hay respuesta automática ni envío.':'Anotación editable del cuaderno. Se conserva con las otras respuestas y requiere revisión humana.',
   'Guardar aquí no envía el proyecto ni registra Códigos del Saber.':'Guardar el cuaderno no acredita una entrega ni activa Códigos del Saber.',
   'Borrar borrador local':'Iniciar una nueva práctica',
   'Borrar datos locales':'Iniciar una nueva práctica',
   'Datos locales borrados.':'Nueva práctica preparada; el historial anterior se conserva en la bitácora central.',
   'de esta misión en este navegador':'de la práctica actual',
   'la bitácora de este navegador':'la bitácora de la práctica actual',
   'Voto personal local;':'Voto de este cuaderno;',
  }
  for before,after in replacements.items():txt=txt.replace(before,after)
  if m['slug']=='pulido-prototipo':txt=txt.replace('cloud.saveMission(state);return;','cloud.saveMission(state);updateHud();return;',1)
  if m['slug']=='espejo-compartido':txt=txt.replace('cloud.saveMission(state);return;','cloud.saveMission(state);hud();return;',1)
 txt=txt.replace('Comprueba la confirmación de Sheets.','Comprueba la confirmación de tu bitácora.')
 if 'function setPageHistory(' not in txt:
  txt=txt.replace('history.replaceState(', 'setPageHistory(')
  pos=txt.index('{',txt.index('(async'))+1
  guard="\nfunction setPageHistory(state,title,hash){if(!window.LudariaCloud?.active)history.replaceState(state,title,location.href.split('#')[0]+hash);}\n"
  txt=txt[:pos]+guard+txt[pos:]
 # Los iframe originales terminan en #pantalla-1. Una bitácora recuperada
 # tiene prioridad al iniciar; cambiar el fragmento después conserva su función.
 # También funciona con el cliente de Apps Script anterior, sin nuevas APIs.
 if m['slug'] in ['pergaminos-dispersos','vetas-diseno']:
  txt=txt.replace('await cloud.loadMission()', '(centralSnapshot = await cloud.loadMission())')
 txt=txt.replace('location.hash', 'missionHash()')
 pos=txt.index('{',txt.index('(async'))+1
 navigation="\nlet startingMission=true;\n" + ("let centralSnapshot=null;\n" if m['slug'] in ['pergaminos-dispersos','vetas-diseno'] else "") + "function missionHash(){return startingMission && window.LudariaCloud?.active && centralSnapshot ? '' : location.hash;}\n"
 txt=txt[:pos]+navigation+txt[pos:]
 pos=txt.rfind('})();')
 if pos < 0:raise RuntimeError('Falta cierre de adaptador '+m['slug'])
 txt=txt[:pos]+'startingMission=false;\n'+txt[pos:]
 # Nueva app exacta, ambas entradas HTML apuntan al adaptador; fuentes antiguas conservadas.
 (folder/'app.rpg.js').write_text(txt)
 for path in [folder/'index.html',folder/'presentacion.html']:
  if not path.is_file():continue
  h=path.read_text()
  h=re.sub(r'(<script[^>]+src=")app[^"/]*\.js(?:\?[^\"]*)?("[^>]*>)',r'\1app.rpg.js?v=20261011-auditoria1\2',h)
  if '../ludaria/gateway-config.js' not in h:
   h=h.replace('<head>','<head>\n<script src="../ludaria/gateway-config.js?v=20261011-rpg1"></script><script src="../ludaria/gateway.js?v=20261011-rpg1"></script>',1)
  path.write_text(h)
 entries[m['slug']]=entry
(root/'ludaria/mission-entries.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
print('Adaptadores generados:',len(entries)-1)
