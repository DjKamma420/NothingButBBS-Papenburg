/* Angreifer-Perspektive: XSS über jedes Feld, Import, ICS, Prototype-Pollution,
   URL-Parameter. Nichts darf window.__x setzen. */
import { starte, ende, pruef, fehlerkasten } from "../browser.mjs";
const { page } = await starte();

const BOMBE = `<img src=x onerror="window.__x=(window.__x||0)+1"><script>window.__x=(window.__x||0)+1</script>`;

/* Payload in jedes Datenfeld, dann jede Ansicht zeichnen. */
await page.evaluate((b) => {
  window.__x = 0;
  cfg.klasse = b; cfg.lehrer = {[b]:b}; cfg.fachnamen = {[b]:b};
  cfg.slots = [{std:b, von:"08:00", bis:"09:30"}, {std:"3,4",von:"09:50",bis:"11:20"}];
  plan = {A:{},B:{}};
  ["MO","DI","MI","DO","FR"].forEach(t => { plan.A[t]=[{fach:b,raum:b,lk:b},null]; plan.B[t]=[null,null]; });
  eintraege = [
    {id:"e1",typ:"H",fach:b,datum:iso(new Date()),titel:b,notiz:b,erledigt:false,geloescht:false},
    {id:"e2",typ:"M",fach:b,datum:iso(new Date()),titel:b,notiz:b,bilder:[b,"data:image/png;base64,"+b],zeit:"08:00",geloescht:false},
    {id:"e3",typ:"F",fach:"",datum:iso(new Date()),titel:b,notiz:b,stunden:2,geloescht:false},
    {id:"e4",typ:"N",fach:b,datum:iso(new Date()),titel:b,notiz:b,geloescht:true,geloeschtAm:iso(new Date())},
  ];
  noten = [{id:"n1",fach:b,art:"s",wert:2,datum:iso(new Date()),titel:b,notiz:b,geloescht:false}];
  sonder = [{id:"s1",datum:iso(new Date()),slot:0,art:"vertretung",titel:b,raum:b,notiz:b,geloescht:false}];
  ferien = [{von:iso(new Date()),bis:iso(new Date()),name:b,typ:"eigen"}];
  profile = [{id:"1",name:b}];
  persistState(); normalize();
}, BOMBE);

for (const v of ["tag","kalender","zeugnis"]) {
  await page.evaluate(x => { ansicht=x; render(); }, v);
  await page.waitForTimeout(120);
}
/* Einträge samt aller Unterlisten */
for (const sub of [null,"H","K","N","E","G","M","F","archiv"]) {
  await page.evaluate(s => { ansicht="eintraege"; einSub=s; render(); }, sub);
  await page.waitForTimeout(60);
}
/* Suche über den Payload */
await page.evaluate(() => { ansicht="eintraege"; einSub=null; render(); const f=document.getElementById("suchFeld"); f.value="<img"; f.dispatchEvent(new Event("input")); });
await page.waitForTimeout(120);
/* Dialoge, die den Payload anzeigen */
await page.evaluate(() => { try{ subjectInfo(0); }catch(e){} });
await page.waitForTimeout(80);
await page.evaluate(() => { document.querySelectorAll("dialog").forEach(d=>d.close()); try{ openSettings(); }catch(e){} });
await page.waitForTimeout(150);
await page.evaluate(() => { document.querySelectorAll("dialog").forEach(d=>d.close()); try{ hilfeOeffnen(); const s=document.getElementById("hilfeSuche"); s.value="Chemie"; s.dispatchEvent(new Event("input")); }catch(e){} });
await page.waitForTimeout(150);

const x1 = await page.evaluate(() => window.__x);
pruef("kein XSS über Datenfelder (alle Ansichten/Dialoge)", x1 === 0, "window.__x=" + x1);
pruef("kein Fehlerkasten durch Payload-Daten", (await fehlerkasten(page)) === null, ((await fehlerkasten(page))||"").slice(0,80));

