/** Combate efímero y determinista: no conoce cuentas, almacenamiento ni recompensas. */
(function(root){
 'use strict';
 const moves={
  sabiduria:{name:'Luz del Saber',damage:16,guard:0,heal:0,detail:'16 de impacto. Otra habilidad recibe +10 después.'},
  maestria:{name:'Sello del Artesano',damage:14,guard:10,heal:0,detail:'14 de impacto, bloquea 10 y prepara +6 para otra habilidad.'},
  creacion:{name:'Chispa Creadora',damage:22,guard:0,heal:0,detail:'22 de impacto directo sobre la bruma.'},
  evaluacion:{name:'Espejo Protector',damage:10,guard:24,heal:0,detail:'10 de impacto y bloquea hasta 24 del contraataque.'},
  camaraderia:{name:'Vínculo del Gremio',damage:6,guard:0,heal:28,detail:'6 de impacto y recupera 28 de escudo antes del contraataque.'}
 };
 const phases=[
  {place:'Bosque de los Conceptos',line:'«Borraré hasta los nombres de lo que habéis aprendido.»',memory:'Théol: «Nombrar con claridad también es resistir al olvido».',attack:'Bruma del Olvido'},
  {place:'Cantera de los Elementos',line:'«Sin vínculos, vuestras piezas no son más que polvo.»',memory:'Bryn: «Las piezas cobran sentido cuando comprendemos sus relaciones».',attack:'Fragmentos dispersos'},
  {place:'Forja del Arquitecto',line:'«Ninguna de vuestras creaciones atravesará esta oscuridad.»',memory:'Ondal: «Lo que habéis construido ya puede abrir un camino».',attack:'Golpe del Vacío'},
  {place:'Santuario del Espejo',line:'«¿Os atrevéis a mirar lo que aún os queda por aprender?»',memory:'Mira: «Una mirada crítica también puede cuidar lo que está naciendo».',attack:'Último Velo'}
 ];
 const fresh=()=>({hp:100,ward:100,turn:1,fragments:0,last:null,outcome:'battle',lastEvent:null});
 function act(state,key){
  if(state.outcome!=='battle'||!moves[key])return state;
  const move=moves[key],phase=Math.min(3,Math.floor((100-state.hp)/25));
  const bonus=state.last!==key?(state.last==='sabiduria'?10:state.last==='maestria'?6:0):0;
  const damage=Math.min(state.hp,move.damage+bonus),hp=state.hp-damage;
  const incoming=hp===0?0:16+phase*4,blocked=Math.min(incoming,move.guard);
  const healed=Math.min(100-state.ward,move.heal),ward=Math.max(0,state.ward+healed-incoming+blocked);
  const fragments=Math.min(4,Math.floor((100-hp)/25));
  return {...state,hp,ward,turn:state.turn+1,fragments,last:key,outcome:hp===0?'victory':ward===0?'breather':'battle',lastEvent:{key,damage,bonus,incoming,blocked,healed,phase,fragment:fragments>state.fragments,attack:phases[phase].attack}};
 }
 const recover=state=>state.outcome==='breather'?{...state,ward:75,outcome:'battle',last:null,lastEvent:null}:state;
 const api={moves,phases,fresh,act,recover};root.LudariaBattle=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
