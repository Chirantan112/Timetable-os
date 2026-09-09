const CACHE='studentos-v3';
const ASSETS=['./','./index.html','./data.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(async r=>{
    const url=new URL(e.request.url);
    if(url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')){
      const text=await r.clone().text();
      const fix=`<script>(function(){function __studentosFixSections(){const dept=document.getElementById('deptSel'),ss=document.getElementById('sectionSel');if(!dept||!ss)return;dept.value=(state.section||'CSE-A').split('-')[0];ss.innerHTML=Object.entries(SECTIONS).filter(([k])=>k.startsWith(dept.value+'-')).map(([k,v])=>'<option value="'+k+'" '+(state.section===k?'selected':'')+'>Section '+k.split('-')[1]+' — '+v.program+'</option>').join('');dept.onchange=()=>{const first=Object.keys(SECTIONS).find(k=>k.startsWith(dept.value+'-'));if(first){state.section=first;state.profile.dept=dept.value;save();render();}};ss.onchange=()=>{state.section=ss.value;state.profile.dept=dept.value;save();render();};}window.addEventListener('load',__studentosFixSections);})();</script>`;
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
