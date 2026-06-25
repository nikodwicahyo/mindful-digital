export const heroContent = {
  title: "Bijak Berteknologi",
  subtitle: "Jaga Kesehatan Mentalmu",
  tagline: "Screen time bukan segalanya. Ada dunia di luar layar.",
  ctaText: "Mulai Sekarang",
  tickerStats: [
    { value: 6, suffix: " jam", label: "rata-rata screen time/hari orang Indonesia" },
    { value: 400, suffix: "%", label: "kenaikan early-onset dementia usia 35-44" },
    { value: 47, suffix: "%", label: "remaja sulit fokus akibat scrolling berlebih" },
  ],
};

export const stats = [
  {
    number: 6,
    suffix: " jam",
    label: "Rata-rata screen time harian - Indonesia juara dunia penggunaan gadget terlama.",
    source: "State of Mobile 2025 + Liputan6",
    icon: "screen" as const,
  },
  {
    number: 33,
    suffix: "%",
    label: "Remaja Indonesia alami masalah kesehatan mental terkait digital.",
    source: "I-NAMHS 2024",
    icon: "brain" as const,
  },
  {
    number: 20,
    suffix: "%",
    label: "Remaja 10-19 tahun dengan gejala kecanduan digital tingkat sedang-berat.",
    source: "Kemenkes RI 2025 + PP Tunas No. 17/2025",
    icon: "detox" as const,
  },
];

export const videoData = {
  title: "MENGUAK FENOMENA BRAIN ROT",
  description:
    "OPSI: Obrolan Psikologi - Fakultas Psikologi UGM × TVRI. Psikolog Theresia Novi Poespita Candra, Ph.D. mengupas tuntas brain rot, dampaknya pada kognitif Gen Z, dan cara menjaga kesehatan mental di era digital.",
  youtubeId: "DuVuCaptICE",
  posterAlt: "Thumbnail OPSI UGM TVRI - Menguak Fenomena Brain Rot",
  keyTakeaways: [
    {
      time: "",
      label: "Apa itu brain rot?",
      desc: "Penurunan fungsi kognitif akibat konten digital berlebihan - bukan sekadar istilah gaul!",
    },
    {
      time: "",
      label: "Mekanisme psikologis",
      desc: "Dopamine hijacking & cognitive overload - kenapa otak kita kecanduan scroll?",
    },
    {
      time: "",
      label: "Dampak pada Gen Z",
      desc: "Rentang perhatian memendek, daya analisis menurun, interaksi sosial terganggu.",
    },
    {
      time: "",
      label: "Tips dari Psikolog",
      desc: "Digital detox, batasi screen time, biasakan baca buku, dan perbanyak diskusi nyata!",
    },
  ],
  pullQuote: "Brain rot bukan sekadar guyonan internet. Ini sinyal darurat krisis kendali diri di era digital. — Theresia Novi, Psikolog UGM",
  statsOverlay: [
    { label: "Narasumber", value: "Psikolog UGM", icon: "medical" },
    { label: "Produksi", value: "UGM × TVRI", icon: "trending" },
    { label: "Topik", value: "Brain Rot", icon: "trending" },
  ],
};

export const audioData = {
  title: "BRAIN ROT! Scrolling Berjam-jam Bikin Otak Lemot?",
  description:
    "Liputan6 mengupas fenomena brain rot — dari tanda-tanda 'otak kosong' setelah scroll TikTok sampai tips digital detox biar fokus balik lagi. Simak selengkapnya!",
  youtubeId: "FVybr1ggJY4",
  source: "Liputan6",
  sourceUrl: "https://www.youtube.com/watch?v=FVybr1ggJY4",
  highlights: [
    "Indonesia juara dunia screen time — 6 jam sehari!",
    "Scrolling >4 jam turunkan konsentrasi & daya ingat",
    "Otak alami cognitive overload — kelebihan beban informasi",
    "Tips: batasi gadget, baca buku, diskusi dengan teman",
  ],
  episodeMeta: {
    duration: "2:43",
    date: "Juni 2026",
    category: "Kesehatan Mental",
  },
};

