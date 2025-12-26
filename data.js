// ====== Shared Portfolio Data (used by index + project detail page) ======
const PROFILE = {
  name: "ZUZLIFATUL ADNAN",
  title: "Full-Stack Web & Mobile Developer",
  email: "juslifatuladnan@gmail.com",
  location: "Lampung, Indonesia",
  experience: "4+ years"
};

const PROJECTS = [
  {
    id: "promosi-wisata-pam",
    title: "Promosi Wisata (PAM Clustering)",
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
    desc_en: "School profile website with news, agenda, gallery, and admin content management.",
    desc_id: "Website profil sekolah dengan berita, agenda, galeri, dan manajemen konten admin.",
    img: "assets/img/p4.svg",
    tags: ["Laravel", "CMS", "School"],
    link: "#",
    details_en: [
      "News, announcements, agenda, galleries.",
      "Admin CMS for easy content updates.",
      "SEO-friendly pages & responsive UI."
    ],
    details_id: [
      "Berita, pengumuman, agenda, galeri.",
      "CMS admin untuk update konten dengan mudah.",
      "Halaman SEO-friendly & tampilan responsif."
    ]
  },
  {
    id: "website-lpg-astar",
    title: "Website LPG (A* Route Finder)",
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
