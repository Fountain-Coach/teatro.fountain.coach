/* MIDI2 UMP book plane. In-browser event transport, not a physical MIDI device. */
const CC=Object.freeze({position:20,focus:21,transport:22,wind:70,turbulence:71,head:72,voice:73,earLevel:74});
const valid=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
export function controlChange(controller,value,group=0,channel=0){
 if(!valid(controller,0,127)||!valid(group,0,15)||!valid(channel,0,15)||
    !Number.isFinite(value)||value<0||value>1)throw Error('Invalid MIDI2 CC');
 return [((0x4<<28)|(group<<24)|((0xb0|channel)<<16)|(controller<<8))>>>0,Math.round(value*0xffffffff)>>>0];
}
export function unpackControlChange(words){
 if(!Array.isArray(words)||words.length!==2||words.some(x=>!valid(x,0,0xffffffff)))return null;
 const [a,b]=words;
 if((a>>>28)!==4||((a>>>16)&0xf0)!==0xb0||((a>>>8)&0x80)!==0)return null;
 return {group:(a>>>24)&15,channel:(a>>>16)&15,controller:(a>>>8)&127,value:b/0xffffffff};
}
export function createBookMidi2(identity){
 if(typeof identity!=='string'||identity.length>160||!identity.trim())throw Error('Bounded book identity required');
 let sequence=0;const listeners=new Set();
 function receive(packet){
   if(!packet||packet.schema!=='fountain.book-midi2.ump.v1'||packet.target!==identity||
      !valid(packet.sequence,0,0xffffffff)||typeof packet.source!=='string')return false;
   const cc=unpackControlChange(packet.words);
   if(!cc)return false;
   listeners.forEach(fn=>fn({...cc,source:packet.source,sequence:packet.sequence,direction:'incoming'}));
   return true;
 }
 const incoming=e=>receive(e.detail);
 window.addEventListener('fountain:midi2:receive',incoming);
 return Object.freeze({id:identity,controllers:CC,
   publish(controller,value,source='book'){
     const detail=Object.freeze({schema:'fountain.book-midi2.ump.v1',source,target:identity,
       sequence:++sequence,timestamp:performance.now(),words:controlChange(controller,value)});
     window.dispatchEvent(new CustomEvent('fountain:book:midi2',{detail}));
     return detail;
   },
   receive,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
   dispose(){window.removeEventListener('fountain:midi2:receive',incoming);listeners.clear()}
 });
}
