# Panduan SEO Situs Ini

Dokumen kerja untuk merawat SEO `zuzlifatuladnan.github.io`. Isinya: apa yang
sudah dikerjakan, cara membangun ulang halaman, dan langkah yang **harus
dilakukan manual** karena tidak bisa diselesaikan dari kode.

---

## 1. Cara membangun ulang

Setiap kali `data.js` atau berkas di `content/` diubah, jalankan:

```bash
node tools/build-seo.mjs     # halaman /projects/, /layanan/, dan sitemap.xml
node tools/check-seo.mjs     # verifikasi: JSON-LD, meta, tautan, duplikat
```

Atau lewat npm: `npm run build` (menjalankan keduanya).

Perintah lain:

| Perintah | Fungsi | Kapan dipakai |
| --- | --- | --- |
| `python tools/make-og.py` | Membuat ulang gambar Open Graph & ikon PNG | Saat menambah proyek baru atau mengganti warna merek |
| `node tools/localize-html.mjs` | Menulis teks bahasa Indonesia dari `i18n/id.json` ke `index.html` | Setelah mengubah teks di `i18n/id.json` |
| `npm run serve` | Menjalankan server lokal di `http://localhost:8080` | Untuk mengecek hasil sebelum push |

**Jangan mengedit langsung** berkas di `projects/`, `layanan/`, dan
`sitemap.xml` — semuanya ditimpa ulang oleh generator. Ubah sumbernya:

- Data teknis proyek (judul, tag, gambar, fitur) → `data.js`
- Narasi & FAQ tiap proyek → `content/projects.seo.json`
- Isi halaman layanan → `content/services.seo.json`

---

## 2. Yang sudah diperbaiki

**Halaman proyek jadi halaman asli.** Sebelumnya sembilan proyek memakai satu
berkas `project-detail.html?id=xxx` yang isinya diisi JavaScript — judul dan
deskripsi sembilan URL itu identik, sehingga Google membacanya sebagai halaman
duplikat tanpa konten. Sekarang tiap proyek punya halaman sendiri di
`/projects/<id>/` dengan judul, deskripsi, dan teks unik langsung di HTML.
URL lama tetap berfungsi (dialihkan) dan sudah diberi `noindex` agar tidak
bersaing dengan halaman barunya.

**Empat halaman layanan baru** menyasar kata kunci yang orang benar-benar
ketikkan di Google:

| Halaman | Kata kunci utama |
| --- | --- |
| `/layanan/jasa-pembuatan-website-lampung/` | jasa pembuatan website Lampung |
| `/layanan/jasa-pembuatan-website-sekolah/` | jasa pembuatan website sekolah |
| `/layanan/jasa-pembuatan-aplikasi-android/` | jasa pembuatan aplikasi android |
| `/layanan/jasa-pembuatan-sistem-informasi/` | jasa pembuatan sistem informasi |

**Gambar pratinjau tautan diperbaiki.** `og:image` sebelumnya berformat SVG,
dan WhatsApp, Facebook, maupun LinkedIn tidak bisa menampilkannya — setiap
tautan yang dibagikan tampil tanpa gambar. Sekarang PNG 1200×630, satu gambar
khusus untuk tiap proyek.

**Bahasa halaman disamakan.** Halaman utama menyatakan `lang="id"` dengan meta
berbahasa Indonesia, tetapi teksnya dirender dalam bahasa Inggris oleh
JavaScript. Teks Indonesia kini tertulis langsung di HTML, dan bahasa bawaan
untuk pengunjung baru diubah dari Inggris ke Indonesia.

**Data terstruktur dibersihkan.** Nomor telepon contoh (`+6281000000000`) yang
tertulis di JSON-LD sudah dihapus karena data palsu merusak kepercayaan pada
seluruh blok data terstruktur. Ditambahkan `BreadcrumbList`, `FAQPage`,
`CreativeWork`, `Service`, dan koordinat lokasi.

**Lain-lain:** token verifikasi contoh dihapus, `robots.txt` diperbarui,
sitemap dibuat otomatis, ditambahkan `404.html`, manifest, ikon PNG, serta
`preload` untuk gambar hero agar Core Web Vitals membaik.

---

## 3. Langkah manual yang wajib dilakukan

Tanpa langkah ini, hasil di atas tidak akan terpakai maksimal.

### 3.1 Kirim sitemap ke Google Search Console — **paling penting**

1. Buka <https://search.google.com/search-console> (kepemilikan situs sudah
   terverifikasi lewat berkas `googleb88311bae89f2340.html`).
