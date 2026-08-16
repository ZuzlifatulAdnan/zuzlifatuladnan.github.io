// ===========================================================================
//  Generator halaman statis SEO
//  Jalankan:  node tools/build-seo.mjs
//
//  Menghasilkan:
//    /projects/index.html            -> halaman hub portofolio
//    /projects/<id>/index.html       -> 9 halaman studi kasus (konten asli di HTML)
//    /layanan/<slug>/index.html      -> halaman layanan untuk kata kunci long-tail
//    /sitemap.xml                    -> sitemap yang selalu sinkron dengan isi situs
//
//  Kenapa halaman statis: sebelumnya seluruh proyek memakai satu file
//  project-detail.html?id=xxx yang isinya diisi JavaScript. Judul, deskripsi,
//  dan teksnya identik untuk 9 URL, sehingga Google membacanya sebagai halaman
//  duplikat tanpa konten. Halaman di bawah ini punya HTML asli sejak byte
//  pertama, jadi tidak bergantung pada rendering JavaScript.
// ===========================================================================
import fs from 'node:fs';
import path from 'node:path';
import { loadData, ROOT } from './load-data.mjs';

const SITE = 'https://zuzlifatuladnan.github.io';
const TODAY = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

const { PROJECTS } = loadData();
const SEO = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'content', 'projects.seo.json'), 'utf8')
);
const SERVICES = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'content', 'services.seo.json'), 'utf8')
);

const CATEGORY_LABEL = {
  web: 'Aplikasi Web',
  mobile: 'Aplikasi Mobile',
  dashboard: 'Dashboard & Sistem Informasi',
};

// --------------------------------------------------------------------------
// Utilitas
// --------------------------------------------------------------------------
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const jsonld = (obj) =>
  `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;

function write(relPath, html) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
  console.log('  ->', relPath.replace(/\\/g, '/'));
}

/** Potong deskripsi di batas kata agar tidak terpenggal di hasil pencarian. */
function clampDesc(text, max = 158) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\-]$/, '') + '…';
}

// --------------------------------------------------------------------------
// Kerangka halaman (header + footer sama seperti halaman utama)
// --------------------------------------------------------------------------
function layout({ base, head, breadcrumbLinks, body, jsonLdBlocks }) {
  const crumbs = breadcrumbLinks
    .map((c, i) => {
      const sep =
        i === 0
          ? ''
          : '<span class="crumb-sep" aria-hidden="true">/</span>';
      return c.href
        ? `${sep}<a href="${c.href}">${esc(c.name)}</a>`
        : `${sep}<span aria-current="page">${esc(c.name)}</span>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
${head}
  <link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml"/>
  <link rel="apple-touch-icon" href="${base}assets/img/apple-touch-icon.png"/>
  <link rel="manifest" href="${base}site.webmanifest"/>
  <meta name="theme-color" content="#0a0a0b"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}styles.css"/>

  <!-- Terapkan tema tersimpan sebelum halaman dilukis agar tidak berkedip. -->
  <script>try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light')}catch(e){}</script>

${jsonLdBlocks.map((b) => '  ' + b).join('\n')}
</head>
<body>
  <a class="skip-link" href="#main">Lewati ke konten</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${base}">
        <span class="logo">ZA</span>
        <span class="brand-name">Zuzlifatul Adnan</span>
      </a>

      <nav class="nav" id="navMenu">
        <a href="${base}#about">Tentang</a>
        <a href="${base}#services">Layanan</a>
        <a href="${base}projects/">Portofolio</a>
        <a href="${base}#packages">Paket</a>
        <a href="${base}#faq">FAQ</a>
        <a href="${base}#contact" class="nav-contact-only btn primary">Kontak</a>
      </nav>

      <div class="actions">
        <button id="themeToggle" class="icon-btn" aria-label="Ganti tema" title="Ganti tema terang/gelap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <a href="${base}#contact" class="btn primary" style="margin-left:4px;">Konsultasi Gratis</a>
        <button id="navToggle" class="icon-btn nav-toggle" aria-label="Buka menu" aria-expanded="false" title="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <main id="main">
    <nav class="breadcrumb-bar" aria-label="Breadcrumb">
      <div class="container breadcrumb">${crumbs}</div>
    </nav>
