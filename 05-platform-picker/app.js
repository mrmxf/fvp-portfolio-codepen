// 05 · Platform picker
// Each platform scores 1 (bad) to 5 (good) on each criterion.
// These are the course's opinions, not facts: change them if you disagree,
// but write your reason in the matching "why" line.

const criteria = [
  { key: "cost",        label: "Low cost",              help: "What you pay over three years, including a domain" },
  { key: "maintenance", label: "Little maintenance",    help: "How much updating and fixing it needs" },
  { key: "debt",        label: "Low technical debt",    help: "How few shortcuts come back to bite you later" },
  { key: "migration",   label: "Easy to move away",     help: "Can you take your content and design elsewhere?" },
  { key: "security",    label: "Secure by default",     help: "How little there is for an attacker to aim at" },
  { key: "lockin",      label: "No lock-in",            help: "Are you free of one company's decisions and prices?" },
];

const platforms = [
  { name: "Wix", colour: "#203d75",
    score: { cost: 2, maintenance: 5, debt: 4, migration: 1, security: 4, lockin: 1 },
    why: { cost: "£9–£119 a month for a custom domain and no ads", maintenance: "Wix does all the updates",
           debt: "You can't make much mess, but you can't fix much either", migration: "You can't export the design",
           security: "Wix runs and patches everything", lockin: "Your site only exists inside Wix" } },
  { name: "WordPress.com", colour: "#672669",
    score: { cost: 3, maintenance: 4, debt: 3, migration: 3, security: 4, lockin: 3 },
    why: { cost: "About $4–$45 a month billed yearly", maintenance: "Hosting and core updates are done for you",
           debt: "Themes and plugins can still pile up", migration: "Posts export; designs and some plugins don't",
           security: "Managed, but plugins are still a risk", lockin: "Open-source software, but you're on their hosting" } },
  { name: "WordPress (self-hosted)", colour: "#9c27b0",
    score: { cost: 3, maintenance: 1, debt: 1, migration: 3, security: 2, lockin: 4 },
    why: { cost: "Hosting about £5–£12 a month plus a domain and paid plugins", maintenance: "Core, theme and plugin updates every month",
           debt: "Abandoned plugins and old PHP are the classic trap", migration: "Database and files move, with effort",
           security: "Plugins and logins are the most attacked part of the web", lockin: "Any host will run it" } },
  { name: "Jekyll + GitHub Pages", colour: "#2b7a8b",
    score: { cost: 5, maintenance: 3, debt: 3, migration: 5, security: 5, lockin: 5 },
    why: { cost: "Hosting is free; you pay only for a domain", maintenance: "Nothing runs on the server, but Ruby tooling needs care",
           debt: "Ruby gem versions can break old sites", migration: "It's just Markdown and HTML files",
           security: "Static files: no login, no database", lockin: "Any static host will serve the output" } },
  { name: "Hugo + GitHub Pages", colour: "#18654d",
    score: { cost: 5, maintenance: 4, debt: 4, migration: 5, security: 5, lockin: 5 },
    why: { cost: "Hosting is free; you pay only for a domain", maintenance: "One program, very fast builds",
           debt: "A single binary; themes can still go stale", migration: "It's just Markdown and HTML files",
           security: "Static files: no login, no database", lockin: "Any static host will serve the output" } },
];

// ---- user interface (no need to change below here) ---------------------
const $ = (s) => document.querySelector(s);
const weights = Object.fromEntries(criteria.map((c) => [c.key, 3]));
let picked = null;

$("#weights").innerHTML = "<h2>What matters to you?</h2>" + criteria.map((c) => `
  <label class="w"><span>${c.label} <b id="v-${c.key}">3</b></span>
    <input type="range" min="0" max="5" value="3" data-key="${c.key}">
    <small>${c.help}</small></label>`).join("");

$("#weights").addEventListener("input", (e) => {
  const k = e.target.dataset.key; if (!k) return;
  weights[k] = +e.target.value; $("#v-" + k).textContent = e.target.value; rank();
});

function total(p) {
  const max = criteria.reduce((a, c) => a + weights[c.key] * 5, 0) || 1;
  const got = criteria.reduce((a, c) => a + weights[c.key] * p.score[c.key], 0);
  return Math.round((got / max) * 100);
}

function rank() {
  const list = [...platforms].sort((a, b) => total(b) - total(a));
  $("#ranking").innerHTML = list.map((p) => `
    <li data-name="${p.name}"><span class="name">${p.name}</span>
      <span class="bar"><i style="width:${total(p)}%;background:${p.colour}"></i></span><b>${total(p)}%</b></li>`).join("");
  showWhy();
}

function showWhy() {
  const p = platforms.find((x) => x.name === picked);
  $("#why").innerHTML = p ? `<h3 style="color:${p.colour}">${p.name}</h3><ul>` + criteria.map((c) =>
    `<li><b>${c.label}: ${p.score[c.key]}/5</b> · ${p.why[c.key]}</li>`).join("") + "</ul>" : "";
}

$("#ranking").addEventListener("click", (e) => {
  const li = e.target.closest("li"); if (!li) return;
  picked = li.dataset.name; showWhy();
});

rank();
