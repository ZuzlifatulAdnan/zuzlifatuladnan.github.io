// ====== Theme Toggle ======
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
    if (meta) meta.setAttribute('content', mode === 'light' ? '#fafafa' : '#0a0a0b');
  });
}

// ====== Tech logo mapping ======
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

function techKey(tag) {
  return String(tag || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()]/g, "")
    .replace(/\+/g, "");
}

function renderTechPills(tags) {
  const arr = Array.isArray(tags) ? tags : [];
  return `<div class="tech-wrap">${arr.map(t => {
    const key = techKey(t);
    const icon = TECH_ICONS[key];
    return icon
      ? `<span class="tech-pill"><img src="${icon}" alt="${t} logo" loading="lazy"><span>${t}</span></span>`
      : `<span class="tech-pill tech-pill--text"><span>${t}</span></span>`;
  }).join("")}</div>`;
}

// ====== Profile / static binds ======
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const brandName = document.getElementById('brandName');
const footerName = document.getElementById('footerName');
const heroTitle = document.getElementById('heroTitle');
const emailLink = document.getElementById('emailLink');
const yearsExp = document.getElementById('yearsExp');
const heroYears = document.getElementById('heroYears');

if (brandName) brandName.textContent = PROFILE.name;
if (footerName) footerName.textContent = PROFILE.name;
if (heroTitle) heroTitle.textContent = PROFILE.name;
if (emailLink) emailLink.href = `mailto:${PROFILE.email}`;
if (yearsExp) yearsExp.textContent = PROFILE.experience;

// ====== Core skills (data-skills placeholders) ======
function renderDataSkills() {
  document.querySelectorAll('[data-skills]').forEach(el => {
    const tags = el.dataset.skills.split(',').map(s => s.trim()).filter(Boolean);
    el.outerHTML = renderTechPills(tags);
  });
}

// ====== Marquee ======
function renderMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track || typeof MARQUEE_ITEMS === 'undefined') return;
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  track.innerHTML = items.map(name => {
    const icon = TECH_ICONS[techKey(name)];
    return `<span class="marquee-item">${icon ? `<img src="${icon}" alt="" loading="lazy" />` : ''}<span>${name}</span></span>`;
  }).join('');
}

// ====== GitHub stats ======
const GH_CACHE_KEY = 'gh_cache_v3';
const GH_CACHE_TTL = 1000 * 60 * 30; // 30 minutes
let ghFetched = false;

async function fetchGitHub(locale = 'en') {
  if (ghFetched) return;
  if (typeof GITHUB === 'undefined' || !GITHUB.username) {
    console.warn('[gh] GITHUB config missing');
    return;
  }

  const card = document.getElementById('ghStatsCard');
  const repoList = document.getElementById('ghRepoList');

  // Try cache first
  const cached = readGhCache();
  if (cached) {
    try {
      renderGitHub(cached, locale);
      ghFetched = true;
      return;
    } catch (e) {
      console.warn('[gh] cached render failed, refetching', e);
      try { localStorage.removeItem(GH_CACHE_KEY); } catch {}
    }
  }

  if (card) card.classList.add('loading');
  if (repoList) {
    const msg = locale === 'id' ? 'Memuat data dari GitHub…' : 'Loading from GitHub…';
    repoList.innerHTML = `<li class="gh-repo placeholder">${msg}</li>`;
  }

  try {
    console.log('[gh] fetching for', GITHUB.username);
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB.apiBase}/users/${GITHUB.username}`, { headers: { Accept: 'application/vnd.github+json' } }),
      fetch(`${GITHUB.apiBase}/users/${GITHUB.username}/repos?per_page=100&sort=updated`, { headers: { Accept: 'application/vnd.github+json' } })
    ]);
    console.log('[gh] status', userRes.status, reposRes.status);
    if (!userRes.ok) throw new Error(`User API ${userRes.status}`);
    if (!reposRes.ok) throw new Error(`Repos API ${reposRes.status}`);

    const user = await userRes.json();
    const repos = await reposRes.json();
    if (!Array.isArray(repos)) throw new Error('repos response is not an array');

    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const topRepos = [...repos]
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
      .slice(0, GITHUB.topReposLimit);

    const data = {
      avatar: user.avatar_url || '',
      name: user.name || user.login || GITHUB.username,
      login: user.login || GITHUB.username,
      bio: user.bio || '',
      profileUrl: user.html_url || `https://github.com/${GITHUB.username}`,
      public_repos: Number(user.public_repos) || 0,
      followers: Number(user.followers) || 0,
      following: Number(user.following) || 0,
      totalStars,
      updatedAt: new Date().toISOString(),
      topRepos: topRepos.map(r => ({
        name: r.name,
        description: r.description || '',
        url: r.html_url,
        stars: r.stargazers_count || 0,
        language: r.language || ''
      }))
    };

    writeGhCache(data);
    try {
      renderGitHub(data, locale);
      ghFetched = true;
      console.log('[gh] rendered', data.login, data.public_repos, 'repos,', data.totalStars, 'stars');
    } catch (renderErr) {
      console.error('[gh] render failed', renderErr);
      throw renderErr;
    }
  } catch (err) {
    console.warn('[gh] fetch failed:', err);
    if (repoList) {
      const msg = locale === 'id'
        ? 'Tidak bisa terhubung ke GitHub saat ini. Silakan coba lagi nanti.'
        : "Couldn't reach GitHub right now. Please try again later.";
      repoList.innerHTML = `<li class="gh-repo placeholder error">${msg}</li>`;
    }
  } finally {
    if (card) card.classList.remove('loading');
  }
}

