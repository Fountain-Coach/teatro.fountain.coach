/* Private acoustic evidence recorder. This is NOT another Ear, transport, or
   synthesis engine: it copies actual Csound AudioWorklet PCM for independent
   audition and time-domain measurement. No network or file access. */
class CsoundEvidenceRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.frames=0;
    this.left=new Float32Array(4096);
    this.right=new Float32Array(4096);
    this.port.onmessage=event=>{
      if(event.data?.type==='flush')this.flush();
    };
  }
  flush() {
    if(!this.frames)return;
    const left=this.left.slice(0,this.frames),right=this.right.slice(0,this.frames);
    this.port.postMessage({type:'csound.pcm',frames:this.frames,left,right},
                          [left.buffer,right.buffer]);
    this.left=new Float32Array(4096);
    this.right=new Float32Array(4096);
    this.frames=0;
  }
  process(inputs,outputs) {
    // Explicitly silent monitoring branch; do not add a second audible output.
    for(const channel of outputs[0]||[])channel.fill(0);
    const input=inputs[0],a=input?.[0],b=input?.[1]||a;
    if(!a)return true;
    for(let i=0;i<a.length;i++){
      this.left[this.frames]=a[i];
      this.right[this.frames]=b[i];
      if(++this.frames===4096)this.flush();
    }
    return true;
  }
}
registerProcessor('csound-evidence-recorder',CsoundEvidenceRecorder);
