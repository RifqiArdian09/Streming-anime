<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

# 🌌 AniVerse — Anime Streaming Platform

**AniVerse** adalah platform streaming anime modern yang dibangun dengan **Next.js 16** dan **React 19**. Dirancang dengan UI premium bertema gelap dan pengalaman pengguna yang imersif — dari hero slider sinematik hingga video player terintegrasi.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🎥 **Video Player** | Player bawaan dengan dukungan streaming langsung di halaman episode |
| 🔍 **Pencarian Real-time** | Cari anime berdasarkan judul dengan hasil instan |
| 🕐 **Tonton Nanti** | Tandai episode untuk ditonton nanti, tersimpan di localStorage |
| ❤️ **Favorit Anime** | Simpan anime favorit dengan satu klik dari halaman episode |
| 📖 **Koleksi Saya** | Halaman bookmarks dengan tab Tonton Nanti & Favorit, grid/list view |
| 🎭 **Filter Genre** | Jelajahi anime berdasarkan genre (Action, Romance, Fantasy, dll.) |
| 📅 **Jadwal Ongoing** | Jadwal rilis anime ongoing per hari dengan filter interaktif |
| 📦 **Batch Download** | Halaman batch download dengan link multi-kualitas |
| 🔗 **Share** | Bagikan episode ke WhatsApp, Telegram, Twitter, atau salin link |
| 📱 **Responsive** | Optimal di semua ukuran layar — mobile, tablet, desktop |
| 🎨 **Premium Dark UI** | Desain gelap berteknologi glassmorphism, gradient, dan micro-animations |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [tw-animate-css](https://github.com/avafloww/tw-animate-css) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) |
| **Fonts** | Google Fonts (Geist, Spline Sans) |

---

## 📁 Struktur Project

```
aniverse/
├── app/                          # App Router (halaman & API)
│   ├── page.tsx                  # Beranda — Hero Slider + Trending + Completed
│   ├── layout.tsx                # Root layout (Header, Footer, ScrollToTop)
│   ├── globals.css               # Design tokens & global styles
│   ├── anime/[slug]/             # Detail anime
│   ├── episode/[slug]/           # Halaman tonton episode + video player
│   ├── batch/[slug]/             # Batch download links
│   ├── bookmarks/                # Koleksi Saya (Tonton Nanti & Favorit)
│   ├── ongoing/                  # Jadwal anime ongoing per hari
│   ├── complete/[page]/          # Daftar anime tamat (paginated)
│   ├── genre/[slug]/             # Anime berdasarkan genre
│   ├── genres/                   # Daftar semua genre
│   ├── search/                   # Hasil pencarian
│   └── api/                      # API Routes
│       ├── anime/complete/       # API anime completed
│       ├── anime/search/         # API pencarian anime
│       └── server/[id]/          # API proxy
│
├── components/                   # Komponen UI
│   ├── Header.tsx                # Navigasi utama + search bar
│   ├── Footer.tsx                # Footer dengan navigasi & social links
│   ├── HeroSlider.tsx            # Carousel hero di beranda
│   ├── AnimeCard.tsx             # Card anime reusable
│   ├── AnimeCarousel.tsx         # Carousel horizontal anime
│   ├── VideoPlayer.tsx           # Video player embedded
│   ├── EpisodeActions.tsx        # Tombol Tonton Nanti, Favorit, Share, Download
│   ├── EpisodeSidebar.tsx        # Sidebar daftar episode
│   ├── EpisodeList.tsx           # List episode
│   ├── BookmarkButton.tsx        # Tombol favorit di halaman detail anime
│   ├── OngoingSchedule.tsx       # Jadwal ongoing per hari
│   ├── SearchBar.tsx             # Komponen pencarian
│   ├── ShareButton.tsx           # Tombol share
│   ├── Pagination.tsx            # Komponen paginasi
│   ├── ScrollToTop.tsx           # Tombol scroll ke atas
│   └── ui/                       # Base UI components (shadcn/ui)
│
├── lib/                          # Utilities
│   ├── api.ts                    # API client & type definitions
│   ├── parser.ts                 # Data parser & normalizer
│   └── utils.ts                  # Helper functions (cn, dll.)
│
└── public/                       # Aset statis
    └── hero/                     # Gambar hero slider
```

---

## 🚀 Cara Menjalankan

### Prerequisites

- **Node.js** 18+ 
- **npm** atau **yarn**

### Instalasi

```bash
# Clone repository
git clone https://github.com/RifqiArdian09/Streming-anime.git
cd Streming-anime

# Install dependencies
npm install

# Setup environment variable
# Buat file .env di root project:
# API_BASE_URL=https://your-api-url.com

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
npm run build
npm start
```

---

## 📸 Halaman Utama

| Halaman | Route | Deskripsi |
|---|---|---|
| **Beranda** | `/` | Hero slider + Trending + Selesai Tayang |
| **Detail Anime** | `/anime/[slug]` | Info anime, sinopsis, daftar episode |
| **Tonton Episode** | `/episode/[slug]` | Video player + info + daftar episode |
| **Batch Download** | `/batch/[slug]` | Link download multi-kualitas |
| **Koleksi Saya** | `/bookmarks` | Tonton Nanti & Favorit (localStorage) |
| **Ongoing** | `/ongoing` | Jadwal anime ongoing per hari |
| **Completed** | `/complete/[page]` | Daftar anime tamat |
| **Genre** | `/genre/[slug]` | Anime berdasarkan genre |
| **Semua Genre** | `/genres` | Daftar semua genre |
| **Pencarian** | `/search?q=...` | Hasil pencarian anime |

---

## 💾 Penyimpanan Lokal

AniVerse menggunakan `localStorage` untuk menyimpan data pengguna secara lokal:

| Key | Tipe | Deskripsi |
|---|---|---|
| `watchLaterEpisodes` | `Array<Episode>` | Daftar episode yang ditandai "Tonton Nanti" |
| `favoriteAnime` | `Array<Anime>` | Daftar anime yang ditandai sebagai favorit |

Data disinkronkan antar komponen menggunakan custom event `watchlist-updated`.

---

## 📄 License

Project ini dibuat untuk keperluan edukasi dan portfolio.

---
