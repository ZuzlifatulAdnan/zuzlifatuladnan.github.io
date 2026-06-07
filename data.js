// ====== Shared Portfolio Data (used by index + project detail page) ======
const PROFILE = {
  name: "Zuzlifatul Adnan",
  title: "Full-Stack Web & Mobile Developer",
  email: "juslifatuladnan@gmail.com",
  location: "Lampung, Indonesia",
  experience: "4+ years",
  whatsapp: "6281000000000",
  github: "ZuzlifatulAdnan",
  siteUrl: "https://zuzlifatuladnan.github.io/"
};

// ===== GitHub config =====
const GITHUB = {
  username: "ZuzlifatulAdnan",
  topReposLimit: 5,
  apiBase: "https://api.github.com"
};

const PROJECTS = [
  {
    id: "promosi-wisata-pam",
    title: "Promosi Wisata (PAM Clustering)",
    category: "web",
    desc_en: "Tourism promotion dashboard using PAM clustering for visitor segmentation and targeting.",
    desc_id: "Dashboard promosi wisata menggunakan clustering PAM untuk segmentasi dan targeting pengunjung.",
    img: "assets/img/p1.svg",
    tags: ["Laravel", "PAM", "Clustering"],
    link: "#",
    details_en: [
      "PAM clustering for tourism segment analysis.",
      "Admin dashboard for targeting and campaign planning.",
      "Export-friendly reporting for stakeholders."
    ],
    details_id: [
      "Clustering PAM untuk analisis segmentasi wisata.",
      "Dashboard admin untuk targeting & perencanaan promosi.",
      "Laporan siap ekspor untuk stakeholder."
    ]
  },
  {
    id: "pos-kmeans",
    title: "POS K-Means",
    category: "web",
    desc_en: "Point-of-Sale system enhanced with K-Means clustering for sales/customer grouping insights.",
    desc_id: "Sistem POS dengan analisis clustering K-Means untuk insight penjualan/kelompok pelanggan.",
    img: "assets/img/p2.svg",
    tags: ["Laravel", "K-Means", "POS"],
    link: "#",
    details_en: [
      "POS features: products, transactions, reports.",
      "K-Means clustering for customer/sales grouping.",
      "Dashboard insights for decision-making."
    ],
    details_id: [
      "Fitur POS: produk, transaksi, laporan.",
      "Clustering K-Means untuk pengelompokan penjualan/pelanggan.",
      "Dashboard insight untuk mendukung keputusan bisnis."
    ]
  },
  {
    id: "events-kmeans",
    title: "Events (K-Means)",
    category: "web",
    desc_en: "Event platform with K-Means clustering to classify participants and optimize recommendations.",
    desc_id: "Platform event dengan clustering K-Means untuk klasifikasi peserta dan rekomendasi lebih tepat.",
    img: "assets/img/p3.svg",
    tags: ["Laravel", "K-Means", "Events"],
    link: "#",
    details_en: [
      "Participant classification using K-Means.",
      "Helps organizers segment audiences and content.",
      "Admin panel for event management."
    ],
    details_id: [
      "Klasifikasi peserta menggunakan K-Means.",
      "Membantu segmentasi audiens dan rekomendasi konten.",
      "Admin panel untuk manajemen event."
    ]
  },
  {
    id: "website-profile-sekolah",
    title: "Website Profile Sekolah",
    category: "web",
    desc_en: "A complete, WordPress-like school profile CMS built with Laravel 10 & Filament. Admins manage everything—news, agenda, galleries, pages, menus, and the whole theme—without writing code. One install fits any level: SD/MI, SMP/MTs, SMA/SMK.",
    desc_id: "CMS profil sekolah lengkap ala WordPress berbasis Laravel 10 & Filament. Admin mengelola semuanya—berita, agenda, galeri, halaman, menu, hingga tema—tanpa ngoding. Satu instalasi untuk semua jenjang: SD/MI, SMP/MTs, SMA/SMK.",
    img: "assets/img/p4.svg",
    tags: ["Laravel", "Filament", "CMS", "MySQL"],
    link: "https://github.com/ZuzlifatulAdnan/website-profile-sekolah",
    details_en: [
      "Drag-and-drop Page Builder with 12 content blocks (heading, text, image, gallery, video, button, cards, columns, quote, stats, divider, HTML).",
      "Central Media Library: bulk upload, collections, and reusable images across all content.",
      "Dynamic menu builder: rename items, nested submenus, navbar & footer links, drag-to-reorder.",
      "Customizable homepage: reorder or hide each section, plus free-form widget/content areas.",
      "Theme customizer (no code): logo, favicon, colors, fonts, card style, and layout width.",
      "Rich news module: multiple photos with a primary image, view counter, like button & social share.",
      "Visitor analytics dashboard: today / month / year, trend charts, and most-popular pages.",
      "Audit log of every admin action with printable, PDF & Excel reports.",
      "Role-based access control (Super Admin & Content Operator) and Two-Factor Authentication (Google Authenticator).",
      "Multi-level ready (SD/MI–SMA/SMK), accessibility toolbar, server-side lazy-loading, fully responsive & SEO-friendly."
    ],
    details_id: [
      "Page Builder seret-lepas dengan 12 blok konten (judul, teks, gambar, galeri, video, tombol, kartu, kolom, kutipan, statistik, pemisah, HTML).",
      "Media Library terpusat: unggah massal, koleksi, dan gambar bisa dipakai ulang di semua konten.",
      "Menu builder dinamis: ganti nama, submenu bertingkat, tautan navbar & footer, urutkan dengan seret.",
      "Beranda fleksibel: urutkan atau sembunyikan tiap section, plus area widget/konten bebas.",
      "Customizer tema (tanpa ngoding): logo, favicon, warna, font, gaya kartu, dan lebar layout.",
      "Modul berita lengkap: banyak foto dengan foto utama, penghitung dilihat, tombol suka & bagikan ke sosmed.",
      "Dashboard statistik pengunjung: hari ini / bulan / tahun, grafik tren, dan halaman terpopuler.",
      "Audit log setiap aktivitas admin dengan laporan siap cetak, PDF & Excel.",
      "Kontrol akses berbasis peran (Super Admin & Operator Konten) dan Autentikasi Dua Faktor (Google Authenticator).",
      "Siap multi-jenjang (SD/MI–SMA/SMK), toolbar aksesibilitas, lazy-loading sisi server, sepenuhnya responsif & SEO-friendly."
    ]
  },
  {
    id: "website-lpg-astar",
    title: "Website LPG (A* Route Finder)",
    category: "web",
    desc_en: "LPG stock & nearest retailer finder using A* pathfinding based on user location.",
    desc_id: "Sistem stok LPG & pencarian pengecer terdekat menggunakan algoritma A* berbasis lokasi pengguna.",
    img: "assets/img/p5.svg",
    tags: ["Laravel", "A*", "Maps"],
    link: "#",
    details_en: [
      "A* route search based on user location (lat/long).",
      "Shows nearest retailers with distance + stock availability.",
      "Google Maps direction integration."
    ],
    details_id: [
      "Pencarian rute A* berbasis lokasi user (lat/long).",
      "Menampilkan pengecer terdekat beserta jarak + stok.",
      "Integrasi arah ke Google Maps."
    ]
  },
  {
    id: "peminjaman-ruangan-fifo",
    title: "Peminjaman Ruangan (FIFO)",
    category: "web",
    desc_en: "Room reservation system with FIFO scheduling/queue logic and notifications.",
    desc_id: "Sistem peminjaman ruangan dengan logika antrian FIFO dan notifikasi.",
    img: "assets/img/p6.svg",
    tags: ["Laravel", "FIFO", "Reservation"],
    link: "#",
    details_en: [
      "FIFO-based booking queue to prevent conflicts.",
      "Admin approval flow and schedule view.",
      "Notification-ready architecture (email/WA)."
    ],
    details_id: [
      "Antrian booking berbasis FIFO untuk mencegah bentrok.",
      "Alur persetujuan admin dan tampilan jadwal.",
      "Siap integrasi notifikasi (email/WA)."
    ]
  },
  {
    id: "sistem-akademik-sekolah",
    title: "Sistem Akademik Sekolah",
    category: "dashboard",
    desc_en: "Academic information system: students, teachers, schedules, grades, attendance, and reports.",
    desc_id: "Sistem akademik: siswa, guru, jadwal, nilai, absensi, dan laporan.",
    img: "assets/img/p7.svg",
    tags: ["Laravel", "Academic", "Dashboard"],
    link: "#",
    details_en: [
      "Multi-role: admin, teacher, student.",
      "Schedules, grades, attendance, reporting.",
      "Secure authentication and data management."
    ],
    details_id: [
      "Multi-role: admin, guru, siswa.",
      "Jadwal, nilai, absensi, pelaporan.",
      "Autentikasi aman dan manajemen data rapi."
    ]
  },
  {
    id: "cleanwash-laundry-kotlin-laravel",
    title: "Clean Wash Laundry (Kotlin + Laravel)",
    category: "mobile",
    desc_en: "Laundry ordering app with Kotlin Android client and Laravel backend, including tracking and notifications.",
    desc_id: "Aplikasi laundry dengan client Kotlin Android dan backend Laravel, termasuk tracking dan notifikasi.",
    img: "assets/img/p8.svg",
    tags: ["Kotlin", "Laravel", "WhatsApp"],
    link: "#",
    details_en: [
      "Kotlin Android app for ordering and status tracking.",
      "Laravel API backend with order/payment workflow.",
      "WhatsApp notifications (Fonnte-ready)."
    ],
    details_id: [
      "Aplikasi Kotlin Android untuk order & tracking status.",
      "Backend Laravel API untuk alur order/pembayaran.",
      "Notifikasi WhatsApp (siap Fonnte)."
    ]
  },
  {
    id: "absensi-qr-sekolah-kotlin-laravel",
    title: "Absensi QR Sekolah (Kotlin + Laravel)",
    category: "mobile",
    desc_en: "QR attendance with geolocation validation, reports, and Laravel API backend.",
    desc_id: "Absensi QR dengan validasi geolokasi, laporan, dan backend API Laravel.",
    img: "assets/img/p9.svg",
    tags: ["Kotlin", "Laravel", "QR"],
    link: "#",
    details_en: [
      "QR scan attendance with time & location validation.",
      "Laravel REST API and admin reporting dashboard.",
      "Parent notification workflow ready (WA/email)."
    ],
    details_id: [
      "Absensi scan QR dengan validasi waktu & lokasi.",
      "Laravel REST API dan dashboard laporan admin.",
      "Siap alur notifikasi orang tua (WA/email)."
    ]
  }
];