export const quizQuestions = [
  {
    id: 1,
    question: "Apa hal pertama yang kamu lakukan setelah bangun tidur?",
    options: [
      { text: "Langsung cek ponsel — notifikasi lebih penting dari sarapan", score: 0 },
      { text: "Scroll sosmed sambil masih di kasur", score: 1 },
      { text: "Sarapan dulu, baru cek ponsel", score: 2 },
      { text: "Beraktivitas dulu, ponsel belakangan", score: 3 },
    ],
  },
  {
    id: 2,
    question: "Berapa lama rata-rata screen time harianmu?",
    options: [
      { text: "Lebih dari 7 jam", score: 0 },
      { text: "4-7 jam — masih di zona bahaya", score: 1 },
      { text: "2-4 jam — cukup terkontrol", score: 2 },
      { text: "Kurang dari 2 jam — kamu hebat!", score: 3 },
    ],
  },
  {
    id: 3,
    question: "Pernah merasa 'brain fog' setelah scroll berjam-jam?",
    options: [
      { text: "Sering — otak terasa 'nggak karuan'", score: 0 },
      { text: "Kadang — apalagi abis nonton FYP", score: 1 },
      { text: "Jarang — masih bisa fokus", score: 2 },
      { text: "Tidak pernah — screen time-ku sehat", score: 3 },
    ],
  },
  {
    id: 4,
    question: "Seberapa sering screen time mengganggu tidurmu?",
    options: [
      { text: "Sering — tidur larut karena 'bentar lagi' scroll", score: 0 },
      { text: "Kadang — ponsel di samping tempat tidur", score: 1 },
      { text: "Jarang — matikan ponsel 1 jam sebelum tidur", score: 2 },
      { text: "Tidak pernah — rutinitas tidurku sehat", score: 3 },
    ],
  },
  {
    id: 5,
    question: "Seberapa sering kamu meluangkan waktu offline?",
    options: [
      { text: "Hampir tidak pernah — hidupku di dalam layar", score: 0 },
      { text: "Sekali seminggu — masih kurang", score: 1 },
      { text: "Beberapa kali seminggu — lumayan aktif", score: 2 },
      { text: "Setiap hari — hobi di dunia nyata!", score: 3 },
    ],
  },
];

export const quizResultLevels = [
  {
    min: 12,
    max: 15,
    title: "Sangat Bijak",
    description:
      "Kamu sudah sangat bijak dalam menggunakan teknologi! Pertahankan keseimbangan ini dan ajak teman-temanmu.",
    color: "text-emerald-400",
    emoji: "🌟",
  },
  {
    min: 8,
    max: 11,
    title: "Cukup Bijak",
    description:
      "Kamu sudah cukup baik, tapi masih ada ruang untuk meningkatkan keseimbangan digital. Yuk, mulai digital detox!",
    color: "text-amber-400",
    emoji: "👍",
  },
  {
    min: 4,
    max: 7,
    title: "Perlu Perhatian",
    description:
      "Kebiasaan digitalmu mulai berdampak pada produktivitas. Saatnya melakukan perubahan kecil hari ini.",
    color: "text-orange-400",
    emoji: "⚡",
  },
  {
    min: 0,
    max: 3,
    title: "Sangat Perlu Perubahan",
    description:
      "Kamu sangat bergantung pada teknologi. Yuk, mulai digital detox sekarang — otakmu butuh istirahat!",
    color: "text-red-400",
    emoji: "🚨",
  },
];

export const actionContent = {
  title: "Saya Siap Bijak Digital!",
  description: "Ambil langkah pertama untuk kesehatan mental yang lebih baik. Pilih komitmenmu dan bagikan ke teman-teman.",
  commitments: [
    { text: "Mengurangi screen time minimal 30 menit sehari" },
    { text: "Tidak menggunakan ponsel 1 jam sebelum tidur" },
    { text: "Meluangkan waktu untuk aktivitas offline setiap hari" },
    { text: "Menjadi contoh bijak digital bagi teman dan keluarga" },
    { text: "Membaca satu buku per bulan sebagai pengganti scrolling" },
  ],
  shareText: "Ayo bijak digital! Saya sudah berkomitmen untuk %commitment%. Yuk ikutan di mindful-digital.vercel.app #BijakDigital #BrainRot #DigitalDetox #KesehatanMental",
};

export const footerContent = {
  credits: "MindfulDigital © 2026 - Tugas Sistem Multimedia",
  videoSource:
    'Video: "OPSI: Obrolan Psikologi - Menguak Fenomena Brain Rot" - Fakultas Psikologi UGM × TVRI',
  audioSource:
    'Audio: "BRAIN ROT! Scrolling Berjam-jam Bikin Otak Lemot?" - Liputan6',
  socialLinks: [
    { label: "YouTube", url: "https://www.youtube.com/results?search_query=bijak+digital", icon: "youtube" },
    { label: "Instagram", url: "https://instagram.com/nikodwchy", icon: "instagram" },
    { label: "Website", url: "https://mindful-digital.vercel.app", icon: "web" },
  ],
};