${body}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${base}">
            <span class="logo">ZA</span>
            <span>Zuzlifatul Adnan</span>
          </a>
          <p class="footer-tagline muted">Full-Stack Web &amp; Mobile Developer di Lampung, Indonesia. Laravel, Flutter, dan Kotlin.</p>
        </div>

        <div class="footer-col">
          <h4>Layanan</h4>
          <ul>
${SERVICES.map((s) => `            <li><a href="${base}layanan/${s.slug}/">${esc(s.navLabel)}</a></li>`).join('\n')}
          </ul>
        </div>

        <div class="footer-col">
          <h4>Portofolio</h4>
          <ul>
${PROJECTS.slice(0, 5)
  .map((p) => `            <li><a href="${base}projects/${p.id}/">${esc(p.title)}</a></li>`)
  .join('\n')}
            <li><a href="${base}projects/">Semua proyek</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Kontak</h4>
          <ul>
            <li><a href="mailto:juslifatuladnan@gmail.com">juslifatuladnan@gmail.com</a></li>
            <li><a href="https://github.com/ZuzlifatulAdnan" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="${base}#contact">Form konsultasi</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© <span id="year"></span> Zuzlifatul Adnan. Seluruh hak cipta dilindungi.</p>
        <p class="muted">Dibangun dengan Laravel · Flutter · Kotlin</p>
      </div>
    </div>
  </footer>

  <script src="${base}page.js" defer></script>
</body>
</html>
`;
}

/** Blok meta yang sama polanya untuk semua halaman statis. */
function metaHead({ title, desc, url, image, imageAlt, keywords }) {
  return `  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}"/>
  <meta name="keywords" content="${esc(keywords.join(', '))}"/>
  <meta name="author" content="Zuzlifatul Adnan"/>
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1"/>
  <link rel="canonical" href="${url}"/>

  <meta property="og:type" content="article"/>
  <meta property="og:site_name" content="Zuzlifatul Adnan"/>
  <meta property="og:locale" content="id_ID"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:title" content="${esc(title)}"/>
  <meta property="og:description" content="${esc(desc)}"/>
  <meta property="og:image" content="${image}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:alt" content="${esc(imageAlt)}"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@ZuzlifatulAdnan"/>
  <meta name="twitter:title" content="${esc(title)}"/>
  <meta name="twitter:description" content="${esc(desc)}"/>
  <meta name="twitter:image" content="${image}"/>`;
}

const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

const faqLd = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const ctaBlock = (base, heading, text) => `
    <section class="section alt">
      <div class="container">
        <div class="cta-panel">
          <h2>${esc(heading)}</h2>
          <p class="lead">${esc(text)}</p>
          <div class="cta-actions">
            <a class="btn primary" href="${base}#contact">Konsultasi gratis</a>
            <a class="btn ghost" href="${base}projects/">Lihat portofolio lain</a>
          </div>
        </div>
      </div>
    </section>`;

// --------------------------------------------------------------------------
// 1. Halaman studi kasus per proyek
// --------------------------------------------------------------------------
function buildProjectPage(project) {
  const seo = SEO[project.id];
  if (!seo) throw new Error(`Konten SEO belum ditulis untuk proyek: ${project.id}`);

  const base = '../../';
  const url = `${SITE}/projects/${project.id}/`;
  const image = `${SITE}/assets/img/og/${project.id}.png`;
  // Tanpa akhiran nama: Google memotong judul di sekitar 60 karakter, jadi
  // ruang yang ada dipakai untuk kata kunci. Nama situs tetap ditampilkan
  // Google sendiri di bawah judul.
  const title = seo.seoTitle;
  const desc = clampDesc(seo.metaDesc);
  const category = CATEGORY_LABEL[project.category] || 'Proyek';
  const details = project.details_id || project.details_en || [];

  const related = PROJECTS.filter((p) => p.id !== project.id)
    .sort((a, b) => {
      const score = (p) => (p.category === project.category ? 0 : 1);
      return score(a) - score(b);
    })
    .slice(0, 3);

  const body = `
    <article class="section">
      <div class="container">
        <div class="case-head">
          <p class="eyebrow">Studi Kasus · ${esc(category)}</p>
          <h1>${esc(project.title)}</h1>
          <p class="lead">${esc(seo.lead)}</p>
          <div class="case-tags">
