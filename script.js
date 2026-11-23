"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Inhalte ---------- */
const TOPICS = [
  { id: "iaas", icon: "☁️", title: "IaaS", short: "Infrastructure as a Service – Server, Speicher, Netz aus der Cloud.",
    html: `<p><b>IaaS (Infrastructure as a Service)</b> liefert virtualisierte Rechenleistung, Speicher und Netzwerk über das Internet. Du mietest Ressourcen nach Bedarf und bezahlst nur, was du nutzt (<i>Pay-as-you-go</i>).</p>
    <table><tr><th>Modell</th><th>Du verwaltest</th><th>Beispiel</th></tr>
    <tr><td>IaaS</td><td>OS, Runtime, Anwendungen, Daten</td><td>AWS EC2</td></tr>
    <tr><td>PaaS</td><td>Anwendungen, Daten</td><td>Elastic Beanstalk</td></tr>
    <tr><td>SaaS</td><td>nur Nutzung</td><td>Microsoft 365</td></tr></table>
    <ul><li>Schnell verfügbar &amp; skalierbar (Elastizität)</li><li>Keine eigene Hardware nötig</li><li>Anbieter: Hardware, Rechenzentrum, Virtualisierung</li></ul>
    <div class="note"><b>Shared Responsibility:</b> Der Anbieter ist für die Sicherheit <i>der</i> Cloud zuständig, der Kunde für die Sicherheit <i>in</i> der Cloud (OS-Updates, Firewall-Regeln, Keys).</div>` },
  { id: "vm", icon: "🖥️", title: "Virtuelle Maschine", short: "EC2-Instanzen, AMI, Instanztyp, Hypervisor.",
    html: `<p>Eine <b>virtuelle Maschine (VM)</b> ist ein per Software simulierter Computer. Ein <b>Hypervisor</b> teilt die physische Hardware auf mehrere VMs auf. Bei AWS heisst der Dienst <b>EC2</b> (Elastic Compute Cloud).</p>
    <ul><li><b>AMI</b> (Amazon Machine Image): Vorlage mit Betriebssystem, z. B. Ubuntu</li>
    <li><b>Instanztyp</b>: bestimmt vCPU und RAM (z. B. <code>t3.micro</code>)</li>
    <li><b>Öffentliche IP</b>: Adresse, unter der die VM im Internet erreichbar ist</li>
    <li><b>Volume (EBS)</b>: virtuelle Festplatte</li></ul>
    <div class="note">Beim Stoppen und Starten einer Instanz kann sich die öffentliche IP ändern – eine <b>Elastic IP</b> bleibt fix.</div>` },
  { id: "ssh", icon: "🔑", title: "SSH-Keypairs", short: "Sicherer Fernzugriff mit öffentlichem und privatem Schlüssel.",
    html: `<p><b>SSH (Secure Shell)</b> ermöglicht verschlüsselten Fernzugriff auf Server (Port <b>22</b>). Statt Passwort wird ein <b>Keypair</b> verwendet (asymmetrische Kryptografie).</p>
    <ul><li><b>Public Key</b>: liegt auf dem Server (<code>~/.ssh/authorized_keys</code>), darf geteilt werden</li>
    <li><b>Private Key</b> (<code>.pem</code>): bleibt geheim beim Benutzer – nie weitergeben!</li></ul>
<pre>chmod 400 mein-key.pem
ssh -i mein-key.pem ubuntu@3.75.12.34</pre>
    <div class="note">Ist der private Schlüssel zu offen berechtigt, verweigert SSH die Verbindung («UNPROTECTED PRIVATE KEY FILE»). Lösung: <code>chmod 400</code>.</div>
    <p>Standardbenutzer: Ubuntu → <code>ubuntu</code>, Amazon Linux → <code>ec2-user</code>, Debian → <code>admin</code>.</p>` },
  { id: "cloudinit", icon: "⚙️", title: "Cloud-Init", short: "Automatische Konfiguration beim ersten Start der VM.",
    html: `<p><b>Cloud-Init</b> ist der Standard, um Cloud-VMs beim <b>ersten Start</b> automatisch zu konfigurieren. Das Skript wird als <b>User Data</b> beim Erstellen der Instanz übergeben.</p>
<pre>#cloud-config
package_update: true
packages:
  - nginx
runcmd:
  - systemctl enable --now nginx
  - echo "&lt;h1&gt;Hallo&lt;/h1&gt;" &gt; /var/www/html/index.html</pre>
    <ul><li>Erste Zeile muss <code>#cloud-config</code> sein</li><li><code>packages</code>: Software installieren</li><li><code>runcmd</code>: Befehle ausführen (als root)</li><li><code>users</code>: Benutzer und SSH-Keys anlegen</li><li>Läuft nur einmal beim ersten Boot</li></ul>
    <div class="note">Vorteil: reproduzierbar, automatisiert, keine manuelle Installation per SSH nötig (Infrastructure as Code).</div>` },
  { id: "sg", icon: "🛡️", title: "Security Groups", short: "Virtuelle Firewall für Instanzen.",
    html: `<p>Eine <b>Security Group</b> ist eine virtuelle Firewall auf Instanzebene. Sie erlaubt nur ausdrücklich freigegebenen Datenverkehr.</p>
    <table><tr><th>Port</th><th>Protokoll</th><th>Zweck</th></tr><tr><td>22</td><td>TCP</td><td>SSH</td></tr><tr><td>80</td><td>TCP</td><td>HTTP</td></tr><tr><td>443</td><td>TCP</td><td>HTTPS</td></tr></table>
    <ul><li><b>Inbound</b>: eingehend (standardmässig alles blockiert)</li><li><b>Outbound</b>: ausgehend (standardmässig alles erlaubt)</li><li><b>Stateful</b>: Antworten auf erlaubte Anfragen sind automatisch erlaubt</li><li>Nur <i>Allow</i>-Regeln, keine Deny-Regeln</li></ul>
    <div class="note">Sicherheitstipp: SSH (Port 22) wenn möglich nur von der eigenen IP erlauben statt <code>0.0.0.0/0</code>.</div>` },
  { id: "nginx", icon: "🌐", title: "nginx Webserver", short: "Webseite ausliefern auf der VM.",
    html: `<p><b>nginx</b> (gesprochen «engine-x») ist ein schneller Webserver und Reverse Proxy. Er liefert statische Dateien (HTML, CSS, JS) per HTTP aus.</p>
<pre>sudo apt update
sudo apt install nginx -y
sudo systemctl enable --now nginx
sudo cp -r ./Repetition-Ref-Cards/* /var/www/html/</pre>
    <ul><li>Standard-Webroot: <code>/var/www/html</code></li><li>Konfiguration: <code>/etc/nginx/</code></li><li>Status: <code>systemctl status nginx</code></li><li>Test: <code>http://&lt;öffentliche-IP&gt;</code> im Browser (Port 80 in Security Group freigeben!)</li></ul>` },
  { id: "ref", icon: "🗂️", title: "Architecture Ref. Cards", short: "Kompakte Übersicht der Architektur-Bausteine.",
    html: `<p><b>Architecture Ref. Cards</b> fassen Architekturthemen kompakt zusammen: Was ist es, wofür brauche ich es, worauf muss ich achten.</p>
    <ul><li>Zusammenhang: Internet → Security Group → EC2-Instanz (nginx) → Webseite</li><li>Zugriff: SSH-Keypair; Automatisierung: Cloud-Init</li><li>Verantwortung: Anbieter (Infrastruktur) vs. Kunde (OS &amp; Apps)</li></ul>
    <div class="note">Ablauf der Gesamtaufgabe: Webseite erstellen → VM auf AWS starten → per SSH/Cloud-Init nginx installieren → Seite hochladen → IP teilen (Virtual Gallery Walk).</div>` }
];

