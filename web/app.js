/* Ravens Game Day HQ — public schedule only; no invented odds/stats/injuries */
(function () {
  "use strict";

  const KICKOFF = new Date("2026-10-11T20:20:00-04:00"); // 8:20 PM EDT
  const LS_PICK = "ravens-gameday-simmons-pick-v1";
  const LS_CHECK = "ravens-gameday-checklist-v1";

  /** @type {Array<object>} Verified from baltimoreravens.com schedule + schedule-release article */
  const WEEKS = [
    { w: 1, date: "Sun Sep 13", when: "FINAL", ha: "at", opp: "Indianapolis Colts", oppShort: "IND", venue: "Lucas Oil Stadium", tv: "CBS", result: "W", score: "41-23", cls: "win" },
    { w: 2, date: "Sun Sep 20", when: "FINAL", ha: "vs", opp: "New Orleans Saints", oppShort: "NO", venue: "M&T Bank Stadium", tv: "CBS", result: "L", score: "17-24", cls: "loss" },
    { w: 3, date: "Sun Sep 27", when: "FINAL", ha: "at", opp: "Dallas Cowboys", oppShort: "DAL", venue: "Maracanã Stadium (Brazil)", tv: "CBS", result: "W", score: "34-31", cls: "win", note: "International game · Rio de Janeiro" },
    { w: 4, date: "Sun Oct 4", when: "FINAL", ha: "vs", opp: "Tennessee Titans", oppShort: "TEN", venue: "M&T Bank Stadium", tv: "CBS", result: "W", score: "24-18", cls: "win" },
    { w: 5, date: "Sun Oct 11", when: "8:20 PM EDT", ha: "at", opp: "Atlanta Falcons", oppShort: "ATL", venue: "Mercedes-Benz Stadium", tv: "NBC · Peacock", result: "NEXT", score: "tonight", cls: "next", radio: "98 Rock 97.9 FM · WBAL 1090 AM · Tico Sports 107.9 FM" },
    { w: 6, date: "Sun Oct 18", when: "1:00 PM EDT", ha: "at", opp: "Cleveland Browns", oppShort: "CLE", venue: "Huntington Bank Field", tv: "FOX", result: "", score: "", cls: "" },
    { w: 7, date: "Sun Oct 25", when: "1:00 PM EDT", ha: "vs", opp: "Cincinnati Bengals", oppShort: "CIN", venue: "M&T Bank Stadium", tv: "CBS · Paramount+", result: "", score: "", cls: "" },
    { w: 8, date: "Sun Nov 1", when: "1:00 PM EST", ha: "at", opp: "Buffalo Bills", oppShort: "BUF", venue: "Highmark Stadium", tv: "CBS · Paramount+", result: "", score: "", cls: "" },
    { w: 9, date: "Thu Nov 5", when: "8:15 PM EST", ha: "vs", opp: "Jacksonville Jaguars", oppShort: "JAX", venue: "M&T Bank Stadium", tv: "Prime Video", result: "", score: "", cls: "" },
    { w: 10, date: "Mon Nov 16", when: "8:15 PM EST", ha: "vs", opp: "Los Angeles Chargers", oppShort: "LAC", venue: "M&T Bank Stadium", tv: "ESPN", result: "", score: "", cls: "" },
    { w: 11, date: "Sun Nov 22", when: "1:00 PM EST", ha: "at", opp: "Carolina Panthers", oppShort: "CAR", venue: "Bank of America Stadium", tv: "FOX", result: "", score: "", cls: "" },
    { w: 12, date: "Sun Nov 29", when: "1:00 PM EST", ha: "at", opp: "Houston Texans", oppShort: "HOU", venue: "NRG Stadium (listed Reliant on some pages)", tv: "CBS", result: "", score: "", cls: "" },
    { w: 13, date: "Sun Dec 6", when: "BYE", ha: "", opp: "Bye week", oppShort: "BYE", venue: "—", tv: "—", result: "BYE", score: "—", cls: "bye" },
    { w: 14, date: "Sun Dec 13", when: "1:00 PM EST", ha: "vs", opp: "Tampa Bay Buccaneers", oppShort: "TB", venue: "M&T Bank Stadium", tv: "FOX", result: "", score: "", cls: "" },
    { w: 15, date: "Sun Dec 20", when: "1:00 PM EST", ha: "at", opp: "Pittsburgh Steelers", oppShort: "PIT", venue: "Acrisure Stadium", tv: "CBS", result: "", score: "", cls: "" },
    { w: 16, date: "Sun Dec 27", when: "1:00 PM EST", ha: "vs", opp: "Cleveland Browns", oppShort: "CLE", venue: "M&T Bank Stadium", tv: "CBS · Paramount+", result: "", score: "", cls: "" },
    { w: 17, date: "Thu Dec 31", when: "8:15 PM EST", ha: "at", opp: "Cincinnati Bengals", oppShort: "CIN", venue: "Paycor Stadium (venue label not loaded — Cincinnati)", tv: "Prime Video", result: "", score: "", cls: "" },
    { w: 18, date: "Jan TBD", when: "TBD", ha: "vs", opp: "Pittsburgh Steelers", oppShort: "PIT", venue: "M&T Bank Stadium", tv: "TBD", result: "", score: "", cls: "" },
  ];

  const CHECKLIST = [
    { id: "tv", label: "TV on · input set to NBC (or Peacock ready)" },
    { id: "snacks", label: "Snacks + drinks staged before kickoff" },
    { id: "bedtime", label: "Kids bedtime plan before SNF (Char / Vic)" },
    { id: "radio", label: "Optional: 98 Rock / WBAL as backup audio" },
    { id: "phone", label: "Phone on Do Not Disturb (or sports-only)" },
    { id: "purple", label: "Purple gear on the couch (optional flair)" },
    { id: "chat", label: "Group chat muted until halftime if needed" },
  ];

  const LINKS = [
    { title: "Ravens official schedule", url: "https://www.baltimoreravens.com/schedule/" },
    { title: "Week 5 game day — Ravens at Falcons", url: "https://www.baltimoreravens.com/game-day/2026/reg-week5/ravens-at-falcons/" },
    { title: "Falcons game center (BAL @ ATL)", url: "https://www.atlantafalcons.com/game-day/2026/reg-week5/falcons-vs-ravens/" },
    { title: "Schedule release / full slate article", url: "https://www.baltimoreravens.com/news/baltimore-ravens-2026-schedule" },
    { title: "NFL.com game center", url: "https://www.nfl.com/games/ravens-at-falcons-2026-reg-5" },
  ];

  let selectedPick = null;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---- Tabs ---- */
  function showTab(id) {
    $all(".tab").forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle("on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $all(".panel").forEach((p) => {
      const on = p.id === "panel-" + id;
      p.classList.toggle("on", on);
      if (on) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
    try { sessionStorage.setItem("ravens-gameday-tab", id); } catch (_) {}
  }

  /* ---- Countdown ---- */
  function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }

  function tickCountdown() {
    const now = new Date();
    const diff = KICKOFF - now;
    const status = $("#cdStatus");
    if (diff <= 0) {
      // Approximate game window ~3.5 hours; after that mark final unknown
      const since = -diff;
      if (since < 3.5 * 3600 * 1000) {
        $("#cdD").textContent = "00";
        $("#cdH").textContent = "00";
        $("#cdM").textContent = "00";
        $("#cdS").textContent = "00";
        status.textContent = "IT'S GAMETIME — Sunday Night Football is on";
        status.classList.add("live");
      } else {
        status.textContent = "Kickoff window passed · final score not loaded in this offline HQ";
        status.classList.remove("live");
      }
      return;
    }
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    $("#cdD").textContent = pad(d);
    $("#cdH").textContent = pad(h);
    $("#cdM").textContent = pad(m);
    $("#cdS").textContent = pad(sec);
    status.textContent = "Counting down to 8:20 PM EDT kickoff at Mercedes-Benz Stadium";
    status.classList.remove("live");
  }

  /* ---- Season strip ---- */
  function chipLabel(w) {
    if (w.cls === "win") return "W " + w.score;
    if (w.cls === "loss") return "L " + w.score;
    if (w.cls === "next") return "TONIGHT";
    if (w.cls === "bye") return "BYE";
    return w.oppShort;
  }

  function renderStrip() {
    const strip = $("#weekStrip");
    strip.innerHTML = "";
    WEEKS.forEach((w) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "week-chip " + (w.cls || "");
      btn.setAttribute("role", "listitem");
      btn.dataset.week = String(w.w);
      btn.innerHTML = '<span class="wnum">Wk ' + w.w + '</span><span class="wres">' + chipLabel(w) + "</span>";
      btn.addEventListener("click", () => selectWeek(w.w));
      strip.appendChild(btn);
    });
    selectWeek(5);
  }

  function selectWeek(num) {
    const w = WEEKS.find((x) => x.w === num);
    if (!w) return;
    $all(".week-chip").forEach((c) => c.classList.toggle("on", Number(c.dataset.week) === num));
    $("#wdTitle").textContent = "Week " + w.w + " · " + w.date;
    const rows = [
      ["Opponent", (w.ha ? w.ha + " " : "") + w.opp],
      ["Kickoff / status", w.when],
      ["Venue", w.venue],
      ["TV", w.tv],
    ];
    if (w.radio) rows.push(["Radio", w.radio]);
    if (w.result === "W" || w.result === "L") rows.push(["Result", w.result + " " + w.score]);
    if (w.result === "NEXT") rows.push(["Result", "Upcoming — no score loaded"]);
    if (w.result === "BYE") rows.push(["Result", "Bye week"]);
    if (w.note) rows.push(["Note", w.note]);
    rows.push(["Source", "baltimoreravens.com schedule / schedule-release article"]);
    $("#wdBody").innerHTML = rows.map(([k, v]) =>
      '<div class="row"><span class="k">' + k + '</span><span class="v">' + v + "</span></div>"
    ).join("");
  }

  /* ---- Checklist ---- */
  function loadChecks() {
    try { return JSON.parse(localStorage.getItem(LS_CHECK) || "{}"); } catch (_) { return {}; }
  }
  function saveChecks(map) {
    try { localStorage.setItem(LS_CHECK, JSON.stringify(map)); } catch (_) {}
  }
  function renderChecklist() {
    const ul = $("#checklist");
    const map = loadChecks();
    ul.innerHTML = "";
    CHECKLIST.forEach((item) => {
      const li = document.createElement("li");
      const checked = !!map[item.id];
      if (checked) li.classList.add("done");
      li.innerHTML = '<input type="checkbox" id="ck-' + item.id + '"' + (checked ? " checked" : "") + '>' +
        '<label for="ck-' + item.id + '">' + item.label + "</label>";
      const inp = li.querySelector("input");
      inp.addEventListener("change", () => {
        const m = loadChecks();
        m[item.id] = inp.checked;
        saveChecks(m);
        li.classList.toggle("done", inp.checked);
      });
      ul.appendChild(li);
    });
  }

  /* ---- Simmons pick ---- */
  function loadPick() {
    try { return JSON.parse(localStorage.getItem(LS_PICK) || "null"); } catch (_) { return null; }
  }
  function savePick(obj) {
    try {
      if (obj) localStorage.setItem(LS_PICK, JSON.stringify(obj));
      else localStorage.removeItem(LS_PICK);
    } catch (_) {}
  }
  function syncPickUI() {
    const saved = loadPick();
    selectedPick = saved ? saved.pick : selectedPick;
    $all(".sim-pick").forEach((b) => b.classList.toggle("on", b.dataset.pick === selectedPick));
    const conf = saved ? saved.conf : Number($("#confRange").value);
    $("#confRange").value = String(conf);
    $("#confLabel").textContent = conf + (conf === 1 ? " bag" : " bags");
    if (saved && saved.note) $("#simNote").value = saved.note;
    const st = $("#simStatus");
    if (saved && saved.pick) {
      st.textContent = "Locked: " + saved.pick + " · " + saved.conf + " bag" + (saved.conf === 1 ? "" : "s") +
        (saved.note ? " — “" + saved.note + "”" : "") + " · your pick only (not Simmons)";
    } else if (selectedPick) {
      st.textContent = "Selected " + selectedPick + " — tap Lock to save on this device.";
    } else {
      st.textContent = "No pick locked yet. Tap BAL or ATL — this is your pick, not Bill’s.";
    }
  }

  /* ---- Links ---- */
  function renderLinks() {
    const ul = $("#linkList");
    ul.innerHTML = LINKS.map((L) =>
      '<li><span class="title">' + L.title + '</span><a href="' + L.url + '" target="_blank" rel="noopener noreferrer">' + L.url + "</a></li>"
    ).join("");
  }

  /* ---- Particle / stadium canvas ---- */
  function startBg() {
    const canvas = $("#bg");
    const ctx = canvas.getContext("2d");
    let w, h, particles, t0;
    const N = 55;

    function resize() {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function resetParticles() {
      particles = Array.from({ length: N }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 1 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.4,
        a: 0.15 + Math.random() * 0.45,
        gold: Math.random() > 0.72,
      }));
    }

    function drawStadiumSilhouette(cw, ch) {
      const baseY = ch * 0.78;
      ctx.save();
      ctx.fillStyle = "rgba(20, 12, 55, 0.55)";
      ctx.beginPath();
      ctx.moveTo(cw * 0.12, baseY);
      // bowl left
      ctx.quadraticCurveTo(cw * 0.18, baseY - ch * 0.18, cw * 0.35, baseY - ch * 0.2);
      // roof arc
      ctx.quadraticCurveTo(cw * 0.5, baseY - ch * 0.32, cw * 0.65, baseY - ch * 0.2);
      ctx.quadraticCurveTo(cw * 0.82, baseY - ch * 0.18, cw * 0.88, baseY);
      ctx.lineTo(cw * 0.12, baseY);
      ctx.fill();
      // gold rim pulse
      const pulse = 0.35 + 0.25 * Math.sin((performance.now() - t0) / 900);
      ctx.strokeStyle = "rgba(247, 208, 70, " + pulse + ")";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cw * 0.2, baseY - ch * 0.02);
      ctx.quadraticCurveTo(cw * 0.5, baseY - ch * 0.28, cw * 0.8, baseY - ch * 0.02);
      ctx.stroke();
      // field hint
      ctx.fillStyle = "rgba(36, 23, 115, 0.35)";
      ctx.fillRect(cw * 0.32, baseY - 4, cw * 0.36, 8);
      ctx.restore();
    }

    function frame(now) {
      if (!t0) t0 = now;
      const cw = window.innerWidth, ch = window.innerHeight;
      ctx.clearRect(0, 0, cw, ch);
      // deep purple wash
      const g = ctx.createRadialGradient(cw * 0.5, ch * 0.2, 40, cw * 0.5, ch * 0.4, cw * 0.7);
      g.addColorStop(0, "rgba(91,75,196,0.25)");
      g.addColorStop(0.5, "rgba(36,23,115,0.35)");
      g.addColorStop(1, "rgba(5,4,12,0.9)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);

      drawStadiumSilhouette(cw, ch);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = ch + 10; p.x = Math.random() * cw; }
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = p.gold
          ? "rgba(247,208,70," + p.a + ")"
          : "rgba(160,140,255," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // center pulse ring
      const pr = 40 + 18 * Math.sin((now - t0) / 700);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(247,208,70," + (0.12 + 0.08 * Math.sin((now - t0) / 700)) + ")";
      ctx.lineWidth = 2;
      ctx.arc(cw / 2, ch * 0.22, pr, 0, Math.PI * 2);
      ctx.stroke();

      requestAnimationFrame(frame);
    }

    resize();
    resetParticles();
    window.addEventListener("resize", () => { resize(); resetParticles(); });
    requestAnimationFrame(frame);
  }

  /* ---- Wire UI ---- */
  function init() {
    $all(".tab").forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));
    let tab = "kickoff";
    try { tab = sessionStorage.getItem("ravens-gameday-tab") || "kickoff"; } catch (_) {}
    showTab(tab);

    renderStrip();
    renderChecklist();
    renderLinks();
    syncPickUI();

    $all(".sim-pick").forEach((b) => {
      b.addEventListener("click", () => {
        selectedPick = b.dataset.pick;
        syncPickUI();
      });
    });
    $("#confRange").addEventListener("input", () => {
      const v = Number($("#confRange").value);
      $("#confLabel").textContent = v + (v === 1 ? " bag" : " bags");
    });
    $("#btnLockPick").addEventListener("click", () => {
      if (!selectedPick) { toast("Pick BAL or ATL first"); return; }
      const obj = {
        pick: selectedPick,
        conf: Number($("#confRange").value),
        note: ($("#simNote").value || "").trim().slice(0, 200),
        at: new Date().toISOString(),
        disclaimer: "User pick only — not Bill Simmons",
      };
      savePick(obj);
      syncPickUI();
      toast("Pick locked on this device");
    });
    $("#btnClearPick").addEventListener("click", () => {
      selectedPick = null;
      $("#simNote").value = "";
      $("#confRange").value = "3";
      savePick(null);
      syncPickUI();
      toast("Pick cleared");
    });

    $("#btnResetChecks").addEventListener("click", () => {
      saveChecks({});
      renderChecklist();
      toast("Checklist reset");
    });

    $("#btnHelp").addEventListener("click", () => $("#help").removeAttribute("hidden"));
    $("#btnHelpClose").addEventListener("click", () => $("#help").setAttribute("hidden", ""));
    $("#help").addEventListener("click", (e) => {
      if (e.target.id === "help") $("#help").setAttribute("hidden", "");
    });

    $("#btnWall").addEventListener("click", () => {
      document.body.classList.toggle("wall");
      showTab("kickoff");
      toast(document.body.classList.contains("wall") ? "Wall mode — press Wall again to exit" : "Wall mode off");
    });

    tickCountdown();
    setInterval(tickCountdown, 1000);
    startBg();

    // expose for smoke / screenshots
    window.RG = {
      showTab, selectWeek, WEEKS, KICKOFF: KICKOFF.toISOString(),
      version: "ravens-gameday-1.0",
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
