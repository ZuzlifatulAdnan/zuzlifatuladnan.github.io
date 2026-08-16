// ===========================================================================
//  Menulis teks bahasa Indonesia langsung ke index.html
//  Jalankan:  node tools/localize-html.mjs
//
//  Masalah yang diperbaiki: seluruh teks halaman utama ditulis dalam bahasa
//  Inggris dan baru diganti ke bahasa Indonesia oleh JavaScript. Padahal
//  <html lang="id">, meta description berbahasa Indonesia, dan target
//  pencariannya juga Indonesia. Crawler yang tidak menjalankan JavaScript —
//  serta pratinjau tautan di WhatsApp dan media sosial — hanya melihat versi
//  Inggrisnya, sehingga sinyal bahasanya bertabrakan.
//
//  Skrip ini mengganti teks bawaan setiap elemen ber-atribut data-i18n dengan
//  nilai dari i18n/id.json. Peralihan bahasa lewat tombol tetap berjalan
//  seperti biasa karena atribut data-i18n tidak diubah.
//
//  Elemen yang isinya mengandung tag lain (misal tombol dengan ikon SVG)
//  sengaja dilewati agar markupnya tidak rusak.
// ===========================================================================
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './load-data.mjs';

const dict = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'i18n', 'id.json'), 'utf8')
);

const lookup = (key) => key.split('.').reduce((o, k) => (o || {})[k], dict);

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const target = path.join(ROOT, 'index.html');
let html = fs.readFileSync(target, 'utf8');

let replaced = 0;
const skipped = [];
const missing = [];

html = html.replace(
  /<(\w+)([^>]*\bdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
  (full, tag, attrs, key, inner) => {
    const value = lookup(key);
    if (typeof value !== 'string') {
      missing.push(key);
      return full;
    }
    if (inner.includes('<')) {
      // Ada elemen anak (ikon, dsb.) — biarkan apa adanya.
      skipped.push(key);
      return full;
    }
    if (inner.trim() === value) return full; // sudah bahasa Indonesia
    replaced++;
    return `<${tag}${attrs}>${escapeHtml(value)}</${tag}>`;
  }
);

fs.writeFileSync(target, html, 'utf8');

console.log(`index.html: ${replaced} teks diganti ke bahasa Indonesia.`);
if (skipped.length)
  console.log(
    `  dilewati (berisi elemen anak): ${[...new Set(skipped)].join(', ')}`
  );
if (missing.length)
  console.log(
    `  tidak ada di i18n/id.json: ${[...new Set(missing)].join(', ')}`
  );
