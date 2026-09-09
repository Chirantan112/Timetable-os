/* StudentOS attendance UX enhancement
 * Adds low-friction post-class attendance prompts without changing the
 * existing Present / Absent / Not Recorded data model.
 */
(function(){
  const REMINDER_KEY='studentos-attendance-reminder-mode';
  const MODES={every:'After every class',daily:'End of day',off:'Off'};

  function getMode(){return localStorage.getItem(REMINDER_KEY)||'every';}
  function setMode(v){localStorage.setItem(REMINDER_KEY,v);}

  function attendanceKeyFor(section,day,e){return `${section}|${day}|${e.time}|${e.code}`;}
  function todayName(){return new Date().toLocaleDateString('en-US',{weekday:'long'});}
  function minsNow(){const d=new Date();return d.getHours()*60+d.getMinutes();}
  function parseRange(range){const [a,b]=range.split('–');const p=s=>{const [h,m]=s.split(':').map(Number);return h*60+m};return [p(a),p(b)];}

  function injectPromptStyles(){
    if(document.getElementById('attendanceEnhancementStyles'))return;
    const style=document.createElement('style');style.id='attendanceEnhancementStyles';
    style.textContent=`
      .att-reminder{position:fixed;left:50%;bottom:78px;transform:translateX(-50%) translateY(20px);width:min(560px,calc(100% - 24px));z-index:100;background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:20px;box-shadow:0 18px 60px rgba(16,24,40,.18);padding:16px;opacity:0;pointer-events:none;transition:.25s}
      .att-reminder.show{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}
      .att-reminder-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
      .att-reminder-title{font-weight:900;font-size:15px}
      .att-reminder-meta{color:var(--muted);font-size:12px;margin-top:3px}
      .att-reminder-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:13px}
      .att-reminder-actions button{padding:10px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);color:var(--text);font-weight:900}
      .att-reminder-actions .present{color:var(--good)}
      .att-reminder-actions .absent{color:var(--bad)}
      .att-reminder-actions .skip{color:var(--muted)}
      .att-pending-card{margin-bottom:14px;border:1px solid var(--line);background:var(--panel2);border-radius:18px;padding:14px}
      .att-pending-head{display:flex;justify-content:space-between;gap:10px;align-items:center}
      .att-pending-title{font-weight:900}
      .att-pending-sub{font-size:11px;color:var(--muted);margin-top:3px}
      .att-pending-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
      .att-pending-actions button{padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);font-size:11px;font-weight:900}
      .att-pending-actions .present{color:var(--good)} .att-pending-actions .absent{color:var(--bad)}
      .att-mode-select{width:100%;margin-top:8px;padding:10px;border:1px solid var(--line);border-radius:11px;background:var(--panel2);color:var(--text)}
      @media(max-width:520px){.att-reminder-actions{grid-template-columns:1fr 1fr}.att-reminder-actions .skip{grid-column:1/-1}}
    `;document.head.appendChild(style);
  }

  function currentSectionEntries(){
    if(typeof state==='undefined'||typeof TIMETABLE==='undefined')return [];
    const day=todayName();
    return (TIMETABLE[state.section]?.[day]||[]).slice().sort((a,b)=>parseRange(a.time)[0]-parseRange(b.time)[0]);
  }

  function pendingToday(){
    const day=todayName(), es=currentSectionEntries();
    if(typeof state==='undefined')return [];
    return es.filter(e=>{
      const [start,end]=parseRange(e.time), key=attendanceKeyFor(state.section,day,e);
      return minsNow()>=end && !state.attendance?.[key];
    });
  }

  function record(item,value){
    state.day=todayName();
    state.attendance=state.attendance||{};
    state.attendance[attendanceKeyFor(state.section,state.day,item)]=value;
    save();
    hideReminder();
    if(typeof render==='function')render();
    setTimeout(checkReminder,80);
  }

  function hideReminder(){document.getElementById('attReminder')?.remove();}

  function showReminder(item){
    if(document.getElementById('attReminder'))return;
    const el=document.createElement('div');el.id='attReminder';el.className='att-reminder';
    el.innerHTML=`<div class="att-reminder-top"><div><div class="att-reminder-title">${item.subject} just ended</div><div class="att-reminder-meta">${item.time} · Tap once to update your personal attendance</div></div><button class="icon-btn" id="attReminderClose" aria-label="Close">✕</button></div><div class="att-reminder-actions"><button class="present" id="attPresent">✓ Present</button><button class="absent" id="attAbsent">✕ Absent</button><button class="skip" id="attSkip">Skip for now</button></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    document.getElementById('attPresent').onclick=()=>record(item,'present');
    document.getElementById('attAbsent').onclick=()=>record(item,'absent');
    document.getElementById('attSkip').onclick=()=>{hideReminder();};
    document.getElementById('attReminderClose').onclick=()=>hideReminder();
  }

  function checkReminder(){
    if(getMode()!=='every'||typeof state==='undefined')return;
    const pending=pendingToday();
    if(!pending.length)return;
    const item=pending[pending.length-1];
    const marker=`${state.section}|${todayName()}|${item.time}|${item.code}`;
    if(sessionStorage.getItem('studentos-att-reminded')===marker)return;
    sessionStorage.setItem('studentos-att-reminded',marker);
    showReminder(item);
  }

  function patchHome(){
    if(typeof state==='undefined')return;
    if(state.view!=='home')return;
    const shell=document.querySelector('.shell');
    if(!shell)return;
    const marker='att-pending-container';
    let old=document.getElementById(marker); if(old)old.remove();
    const pending=pendingToday();
    if(!pending.length)return;
    const holder=document.createElement('div');holder.id=marker;
    holder.innerHTML=`<div class="section-title"><div><h2>Attendance to record</h2><p>One tap per completed class · skipped classes stay Not Recorded</p></div></div>`;
    const list=document.createElement('div');list.className='att-pending-card';
    list.innerHTML=pending.map((item,i)=>`<div ${i?'style="border-top:1px solid var(--line);padding-top:12px;margin-top:12px"':''}><div class="att-pending-head"><div><div class="att-pending-title">${item.subject}</div><div class="att-pending-sub">${item.time} · ${item.room||'Room not specified'}</div></div><span class="badge orange">NOT RECORDED</span></div><div class="att-pending-actions"><button class="present" data-att-p="${encodeURIComponent(JSON.stringify(item))}">✓ Present</button><button class="absent" data-att-a="${encodeURIComponent(JSON.stringify(item))}">✕ Absent</button><button data-att-s="${encodeURIComponent(JSON.stringify(item))}">Skip</button></div></div>`).join('');
    holder.appendChild(list);
    const hero=shell.querySelector('.status-grid');
    if(hero)hero.insertAdjacentElement('afterend',holder); else shell.prepend(holder);
    holder.querySelectorAll('[data-att-p]').forEach(b=>b.onclick=()=>record(JSON.parse(decodeURIComponent(b.dataset.attP)),'present'));
    holder.querySelectorAll('[data-att-a]').forEach(b=>b.onclick=()=>record(JSON.parse(decodeURIComponent(b.dataset.attA)),'absent'));
    holder.querySelectorAll('[data-att-s]').forEach(b=>b.onclick=()=>b.closest('div[style]')?.remove());
  }

  function patchSettings(){
    if(typeof state==='undefined'||state.view!=='settings')return;
    const settings=document.querySelector('.settings-row')?.parentElement;
    if(!settings||document.getElementById('attendanceReminderSetting'))return;
    const row=document.createElement('div');row.id='attendanceReminderSetting';row.className='settings-row';
    row.innerHTML=`<div><b>Attendance reminders</b><div class="muted small">Reduce effort after each class</div></div><select class="att-mode-select" style="max-width:220px" id="attModeSelect">${Object.entries(MODES).map(([k,v])=>`<option value="${k}" ${getMode()===k?'selected':''}>${v}</option>`).join('')}</select>`;
    settings.appendChild(row);
    row.querySelector('select').onchange=e=>{setMode(e.target.value);toast('Attendance reminder preference saved');};
  }

  function enhance(){
    injectPromptStyles();
    patchHome();
    patchSettings();
    setTimeout(checkReminder,100);
  }

  const originalSetInterval=window.setInterval;
  originalSetInterval(enhance,30000);
  window.addEventListener('load',enhance);
  enhance();
})();