const CARDS = [
  ["IaaS", "Wofür steht IaaS?", "Infrastructure as a Service – virtualisierte Infrastruktur (Server, Speicher, Netzwerk) aus der Cloud."],
  ["IaaS", "Wer verwaltet bei IaaS das Betriebssystem?", "Der Kunde."],
  ["IaaS", "Was bedeutet Pay-as-you-go?", "Man bezahlt nur die tatsächlich genutzten Ressourcen."],
  ["VM", "Wie heisst der VM-Dienst von AWS?", "EC2 (Elastic Compute Cloud)."],
  ["VM", "Was ist ein AMI?", "Amazon Machine Image – Vorlage mit Betriebssystem für eine Instanz."],
  ["VM", "Was macht ein Hypervisor?", "Er teilt die physische Hardware auf mehrere virtuelle Maschinen auf."],
  ["VM", "Was bestimmt der Instanztyp?", "Die Ressourcen: vCPU, RAM, Netzwerkleistung (z. B. t3.micro)."],
  ["SSH", "Welcher Port wird für SSH verwendet?", "Port 22 (TCP)."],
  ["SSH", "Welcher Schlüssel bleibt geheim?", "Der private Schlüssel (Private Key, .pem)."],
  ["SSH", "Wo liegt der Public Key auf dem Server?", "In ~/.ssh/authorized_keys."],
  ["SSH", "Befehl, um den Key zu schützen?", "chmod 400 mein-key.pem"],
  ["SSH", "SSH-Verbindung mit Key aufbauen?", "ssh -i mein-key.pem ubuntu@<IP-Adresse>"],
  ["Cloud-Init", "Was ist Cloud-Init?", "Ein Tool, das VMs beim ersten Start automatisch konfiguriert (User Data)."],
  ["Cloud-Init", "Wie beginnt eine Cloud-Config-Datei?", "Mit der Zeile #cloud-config"],
  ["Cloud-Init", "Wofür dient 'runcmd'?", "Zum Ausführen von Shell-Befehlen beim ersten Start."],
  ["Cloud-Init", "Wofür dient 'packages'?", "Zum Installieren von Software-Paketen."],
  ["Security", "Was ist eine Security Group?", "Eine virtuelle Firewall auf Instanzebene mit Inbound- und Outbound-Regeln."],
  ["Security", "Welcher Port für HTTP?", "Port 80 (HTTPS: 443)."],
  ["Security", "Was heisst «stateful»?", "Antworten auf erlaubte Verbindungen sind automatisch erlaubt."],
  ["nginx", "Standard-Webroot von nginx unter Ubuntu?", "/var/www/html"],
  ["nginx", "Wie startet und aktiviert man nginx?", "sudo systemctl enable --now nginx"],
  ["Cloud", "Was bedeutet Shared Responsibility?", "Anbieter: Sicherheit der Cloud. Kunde: Sicherheit in der Cloud."]
];

