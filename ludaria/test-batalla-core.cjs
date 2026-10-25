const assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../defensa-orbe/batalla-core.js');
assert.equal(Object.keys(C.moves).length,5);
let fresh=C.fresh(),a=C.act(fresh,'sabiduria');assert.equal(fresh.hp,100,'No muta el estado anterior');assert.equal(a.hp,84);assert.equal(a.ward,84);
let combo=C.act(a,'creacion');assert.equal(combo.lastEvent.damage,32);assert.equal(combo.lastEvent.bonus,10);
assert.equal(C.act(a,'sabiduria').lastEvent.bonus,0,'Repetir no activa el combo');
let blocked=C.act(fresh,'evaluacion');assert.equal(blocked.ward,100);assert.equal(blocked.lastEvent.blocked,16);
let healed=C.act({...fresh,ward:30},'camaraderia');assert.equal(healed.lastEvent.healed,28);assert.equal(healed.ward,42);
let low=C.act({...fresh,ward:1},'creacion');assert.equal(low.outcome,'breather');assert.equal(low.ward,0);
let recovered=C.recover(low);assert.equal(recovered.ward,75);assert.equal(recovered.hp,low.hp);assert.equal(recovered.fragments,low.fragments);
for(const skill of Object.keys(C.moves)){
 let s=C.fresh(),turns=0;
 while(s.outcome!=='victory'&&turns++<50){if(s.outcome==='breather')s=C.recover(s);s=C.act(s,skill);assert(s.hp>=0&&s.hp<=100&&s.ward>=0&&s.ward<=100);assert.equal(s.fragments,Math.min(4,Math.floor((100-s.hp)/25)));}
 assert.equal(s.outcome,'victory',skill+' siempre tiene salida con reagrupación');assert.equal(s.fragments,4);assert.equal(C.act(s,skill),s,'No permite golpes tras vencer');
}
assert.equal(C.act(fresh,'inexistente'),fresh);
assert.doesNotMatch(fs.readFileSync(__dirname+'/../defensa-orbe/batalla-core.js','utf8'),/localStorage|sessionStorage|fetch\(|google\.script|LudariaCloud/,'Motor aislado de identidad y datos');
console.log('PASS batalla: acciones distintas, combos, defensa, curación, contraataques, reagrupación sin pérdida, límites y victoria accesible con las cinco habilidades.');
