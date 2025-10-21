// ====== Theme Toggle ======
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') root.classList.add('light');
document.getElementById('themeToggle').addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// ====== Basic dynamic content ======
document.getElementById('year').textContent = new Date().getFullYear();

// ====== Portfolio Data (edit here) ======
const PROFILE = {
  name: "ZUZLIFATUL ADNAN",
  title: "Full-Stack Web & Mobile Developer",
  email: "juslifatuladnan@gmail.com",
};
document.getElementById('brandName').textContent = PROFILE.name;
document.getElementById('footerName').textContent = PROFILE.name;
document.getElementById('heroTitle').textContent = PROFILE.name;
document.getElementById('emailLink').href = `mailto:${PROFILE.email}`;

const PROJECTS = [
  {
    title: "e‑SAKIP Kabupaten",
    desc_en: "Strategic Planning & KPI dashboard for government (CI4 + MySQL).",
    desc_id: "Dashboard Perencanaan & IKU pemerintah (CI4 + MySQL).",
    img: "assets/img/p1.svg",
    tags: ["CI4", "MySQL", "Dashboard"],
    link: "#"
  },
  {
    title: "PPID Portal",
    desc_en: "Public Information Disclosure portal with category & year filters.",
    desc_id: "Portal Keterbukaan Informasi Publik dengan filter kategori & tahun.",
    img: "assets/img/p2.svg",
    tags: ["CI4", "Bootstrap", "SEO"],
    link: "#"
  },
  {
    title: "Clean Wash Laundromart",
    desc_en: "PWA laundry app with WhatsApp notifications via Fonnte.",
    desc_id: "Aplikasi laundry PWA dengan notifikasi WhatsApp via Fonnte.",
    img: "assets/img/p3.svg",
    tags: ["Laravel", "PWA", "Fonnte"],
    link: "#"
  },
  {
    title: "SmartCanteen PWA",
    desc_en: "Canteen ordering with AI search & payment gateway.",
    desc_id: "Pemesanan kantin dengan pencarian AI & payment gateway.",
    img: "assets/img/p4.svg",
    tags: ["PWA", "Node.js", "Payments"],
    link: "#"
  },
  {
    title: "Absensi QR Kampus",
    desc_en: "QR-based attendance with geolocation & parent notification.",
    desc_id: "Absensi berbasis QR dengan geolokasi & notifikasi orang tua.",
    img: "assets/img/p5.svg",
    tags: ["Laravel", "QR", "Maps"],
    link: "#"
  },
  {
    title: "Backend Presensi LAPKIN",
    desc_en: "Express + Sequelize backend for attendance & HR modules.",
    desc_id: "Backend Express + Sequelize untuk presensi & SDM.",
    img: "assets/img/p6.svg",
    tags: ["Node.js", "Express", "Sequelize"],
    link: "#"
  }
];

const TESTIMONIALS = [
  {
    name: "Dinas Kominfo",
    role_en: "Province Partner",
    role_id: "Mitra Provinsi",
    avatar: "assets/img/a1.svg",
    rating: 5,
    text_en: "Delivered on time with strong security and clean UI.",
    text_id: "Tepat waktu, keamanan kuat, dan UI rapi."
  },
  {
    name: "Kampus IIB Darmajaya",
    role_en: "Academic Client",
    role_id: "Klien Akademik",
    avatar: "assets/img/a2.svg",
    rating: 5,
    text_en: "Great communication and reliable maintenance.",
    text_id: "Komunikasi bagus, maintenance bisa diandalkan."
  },
  {
    name: "UMKM Owner",
    role_en: "SME",
    role_id: "UMKM",
    avatar: "assets/img/a3.svg",
    rating: 4,
    text_en: "App boosted our orders significantly. Recommended!",
    text_id: "Aplikasi menaikkan pesanan kami. Rekomendasi!"
  }
];

// ====== Render Projects ======
const projectGrid = document.getElementById('projectGrid');
function renderProjects(locale = 'en') {
  projectGrid.innerHTML = '';
  PROJECTS.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card project-card reveal';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${locale === 'id' ? p.desc_id : p.desc_en}</p>
      <div class="meta">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div style="margin-top:10px">
        <a href="${p.link}" class="btn ghost" target="_blank" rel="noreferrer">${locale === 'id' ? 'Lihat' : 'View'}</a>
      </div>
    `;
    projectGrid.appendChild(card);
  });
}

// ====== Render Testimonials (Carousel) ======
const track = document.getElementById('testiTrack');
let slideIndex = 0;
function renderTestimonials(locale = 'en') {
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
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
}
document.getElementById('prevBtn').addEventListener('click', () => {
  slideIndex = (slideIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
  updateCarousel();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  slideIndex = (slideIndex + 1) % TESTIMONIALS.length;
  updateCarousel();
});
setInterval(() => {
  slideIndex = (slideIndex + 1) % TESTIMONIALS.length;
  updateCarousel();
}, 6000);

// ====== Reveal on scroll (IntersectionObserver) ======
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
langSelect.value = savedLang;

async function loadI18n(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  const dict = await res.json();
  // Replace elements with data-i18n keys
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const txt = key.split('.').reduce((o,k)=> (o||{})[k], dict);
    if (typeof txt === 'string') el.textContent = txt;
  });
  // Update dynamic locale content
  renderProjects(lang);
  renderTestimonials(lang);
  localStorage.setItem('lang', lang);
}
langSelect.addEventListener('change', (e) => loadI18n(e.target.value));

// Init
loadI18n(savedLang).then(() => {
  attachReveal();
});

