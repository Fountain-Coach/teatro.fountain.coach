/* Test-only acoustic feature extension of Teatro Ear, governed by FCIS 138.
 * Its source is explicitly connected in the Web Audio graph. The *existing*
 * shipped EarAnalysisProcessor runs in parallel and remains the MIDI2 owner.
 * This worklet emits source-addressed measurement telemetry only: it does not
 * invent MIDI notes, identify speech, or change the published player.
 */
class EarSingingFeatureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    const config=options?.processorOptions||{};
    this.sourceId=String(config.sourceId||'unbound-source');
    this.sampleRate=Number(config.sampleRate)||48000;
    this.windowSize=1024;
    this.hopSize=512;
    this.buffer=[];
    this.cursor=0;
    this.startTime=null;
    this.previousSpectrum=null;
    this.bins=[250,320,440,780,1200,1480,2300,2850,3500,5500];
    this.coefficients=this.bins.map(f=>2*Math.cos(2*Math.PI*f/this.sampleRate));
    this.lastOnsetAt=-1;
    this.windows=0;
  }
  process(inputs, outputs) {
    if(outputs[0]?.[0]) outputs[0][0].fill(0);
    const channel=inputs[0]?.[0];
    if(!channel) return true;
    if(this.startTime===null)this.startTime=currentTime;
    for(let i=0;i<channel.length;i++)this.buffer.push(channel[i]);
    while(this.buffer.length>=this.windowSize) {
      const window=this.buffer.slice(0,this.windowSize);
      this.measure(window);
      this.buffer=this.buffer.slice(this.hopSize);
      this.cursor+=this.hopSize;
    }
    return true;
  }
  measure(window) {
    const time=this.startTime+(this.cursor+this.windowSize)/this.sampleRate;
    let sum=0,peak=0;
    const n=window.length;
    for(let i=0;i<n;i++){const x=window[i];sum+=x*x;peak=Math.max(peak,Math.abs(x))}
    const rms=Math.sqrt(sum/n);
    const power=[];
    for (let bin=0;bin<this.coefficients.length;bin++) {
      const coeff=this.coefficients[bin];
      let q1=0,q2=0;
      for(let i=0;i<n;i++) {
        const tapered=window[i]*(0.5-0.5*Math.cos(2*Math.PI*i/(n-1)));
        const q=tapered+coeff*q1-q2;
        q2=q1;q1=q;
      }
      power.push(Math.max(0,q1*q1+q2*q2-coeff*q1*q2));
    }
    const total=power.reduce((a,b)=>a+b,0)+1e-20;
    const highRatio=(power[6]+power[7]+power[8]+power[9])/total;
    const lowRatio=(power[0]+power[1]+power[2])/total;
    let flux=0;
    if(this.previousSpectrum) {
      for(let i=0;i<power.length;i++) {
        const norm=power[i]/total;
        const prev=this.previousSpectrum[i];
        if(norm>prev) flux+=norm-prev;
      }
    }
    this.previousSpectrum=power.map(x=>x/total);
    // Downsample autocorrelation: diagnostic fundamental estimate, not ASR.
    let fundamentalHz=null, pitchConfidence=0;
    if(rms>0.003) {
      const decimated=Array.from({length:256},(_,i)=>window[i*4]);
      const avg=decimated.reduce((a,b)=>a+b,0)/decimated.length;
      for(let i=0;i<decimated.length;i++)decimated[i]-=avg;
      let best=-1,bestLag=0;
      const candidates=[];
      for(let lag=27;lag<=88;lag++) {
        let a=0,aa=0,bb=0;
        for(let i=0;i<decimated.length-lag;i++) {
          const x=decimated[i],y=decimated[i+lag];
          a+=x*y;aa+=x*x;bb+=y*y;
        }
        const corr=a/Math.sqrt(aa*bb+1e-18);
        candidates.push({lag,corr});
        if(corr>best){best=corr;bestLag=lag}
      }
      if(best>0.65) {
        // Prefer the first strong autocorrelation peak; a global maximum
        // near 2x the period otherwise labels a legitimate note one octave low.
        const first=candidates.find((c,i)=> c.corr>0.85 && c.corr>=best-0.06 &&
          c.corr>=(candidates[i-1]?.corr??-1) &&
          c.corr>=(candidates[i+1]?.corr??-1));
        const selected=first ?? {lag:bestLag,corr:best};
        fundamentalHz=this.sampleRate/(4*selected.lag);
        pitchConfidence=selected.corr;
      }
    }
    const onsetCandidate=rms>0.006 && flux>0.10 &&
      (time-this.lastOnsetAt)>0.085;
    if(onsetCandidate) this.lastOnsetAt=time;
    this.windows++;
    this.port.postMessage({
      type:'ear.acoustic_features',
      sourceIdentity:this.sourceId,
      timestamp:time,
      windowSamples:n,
      hopSamples:this.hopSize,
      measurement:{
        rms,peak,spectralFlux:flux,lowBandRatio:lowRatio,
        highBandRatio:highRatio,
        fundamentalHz, pitchConfidence,onsetCandidate,
        supportsPhonemeRecognition:false,
        detector:'spectral-transition-pitch-v0',
        state:rms>0.0001?'running':'silent'
      }
    });
  }
}
registerProcessor('ear-singing-features',EarSingingFeatureProcessor);
