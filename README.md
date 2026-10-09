# SwapDoku / SyncDoku — Minimalistisches Echtzeit-Sudoku

> Prototyp für die Seminararbeit im Modul **Web Technologie** (FOM Hochschule).
> Untersuchung der Echtzeitsynchronisation via **Serverless Backend-as-a-Service (Supabase Realtime WebSockets)** im Vergleich zu dedizierten Server-Architekturen.

---

## 1. Übersicht & Tech-Stack

- **Frontend**: HTML5, CSS3 (Dynamische CSS-Variablen-Theme-Engine), Vanilla JavaScript (ES6+). Kein Build-Schritt erforderlich.
- **Design**: Skandinavischer Minimalismus (Inter Font, dezente Ränder, responsive 9x9 CSS-Grid, On-Screen Touch-Numpad).
- **Backend & Persistence**: Supabase (PostgreSQL 15+, Anonymous Authentication, Row Level Security / RLS, Stored Procedures).
- **Echtzeit-Kommunikation**: Supabase Realtime Channels (`Broadcast` & `Presence`) über WebSockets.
- **Deployment**: Vercel (statisches Edge-Hosting).

---

## 2. Spielmodi

1. **Singleplayer (Zen)**: Lokale Validierung, ablenkungsfreies Sudoku. Nach erfolgreichem Lösen: **+50 Sync-Points**.
2. **Multiplayer Versus**: Raum-Erstellung oder Beitritt via 4-stelligem Code. Beide Spieler lösen synchron dasselbe Rätsel. Supabase Broadcast synchronisiert laufend den Fortschritt beider Kontrahenten. Belohnung: **+100 Sync-Points** für den Sieger.
3. **Multiplayer Co-Op (Board-Swap)**: Zwei Spieler starten mit unterschiedlichen Rätseln. Ein synchroner 10-Sekunden-Timer löst über Supabase Broadcast ein `SWAP_BOARDS`-Event aus. Die Grids werden übers Netzwerk getauscht und die Spieler müssen unter Zeitdruck das Rätsel des Partners weiterspielen. Belohnung: **+75 Sync-Points**.

---

## 3. Belohnungssystem & Theme-Engine

Nutzer sammeln durch Siege "Sync-Points", die in der PostgreSQL-Tabelle `profiles` gesichert werden.
Im Theme-Shop können damit minimalistische Farbpaletten freigeschaltet und gewechselt werden:
- **Nordic Light** (Standard, 0 Pts)
- **Dark Slate** (100 Pts)
- **Matcha Paper** (200 Pts)
- **Nordic Frost** (300 Pts)

---

## 4. Einrichtung & Lokales Ausführen

### A. Lokaler Schnelltest (Offline/Demo-Modus)
Die Anwendung verfügt über einen automatischen Fallback: Wenn keine Supabase-Zugangsdaten konfiguriert sind, läuft die App vollautomatisch im lokalen Demo-Modus (inklusive lokaler Profil- & Punkte-Speicherung über `localStorage`).

Einfach einen lokalen HTTP-Server starten:
```powershell
# Beispiel mit Python
python -m http.server 8080

# Oder mit Node.js (npx serve)
npx serve .
```
Öffne anschließend `http://localhost:8080` im Browser.

---

### B. Supabase Backend anbinden

1. Erstelle ein kostenloses Projekt auf [supabase.com](https://supabase.com).
2. Gehe im Supabase Dashboard auf **SQL Editor** und führe das Skript aus [`schema.sql`](./schema.sql) aus.
3. Aktiviere unter **Authentication -> Providers -> Anonymous Sign-Ins** den Haken bei *Enable Anonymous Sign-In*.
4. Kopiere deine **Project URL** und den **anon / public key** aus den *Project Settings -> API*.
5. Trage die Daten am Anfang der Datei [`app.js`](./app.js) ein:
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'https://dein-projekt.supabase.co',
     anonKey: 'dein-anon-key'
   };
   ```

---

## 5. Deployment auf Vercel

1. Repository auf GitHub pushen.
2. In [Vercel](https://vercel.com) auf **Add New -> Project** klicken und das Repository importieren.
3. Da es sich um ein statisches Vanilla-JS-Projekt handelt, sind keine Build-Commands notwendig (`Output Directory: .`).
4. Auf **Deploy** klicken — fertig!

---

## 6. Evaluations-Metrik für die Seminararbeit (FOM)

Zur empirischen Auswertung (Abschnitt *Evaluation* & *Vorgehen bei der Entwicklung*) erfasst die Anwendung bei jedem Broadcast (`PROGRESS`, `SWAP_BOARDS`) die Round-Trip-Time (RTT) in Millisekunden und zeigt diese im HUD an (`RTT: XX ms`).
Damit lassen sich für die Seminararbeit konkrete Latenzmessungen und Analysen zur Zuverlässigkeit von WebSocket-Events unter BaaS-Bedingungen darstellen.