/* Import einer bösartigen Sicherung */
await page.evaluate(() => { document.querySelectorAll("dialog").forEach(d=>d.close()); window.__x=0; });
const boese = JSON.stringify({
  fassung:2,
  cfg:{ klasse:"<img src=x onerror=window.__x=1>", akzent:"javascript:alert(1)", slots:[{std:"1'\"><img src=x onerror=window.__x=1>",von:"08:00",bis:"09:30"}] },
  plan:{ A:{ MO:[{fach:"<script>window.__x=1<\/script>",raum:"x",lk:"y"}] } },
  eintraege:[{id:"z",typ:"M",fach:"CH",datum:"2026-01-01",titel:"<img src=x onerror=window.__x=1>",bilder:['" onerror=window.__x=1 x="', "javascript:alert(1)"]}],
  noten:[], sonder:[], ferien:[{von:"2026-01-01",bis:"x",name:"<img src=x onerror=window.__x=1>",typ:"eigen"}]
});
await page.evaluate(() => openSettings()); await page.waitForTimeout(200);
await page.fill("#sDaten", boese);
await page.click("#sLaden"); await page.waitForTimeout(400);
await page.evaluate(() => { ["tag","kalender","zeugnis","eintraege"].forEach(v=>{ansicht=v;try{render()}catch(e){}}); });
await page.waitForTimeout(200);
const x2 = await page.evaluate(() => window.__x);
pruef("kein XSS über eingelesene Sicherung", x2 === 0, "window.__x=" + x2);
const slotStd = await page.evaluate(() => cfg.slots[0] && cfg.slots[0].std);
pruef("Slot-Std beim Import auf Ziffern reduziert", slotStd === "1", String(slotStd));
const bilder = await page.evaluate(() => (eintraege.find(e=>e.typ==="M")||{}).bilder || []);
pruef("ungültige Bild-URIs beim Import verworfen", bilder.length === 0, JSON.stringify(bilder));
const akz = await page.evaluate(() => cfg.akzent);
pruef("javascript: als Akzentfarbe verworfen", /^#[0-9a-f]{6}$/i.test(akz), akz);

/* Sicherung/Wiederherstellung: eine echte Rundreise (export → import) darf
   keinen Wert verlieren. Das sichert insbesondere das JSON-Schema von
   sicherungsText() ab (Schlüssel cfg/plan/eintraege/ferien/sonder/noten),
   das später bei einer Umbenennung der gleichnamigen Variablen exakt so
   bleiben muss — siehe KOMMUNIKATION.md. */
const rundreiseVorher = await page.evaluate(() => {
  document.querySelectorAll("dialog").forEach(d=>d.close());
  cfg.klasse = "RT-Klasse"; cfg.slots = [{std:"1",von:"08:00",bis:"09:30"}];
  plan = {A:{},B:{}};
  ["MO","DI","MI","DO","FR"].forEach(t => { plan.A[t]=[{fach:"RT",raum:"R1",lk:"L1"}]; plan.B[t]=[null]; });
  eintraege = [{id:"rt1",typ:"H",fach:"RT",datum:iso(new Date()),titel:"Rundreise-Test",notiz:"x",erledigt:false,geloescht:false}];
  ferien = [{von:iso(new Date()),bis:iso(new Date()),name:"RT-Ferien",typ:"eigen"}];
  sonder = [{id:"rt2",datum:iso(new Date()),slot:0,art:"vertretung",titel:"RT-Sonder",raum:"R2",notiz:"y",geloescht:false}];
  noten = [{id:"rt3",fach:"RT",art:"s",wert:2,datum:iso(new Date()),titel:"RT-Note",notiz:"z",geloescht:false}];
  persistState(); normalize();
  return sicherungsText();
});
await page.evaluate(() => {
  cfg.klasse = "ANDERS"; plan = {A:{},B:{}}; eintraege = []; ferien = []; sonder = []; noten = [];
  persistState();
});
await page.evaluate(() => { document.querySelectorAll("dialog").forEach(d=>d.close()); openSettings(); });
await page.waitForTimeout(200);
await page.fill("#sDaten", rundreiseVorher);
await page.click("#sLaden"); await page.waitForTimeout(400);
const rundreiseNachher = await page.evaluate(() => ({
  klasse: cfg.klasse,
  fach: (plan.A.MO && plan.A.MO[0] || {}).fach,
  eintragTitel: (eintraege.find(e=>e.id==="rt1")||{}).titel,
  ferienName: (ferien[0]||{}).name,
  sonderTitel: (sonder.find(s=>s.id==="rt2")||{}).titel,
  noteTitel: (noten.find(n=>n.id==="rt3")||{}).titel,
}));
pruef("Rundreise: cfg übersteht export/import", rundreiseNachher.klasse === "RT-Klasse", rundreiseNachher.klasse);
pruef("Rundreise: plan übersteht export/import", rundreiseNachher.fach === "RT", JSON.stringify(rundreiseNachher.fach));
pruef("Rundreise: eintraege übersteht export/import", rundreiseNachher.eintragTitel === "Rundreise-Test", rundreiseNachher.eintragTitel);
pruef("Rundreise: ferien übersteht export/import", rundreiseNachher.ferienName === "RT-Ferien", rundreiseNachher.ferienName);
pruef("Rundreise: sonder übersteht export/import", rundreiseNachher.sonderTitel === "RT-Sonder", rundreiseNachher.sonderTitel);
pruef("Rundreise: noten übersteht export/import", rundreiseNachher.noteTitel === "RT-Note", rundreiseNachher.noteTitel);
/* Aufräumen, damit die Rundreise-Daten (insbesondere „sonder") nicht in
   die folgenden Prüfungen hineinwirken — allen voran den ICS-Export. */
await page.evaluate(() => {
  document.querySelectorAll("dialog").forEach(d=>d.close());
  eintraege = []; ferien = []; sonder = []; noten = []; persistState();
});

/* Prototype-Pollution über Import */
const proto = await page.evaluate(() => {
  const vorher = ({}).polluted;
  const d = JSON.parse('{"cfg":{"__proto__":{"polluted":"JA"},"lehrer":{"__proto__":{"polluted2":"JA"}}}}');
  try { sanitizePackage(d); } catch(e){}
  return { global: ({}).polluted, global2: ({}).polluted2, vorher };
});
pruef("keine Prototype-Pollution über Import", proto.global === undefined && proto.global2 === undefined, JSON.stringify(proto));

/* URL-Parameter: nur Whitelist */
const url = await page.evaluate(() => {
  const test = (q) => { try { const p=new URLSearchParams(q); const a=p.get("ansicht"); return (a && ANSICHTEN.includes(a)); } catch(e){ return "err"; } };
  return { boese: test("ansicht=<script>"), gut: test("ansicht=kalender") };
});
pruef("URL-Parameter ansicht nur aus Whitelist", url.boese === false && url.gut === true, JSON.stringify(url));

/* ICS-Injektion: Zeilenumbruch/Formel im Titel darf keine neue VEVENT/Formel erzeugen */
const ics = await page.evaluate(() => {
  eintraege = [{id:"i1",typ:"K",fach:"MA",datum:iso(plusTage(new Date(),1)),
    titel:"Hallo\r\nBEGIN:VEVENT\r\nSUMMARY:INJ\r\n=1+2+cmd|' /C calc'!A0",notiz:"x",erledigt:false,geloescht:false}];
  persistState(); return buildIcs();
});
/* Physische Zeilen zählen: eine Injektion erzeugt eine Zeile, die exakt
   BEGIN:VEVENT lautet; Fortsetzungszeilen beginnen mit Leerzeichen. */
const zeilen = ics.split("\r\n");
const echteEvents = zeilen.filter(z => z === "BEGIN:VEVENT").length;
pruef("ICS: kein zusätzliches VEVENT durch Zeilenumbruch im Titel", echteEvents === 1, echteEvents + " echte VEVENT-Zeilen");
pruef("ICS: kein aus dem Wert ausgebrochenes SUMMARY", zeilen.filter(z => z === "SUMMARY:INJ").length === 0);

pruef("kein Fehlerkasten am Ende", (await fehlerkasten(page)) === null, ((await fehlerkasten(page))||"").slice(0,80));
await ende();