${project.tags.map((t) => `            <span class="tech-pill">${esc(t)}</span>`).join('\n')}
          </div>
        </div>

        <figure class="case-figure">
          <img src="${base}${project.img}" width="1200" height="800"
               alt="Tampilan ${esc(project.title)} — ${esc(category.toLowerCase())} oleh Zuzlifatul Adnan"/>
          <figcaption class="muted">${esc(project.desc_id || project.desc_en)}</figcaption>
        </figure>

        <div class="case-grid">
          <div class="case-main">
${seo.sections
  .map(
    (s) => `            <h2>${esc(s.h2)}</h2>
            <p>${esc(s.p)}</p>`
  )
  .join('\n\n')}

            <h2>Fitur utama yang dibangun</h2>
            <ul class="detail-list">
${details.map((d) => `              <li>${esc(d)}</li>`).join('\n')}
            </ul>
          </div>

          <aside class="case-side">
            <div class="card">
              <h3>Ringkasan proyek</h3>
              <dl class="spec-list">
                <dt>Kategori</dt><dd>${esc(category)}</dd>
                <dt>Teknologi</dt><dd>${esc(project.tags.join(', '))}</dd>
                <dt>Peran</dt><dd>Full-stack developer (analisis, backend, frontend, deployment)</dd>
                <dt>Lokasi</dt><dd>Lampung, Indonesia — dikerjakan remote</dd>
              </dl>
${
  project.link && project.link !== '#'
    ? `              <a class="btn primary" style="margin-top:16px;" href="${esc(project.link)}" target="_blank" rel="noreferrer">Lihat repository</a>`
    : ''
}
              <a class="btn ghost" style="margin-top:10px;" href="${base}#contact">Butuh sistem serupa?</a>
            </div>
          </aside>
        </div>

        <section class="case-faq">
          <h2>Pertanyaan seputar proyek ini</h2>
          <div class="faq-list">
${seo.faq
  .map(
    (f) => `            <details class="faq-item">
              <summary>${esc(f.q)}</summary>
              <div class="faq-body">${esc(f.a)}</div>
            </details>`
  )
  .join('\n')}
          </div>
        </section>

        <section class="related">
          <h2>Proyek lain yang mungkin relevan</h2>
          <div class="related-grid">
${related
  .map(
    (r) => `            <a class="related-card" href="${base}projects/${r.id}/">
              <img src="${base}${r.img}" width="1200" height="800" loading="lazy" alt="${esc(r.title)}"/>
              <div>
                <h3>${esc(r.title)}</h3>
                <p class="muted">${esc(clampDesc(r.desc_id || r.desc_en, 100))}</p>
              </div>
            </a>`
  )
  .join('\n')}
          </div>
        </section>
      </div>
    </article>
