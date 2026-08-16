// Membaca data.js (skrip browser biasa, tanpa export) dan mengembalikannya
// sebagai objek JavaScript. Dipakai oleh build-seo.mjs dan make-og.py supaya
// data.js tetap menjadi satu-satunya sumber data portofolio.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export function loadData() {
  const code = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
  const ctx = vm.createContext({ console });
  // `const` di top-level tidak menempel ke object context, jadi nilainya
  // disalin lewat globalThis di akhir skrip yang sama (satu lexical scope).
  vm.runInContext(
    code +
      '\n;globalThis.__DATA__ = { PROFILE, GITHUB, PROJECTS, PACKAGES, TESTIMONIALS, PROJECT_FILTERS, STACK_GROUPS };',
    ctx
  );
  return ctx.__DATA__;
}