const QUIZ = [
  { q: "Was ist bei IaaS Aufgabe des Kunden?", o: ["Wartung der Rechenzentren", "Installation und Updates des Betriebssystems", "Austausch defekter Festplatten", "Betrieb des Hypervisors"], a: 1, e: "Bei IaaS verwaltet der Kunde OS, Anwendungen und Daten; der Anbieter die Hardware und Virtualisierung." },
  { q: "Welches ist ein typisches IaaS-Angebot?", o: ["Microsoft 365", "AWS EC2", "Gmail", "Salesforce"], a: 1, e: "EC2 stellt virtuelle Server (Infrastruktur) bereit. Die anderen sind SaaS." },
  { q: "Was ist ein AMI?", o: ["Ein SSH-Schlüssel", "Eine Firewall-Regel", "Eine Vorlage für das Betriebssystem einer Instanz", "Ein Netzwerkadapter"], a: 2, e: "Ein Amazon Machine Image ist die Vorlage, aus der eine Instanz gestartet wird." },
  { q: "Welche Komponente führt mehrere VMs auf einem physischen Host aus?", o: ["Router", "Hypervisor", "Load Balancer", "Container Registry"], a: 1, e: "Der Hypervisor virtualisiert die Hardware und verteilt sie auf VMs." },
  { q: "Welcher Schlüssel darf NIE weitergegeben werden?", o: ["Public Key", "Private Key", "Beide", "Keiner"], a: 1, e: "Der Private Key beweist deine Identität. Der Public Key darf frei geteilt werden." },
  { q: "Welchen Port nutzt SSH standardmässig?", o: ["21", "22", "80", "443"], a: 1, e: "SSH nutzt TCP-Port 22. 80 = HTTP, 443 = HTTPS, 21 = FTP." },
  { q: "SSH meldet «UNPROTECTED PRIVATE KEY FILE». Was ist die Lösung?", o: ["chmod 400 key.pem", "Instanz neu starten", "Port 80 öffnen", "nginx installieren"], a: 0, e: "Die Schlüsseldatei darf nur vom Besitzer gelesen werden: chmod 400." },
  { q: "Wann wird Cloud-Init normalerweise ausgeführt?", o: ["Bei jedem HTTP-Request", "Beim ersten Start der Instanz", "Jede Stunde", "Nur manuell per SSH"], a: 1, e: "User Data wird beim ersten Boot verarbeitet." },
  { q: "Welche erste Zeile braucht eine Cloud-Config?", o: ["#!/bin/bash", "#cloud-config", "---", "<cloud>"], a: 1, e: "#cloud-config markiert die Datei als Cloud-Init-YAML. #!/bin/bash wäre ein Shell-Skript." },
  { q: "Wo übergibt man das Cloud-Init-Skript bei AWS?", o: ["Key Pair", "Security Group", "User Data (Erweiterte Details)", "Elastic IP"], a: 2, e: "Im Launch-Assistenten unter «Erweiterte Details» im Feld User Data." },
  { q: "Warum ist die Webseite nicht erreichbar, obwohl nginx läuft?", o: ["Port 80 ist in der Security Group nicht offen", "Der Private Key fehlt", "Der Hypervisor ist aus", "Cloud-Init ist aktiv"], a: 0, e: "Ohne Inbound-Regel für HTTP (Port 80) blockiert die Security Group den Zugriff." },
  { q: "Wie verhält sich eine Security Group standardmässig bei eingehendem Verkehr?", o: ["Alles erlaubt", "Alles blockiert", "Nur HTTP erlaubt", "Nur SSH erlaubt"], a: 1, e: "Inbound ist standardmässig komplett blockiert, Regeln erlauben gezielt Verkehr." },
  { q: "Wo liegt bei Ubuntu/nginx standardmässig die Startseite?", o: ["/etc/nginx", "/var/www/html", "/home/ubuntu", "/usr/bin"], a: 1, e: "Der Standard-Webroot ist /var/www/html." },
  { q: "Welcher SSH-Befehl ist korrekt?", o: ["ssh ubuntu@IP key.pem", "ssh -i key.pem ubuntu@IP", "ssh key.pem -u ubuntu IP", "connect -key key.pem IP"], a: 1, e: "Mit -i wird die Identitätsdatei (Private Key) angegeben, dann benutzer@host." },
  { q: "Was bedeutet Shared Responsibility?", o: ["Der Anbieter ist für alles verantwortlich", "Der Kunde ist für alles verantwortlich", "Verantwortung wird zwischen Anbieter und Kunde geteilt", "Mehrere Kunden teilen sich eine VM"], a: 2, e: "Anbieter: Sicherheit der Cloud. Kunde: Sicherheit in der Cloud." }
];