function readGhCache() {
  try {
    const raw = localStorage.getItem(GH_CACHE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.updatedAt) return null;
    if (Date.now() - new Date(obj.updatedAt).getTime() > GH_CACHE_TTL) return null;
    if (!Array.isArray(obj.topRepos)) return null;
    return obj;
  } catch { return null; }
}
function writeGhCache(data) {
  try { localStorage.setItem(GH_CACHE_KEY, JSON.stringify(data)); } catch {}
}

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', PHP: '#4F5D95',
  Dart: '#00B4AB', Kotlin: '#A97BFF', Java: '#b07219',
  Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c',
  Vue: '#41b883', Go: '#00ADD8', Ruby: '#701516', Shell: '#89e051'
};

function renderGitHub(data, locale = 'en') {
  if (!data) return;
  const $ = (id) => document.getElementById(id);
  const num = (v) => Number(v || 0).toLocaleString();

  const avatar = $('ghAvatar');
  if (avatar && data.avatar) { avatar.src = data.avatar; avatar.alt = data.name || ''; }
  if ($('ghName'))      $('ghName').textContent = data.name || data.login || '';
  if ($('ghLogin'))     { $('ghLogin').textContent = '@' + (data.login || ''); if (data.profileUrl) $('ghLogin').href = data.profileUrl; }
  if ($('ghBio'))       $('ghBio').textContent = data.bio || '';
  if ($('ghRepos'))     $('ghRepos').textContent = num(data.public_repos);
  if ($('ghStars'))     $('ghStars').textContent = num(data.totalStars);
  if ($('ghFollowers')) $('ghFollowers').textContent = num(data.followers);
  if ($('ghFollowing')) $('ghFollowing').textContent = num(data.following);
  if ($('ghProfile') && data.profileUrl) $('ghProfile').href = data.profileUrl;
  if ($('ghUpdated') && data.updatedAt) {
    try {
      const d = new Date(data.updatedAt);
      const label = locale === 'id' ? 'Diperbarui' : 'Updated';
      $('ghUpdated').textContent = `${label} ${d.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;
    } catch {}
  }

  const list = $('ghRepoList');
  const topRepos = Array.isArray(data.topRepos) ? data.topRepos : [];
  if (list) {
    if (!topRepos.length) {
      list.innerHTML = `<li class="gh-repo placeholder">${locale === 'id' ? 'Belum ada repository publik.' : 'No public repositories yet.'}</li>`;
    } else {
      list.innerHTML = topRepos.map(r => {
        const stars = Number(r.stars || 0).toLocaleString();
        const lang = r.language ? `<span class="gh-lang"><span class="gh-lang-dot" style="background:${LANG_COLORS[r.language] || '#888'}"></span>${escapeHtml(r.language)}</span>` : '';
        const desc = r.description ? `<p class="gh-repo-desc">${escapeHtml(r.description)}</p>` : '';
        return `
          <li class="gh-repo">
            <a class="gh-repo-link" href="${escapeHtml(r.url || '#')}" target="_blank" rel="noreferrer">
              <div class="gh-repo-head">
                <strong>${escapeHtml(r.name || '')}</strong>
                <span class="gh-repo-stars" title="Stars">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ${stars}
                </span>
              </div>
              ${desc}
              ${lang}
            </a>
          </li>`;
      }).join('');
    }
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

// ====== Stack groups ======
// Stack content is rendered as static HTML in index.html for SEO & reliability.
// This function only fills in groups dynamically if the static markup is empty.
function renderStackGroups(locale = 'en') {
  const grid = document.getElementById('stackGrid');
  if (!grid || typeof STACK_GROUPS === 'undefined') return;
  if (grid.children.length > 0) return; // static HTML already present
  grid.innerHTML = STACK_GROUPS.map(group => {
    const title = locale === 'id' ? group.title_id : group.title_en;
    const items = group.items.map(name => {
      const icon = TECH_ICONS[techKey(name)];
      return `<div class="stack-item">${icon ? `<img src="${icon}" alt="${name} logo" loading="lazy" />` : ''}<span>${name}</span></div>`;
    }).join('');
    return `
      <article class="stack-group">
        <h3>${title}</h3>
        <div class="stack-items">${items}</div>
      </article>`;
  }).join('');
}

// ====== Stats counter ======
function animateCounter(el) {
  const parent = el.parentElement;
  const raw = el.getAttribute('data-count') || (parent && parent.getAttribute('data-count')) || '0';
  const target = Number(raw);
  if (!target || Number.isNaN(target)) { el.textContent = raw; return; }
  // Set final value immediately as a safety net — animation will overwrite during play
  el.textContent = '0';
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * ease).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

let statsFired = false;
function initStats() {
  if (statsFired) return;
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  const counters = grid.querySelectorAll('.counter');
  if (!counters.length) return;
  statsFired = true;
  // Fire immediately — stats are above-the-fold and the animation is brief.
  counters.forEach(c => animateCounter(c));
}

// ====== Packages ======
const packagesGrid = document.getElementById('packagesGrid');

function renderPackages(locale = 'en') {
  if (!packagesGrid || typeof PACKAGES === 'undefined') return;
  packagesGrid.innerHTML = '';

  PACKAGES.forEach(p => {
    const title = locale === 'id' ? p.title_id : p.title_en;
    const desc = locale === 'id' ? p.desc_id : p.desc_en;
    const features = (locale === 'id' ? p.features_id : p.features_en) || [];
    const cta = locale === 'id' ? p.cta_id : p.cta_en;
    const price = p.price || (locale === 'id' ? p.price_id : p.price_en);
    const recommendedLabel = locale === 'id' ? 'Rekomendasi' : 'Popular';

    const card = document.createElement('article');
    card.className = 'pricing-card reveal' + (p.recommended ? ' recommended' : '');
    card.innerHTML = `
      ${p.recommended ? `<span class="recommended-badge">${recommendedLabel}</span>` : ''}
      <h3>${title}</h3>
      <p class="muted">${desc}</p>
      <div class="price-block">
        ${p.priceOld ? `<span class="price-old">${p.priceOld}</span>` : ''}
        <span class="price">${price}</span>
      </div>
      <ul class="check-list">
        ${features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <a href="#contact" class="btn ${p.recommended ? 'primary' : 'ghost'}">${cta}</a>
    `;
    packagesGrid.appendChild(card);
  });
}

// ====== Projects + filters ======
const projectGrid = document.getElementById('projectGrid');
const projectFiltersEl = document.getElementById('projectFilters');
let currentLocale = localStorage.getItem('lang') || 'id';
let activeFilter = 'all';

function renderProjectFilters(locale = 'en') {
  if (!projectFiltersEl || typeof PROJECT_FILTERS === 'undefined') return;
  projectFiltersEl.innerHTML = '';
  PROJECT_FILTERS.forEach(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn' + (f.key === activeFilter ? ' active' : '');
    btn.dataset.filter = f.key;
    btn.textContent = locale === 'id' ? f.label_id : f.label_en;
    btn.addEventListener('click', () => {
      activeFilter = f.key;
      projectFiltersEl.querySelectorAll('button').forEach(b =>
        b.classList.toggle('active', b.dataset.filter === activeFilter)
      );
      renderProjects(currentLocale);
    });
    projectFiltersEl.appendChild(btn);
  });
}

function renderProjects(locale = 'en') {
  currentLocale = locale;
  if (!projectGrid) return;

  const list = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  projectGrid.innerHTML = '';
  const viewLabel = locale === 'id' ? 'Lihat detail' : 'View case';

  list.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'project-card reveal';
    card.innerHTML = `
      <div class="project-cover-wrap">
        <img class="project-cover" src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p>${locale === 'id' ? (p.desc_id || '') : (p.desc_en || '')}</p>
        ${renderTechPills(p.tags)}
        <div class="project-actions">
          <a class="project-link" href="projects/${encodeURIComponent(p.id)}/">
            <span>${viewLabel}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
        </div>
      </div>
    `;
    projectGrid.appendChild(card);
  });

  attachReveal();
}

// ====== Testimonials Carousel ======
const track = document.getElementById('testiTrack');
const dotsEl = document.getElementById('testiDots');
const carouselEl = document.getElementById('testiCarousel');
let slideIndex = 0;
let autoTimer = null;

function renderTestimonials(locale = 'en') {
  if (!track) return;

  track.innerHTML = '';
  TESTIMONIALS.forEach(t => {
    const slide = document.createElement('div');
    slide.className = 'testi';
    slide.innerHTML = `
      <p>"${locale === 'id' ? t.text_id : t.text_en}"</p>
      <div class="client">
        <img class="avatar" src="${t.avatar}" alt="${t.name}" loading="lazy"/>
        <div class="client-info">
          <strong>${t.name}</strong>
          <span class="muted">${locale === 'id' ? t.role_id : t.role_en}</span>
        </div>
        <span class="stars" style="margin-left:auto" aria-label="${t.rating} out of 5">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</span>
      </div>
    `;
    track.appendChild(slide);
  });

  renderDots();
  slideIndex = 0;
  updateCarousel();
}

function renderDots() {
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  TESTIMONIALS.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === slideIndex ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    btn.addEventListener('click', () => {
      slideIndex = i;
      updateCarousel();
      restartAuto();
    });
    dotsEl.appendChild(btn);
  });
}

function updateCarousel() {
  if (!track || !TESTIMONIALS.length) return;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
  if (dotsEl) {
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === slideIndex);
      d.setAttribute('aria-selected', i === slideIndex ? 'true' : 'false');
    });
  }
}

function startAuto() {
  if (TESTIMONIALS.length <= 1) return;
  stopAuto();
  autoTimer = setInterval(() => {
    slideIndex = (slideIndex + 1) % TESTIMONIALS.length;
    updateCarousel();
  }, 6500);
}
function stopAuto() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}
function restartAuto() { stopAuto(); startAuto(); }

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (prevBtn) prevBtn.addEventListener('click', () => {
  if (!TESTIMONIALS.length) return;
  slideIndex = (slideIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
  updateCarousel();
  restartAuto();
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  if (!TESTIMONIALS.length) return;
  slideIndex = (slideIndex + 1) % TESTIMONIALS.length;
  updateCarousel();
  restartAuto();
});

if (carouselEl) {
  carouselEl.addEventListener('mouseenter', stopAuto);
  carouselEl.addEventListener('mouseleave', startAuto);
  carouselEl.addEventListener('focusin', stopAuto);
  carouselEl.addEventListener('focusout', startAuto);
}

// ====== Reveal on scroll ======
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

// ====== I18N ======
const langSelect = document.getElementById('langSelect');
const savedLang = localStorage.getItem('lang') || 'id';
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

    if (heroYears) {
      heroYears.textContent = lang === 'id'
        ? `${PROFILE.experience.replace('+ years', '+ tahun pengalaman')}`
        : `${PROFILE.experience} experience`;
    }

    renderDataSkills();
    renderMarquee();
    renderStackGroups(lang);
    renderProjectFilters(lang);
    renderPackages(lang);
    renderProjects(lang);
    renderTestimonials(lang);
    attachReveal();
    startAuto();
    initStats();
    fetchGitHub(lang);

    localStorage.setItem('lang', lang);
  } catch (err) {
    console.warn(err);
    renderDataSkills();
    renderMarquee();
    renderStackGroups('en');
    renderProjectFilters('en');
    renderPackages('en');
    renderProjects('en');
    renderTestimonials('en');
    attachReveal();
    startAuto();
    initStats();
    fetchGitHub('en');
    localStorage.setItem('lang', 'id');
    if (langSelect) langSelect.value = 'id';
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

// ====== Contact form: build mailto compose link ======
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const subjectInput = (data.get('subject') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      if (formStatus) formStatus.textContent = currentLocale === 'id'
        ? 'Mohon lengkapi nama, email, dan pesan.'
        : 'Please fill in name, email, and message.';
      return;
    }

    const subject = encodeURIComponent(subjectInput || `Project inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    if (formStatus) formStatus.textContent = currentLocale === 'id'
      ? 'Membuka aplikasi email Anda…'
      : 'Opening your email app…';

    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  });
}

// ====== Init ======
loadI18n(savedLang);

// Fallback: ensure stats + GitHub run even if loadI18n is delayed/cached
function _initFallbacks() {
  setTimeout(() => {
    initStats();
    const lang = (typeof currentLocale !== 'undefined' && currentLocale) || localStorage.getItem('lang') || 'id';
    fetchGitHub(lang);
  }, 50);
}
window.addEventListener('load', _initFallbacks);
document.addEventListener('DOMContentLoaded', _initFallbacks);
