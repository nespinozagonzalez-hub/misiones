'use strict';
// Motor puro para la demostración: alternancia, gravedad, victoria y empate.
window.TALLADO_GAME = (() => {
  const empty=()=>({board:Array.from({length:6},()=>Array(7).fill(0)),turn:1,winner:0,draw:false,line:[],moves:[]});
  function winningLine(board,r,c,p) {
    for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
      const cells=[[r,c]];
      for(const sign of [-1,1]) {
        for(let k=1;k<4;k++) {
          const nr=r+dr*k*sign,nc=c+dc*k*sign;
          if(nr<0||nr>=6||nc<0||nc>=7||board[nr][nc]!==p)break;
          cells.push([nr,nc]);
        }
      }
      if(cells.length>=4)return cells;
    }
    return [];
  }
  function play(s,c) {
    if(!Number.isInteger(c)||c<0||c>6||s.winner||s.draw||s.board[0][c])return {state:s,error:'Esta columna no admite una jugada.'};
    const board=s.board.map(row=>row.slice());
    let r=5;while(board[r][c])r--;
    board[r][c]=s.turn;
    const line=winningLine(board,r,c,s.turn),moves=[...s.moves,c];
    return {state:{board,turn:3-s.turn,winner:line.length?s.turn:0,draw:!line.length&&moves.length===42,line,moves},row:r,column:c,player:s.turn};
  }
  function replay(moves) {
    let s=empty();
    if(!Array.isArray(moves))return s;
    for(const c of moves.slice(0,42)){const result=play(s,c);if(result.error)break;s=result.state;}
    return s;
  }
  return {empty,play,replay,winningLine};
})();