${ctaBlock(
  base,
  'Ingin sistem seperti ini untuk organisasi Anda?',
  'Ceritakan kebutuhan, target waktu, dan anggaran Anda. Saya balas dalam satu hari kerja dengan estimasi dan rencana pengerjaan.'
)}`;

  const html = layout({
    base,
    head: metaHead({
      title,
      desc,
      url,
      image,
      imageAlt: `${project.title} — studi kasus oleh Zuzlifatul Adnan`,
      keywords: seo.keywords,
    }),
    breadcrumbLinks: [
      { name: 'Beranda', href: base },
      { name: 'Portofolio', href: `${base}projects/` },
      { name: project.title },
    ],
    jsonLdBlocks: [
      jsonld(
        breadcrumbLd([
          { name: 'Beranda', url: `${SITE}/` },
          { name: 'Portofolio', url: `${SITE}/projects/` },
          { name: project.title, url },
        ])
      ),
      jsonld({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: seo.seoTitle,
        description: seo.metaDesc,
        url,
        image,
        inLanguage: 'id-ID',
        keywords: seo.keywords.join(', '),
        genre: category,
        dateModified: TODAY,
        author: {
          '@type': 'Person',
          name: 'Zuzlifatul Adnan',
          url: `${SITE}/`,
          jobTitle: 'Full-Stack Web & Mobile Developer',
        },
        creator: { '@type': 'Person', name: 'Zuzlifatul Adnan' },
        about: project.tags.map((t) => ({ '@type': 'Thing', name: t })),
        isPartOf: { '@type': 'WebSite', name: 'Zuzlifatul Adnan', url: `${SITE}/` },
      }),
      jsonld(faqLd(seo.faq)),
    ],
    body,
  });

  write(path.join('projects', project.id, 'index.html'), html);
}

// --------------------------------------------------------------------------
// 2. Halaman hub portofolio (/projects/)
// --------------------------------------------------------------------------
function buildProjectsHub() {
  const base = '../';
  const url = `${SITE}/projects/`;
  const title = 'Portofolio Proyek — Website, Aplikasi & Sistem Informasi';
  const desc = clampDesc(
    'Kumpulan studi kasus proyek nyata: CMS sekolah, sistem akademik, POS, aplikasi absensi QR, aplikasi laundry, dan sistem informasi berbasis Laravel, Kotlin, serta Flutter.'
  );

  const cards = PROJECTS.map((p) => {
    const seo = SEO[p.id];
    return `          <article class="project-card">
            <a class="project-cover-wrap" href="${base}projects/${p.id}/" aria-label="${esc(p.title)}">
              <img class="project-cover" src="${base}${p.img}" width="1200" height="800" loading="lazy" alt="${esc(p.title)} — ${esc(CATEGORY_LABEL[p.category] || 'Proyek')}"/>
            </a>
            <div class="project-body">
              <p class="eyebrow">${esc(CATEGORY_LABEL[p.category] || 'Proyek')}</p>
              <h2><a href="${base}projects/${p.id}/">${esc(p.title)}</a></h2>
              <p>${esc(clampDesc(seo ? seo.metaDesc : p.desc_id, 150))}</p>
              <div class="case-tags">
${p.tags.map((t) => `                <span class="tech-pill">${esc(t)}</span>`).join('\n')}
              </div>
              <div class="project-actions">
                <a class="project-link" href="${base}projects/${p.id}/">
                  <span>Baca studi kasus</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </a>
              </div>
            </div>
          </article>`;
  }).join('\n');

  const body = `
    <section class="section">
      <div class="container">
        <div class="case-head">
          <p class="eyebrow">Portofolio</p>
          <h1>Studi kasus proyek yang pernah saya kerjakan</h1>
          <p class="lead">Sembilan proyek nyata di bidang pendidikan, pemerintahan, dan bisnis — mulai dari CMS profil sekolah, sistem akademik, aplikasi kasir, hingga aplikasi Android untuk absensi dan layanan laundry. Setiap halaman menjelaskan masalah yang dihadapi, pendekatan teknis yang dipilih, dan hasil akhirnya.</p>
        </div>

        <div class="projects-grid">
${cards}
        </div>
      </div>
    </section>