const GLOSSARY = [
  ["AMI", "Amazon Machine Image – Vorlage für eine EC2-Instanz."],
  ["Cloud-Init", "Tool zur automatischen Erstkonfiguration von Cloud-VMs."],
  ["EC2", "Elastic Compute Cloud – virtuelle Server bei AWS."],
  ["EBS", "Elastic Block Store – virtuelle Festplatten für EC2."],
  ["Elastic IP", "Feste öffentliche IPv4-Adresse, die sich nicht ändert."],
  ["Hypervisor", "Software, die Hardware auf mehrere VMs aufteilt."],
  ["IaaS", "Infrastructure as a Service."],
  ["Inbound / Outbound", "Eingehender / ausgehender Netzwerkverkehr."],
  ["Instanztyp", "Grösse einer VM (vCPU, RAM), z. B. t3.micro."],
  ["nginx", "Webserver und Reverse Proxy."],
  ["PaaS", "Platform as a Service – Plattform zum Betrieb von Anwendungen."],
  ["Private Key", "Geheimer Teil des Keypairs, bleibt beim Benutzer."],
  ["Public Key", "Öffentlicher Teil des Keypairs, liegt auf dem Server."],
  ["SaaS", "Software as a Service – fertige Anwendung."],
  ["Security Group", "Virtuelle Firewall für Instanzen."],
  ["Shared Responsibility", "Geteilte Verantwortung zwischen Anbieter und Kunde."],
  ["SSH", "Secure Shell – verschlüsselter Fernzugriff (Port 22)."],
  ["User Data", "Skript/Konfiguration, die beim ersten Start ausgeführt wird."],
  ["VM", "Virtuelle Maschine – simulierter Computer."],
  ["YAML", "Einrückungsbasiertes Datenformat, genutzt von Cloud-Config."]
];

