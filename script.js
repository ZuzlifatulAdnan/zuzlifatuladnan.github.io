// ====== Theme Toggle ======
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

// ====== Basic dynamic content ======
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ====== Profile ======
const brandName = document.getElementById('brandName');
const footerName = document.getElementById('footerName');
const heroTitle = document.getElementById('heroTitle');
const emailLink = document.getElementById('emailLink');
const yearsExp = document.getElementById('yearsExp');

if (brandName) brandName.textContent = PROFILE.name;
if (footerName) footerName.textContent = PROFILE.name;
if (heroTitle) heroTitle.textContent = PROFILE.name;
if (emailLink) emailLink.href = `mailto:${PROFILE.email}`;
if (yearsExp) yearsExp.textContent = PROFILE.experience;

// ====== Render Projects ======
const projectGrid = document.getElementById('projectGrid');
let currentLocale = localStorage.getItem('lang') || 'en';

function renderProjects(locale = 'en') {
  currentLocale = locale;
  if (!projectGrid) return;

  projectGrid.innerHTML = '';

  PROJECTS.forEach((p) => {
    const hasLink = p.link && p.link !== '#';

    const card = document.createElement('article');
    card.className = 'card project-card reveal';
    card.innerHTML = `
      <img class="project-cover" src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${locale === 'id' ? (p.desc_id || '') : (p.desc_en || '')}</p>
      ${renderTechPills(p.tags)}

      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <a class="btn btn-detail" href="project-detail.html?id=${encodeURIComponent(p.id)}">
          ${locale === 'id' ? 'Lihat Detail' : 'Details'}
        </a>

        <a href="${hasLink ? p.link : 'javascript:void(0)'}"
           class="btn btn-view ${hasLink ? '' : 'disabled'}"
           ${hasLink ? 'target="_blank" rel="noreferrer"' : ''}>
          ${locale === 'id' ? 'Lihat' : 'View'}
        </a>
      </div>
    `;
    projectGrid.appendChild(card);
  });
}

// ====== Render Testimonials (Carousel) ======
const track = document.getElementById('testiTrack');
let slideIndex = 0;

function renderTestimonials(locale = 'en') {
  if (!track) return;

  track.innerHTML = '';
  TESTIMONIALS.forEach(t => {
    const slide = document.createElement('div');
    slide.className = 'testi reveal';
    slide.innerHTML = `
      <div class="client">
        <img class="avatar" src="${t.avatar}" alt="${t.name}"/>
        <div>
          <strong>${t.name}</strong><br/>
          <span class="muted">${locale === 'id' ? t.role_id : t.role_en}</span>
        </div>
      </div>
      <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <p>"${locale === 'id' ? t.text_id : t.text_en}"</p>
    `;
    track.appendChild(slide);
  });

  slideIndex = 0;
  updateCarousel();
}

function updateCarousel() {
  if (!track || !TESTIMONIALS.length) return;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
}

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (!TESTIMONIALS.length) return;
    slideIndex = (slideIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    updateCarousel();
  });
}
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (!TESTIMONIALS.length) return;
    slideIndex = (slideIndex + 1) % TESTIMONIALS.length;
    updateCarousel();
  });
}

if (TESTIMONIALS.length > 1) {
  setInterval(() => {
    slideIndex = (slideIndex + 1) % TESTIMONIALS.length;
    updateCarousel();
  }, 6000);
}

// ====== Reveal on scroll ======
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .15 });

function attachReveal() {
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ====== I18N ======
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

    renderProjects(lang);
    renderTestimonials(lang);
    attachReveal();

    localStorage.setItem('lang', lang);
  } catch (err) {
    console.warn(err);
    renderProjects('en');
    renderTestimonials('en');
    attachReveal();
    localStorage.setItem('lang', 'en');
    if (langSelect) langSelect.value = 'en';
  }
}

if (langSelect) {
  langSelect.addEventListener('change', (e) => loadI18n(e.target.value));
}

// ====== Mobile nav toggle ======
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

// ====== Init ======
loadI18n(savedLang).then(() => {
  attachReveal();
});
