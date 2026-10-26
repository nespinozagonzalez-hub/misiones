const assert=require('node:assert/strict'),fs=require('node:fs'),S=require('../defensa-orbe/sprite-frames.js');
const calls=[],ctx={clearRect:(...a)=>calls.push(['clear',...a]),save:()=>{},restore:()=>{},beginPath:()=>{},moveTo:()=>{},lineTo:()=>{},closePath:()=>{},clip:()=>{},drawImage:(...a)=>calls.push(['draw',...a.slice(1)])};
const canvas={width:0,height:0,dataset:{},getContext:()=>ctx},image={naturalWidth:1536,naturalHeight:1024};
for(const actor of ['kael','kira','lethon']){
 assert.equal(S.layouts[actor].length,6);
 for(let index=0;index<6;index++){
  const [x,y,w,h,anchor,ground]=S.layouts[actor][index];assert(x>=0&&y>=0&&x+w<=1536&&y+h<=1024);assert(anchor>=x&&anchor<x+w);assert(ground>=y&&ground<y+h);
  assert.equal(S.draw(canvas,image,actor,index),true);assert.equal(canvas.dataset.frame,String(index));assert.equal(canvas.dataset.actor,actor);
  assert.equal(calls.at(-2)[0],'clear','Se limpia el fotograma anterior antes de cada dibujo');assert.deepEqual(calls.at(-2).slice(1),[0,0,704,576]);
  assert.equal(S.baseline-ground+ground,548,'El apoyo queda en una línea de suelo fija');
 }
}
assert.equal(calls.filter(c=>c[0]==='draw').length,18);assert.equal(canvas.width,704);assert.equal(canvas.height,576);
assert.equal(S.draw(canvas,image,'kael',6),false);assert.equal(S.draw(canvas,{naturalWidth:1,naturalHeight:1},'kael',0),false);
assert.doesNotMatch(fs.readFileSync(__dirname+'/../defensa-orbe/sprite-frames.js','utf8'),/localStorage|sessionStorage|fetch\(|google\.script|LudariaCloud/);
console.log('PASS encuadre: 18 recortes propios, dimensiones válidas, suelo alineado y lienzo limpio en cada pose; sin datos del curso.');
