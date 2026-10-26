const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Q=require('../defensa-orbe/batalla-quiz.js'),C=require('../defensa-orbe/batalla-core.js');
assert.equal(Q.bank.length,10);assert.equal(new Set(Q.bank.map(q=>q.id)).size,10);
for(const q of Q.bank){
 assert(C.moves[q.skill]);assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o[0])).size,4);
 assert(q.hint.length>20);assert(q.question.length>20);assert(fs.existsSync(path.join(__dirname,'..',q.source)));
 for(let i=0;i<4;i++){const a=Q.answer(q,i);assert.equal(a.correct,i===q.correct);assert(a.feedback.length>20);}
 assert.equal(Q.answer(q,-1),null);assert.equal(Q.answer(q,4),null);assert.equal(Q.answer(q,NaN),null);
}
for(const skill of Object.keys(C.moves)){
 const seen=[];
 for(let i=0;i<10;i++){const q=Q.choose(skill,seen);assert(!seen.includes(q.id),'No repite antes de agotar el banco');seen.push(q.id);if(i<2)assert.equal(q.skill,skill);}
 assert(Q.choose(skill,seen),'Permite seguir si se agota el banco');
}
assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'../defensa-orbe/batalla-quiz.js'),'utf8'),/localStorage|sessionStorage|fetch\(|google\.script|LudariaCloud/);
console.log('PASS quiz: diez preguntas, cuatro opciones, respuesta única, explicación por opción, pista, fuentes locales y rotación sin repetición prematura; sin conexión ni almacenamiento.');
