
// ===== Tech logo mapping =====
const DEVICON = (name, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

const TECH_ICONS = {
  laravel: DEVICON('laravel'),
  ci4: DEVICON('codeigniter', 'plain'),
  codeigniter: DEVICON('codeigniter', 'plain'),
  mysql: DEVICON('mysql'),
  flutter: DEVICON('flutter'),
  kotlin: DEVICON('kotlin'),
  "node.js": DEVICON('nodejs'),
  nodejs: DEVICON('nodejs'),
  javascript: DEVICON('javascript'),
  typescript: DEVICON('typescript'),
  php: DEVICON('php'),
  android: DEVICON('android'),
  firebase: DEVICON('firebase', 'plain'),
  postgresql: DEVICON('postgresql'),
  "rest api": "./assets/img/tech/rest-api.svg",
  restapi: "./assets/img/tech/rest-api.svg",
  fonnte: "./assets/img/tech/whatsapp.svg",
  whatsapp: "./assets/img/tech/whatsapp.svg",
  maps: "./assets/img/tech/maps.svg",
  qr: "./assets/img/tech/qr.svg",
  pwa: "./assets/img/tech/pwa.svg",
  cms: "./assets/img/tech/cms.svg"
};

function techKey(tag){
  return String(tag || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()]/g, "")
    .replace(/\+/g, "");
}

function renderTechPills(tags){
  const arr = Array.isArray(tags) ? tags : [];
  return `<div class="tech-wrap">${
    arr.map(t => {
      const key = techKey(t);
      const icon = TECH_ICONS[key];
      return icon
        ? `<span class="tech-pill"><img src="${icon}" alt="${t} logo" loading="lazy"><span>${t}</span></span>`
        : `<span class="tech-pill tech-pill--text"><span>${t}</span></span>`;
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
    const mode = root.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'light' ? '#f7fafc' : '#0b0d10');
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
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: .12 });

function attachReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
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

  const desc = currentLocale === 'id' ? (project.desc_id || '') : (project.desc_en || '');

  if (titleEl) titleEl.textContent = project.title || 'Project';
  if (descEl) descEl.textContent = desc;
  if (imgEl) {
    imgEl.src = project.img || 'assets/img/p1.svg';
    imgEl.alt = project.title || 'Project cover';
  }
  document.title = `${project.title} — Zuzlifatul Adnan`;

  // --- SEO meta updates ---
  const siteUrl = (PROFILE && PROFILE.siteUrl) ? PROFILE.siteUrl : 'https://zuzlifatuladnan.github.io/';
  const url = `${siteUrl}project-detail.html?id=${encodeURIComponent(project.id)}`;
  const imgAbs = (project.img && project.img.startsWith('http')) ? project.img : `${siteUrl}${project.img || 'assets/img/hero-dev.svg'}`;

  const setMeta = (id, attr, val) => { const el = document.getElementById(id); if (el && val) el.setAttribute(attr, val); };
  setMeta('canonicalLink', 'href', url);
  setMeta('ogUrl', 'content', url);
  setMeta('ogTitle', 'content', `${project.title} — Zuzlifatul Adnan`);
  setMeta('ogDesc', 'content', desc);
  setMeta('ogImage', 'content', imgAbs);

  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && desc) descMeta.setAttribute('content', desc);

  // --- JSON-LD CreativeWork structured data ---
  const oldLd = document.getElementById('projectLd');
  if (oldLd) oldLd.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'projectLd';
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "url": url,
    "image": imgAbs,
    "description": desc,
    "keywords": (project.tags || []).join(', '),
    "creator": {
      "@type": "Person",
      "name": "Zuzlifatul Adnan",
      "url": siteUrl
    },
    "inLanguage": currentLocale === 'id' ? 'id-ID' : 'en-US'
  });
  document.head.appendChild(ld);

  // --- JSON-LD BreadcrumbList (Google rich result: breadcrumb path in search) ---
  const oldBc = document.getElementById('breadcrumbLd');
  if (oldBc) oldBc.remove();
  const bc = document.createElement('script');
  bc.type = 'application/ld+json';
  bc.id = 'breadcrumbLd';
  const homeLabel = currentLocale === 'id' ? 'Beranda' : 'Home';
  const projectsLabel = currentLocale === 'id' ? 'Karya' : 'Projects';
  bc.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": homeLabel,     "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": projectsLabel, "item": siteUrl + "#projects" },
      { "@type": "ListItem", "position": 3, "name": project.title, "item": url }
    ]
  });
  document.head.appendChild(bc);

  // tags (use tech pills with logos)
  if (tagsEl) {
    tagsEl.innerHTML = renderTechPills(project.tags || []);
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
    stackEl.innerHTML = renderTechPills(project.tags || []);
  }

  // open link — hide entirely when no real demo
  const hasLink = project.link && project.link !== '#';
  if (openEl) {
    if (hasLink) {
      openEl.classList.remove('disabled');
      openEl.href = project.link;
      openEl.style.display = 'inline-flex';
    } else {
      openEl.style.display = 'none';
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