/* ---------- Zustand ---------- */
const KEY = "m346-repetition";
let state = Object.assign({ quiz: 0, known: [], tasks: [] }, JSON.parse(localStorage.getItem(KEY) || "{}"));
const save = () => { localStorage.setItem(KEY, JSON.stringify(state)); updateStats(); };
const TASK_COUNT = 7;
function updateStats() {
  $("#statQuiz").textContent = state.quiz + "/" + QUIZ.length;
  $("#statCards").textContent = state.known.length + "/" + CARDS.length;
  $("#statTasks").textContent = state.tasks.length + "/" + TASK_COUNT;
  const pct = (state.quiz / QUIZ.length + state.known.length / CARDS.length + state.tasks.length / TASK_COUNT) / 3 * 100;
  $("#globalBar").style.width = pct + "%";
}
function markTask(id, ok, el, msg) {
  const fb = $(".feedback", el);
  fb.className = "feedback " + (ok ? "good" : "bad");
  fb.textContent = msg;
  if (ok) { el.classList.add("done"); if (!state.tasks.includes(id)) { state.tasks.push(id); save(); } }
}

/* ---------- Navigation ---------- */
function show(tab) {
  $$(".tab").forEach(t => t.classList.toggle("active", t.id === tab));
  $$("#nav button").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  window.scrollTo(0, 0);
}
$$("#nav button").forEach(b => b.onclick = () => show(b.dataset.tab));

/* ---------- Übersicht & Erklärungen ---------- */
$("#topicGrid").innerHTML = TOPICS.map(t => `<div class="tcard" data-id="${t.id}"><div class="ic">${t.icon}</div><h3>${t.title}</h3><p>${t.short}</p></div>`).join("");
$("#accordion").innerHTML = TOPICS.map(t => `<div class="acc" id="acc-${t.id}"><button class="acc-h">${t.icon} ${t.title}</button><div class="acc-b">${t.html}</div></div>`).join("");
$$(".acc-h").forEach(h => h.onclick = () => h.parentElement.classList.toggle("open"));
$$(".tcard").forEach(c => c.onclick = () => { show("erklaerungen"); const a = $("#acc-" + c.dataset.id); a.classList.add("open"); a.scrollIntoView({ behavior: "smooth" }); });
$("#resetAll").onclick = () => { if (confirm("Fortschritt wirklich zurücksetzen?")) { localStorage.removeItem(KEY); location.reload(); } };

