
// ===== Tech logo mapping =====
const TECH_ICONS = {
  laravel: "./assets/img/tech/laravel.svg",
  ci4: "./assets/img/tech/ci4.svg",
  codeigniter: "./assets/img/tech/ci4.svg",
  mysql: "./assets/img/tech/mysql.svg",
  flutter: "./assets/img/tech/flutter.svg",
  kotlin: "./assets/img/tech/kotlin.svg",
  "node.js": "./assets/img/tech/nodejs.svg",
  nodejs: "./assets/img/tech/nodejs.svg",
  "rest api": "./assets/img/tech/rest-api.svg",
  restapi: "./assets/img/tech/rest-api.svg",
  pam: "./assets/img/tech/pam.svg",
  "k-means": "./assets/img/tech/kmeans.svg",
  kmeans: "./assets/img/tech/kmeans.svg",
  "a*": "./assets/img/tech/astar.svg",
  astar: "./assets/img/tech/astar.svg",
  maps: "./assets/img/tech/maps.svg",
  qr: "./assets/img/tech/qr.svg",
  pwa: "./assets/img/tech/pwa.svg",
  fonnte: "./assets/img/tech/whatsapp.svg",
  whatsapp: "./assets/img/tech/whatsapp.svg",
  cms: "./assets/img/tech/cms.svg",
  reservation: "./assets/img/tech/reservation.svg",
  fifo: "./assets/img/tech/fifo.svg",
  academic: "./assets/img/tech/academic.svg",
  dashboard: "./assets/img/tech/dashboard.svg",
  clustering: "./assets/img/tech/clustering.svg",
  pos: "./assets/img/tech/pos.svg",
  events: "./assets/img/tech/events.svg"
};

function techKey(tag){
  return String(tag || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()]/g, "")
    .replace(/\+/g, "")
    .replace(/-/g, "-");
}

function renderTechPills(tags){
  const arr = Array.isArray(tags) ? tags : [];
  return `<div class="tech-wrap">${
    arr.map(t => {
      const key = techKey(t);
      const icon = TECH_ICONS[key] || "./assets/img/tech/default.svg";
      return `<span class="tech-pill"><img src="${icon}" alt="${t} logo" loading="lazy"><span>${t}</span></span>`;
    }).join("")
  }</div>`;
}

// ===== Theme Toggle =====
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') root.classList.add('light');

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
}

// ===== Year + Profile =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const brandName = document.getElementById('brandName');
const footerName = document.getElementById('footerName');
if (brandName) brandName.textContent = PROFILE.name;
if (footerName) footerName.textContent = PROFILE.name;

// ===== Reveal =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .15 });

function attachReveal() {
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ===== Helpers =====
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function byId(id) {
  return PROJECTS.find(p => p.id === id);
}

// ===== Render Detail =====
let currentLocale = localStorage.getItem('lang') || 'en';

function renderDetail(project) {
  const titleEl = document.getElementById('detailTitle');
  const descEl = document.getElementById('detailDesc');
  const imgEl = document.getElementById('detailImg');
  const tagsEl = document.getElementById('detailTags');
  const listEl = document.getElementById('detailList');
  const stackEl = document.getElementById('detailStack');
  const openEl = document.getElementById('detailOpen');

  if (titleEl) titleEl.textContent = project.title || 'Project';
  if (descEl) descEl.textContent = currentLocale === 'id' ? (project.desc_id || '') : (project.desc_en || '');
  if (imgEl) imgEl.src = project.img || 'assets/img/p1.svg';

  // tags
  if (tagsEl) {
    tagsEl.innerHTML = (project.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  }

  // highlights
  const items = currentLocale === 'id' ? project.details_id : project.details_en;
  if (listEl) {
    listEl.innerHTML = '';
    (items && items.length ? items : []).forEach(txt => {
      const li = document.createElement('li');
      li.textContent = txt;
      listEl.appendChild(li);
    });
    if (!listEl.children.length) {
      const li = document.createElement('li');
      li.textContent = currentLocale === 'id'
        ? 'Detail belum diisi. Tambahkan details_id/details_en di data.js.'
        : 'Details not filled. Add details_id/details_en in data.js.';
      listEl.appendChild(li);
    }
  }

  // tech stack
  if (stackEl) {
    stackEl.innerHTML = (project.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  }

  // open link
  const hasLink = project.link && project.link !== '#';
  if (openEl) {
    if (hasLink) {
      openEl.classList.remove('disabled');
      openEl.href = project.link;
      openEl.style.display = 'inline-block';
    } else {
      openEl.classList.add('disabled');
      openEl.href = 'javascript:void(0)';
    }
  }
}

function showNotFound() {
  const notFound = document.getElementById('notFound');
  const titleEl = document.getElementById('detailTitle');
  const descEl = document.getElementById('detailDesc');
  const imgEl = document.getElementById('detailImg');
  const tagsEl = document.getElementById('detailTags');
  const listEl = document.getElementById('detailList');
  const stackEl = document.getElementById('detailStack');

  if (notFound) notFound.style.display = 'block';
  if (titleEl) titleEl.textContent = '';
  if (descEl) descEl.textContent = '';
  if (imgEl) imgEl.style.display = 'none';
  if (tagsEl) tagsEl.innerHTML = '';
  if (listEl) listEl.innerHTML = '';
  if (stackEl) stackEl.innerHTML = '';
}

// ===== I18N =====
const langSelect = document.getElementById('langSelect');
const savedLang = localStorage.getItem('lang') || 'en';
if (langSelect) langSelect.value = savedLang;

async function loadI18n(lang) {
  try {
    const res = await fetch(`i18n/${lang}.json`);
    if (!res.ok) throw new Error(`i18n file not found: ${lang}`);

    const dict = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = key.split('.').reduce((o, k) => (o || {})[k], dict);
      if (typeof txt === 'string') el.textContent = txt;
    });

    currentLocale = lang;
    localStorage.setItem('lang', lang);
  } catch (err) {
    console.warn(err);
    currentLocale = 'en';
    localStorage.setItem('lang', 'en');
    if (langSelect) langSelect.value = 'en';
  }
}

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const opened = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Init =====
(async function init(){
  await loadI18n(savedLang);

  const pid = getQueryParam('id');
  const project = pid ? byId(pid) : null;

  if (!project) {
    showNotFound();
  } else {
    renderDetail(project);
  }

  attachReveal();
})();
