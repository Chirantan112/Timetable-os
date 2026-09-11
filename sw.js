const CACHE='studentos-v5';
const ASSETS=['./','./index.html','./data.js','./manifest.webmanifest','./icon.svg','./attendance-enhancement.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(async r=>{
    const url=new URL(e.request.url);
    if(url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')){
      const text=await r.clone().text();
      const fix=`<script>(function(){function __studentosFixSections(){if(typeof state==='undefined'||typeof SECTIONS==='undefined')return;state.profile=state.profile||{name:'Student',roll:'',dept:'CSE',sem:'3rd'};delete state._dept;const dept=document.getElementById('deptSel'),ss=document.getElementById('sectionSel');if(!dept||!ss)return;const current=String(state.section||'CSE-B');const program=current.split('-')[0];if(!SECTIONS[current]){const first=Object.keys(SECTIONS).find(k=>k.startsWith(program+'-'));if(first)state.section=first;}const selectedProgram=String(state.section||'CSE-B').split('-')[0];state.profile.dept=selectedProgram;dept.value=selectedProgram;ss.innerHTML=Object.entries(SECTIONS).filter(([k])=>k.startsWith(selectedProgram+'-')).map(([k,v])=>'<option value="'+k+'" '+(state.section===k?'selected':'')+'>Section '+k.split('-')[1]+' — '+v.program+'</option>').join('');dept.onchange=()=>{const first=Object.keys(SECTIONS).find(k=>k.startsWith(dept.value+'-'));if(first){state.section=first;state.profile.dept=dept.value;delete state._dept;save();render();}};ss.onchange=()=>{state.section=ss.value;state.profile.dept=String(ss.value).split('-')[0];delete state._dept;save();render();};}const wrap=()=>{if(typeof render!=='function'||render.__studentosWrapped)return;const original=render;const patched=function(){if(typeof state!=='undefined'){delete state._dept;if(state.section)state.profile.dept=String(state.section).split('-')[0];}const out=original.apply(this,arguments);queueMicrotask(__studentosFixSections);return out;};patched.__studentosWrapped=true;window.render=patched;};if(document.readyState==='loading'){window.addEventListener('DOMContentLoaded',()=>{wrap();__studentosFixSections();});}else{wrap();__studentosFixSections();}})();</script><script src="attendance-enhancement.js"></script>`;
      const body=text.replace('</body>',fix+'</body>');
      const h=new Headers(r.headers);h.set('content-type','text/html; charset=utf-8');h.delete('content-length');
      const out=new Response(body,{status:r.status,statusText:r.statusText,headers:h});
      caches.open(CACHE).then(c=>c.put(e.request,out.clone()));
      return out;
    }
    caches.open(CACHE).then(c=>c.put(e.request,r.clone()));
    return r;
  }).catch(()=>caches.match(e.request)));
});