// ===== Tech Stack Groups (for #stack section) =====
const STACK_GROUPS = [
  {
    key: "backend",
    title_en: "Backend",
    title_id: "Backend",
    items: ["Laravel", "CI4", "PHP", "Node.js", "MySQL"]
  },
  {
    key: "mobile",
    title_en: "Mobile",
    title_id: "Mobile",
    items: ["Flutter", "Kotlin", "Android"]
  },
  {
    key: "frontend",
    title_en: "Frontend",
    title_id: "Frontend",
    items: ["JavaScript", "TypeScript", "PWA"]
  },
  {
    key: "tools",
    title_en: "Tools & Integrations",
    title_id: "Tools & Integrasi",
    items: ["REST API", "Firebase", "Fonnte", "Maps"]
  }
];

const PACKAGES = [
  {
    id: "standar",
    title_id: "Paket Standar",
    title_en: "Standard Package",
    desc_id: "Solusi sempurna untuk usaha kecil dan personal yang ingin tampil online.",
    desc_en: "The perfect solution for small businesses and personal use that want to go online.",
    priceOld: "Rp 2.000.000",
    price: "Rp 699.000",
    features_id: [
      "Desain Modern & Responsif",
      "Optimasi SEO On-Page",
      "Integrasi Social Media",
      "Integrasi Google Analytics",
      "SSL Security (HTTPS)",
      "Speed Optimization",
      "Free Hosting 1 Tahun",
      "Free Domain .com"
    ],
    features_en: [
      "Modern & Responsive Design",
      "On-Page SEO Optimization",
      "Social Media Integration",
      "Google Analytics Integration",
      "SSL Security (HTTPS)",
      "Speed Optimization",
      "Free Hosting 1 Year",
      "Free Domain .com"
    ],
    cta_id: "Pilih Paket",
    cta_en: "Choose Package",
    recommended: false
  },
  {
    id: "bisnis",
    title_id: "Paket Bisnis",
    title_en: "Business Package",
    desc_id: "Dirancang untuk bisnis berkembang dengan fitur lengkap untuk mendukung pertumbuhan.",
    desc_en: "Designed for growing businesses with full features to support growth.",
    priceOld: "Rp 3.500.000",
    price: "Rp 1.999.000",
    features_id: [
      "Desain Premium & Responsif",
      "Full SEO Optimization",
      "CMS Admin Panel",
      "Blog/News System",
      "Form Contact & WhatsApp",
      "Google Maps Integration",
      "Google Analytics & Search Console",
      "Social Media Integration"
    ],
    features_en: [
      "Premium & Responsive Design",
      "Full SEO Optimization",
      "CMS Admin Panel",
      "Blog/News System",
      "Contact Form & WhatsApp",
      "Google Maps Integration",
      "Google Analytics & Search Console",
      "Social Media Integration"
    ],
    cta_id: "Pilih Paket",
    cta_en: "Choose Package",
    recommended: true
  },
  {
    id: "kustom",
    title_id: "Paket Kustom",
    title_en: "Custom Package",
    desc_id: "Kustomisasi lengkap sesuai kebutuhan spesifik Anda, dengan solusi unik.",
    desc_en: "Full customization to match your specific needs with unique solutions.",
    priceOld: null,
    price_id: "Hubungi Kami",
    price_en: "Contact Us",
    features_id: [
      "Melayani Tugas Web Mahasiswa",
      "Halaman & Fitur Kustom",
      "Konsultasi Langsung",
      "Dukungan Khusus"
    ],
    features_en: [
      "Student Web Project Service",
      "Custom Pages & Features",
      "Direct Consultation",
      "Priority Support"
    ],
    cta_id: "Konsultasi",
    cta_en: "Consult",
    recommended: false
  }
];

