// Progressive Satzfunk listening layer on top of the genuine Fountain Press book.
// Deliberately does NOT invent a reading receipt, voice, transcript or audio.
const button = document.getElementById('satzfunk-hear');
const rail = document.getElementById('satzfunk-hearing-rail');
const close = document.getElementById('satzfunk-close');
const status = document.getElementById('satzfunk-hearing-status');
const tracks = document.getElementById('satzfunk-hearing-tracks');
// Independent author-owned books may share Satzfunk's hearing layer.
// The edition's canonical URL is supplied by its own source metadata;
// older First Reading projections retain their original canonical fallback.
const canonicalEdition = document.querySelector('meta[name="satzfunk-edition-url"]')?.content ||
  'https://works.benedikt-eickhoff.de/solstice/editions/first-reading/';
const editionDigest = document.querySelector('meta[name="satzfunk-source-sha256"]')?.content;
let loaded = false;
function setOpen(open) {
  rail.hidden = !open;
  document.body.classList.toggle('book-hearing-open', open);
  button.setAttribute('aria-expanded', String(open));
  if (open && !loaded) void loadApprovedHearing();
  if (!open) {
    tracks.querySelectorAll('audio').forEach(audio => audio.pause());
    button.focus({preventScroll:true});
  }
}
function textNode(name, value, cls='') {
  const n = document.createElement(name);
  n.textContent = value;
  if (cls) n.className = cls;
  return n;
}
function approveTrack(track) {
  if (!track || typeof track !== 'object' || !/^[a-z0-9-]{1,80}$/.test(track.id)) return false;
  if (track.status !== 'released' || typeof track.title !== 'string' || !track.title.trim()) return false;
  const url = new URL(track.audio, document.baseURI);
  const editionPath = new URL(document.baseURI).pathname.replace(/[^/]*$/, '');
  if (url.origin !== location.origin || !url.pathname.startsWith(editionPath+'media/')) return false;
  if (!Array.isArray(track.transcript)) return false;
  const ids = new Set([...document.querySelectorAll('[data-book-chapter]')].map(node=>node.dataset.bookChapter));
  return track.transcript.every(line => line && typeof line.text==='string' && Number.isFinite(line.start) && line.start>=0 && ids.has(line.chapterId));
}
async function loadApprovedHearing() {
  loaded=true;
  try {
    const response=await fetch('./hearings.json', {credentials:'omit',cache:'no-store'});
    if (response.status === 404) {
      status.textContent='The book is available to read. No author-approved spoken edition has been released yet.';
      return;
    }
    if (!response.ok) throw Error('Listening edition cannot be verified.');
    const manifest=await response.json();
    if (manifest.schema !== 'satzfunk.book.hearings.v1' || manifest.status!=='released' ||
        manifest.sourceEdition!==canonicalEdition || manifest.sourceHTMLSHA256!==editionDigest || !Array.isArray(manifest.tracks) ||
        !manifest.tracks.length || !manifest.tracks.every(approveTrack)) {
      throw Error('Listening edition has no admissible released-media and source-address evidence.');
    }
    status.textContent='Released listening edition · Narration is synchronized with the book.';
    for (const track of manifest.tracks) {
      const group=textNode('section','','satzfunk-take');
      group.append(textNode('h3',track.title));
      const audio=document.createElement('audio');
      audio.controls=true; audio.preload='none';
      audio.src=new URL(track.audio, document.baseURI).href;
      audio.setAttribute('aria-label',track.title);
      group.append(audio);
      if (track.voiceProvenance === 'openai') group.append(textNode('p','Synthetic voice · editorially approved.','satzfunk-provenance'));
      else if (track.voiceProvenance === 'mixed') group.append(textNode('p','Human and synthetic voices · editorially approved.','satzfunk-provenance'));
      else if (track.voiceProvenance === 'human') group.append(textNode('p','Human performance · editorially approved.','satzfunk-provenance'));
      else group.append(textNode('p','Audio origin unspecified: confirm provenance before distribution.','satzfunk-provenance'));
      const cues=document.createElement('nav'); cues.setAttribute('aria-label','Source-linked listening transcript');
      for (const line of track.transcript) {
        const chapter=document.getElementById('work-'+line.chapterId);
        const a=document.createElement('a');
        a.href='#work-'+encodeURIComponent(line.chapterId);
        a.textContent=line.text;
        a.addEventListener('click',()=>{
          audio.currentTime=line.start;
          // The existing book.js hash navigation remains authoritative for turning to a chapter.
        });
        if (chapter) cues.append(a);
      }
      group.append(cues); tracks.append(group);
    }
  } catch (error) {
    status.textContent='The hearing is unavailable: '+error.message;
  }
}
button?.addEventListener('click',()=>setOpen(rail.hidden));
close?.addEventListener('click',()=>setOpen(false));
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!rail.hidden) {event.stopPropagation();setOpen(false);}
});