2. Menu **Sitemaps** → isi `sitemap.xml` → **Submit**.
3. Menu **URL Inspection** → tempel satu per satu URL berikut → klik
   **Request Indexing**:
   - `https://zuzlifatuladnan.github.io/`
   - `https://zuzlifatuladnan.github.io/projects/`
   - keempat URL `/layanan/...` di tabel bagian 2

Halaman proyek akan menyusul sendiri lewat sitemap. Meminta indexing manual
mempercepat dari hitungan minggu menjadi hitungan hari.

### 3.2 Pasang Google Analytics 4

Buka `index.html`, cari baris `window.GA_ID = "";` lalu isi dengan Measurement
ID dari <https://analytics.google.com/> (formatnya `G-XXXXXXXXXX`). Selama
kosong, skripnya tidak dimuat sama sekali sehingga tidak membebani halaman.

### 3.3 Isi nomor WhatsApp yang asli

Nomor contoh sudah dihapus. Untuk mengaktifkan kembali:

1. Di `index.html`, cari komentar bertanda `WhatsApp dinonaktifkan sementara`,
   hapus tanda komentarnya, dan ganti `62XXXXXXXXXXX` dengan nomor asli
   (format internasional, tanpa tanda `+`).
2. Tambahkan kembali `"telephone": "+62..."` pada dua blok JSON-LD di `<head>`
   (`Person` dan `ProfessionalService`).
3. Perbarui juga `whatsapp` di `data.js`.

Nomor telepon pada data terstruktur memungkinkan Google menampilkan tombol
hubungi langsung di hasil pencarian.

### 3.4 Daftarkan ke Bing Webmaster Tools

Ambil token di <https://www.bing.com/webmasters>, lalu aktifkan baris
`msvalidate.01` yang sudah disiapkan di `<head>` `index.html`. Bing juga
menjadi sumber data untuk ChatGPT dan Copilot.

### 3.5 Buat Profil Bisnis Google

Untuk kata kunci lokal seperti "jasa pembuatan website Lampung", profil bisnis
di <https://business.google.com> berpengaruh lebih besar daripada perubahan
apa pun di dalam kode. Pastikan nama, alamat area, dan nomor telepon yang
dipakai **sama persis** dengan yang tertulis di situs.

---

## 4. Yang menentukan kecepatan naik

Sisi teknis sudah selesai. Tiga hal berikut yang menentukan sisanya:

**Tautan dari situs lain.** Ini faktor terbesar yang belum tergarap dan tidak
bisa diselesaikan lewat kode. Yang realistis dikerjakan: profil GitHub dengan
tautan ke situs, LinkedIn, direktori developer lokal, forum komunitas
(Kaskus, grup Facebook developer Lampung), dan — paling bernilai — meminta
klien memasang kredit "Dibuat oleh Zuzlifatul Adnan" di footer situs mereka.

**Konten baru secara berkala.** Situs yang isinya tidak pernah bertambah akan
berhenti naik. Menambah satu studi kasus proyek setiap kali menyelesaikan
pekerjaan sudah cukup — dan sekarang prosesnya hanya menambah entri di
`data.js` dan `content/projects.seo.json`, lalu menjalankan `npm run build`.

**Kesabaran.** Domain `github.io` adalah subdomain, sehingga membangun otoritas
lebih lambat dibanding domain sendiri. Perkiraan wajar: kata kunci lokal
seperti "jasa pembuatan website Lampung" mulai terlihat dalam 1–3 bulan,
sedangkan kata kunci nasional butuh 6–12 bulan.

> **Pertimbangan domain.** Jika SEO ini serius dijadikan sumber klien, domain
> sendiri (misalnya `zuzlifatuladnan.com`) akan naik jauh lebih cepat dan
> terlihat lebih profesional. GitHub Pages mendukung domain kustom gratis —
> yang dibayar hanya domainnya, sekitar Rp 150.000 per tahun. Bila nanti
> pindah, ubah konstanta `SITE` di `tools/build-seo.mjs`, jalankan ulang
> build, dan daftarkan properti baru di Search Console.

---

## 5. Pemeriksaan rutin

Sebelum setiap push, jalankan `npm run build`. Skrip `check-seo.mjs` akan
menolak jika ada judul atau deskripsi yang sama antar halaman, JSON-LD rusak,
tautan internal yang menunjuk ke berkas tidak ada, atau gambar tanpa `alt`.

Alat bantu eksternal:

- <https://search.google.com/test/rich-results> — memastikan data terstruktur terbaca
- <https://pagespeed.web.dev/> — Core Web Vitals
- <https://developers.facebook.com/tools/debug/> — pratinjau tautan (klik *Scrape Again* setelah deploy)