/* ---------- Lernkarten ---------- */
let deck = CARDS.map((_, i) => i), ci = 0;
function renderCard() {
  const c = CARDS[deck[ci]];
  $("#flash").classList.remove("flipped");
  $("#cardCat").textContent = c[0];
  $("#cardQ").textContent = c[1];
  $("#cardA").textContent = c[2];
  $("#cardCount").textContent = `Karte ${ci + 1} von ${deck.length} · gewusst: ${state.known.length}/${CARDS.length}`;
}
const flip = () => $("#flash").classList.toggle("flipped");
const go = d => { ci = (ci + d + deck.length) % deck.length; renderCard(); };
$("#flash").onclick = flip;
$("#nextCard").onclick = () => go(1);
$("#prevCard").onclick = () => go(-1);
$("#knownCard").onclick = () => { const id = deck[ci]; if (!state.known.includes(id)) state.known.push(id); save(); go(1); };
$("#unknownCard").onclick = () => { const id = deck[ci]; state.known = state.known.filter(k => k !== id); save(); go(1); };
$("#shuffleCards").onclick = () => { deck.sort(() => Math.random() - .5); ci = 0; renderCard(); };
document.addEventListener("keydown", e => {
  if (!$("#karten").classList.contains("active") || ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (e.code === "Space") { e.preventDefault(); flip(); }
  if (e.key === "ArrowRight") go(1);
  if (e.key === "ArrowLeft") go(-1);
});
renderCard();

/* ---------- Quiz ---------- */
let qi = 0, qscore = 0, qorder = [];
function startQuiz() { qi = 0; qscore = 0; qorder = QUIZ.map((_, i) => i).sort(() => Math.random() - .5); renderQ(); }
function renderQ() {
  const box = $("#quizBox");
  if (qi >= QUIZ.length) {
    state.quiz = Math.max(state.quiz, qscore); save();
    const pct = Math.round(qscore / QUIZ.length * 100);
    box.innerHTML = `<div class="qbox" style="text-align:center"><p class="big">${pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚"}</p><h3>${qscore} von ${QUIZ.length} richtig (${pct} %)</h3><p>${pct >= 80 ? "Sehr gut! Du beherrschst die Themen." : pct >= 50 ? "Gut, aber wiederhole die schwächeren Themen." : "Lies die Erklärungen nochmals durch und versuche es erneut."}</p><button class="btn" id="qAgain">Nochmals</button></div>`;
    $("#qAgain").onclick = startQuiz; return;
  }
  const q = QUIZ[qorder[qi]];
  box.innerHTML = `<div class="qbox"><div class="qprog"><div style="width:${qi / QUIZ.length * 100}%"></div></div>
    <small class="muted">Frage ${qi + 1} von ${QUIZ.length}</small><h3>${q.q}</h3>
    ${q.o.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join("")}
    <div id="qExp"></div></div>`;
  $$(".opt", box).forEach(b => b.onclick = () => {
    const i = +b.dataset.i, ok = i === q.a;
    if (ok) qscore++;
    $$(".opt", box).forEach((x, k) => { x.disabled = true; if (k === q.a) x.classList.add("right"); });
    if (!ok) b.classList.add("wrong");
    $("#qExp").innerHTML = `<div class="explain">${ok ? "✅ Richtig!" : "❌ Leider falsch."} ${q.e}</div><button class="btn" id="qNext">${qi + 1 < QUIZ.length ? "Weiter" : "Resultat"}</button>`;
    $("#qNext").onclick = () => { qi++; renderQ(); };
  });
}
startQuiz();

/* ---------- Aufgabe 1: Lückentext ---------- */
$('[data-check="gap"]').onclick = () => {
  const el = $("#t1"); let n = 0; const ins = $$(".gap input", el);
  ins.forEach(i => { const ok = i.dataset.a.split("|").includes(i.value.trim().toLowerCase()); i.className = ok ? "ok" : "no"; if (ok) n++; });
  markTask("t1", n === ins.length, el, n === ins.length ? "🎉 Alles richtig!" : `${n} von ${ins.length} richtig. Korrigiere die roten Felder.`);
};

/* ---------- Aufgabe 2: Zuordnen ---------- */
const MATCH = [
  ["Hypervisor", "Teilt Hardware auf mehrere VMs auf"],
  ["AMI", "Vorlage für das Betriebssystem einer Instanz"],
  ["Security Group", "Virtuelle Firewall der Instanz"],
  ["Cloud-Init", "Automatische Konfiguration beim ersten Start"],
  ["Private Key", "Geheimer Schlüssel für den SSH-Login"],
  ["nginx", "Webserver, der Webseiten ausliefert"]
];
const mdefs = MATCH.map(m => m[1]).sort();
$("#matchBox").innerHTML = MATCH.map((m, i) => `<div class="matchrow"><b>${m[0]}</b><select data-i="${i}"><option value="">– wählen –</option>${mdefs.map(d => `<option>${d}</option>`).join("")}</select></div>`).join("");
$('[data-check="match"]').onclick = () => {
  const el = $("#t2"); let n = 0;
  $$("select", el).forEach(s => { const ok = s.value === MATCH[s.dataset.i][1]; s.className = ok ? "ok" : "no"; if (ok) n++; });
  markTask("t2", n === MATCH.length, el, n === MATCH.length ? "🎉 Perfekt zugeordnet!" : `${n} von ${MATCH.length} richtig.`);
};

/* ---------- Aufgabe 3: Reihenfolge ---------- */
const STEPS = ["AMI (Betriebssystem-Image) auswählen", "Instanztyp wählen (z. B. t3.micro)", "SSH-Keypair erstellen bzw. auswählen", "Security Group konfigurieren (Port 22 und 80)", "User Data (Cloud-Init) eintragen", "Instanz starten", "Per SSH mit der öffentlichen IP verbinden"];
let ord = STEPS.map((_, i) => i).sort(() => Math.random() - .5);
function renderOrder() {
  $("#orderList").innerHTML = ord.map((s, p) => `<li><span>${p + 1}. ${STEPS[s]}</span><button data-p="${p}" data-d="-1">▲</button><button data-p="${p}" data-d="1">▼</button></li>`).join("");
  $$("#orderList button").forEach(b => b.onclick = () => {
    const p = +b.dataset.p, q = p + +b.dataset.d;
    if (q < 0 || q >= ord.length) return;
    [ord[p], ord[q]] = [ord[q], ord[p]]; renderOrder();
  });
}
renderOrder();
$('[data-check="order"]').onclick = () => {
  const el = $("#t3"); let n = 0;
  $$("#orderList li").forEach((li, p) => { const ok = ord[p] === p; li.className = ok ? "ok" : "no"; if (ok) n++; });
  markTask("t3", n === STEPS.length, el, n === STEPS.length ? "🎉 Richtige Reihenfolge!" : `${n} von ${STEPS.length} Schritten an der richtigen Stelle.`);
};

/* ---------- Aufgabe 4: Cloud-Init Fehler ---------- */
const CI = [
  ["Die erste Zeile «#cloud-config» fehlt.", true],
  ["Der Befehl «systemctl enable --now nginx» ist falsch, weil nginx nicht gestartet werden darf.", false],
  ["«packages» installiert nginx, «runcmd» führt Befehle beim ersten Start aus.", true],
  ["Das Skript wird bei jedem Seitenaufruf ausgeführt.", false],
  ["Das Skript wird als User Data beim Erstellen der Instanz übergeben.", true]
];
$("#ciBox").innerHTML = CI.map((c, i) => `<label><input type="checkbox" data-i="${i}"> ${c[0]}</label>`).join("");
$('[data-check="ci"]').onclick = () => {
  const el = $("#t4"); let ok = true;
  $$("#ciBox label").forEach((l, i) => { const good = l.firstElementChild.checked === CI[i][1]; l.className = good ? "ok" : "no"; if (!good) ok = false; });
  markTask("t4", ok, el, ok ? "🎉 Genau! Es fehlt #cloud-config als erste Zeile." : "Nicht ganz. Prüfe die rot markierten Aussagen.");
};

/* ---------- Aufgabe 5: Baukasten ---------- */
const PARTS = {
  update: "package_update: true\n",
  nginx: "packages:\n  - nginx\n",
  user: "users:\n  - name: student\n    sudo: ALL=(ALL) NOPASSWD:ALL\n    shell: /bin/bash\n    ssh_authorized_keys:\n      - ssh-rsa AAAA... mein-public-key\n"
};
function buildCI() {
  const on = v => $(`#ciBuilder input[value=${v}]`).checked;
  let s = "#cloud-config\n";
  if (on("update")) s += PARTS.update;
  if (on("nginx")) s += PARTS.nginx;
  if (on("user")) s += PARTS.user;
  const cmds = [];
  if (on("start")) cmds.push("  - systemctl enable --now nginx");
  if (on("page")) cmds.push('  - echo "<h1>Meine Repetitionsseite</h1>" > /var/www/html/index.html');
  if (cmds.length) s += "runcmd:\n" + cmds.join("\n") + "\n";
  $("#ciOut").textContent = s;
}
$$("#ciBuilder input").forEach(i => i.onchange = buildCI);
$('[data-check="builder"]').onclick = () => {
  const el = $("#t5"), on = v => $(`#ciBuilder input[value=${v}]`).checked;
  const miss = [];
  if (!on("nginx")) miss.push("nginx installieren");
  if (!on("start")) miss.push("nginx starten");
  if (!on("page")) miss.push("Startseite schreiben");
  markTask("t5", !miss.length, el, miss.length ? "Es fehlt noch: " + miss.join(", ") + "." : "🎉 Dieses Skript richtet einen Webserver mit Startseite ein!");
};

/* ---------- Aufgabe 6: SSH-Terminal ---------- */
let keyOk = false;
$("#termIn").addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const cmd = e.target.value.trim(), out = $("#termOut"), el = $("#t6");
  e.target.value = "";
  const add = t => { const d = document.createElement("div"); d.textContent = t; out.appendChild(d); };
  add("$ " + cmd);
  if (/^chmod\s+(400|600)\s+mein-key\.pem$/.test(cmd)) { keyOk = true; add("(Berechtigungen gesetzt)"); }
  else if (/^ssh\b/.test(cmd)) {
    const hasKey = /-i\s+mein-key\.pem/.test(cmd), target = /ubuntu@3\.75\.12\.34/.test(cmd);
    if (!hasKey) { add("Permission denied (publickey). Tipp: Schlüssel mit -i angeben."); markTask("t6", false, el, "❌ Der Private Key fehlt im Befehl."); }
    else if (!target) { add("Connection failed. Prüfe Benutzer und IP-Adresse."); markTask("t6", false, el, "❌ Benutzer@IP ist nicht korrekt (ubuntu@3.75.12.34)."); }
    else if (!keyOk) { add("@@@ WARNING: UNPROTECTED PRIVATE KEY FILE! @@@\nPermissions 0644 for 'mein-key.pem' are too open."); markTask("t6", false, el, "❌ Zuerst den Key mit chmod 400 schützen."); }
    else { add("Welcome to Ubuntu 22.04 LTS\nubuntu@ip-172-31-5-10:~$"); markTask("t6", true, el, "🎉 Verbunden! Genau so loggt man sich per SSH ein."); }
  } else add("Befehl nicht erkannt: " + cmd);
  out.parentElement.scrollTop = out.parentElement.scrollHeight;
});

