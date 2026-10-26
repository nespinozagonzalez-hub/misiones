/** Recortes independientes del arte existente: una pose por lienzo, sin desplazar el atlas. */
(function(root){
 'use strict';
 const width=704,height=576,baseline=548;
 // [x, y, ancho, alto, centro de apoyo x, línea de suelo y]. Coordenadas del original.
 const layouts={
  kael:[[0,0,512,512,286,505],[512,0,512,512,801,505],[1024,0,512,512,1270,505],[0,512,640,512,254,1007],[620,512,490,512,845,1007],[1140,512,396,512,1315,1007]],
  kira:[[0,0,512,512,284,505],[512,0,512,512,801,505],[1024,0,512,512,1268,505],[0,512,640,512,255,1007],[620,512,490,512,845,1007],[1140,512,396,512,1315,1007]],
  lethon:[[0,0,512,512,292,505],[512,0,512,512,808,505],[960,0,576,512,1280,505],[0,512,640,512,300,1007],[620,512,490,512,852,1007],[1140,512,396,512,1320,1007]]
 };
 const sources={kael:'kael-ataque-v3.webp',kira:'kira-ataque-v3.webp',lethon:'lethon-ataque-v3.webp'};
 function draw(canvas,image,actor,index){
  const frame=layouts[actor]?.[index];if(!frame||image?.naturalWidth!==1536||image?.naturalHeight!==1024)return false;
  const ctx=canvas.getContext('2d');if(!ctx)return false;
  if(canvas.width!==width)canvas.width=width;if(canvas.height!==height)canvas.height=height;
  const [x,y,w,h,anchor,ground]=frame,origin=(actor==='lethon'?366:300)-anchor,top=baseline-ground;
  ctx.clearRect(0,0,width,height);ctx.save();
  // Bajo el proyectil, el borde de la cuarta pose no incluye la capa de la siguiente.
  if(index===3){const edge=actor==='lethon'?620:580;ctx.beginPath();ctx.moveTo(x+origin,y+top);ctx.lineTo(640+origin,y+top);ctx.lineTo(640+origin,755+top);ctx.lineTo(edge+origin,790+top);ctx.lineTo(edge+origin,1024+top);ctx.lineTo(x+origin,1024+top);ctx.closePath();ctx.clip();}
  // La quinta pose comparte una franja con el proyectil anterior: solo su contorno propio.
  if(index===4){ctx.beginPath();ctx.moveTo(660+origin,512+top);ctx.lineTo(1110+origin,512+top);ctx.lineTo(1110+origin,1024+top);ctx.lineTo(650+origin,1024+top);ctx.lineTo(650+origin,755+top);ctx.lineTo(660+origin,700+top);ctx.closePath();ctx.clip();}
  // La bruma de la tercera pose de Lethon invade la esquina superior de la segunda.
  if(actor==='lethon'&&index===1){ctx.beginPath();ctx.moveTo(x+origin,y+top);ctx.lineTo(920+origin,y+top);ctx.lineTo(920+origin,200+top);ctx.lineTo(978+origin,205+top);ctx.lineTo(978+origin,295+top);ctx.lineTo(1004+origin,370+top);ctx.lineTo(1004+origin,512+top);ctx.lineTo(x+origin,512+top);ctx.closePath();ctx.clip();}
  ctx.drawImage(image,x,y,w,h,x+origin,y+top,w,h);ctx.restore();canvas.dataset.frame=String(index);canvas.dataset.actor=actor;return true;
 }
 function load(canvas,url,actor){
  const image=new Image();let frame=0,started=0,animation=0,stopped=false,ready=false;
  function stop(){stopped=true;cancelAnimationFrame(animation);animation=0;}
  image.onload=()=>{if(stopped)return;ready=draw(canvas,image,actor,0);if(ready)canvas.dispatchEvent(new Event('sprite-ready'));};
  image.src=url;
  function play(duration=840){
   if(!ready||stopped)return false;cancelAnimationFrame(animation);started=performance.now();frame=-1;
   function tick(now){if(stopped||!canvas.isConnected)return;const next=Math.min(5,Math.floor((now-started)/duration*6));if(next!==frame){frame=next;draw(canvas,image,actor,frame);}if(next<5)animation=requestAnimationFrame(tick);}
   tick(started);return true;
  }
  return {play,stop,get ready(){return ready;}};
 }
 const api={width,height,baseline,layouts,sources,draw,load};root.LudariaSprites=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
