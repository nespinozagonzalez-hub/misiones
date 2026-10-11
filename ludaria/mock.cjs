const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
let source = '';
function setSource(value) { source = value; }
class Range {
  constructor(sheet, row, col, height, width) { Object.assign(this, {sheet,row,col,height,width}); }
  getValues() { return Array.from({length:this.height}, (_,i)=>Array.from({length:this.width}, (_,j)=>this.sheet.data[this.row+i-1]?.[this.col+j-1] ?? '')); }
  setValues(values) { assert.equal(values.length,this.height); values.forEach((row,i)=>{assert.equal(row.length,this.width); const target=this.sheet.data[this.row+i-1] ||= []; row.forEach((v,j)=>target[this.col+j-1]=v);});return this; }
  setBackground() {return this;} setFontColor(){return this;} setFontWeight(){return this;}
}
class Sheet {
  constructor(name){this.name=name;this.data=[];}
  getName(){return this.name;} getLastRow(){return this.data.length;} getLastColumn(){return Math.max(0,...this.data.map(r=>r.length));}
  getRange(...args){return new Range(this,...args);} setFrozenRows(){} autoResizeColumns(){}
  appendRow(row){this.data.push([...row]);}
}
function context() {
  const sheets = new Map([['Hoja 1',new Sheet('Hoja 1')]]);
  const ss = {getId:()=> 'test-spreadsheet-ludaria', getSheetByName:n=>sheets.get(n),insertSheet:n=>{const s=new Sheet(n);sheets.set(n,s);return s;}};
  const props = new Map();
  const service = {getProperty:k=>props.get(k)??null,setProperty:(k,v)=>props.set(k,String(v)),deleteProperty:k=>props.delete(k)};
  let locked=false;
  const messages=[];
  const c = vm.createContext({console:{log:x=>messages.push(x)},Date,Session:{getActiveUser:()=>({getEmail:()=> 'owner@example.test'}),getEffectiveUser:()=>({getEmail:()=> 'owner@example.test'})},UrlFetchApp:{fetch:()=>({getResponseCode:()=>200,getContentText:()=>'<html><head></head><body>Fixture</body></html>'})},HtmlService:{createHtmlOutput:html=>({html,setTitle(){return this;},addMetaTag(){return this;},setXFrameOptionsMode(){return this;}}),XFrameOptionsMode:{ALLOWALL:'ALLOWALL'}},SpreadsheetApp:{getActiveSpreadsheet:()=>ss,openById:id=>{assert.equal(id,ss.getId());return ss;},flush(){}},PropertiesService:{getScriptProperties:()=>service},LockService:{getScriptLock:()=>({waitLock(){assert.equal(locked,false);locked=true;},releaseLock(){assert.equal(locked,true);locked=false;}})},Utilities:{getUuid:()=>crypto.randomUUID(),Charset:{UTF_8:'UTF-8'},computeHmacSha256Signature:(s,k)=>[...crypto.createHmac('sha256',k).update(s).digest()].map(x=>x>127?x-256:x)}});
  vm.runInContext(source,c);
  c.ss=ss; return {c,sheets,props,messages,run:s=>vm.runInContext(s,c)};
}

module.exports={context,setSource};