${ctaBlock(
  base,
  'Punya kebutuhan yang mirip?',
  'Sebagian besar proyek di atas berawal dari masalah operasional sederhana. Ceritakan kondisi Anda dan saya bantu rumuskan solusinya.'
)}`;

  const html = layout({
    base,
    head: metaHead({
      title,
      desc,
      url,
      image: `${SITE}/assets/img/og-image.png`,
      imageAlt: 'Portofolio proyek Zuzlifatul Adnan',
      keywords: [
        'portofolio web developer',
        'contoh project Laravel',
        'studi kasus aplikasi',
        'portofolio programmer Indonesia',
        'contoh aplikasi Kotlin',
      ],
    }),
    breadcrumbLinks: [{ name: 'Beranda', href: base }, { name: 'Portofolio' }],
    jsonLdBlocks: [
      jsonld(
        breadcrumbLd([
          { name: 'Beranda', url: `${SITE}/` },
          { name: 'Portofolio', url },
        ])
      ),
      jsonld({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Portofolio Proyek — Zuzlifatul Adnan',
        description: desc,
        url,
        inLanguage: 'id-ID',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: PROJECTS.length,
          itemListElement: PROJECTS.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            url: `${SITE}/projects/${p.id}/`,
          })),
        },
      }),
    ],
    body,
  });

  write(path.join('projects', 'index.html'), html);
}

// --------------------------------------------------------------------------
// 3. Halaman layanan (kata kunci long-tail)
// --------------------------------------------------------------------------
function buildServicePage(service) {
  const base = '../../';
  const url = `${SITE}/layanan/${service.slug}/`;
  const title = service.seoTitle;
  const desc = clampDesc(service.metaDesc);

  const relatedProjects = service.projects
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter(Boolean);

  const body = `
    <section class="section">
      <div class="container">
        <div class="case-head">
          <p class="eyebrow">${esc(service.eyebrow)}</p>
          <h1>${esc(service.h1)}</h1>
          <p class="lead">${esc(service.lead)}</p>
          <div class="cta-actions" style="margin-top:22px;">
            <a class="btn primary" href="${base}#contact">Minta penawaran</a>
            <a class="btn ghost" href="${base}#packages">Lihat daftar harga</a>
          </div>
        </div>

        <div class="case-grid">
          <div class="case-main">
${service.sections
  .map(
    (s) => `            <h2>${esc(s.h2)}</h2>
            <p>${esc(s.p)}</p>`
  )
  .join('\n\n')}

            <h2>Yang Anda dapatkan</h2>
            <ul class="detail-list">
${service.deliverables.map((d) => `              <li>${esc(d)}</li>`).join('\n')}
            </ul>
          </div>

          <aside class="case-side">
            <div class="card">
              <h3>Ringkas</h3>
              <dl class="spec-list">
                <dt>Teknologi</dt><dd>${esc(service.stack.join(', '))}</dd>
                <dt>Estimasi waktu</dt><dd>${esc(service.timeline)}</dd>
                <dt>Mulai dari</dt><dd>${esc(service.priceFrom)}</dd>
                <dt>Area layanan</dt><dd>Lampung &amp; seluruh Indonesia (remote)</dd>
              </dl>
              <a class="btn primary" style="margin-top:16px;" href="${base}#contact">Konsultasi gratis</a>
            </div>
          </aside>
        </div>

${
  relatedProjects.length
    ? `        <section class="related">
          <h2>Contoh pengerjaan nyata</h2>
          <div class="related-grid">
${relatedProjects
  .map(
    (r) => `            <a class="related-card" href="${base}projects/${r.id}/">
              <img src="${base}${r.img}" width="1200" height="800" loading="lazy" alt="${esc(r.title)}"/>
              <div>
                <h3>${esc(r.title)}</h3>
                <p class="muted">${esc(clampDesc(r.desc_id || r.desc_en, 100))}</p>
              </div>
            </a>`
  )
  .join('\n')}
          </div>
        </section>`
    : ''
}

        <section class="case-faq">
          <h2>Pertanyaan yang sering ditanyakan</h2>
          <div class="faq-list">