/* ---------- Aufgabe 7: Security Group ---------- */
const SG = [["SSH (TCP 22)", true], ["HTTP (TCP 80)", true], ["MySQL (TCP 3306) von überall", false], ["RDP (TCP 3389)", false], ["Alle Ports für alle (0-65535)", false]];
$("#sgBox").innerHTML = SG.map((s, i) => `<label><input type="checkbox"> ${s[0]}</label>`).join("");
$('[data-check="sg"]').onclick = () => {
  const el = $("#t7"); let ok = true;
  $$("#sgBox label").forEach((l, i) => { const g = l.firstElementChild.checked === SG[i][1]; l.className = g ? "ok" : "no"; if (!g) ok = false; });
  markTask("t7", ok, el, ok ? "🎉 Richtig: nur SSH (22) und HTTP (80) – so wenig Ports wie möglich." : "Nicht ganz. Öffne nur, was wirklich nötig ist (Least Privilege).");
};

/* ---------- Glossar ---------- */
function renderGlossary(f = "") {
  const l = GLOSSARY.filter(g => (g[0] + g[1]).toLowerCase().includes(f.toLowerCase()));
  $("#glist").innerHTML = l.length ? l.map(g => `<dt>${g[0]}</dt><dd>${g[1]}</dd>`).join("") : "<p class='muted'>Kein Treffer.</p>";
}
$("#gsearch").oninput = e => renderGlossary(e.target.value);
renderGlossary();

/* ---------- Gespeicherten Aufgabenstatus anzeigen ---------- */
state.tasks.forEach(id => $("#" + id)?.classList.add("done"));
updateStats();
