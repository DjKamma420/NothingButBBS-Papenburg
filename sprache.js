/* Phase 2: DE/EN UI language layer. Keeps stored timetable data untouched. */
(function(){
  'use strict';
  const KEY='appLanguage';
  const dict={
    'Heute':'Today','Wischen wechselt die Ansicht':'Swipe to change view','Kalender':'Calendar','Einträge':'Entries','Zeugnis':'Report Card','Einstellungen':'Settings','Speichern':'Save','Zurück':'Back','Suche':'Search','Fach':'Subject','Raum':'Room','Lehrkraft':'Teacher','Lehrer':'Teacher','Hausaufgabe':'Homework','Hausaufgaben':'Homework','Klausur':'Exam','Klausuren':'Exams','Notiz':'Note','Notizen':'Notes','Ereignis':'Event','Ereignisse':'Events','Note':'Grade','Merkblatt':'Handout','Merkblätter':'Handouts','Archiv':'Archive','Termin':'Appointment','Fällt aus':'Cancelled','Vertretung':'Substitute','Sonstiges Ereignis':'Other event','Fach-Info':'Subject info','Fachnamen':'Subject names','Lehrkräfte':'Teachers','Stundenraster':'Lesson schedule','Wochenwechsel':'Week rotation','Noten':'Grades','Erinnerungen':'Reminders','Ferien und Feiertage':'Holidays and public holidays','Sicherung':'Backup','Speicher':'Storage','Schule':'School','Klasse':'Class','Bundesland':'State','Schrift':'Font','System':'System','Technisch':'Technical','Serif':'Serif','Beim Öffnen':'On open','immer zur Profilauswahl':'Always choose profile','nur bei mehreren Profilen':'Only with multiple profiles','gleich in den Plan':'Open plan directly','A- und B-Woche getrennt führen':'Keep A and B weeks separately','mündlich %':'Oral %','Stunden je Schultag':'Lessons per school day','Gelöschtes aufbewahren':'Keep deleted items','für immer':'Forever','30 Tage':'30 days','3 Monate':'3 months','6 Monate':'6 months','1 Jahr':'1 year','Reihenfolge im Einträge-Menü':'Order in entries menu','Reihenfolge der Fächer':'Subject order','Gilt für das Zeugnis.':'Applies to the report card.','Beim Öffnen an Klausuren und Hausaufgaben erinnern':'Remind about exams and homework on open','Benachrichtigungen erlauben':'Allow notifications','Kalender-Export (.ics)':'Calendar export (.ics)','Ferien laden':'Load holidays','Entfernen':'Remove','Plan einfügen':'Paste timetable','Als Datei sichern':'Save as file','Alle Profile sichern':'Save all profiles','Datei einlesen':'Load file','Teilen':'Share','Text übernehmen':'Apply text','Alles löschen':'Delete everything','Nach Update suchen':'Check for updates','BBS Papenburg (Blöcke)':'BBS Papenburg (blocks)','4 Blöcke à 90 min':'4 blocks of 90 min','8 Einzelstunden':'8 individual lessons','+ Zeile':'+ Row','+ Eintrag':'+ Entry','Tag':'Day','Monat zurück':'Previous month','Monat vor':'Next month','Tag markieren':'Mark day','Bezeichnung':'Description','bis einschließlich':'through and including','Freier Tag':'Day off','Beweglicher Ferientag':'Floating holiday','Bild hinzufügen':'Add image','Erledigt':'Done','Fertig':'Done','Bearbeiten':'Edit','Details':'Details','Was':'What','Aufgabe':'Task','Schulschluss':'School ends','Sicherung fällig':'Backup due','Jetzt sichern':'Back up now','Heute nicht':'Not today','frei':'free','Pause':'Break','weiter um':'continues at','Schule aus':'School over','Stand heute':'As of today','Nur eine Schätzung. Die App gewichtet alle Noten einer Art gleich; Lehrkräfte rechnen oft anders. Keine amtliche Auskunft.':'Estimate only. The app weights grades of each type equally; teachers may calculate differently. Not official information.','Trag zuerst deinen Stundenplan ein — dann erscheinen hier die Fächer.':'Enter your timetable first — subjects will then appear here.','Nichts an diesem Tag.':'Nothing on this day.'
  };
  const original=window.__languageOriginals||new WeakMap(); window.__languageOriginals=original;
  function translate(root){
    if(!root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT), nodes=[]; let n;
    while(n=walker.nextNode()) nodes.push(n);
    nodes.forEach(t=>{
      const p=t.parentElement; if(!p || ['SCRIPT','STYLE','TEXTAREA'].includes(p.tagName)) return;
      let o=original.get(t); if(o===undefined){o=t.nodeValue; original.set(t,o);}
      const trimmed=o.trim(); if(!trimmed) return;
      const tr=dict[trimmed]; if(tr) t.nodeValue=o.replace(trimmed,tr);
    });
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el=>['placeholder','aria-label','title'].forEach(a=>{const v=el.getAttribute(a); if(v && dict[v]) el.setAttribute(a,dict[v]);}));
  }
  function setLanguage(lang){
    localStorage.setItem(KEY,lang); document.documentElement.lang=lang;
    if(lang==='de') location.reload(); else translate(document.body);
  }
  function addControl(){
    if(!document.body || document.getElementById('sSprache')) return;
    const settings=document.getElementById('dlgEinst'); if(!settings) return;
    const anchor=settings.querySelector('.eyebrow'); if(!anchor) return;
    const wrap=document.createElement('label'); wrap.style.marginTop='14px';
    wrap.innerHTML='<span>Language / Sprache</span><select id="sSprache"><option value="de">Deutsch</option><option value="en">English</option></select>';
    anchor.parentNode.insertBefore(wrap,anchor);
    const s=wrap.querySelector('select'); s.value=localStorage.getItem(KEY)||'de'; s.addEventListener('change',()=>setLanguage(s.value));
  }
  function boot(){
    addControl();
    if((localStorage.getItem(KEY)||'de')==='en') translate(document.body);
    new MutationObserver(m=>{if((localStorage.getItem(KEY)||'de')!=='en') return; m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1) translate(n);}));}).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