${service.faq
  .map(
    (f) => `            <details class="faq-item">
              <summary>${esc(f.q)}</summary>
              <div class="faq-body">${esc(f.a)}</div>
            </details>`
  )
  .join('\n')}
          </div>
        </section>
      </div>
    </section>
${ctaBlock(base, service.ctaHeading, service.ctaText)}`;

  const html = layout({
    base,
    head: metaHead({
      title,
      desc,
      url,
      image: `${SITE}/assets/img/og-image.png`,
      imageAlt: service.h1,
      keywords: service.keywords,
    }),
    breadcrumbLinks: [
      { name: 'Beranda', href: base },
      { name: 'Layanan', href: `${base}#services` },
      { name: service.navLabel },
    ],
    jsonLdBlocks: [
      jsonld(
        breadcrumbLd([
          { name: 'Beranda', url: `${SITE}/` },
          { name: 'Layanan', url: `${SITE}/#services` },
          { name: service.navLabel, url },
        ])
      ),
      jsonld({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.h1,
        description: service.metaDesc,
        url,
        serviceType: service.serviceType,
        category: service.serviceType,
        provider: {
          '@type': 'ProfessionalService',
          '@id': `${SITE}/#service`,
          name: 'Zuzlifatul Adnan — Jasa Pembuatan Website & Aplikasi',
          url: `${SITE}/`,
          email: 'juslifatuladnan@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bandar Lampung',
            addressRegion: 'Lampung',
            addressCountry: 'ID',
          },
        },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Lampung' },
          { '@type': 'Country', name: 'Indonesia' },
        ],
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${SITE}/#contact`,
        },
      }),
      jsonld(faqLd(service.faq)),
    ],
    body,
  });

  write(path.join('layanan', service.slug, 'index.html'), html);
}

// --------------------------------------------------------------------------
// 4. Sitemap
// --------------------------------------------------------------------------
function buildSitemap() {
  const urls = [
    {
      loc: `${SITE}/`,
      priority: '1.0',
      changefreq: 'weekly',
      images: [
        {
          loc: `${SITE}/assets/img/og-image.png`,
          title: 'Zuzlifatul Adnan — Jasa Pembuatan Website & Aplikasi',
        },
        {
          loc: `${SITE}/assets/img/profile.png`,
          title: 'Zuzlifatul Adnan — Full-Stack Web & Mobile Developer',
        },
      ],
      alternates: true,
    },
    { loc: `${SITE}/projects/`, priority: '0.9', changefreq: 'weekly' },
    ...SERVICES.map((s) => ({
      loc: `${SITE}/layanan/${s.slug}/`,
      priority: '0.9',
      changefreq: 'monthly',
    })),
    ...PROJECTS.map((p) => ({
      loc: `${SITE}/projects/${p.id}/`,
      priority: '0.8',
      changefreq: 'monthly',
      images: [
        { loc: `${SITE}/assets/img/og/${p.id}.png`, title: p.title },
        { loc: `${SITE}/${p.img}`, title: p.title },
      ],
    })),
  ];

  const body = urls
    .map((u) => {
      const imgs = (u.images || [])
        .map(
          (im) => `    <image:image>
      <image:loc>${im.loc}</image:loc>
      <image:title>${esc(im.title)}</image:title>
    </image:image>`
        )
        .join('\n');
      const alt = u.alternates
        ? `    <xhtml:link rel="alternate" hreflang="id" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`
        : '';
      return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${[alt, imgs].filter(Boolean).join('\n')}
  </url>`;
    })
    .join('\n');

  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<!-- Dibuat otomatis oleh tools/build-seo.mjs — jangan diedit manual. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`
  );
}

// --------------------------------------------------------------------------
console.log(`Membangun halaman SEO statis (lastmod ${TODAY})...`);
buildProjectsHub();
PROJECTS.forEach(buildProjectPage);
SERVICES.forEach(buildServicePage);
buildSitemap();
console.log(
  `Selesai: ${PROJECTS.length} studi kasus, ${SERVICES.length} halaman layanan, 1 hub, 1 sitemap.`
);