const TESTIMONIALS = [
  {
    name: "UMKM Owner",
    role_en: "SME",
    role_id: "UMKM",
    avatar: "assets/img/a3.svg",
    rating: 4,
    text_en: "App boosted our orders significantly. Recommended!",
    text_id: "Aplikasi menaikkan pesanan kami. Rekomendasi!"
  },
  {
    name: "School Principal",
    role_en: "Education",
    role_id: "Sekolah",
    avatar: "assets/img/a1.svg",
    rating: 5,
    text_en: "The school website and academic system are clean, fast, and easy to manage. Great work!",
    text_id: "Website sekolah dan sistem akademik rapi, cepat, dan mudah dikelola. Keren!"
  },
  {
    name: "Admin Operator",
    role_en: "Government",
    role_id: "Pemerintah",
    avatar: "assets/img/a2.svg",
    rating: 5,
    text_en: "Dashboard works smoothly, reports are accurate, and the workflow is much more efficient now.",
    text_id: "Dashboard berjalan lancar, laporan akurat, dan alur kerja jadi jauh lebih efisien."
  },
  {
    name: "Event Organizer",
    role_en: "Events",
    role_id: "Event",
    avatar: "assets/img/a4.svg",
    rating: 4,
    text_en: "Participant management is easier, and the recommendation feature is very helpful.",
    text_id: "Manajemen peserta jadi lebih mudah, dan fitur rekomendasinya sangat membantu."
  },
  {
    name: "Campus Staff",
    role_en: "Campus",
    role_id: "Kampus",
    avatar: "assets/img/a5.svg",
    rating: 5,
    text_en: "Room booking is simple and fair. FIFO scheduling prevents overlaps and confusion.",
    text_id: "Peminjaman ruangan jadi simpel dan adil. FIFO mencegah bentrok dan kebingungan."
  }
];

// ===== Project filter categories =====
const PROJECT_FILTERS = [
  { key: "all",       label_en: "All",       label_id: "Semua" },
  { key: "web",       label_en: "Web",       label_id: "Web" },
  { key: "mobile",    label_en: "Mobile",    label_id: "Mobile" },
  { key: "dashboard", label_en: "Dashboard", label_id: "Dashboard" }
];

// ===== Marquee items (trusted-by / tech logos) =====
const MARQUEE_ITEMS = [
  "Laravel", "Flutter", "Kotlin", "MySQL", "Node.js",
  "JavaScript", "PHP", "Firebase", "REST API", "Android"
];
