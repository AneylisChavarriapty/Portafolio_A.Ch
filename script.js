const $ = id => document.getElementById(id);
let lang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "es");
let theme = localStorage.getItem("theme") || "dark";
const SECTIONS = ["about", "skills", "projects", "contact"];

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("show");
  e.target.querySelectorAll("[data-count]").forEach(count);
  if (e.target.dataset.count) count(e.target);
}), { threshold: .12 });

function count(el) {
  if (el.done) return; el.done = true;
  const end = +el.dataset.count, t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

const rv = (i) => `reveal" style="--d:${i * 90}ms`;

function render() {
  const c = DATA.common, t = DATA[lang], u = t.ui;
  document.documentElement.lang = lang;
  document.documentElement.dataset.theme = theme;
  document.title = c.name + " | " + (lang === "es" ? "Portafolio" : "Portfolio");
  $("langBtn").textContent = lang === "es" ? "EN" : "ES";
  $("themeBtn").textContent = theme === "dark" ? u.theme_light : u.theme_dark;

  $("logo").textContent = c.initials;
  $("nav").innerHTML = SECTIONS.map(s => `<a href="#${s}">${u["nav_" + s]}</a>`).join("");

  // portada
  $("badge").textContent = t.badge;
  $("hello").textContent = t.hello;
  $("first").textContent = c.first;
  $("fullname").textContent = c.name;
  $("heroDesc").textContent = t.heroDesc;
  $("btn1").textContent = u.btn1; $("btn2").textContent = u.btn2;
  $("stats").innerHTML = c.stats.map((n, i) => `<div><b data-count="${n}">0</b><span>${t.stats[i]}</span></div>`).join("");
  $("frame").innerHTML = c.photo ? `<img src="${c.photo}" alt="${c.name}">` : `<span>${c.initials}</span>`;
  [1, 2, 3].forEach(i => $("chip" + i).textContent = t.chips[i - 1]);

  // titulos
  SECTIONS.forEach(s => { $("eb_" + s).textContent = t.eb[s]; $("t_" + s).textContent = t.t[s]; });

  // sobre mi
  $("aboutGrid").innerHTML = `<div class="card big ${rv(0)}">${t.about.map(p => `<p>${p}</p>`).join("")}</div>
    <div class="facts">${t.facts.map((f, i) => `<div class="card ${rv(i + 1)}"><span class="mono k">${f.label}</span><b>${f.title}</b><small>${f.sub}</small></div>`).join("")}</div>`;

  // conocimientos
  $("skillGrid").innerHTML = t.skills.map((g, i) => `<div class="card s${i} ${rv(i)}"><h4 class="mono">${g.title}</h4>
    <div class="chips">${g.items.map(x => `<em>${x}</em>`).join("")}</div></div>`).join("");

  // proyectos
  $("projList").innerHTML = t.projects.map((p, i) => {
    const m = c.projects[i] || {};
    return `<article class="card proj p${i} ${rv(i)}">
      <div class="ph"><span class="mono kind">${p.kind}</span><b>0${i + 1}</b></div>
      <div class="pb"><h3>${p.title}</h3><p class="tag">${p.tagline}</p><p>${p.desc}</p>
      <ul>${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
      <div class="tags">${(m.tags || []).map(x => `<em class="mono">${x}</em>`).join("")}</div>
      ${m.link ? `<a class="btn ghost sm" href="${m.link}" target="_blank" rel="noopener">${u.view}</a>` : ""}</div></article>`;
  }).join("");

  // contacto
  $("contactText").textContent = t.contactText;
  $("mailBtn").href = "mailto:" + c.email;
  $("mailBtn").textContent = u.mail;
  $("socials").innerHTML = c.socials.map(s => `<a class="btn ghost sm" href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join("");
  $("footer").textContent = t.footer;

  document.querySelectorAll(".reveal, .stats").forEach(el => io.observe(el));
}

$("langBtn").onclick = () => { lang = lang === "es" ? "en" : "es"; localStorage.setItem("lang", lang); render(); };
$("themeBtn").onclick = () => { theme = theme === "dark" ? "light" : "dark"; localStorage.setItem("theme", theme); render(); };

// barra de progreso
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
}, { passive: true });

// luz que sigue al mouse dentro de las tarjetas
document.addEventListener("pointermove", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", (e.clientX - r.left) + "px");
  c.style.setProperty("--my", (e.clientY - r.top) + "px");
});

render();
