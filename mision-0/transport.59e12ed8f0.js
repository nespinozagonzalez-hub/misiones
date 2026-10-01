/* Envío de formulario y recibo de solo lectura. Nunca tratar una respuesta opaca como éxito. */
window.LudariaTransport = (() => {
  function validUrl(value) {
    try {const u=new URL(value);return u.protocol==='https:'&&u.hostname==='script.google.com'&&/^\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(u.pathname)&&!u.search&&!u.hash;}catch{return false;}
  }
  function receipt(url,payload) {
    return new Promise((resolve,reject)=>{
      const callback='ludariaAck_'+crypto.randomUUID().replaceAll('-','');
      const script=document.createElement('script');
      const cleanup=()=>{clearTimeout(timer);delete window[callback];script.remove();};
      const timer=setTimeout(()=>{cleanup();reject(new Error('RECEIPT_TIMEOUT'));},7000);
      window[callback]=result=>{cleanup();resolve(result);};
      const u=new URL(url);u.search=new URLSearchParams({action:'receipt',id:payload.id,token:payload.receiptToken,callback,ts:String(Date.now())});
      script.src=u.href;script.referrerPolicy='no-referrer';
      script.onerror=()=>{cleanup();reject(new Error('RECEIPT_NETWORK'));};
      document.head.append(script);
    });
  }
  async function confirm(url,payload) {
    for(let attempt=0;attempt<5;attempt++) {
      try {
        const result=await receipt(url,payload);
        if(result?.ok===false)throw new Error('SERVER_'+(result.error||'ERROR'));
        if(result?.received===true && result.id===payload.id)return {id:payload.id,confirmedAt:new Date().toISOString()};
      } catch(error) {if(error.message.startsWith('SERVER_'))throw error;}
      if(attempt<4)await new Promise(r=>setTimeout(r,1800));
    }
    throw new Error('UNCONFIRMED');
  }
  async function send(url,payload) {
    if(!validUrl(url))throw new Error('NOT_CONFIGURED');
    // POST simple: evita preflight. El cuerpo es el mismo en cada reintento.
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    try {await fetch(url,{method:'POST',mode:'no-cors',redirect:'follow',credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,body:new URLSearchParams({payload:JSON.stringify(payload)})});}catch{}finally{clearTimeout(timeout);}
    return confirm(url,payload);
  }
  return {validUrl,send,confirm};
})();
