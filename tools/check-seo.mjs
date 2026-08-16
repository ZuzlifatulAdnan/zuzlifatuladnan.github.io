// Pemeriksaan cepat setelah build: JSON-LD valid, meta wajib ada, judul dan
// deskripsi unik antar halaman, serta seluruh tautan/berkas internal benar-benar
// ada di disk.  Jalankan: node tools/check-seo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './load-data.mjs';

let errors = 0;
let warnings = 0;
const fail = (m) => { errors++; console.log('  ✗ ' + m); };
const warn = (m) => { warnings++; console.log('  ! ' + m); };

function htmlFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'tools', 'prototype', 'assets'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const files = htmlFiles(ROOT);
const titles = new Map();
const descs = new Map();

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'googleb88311bae89f2340.html') continue;
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const noindex = /name="robots"[^>]*content="[^"]*noindex/.test(html);

  // --- JSON-LD ---
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  blocks.forEach((b, i) => {
    const body = b.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
    try {
      JSON.parse(body);
    } catch (e) {
      fail(`${rel}: JSON-LD blok #${i + 1} tidak valid — ${e.message}`);
    }
  });

  // --- Meta wajib ---
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canonical = (html.match(/<link rel="canonical"[^>]*href="([^"]*)"/) || [])[1];
  const h1count = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) fail(`${rel}: tidak ada <title>`);
  if (!desc) fail(`${rel}: tidak ada meta description`);
  if (!canonical && !noindex) fail(`${rel}: tidak ada canonical`);
  if (h1count !== 1) warn(`${rel}: jumlah <h1> = ${h1count} (idealnya 1)`);
  if (title && title.length > 65) warn(`${rel}: title ${title.length} karakter (Google memotong ~60)`);
  if (desc && desc.length > 165) warn(`${rel}: description ${desc.length} karakter (ideal <160)`);

  if (!noindex) {
    if (title) {
      if (titles.has(title)) fail(`${rel}: title sama dengan ${titles.get(title)}`);
      else titles.set(title, rel);
    }
    if (desc) {
      if (descs.has(desc)) fail(`${rel}: description sama dengan ${descs.get(desc)}`);
      else descs.set(desc, rel);
    }
  }

  // --- Berkas lokal yang dirujuk benar-benar ada ---
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((m) => m[1].split('#')[0].split('?')[0]) // buang anchor & query
    .filter(Boolean);
  for (const ref of new Set(refs)) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    const target = ref.startsWith('/')
      ? path.join(ROOT, ref)
      : path.resolve(dir, ref);
    const candidates = ref.endsWith('/') || !path.extname(target)
      ? [path.join(target, 'index.html'), target]
      : [target];
    if (!candidates.some((c) => fs.existsSync(c))) {
      fail(`${rel}: tautan/berkas tidak ditemukan → ${ref}`);
    }
  }

  // --- Gambar wajib punya alt ---
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  imgs.forEach((tag) => {
    if (!/\balt=/.test(tag)) warn(`${rel}: ada <img> tanpa atribut alt`);
  });
}

// --- Sitemap: setiap URL harus punya berkasnya ---
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const rel = loc.replace(/^https?:\/\/[^/]+\//, '');
  if (!rel) continue;
  const target = path.join(ROOT, rel);
  const ok = fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html'));
  if (!ok) fail(`sitemap.xml: URL tidak punya berkas → ${loc}`);
}
console.log(`  · sitemap berisi ${locs.length} URL`);

console.log(
  `\n${errors === 0 ? 'LULUS' : 'GAGAL'} — ${files.length} halaman diperiksa, ` +
    `${errors} error, ${warnings} peringatan.`
);
process.exit(errors === 0 ? 0 : 1);
