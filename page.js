// Skrip ringan untuk halaman statis (/projects/, /layanan/).
// Hanya menangani elemen kerangka halaman: tema, menu, tahun, dan animasi
// muncul. Konten utama halaman ini sudah berupa HTML asli, jadi tidak ada
// teks yang bergantung pada JavaScript.
(function () {
  'use strict';

  var root = document.documentElement;

  // Tema — nilai awal sudah diterapkan oleh skrip inline di <head> agar tidak
  // ada kedipan warna. Di sini hanya menangani tombolnya.
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      root.classList.toggle('light');
      var mode = root.classList.contains('light') ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', mode);
      } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', mode === 'light' ? '#f7fafc' : '#0b0d10');
    });
  }

  // Menu mobile
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var opened = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animasi muncul saat elemen masuk viewport.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      io.observe(el);
    });
  }
})();
