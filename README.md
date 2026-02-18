# 🎌 Nimestream - Anime Streaming Platform

Nimestream adalah platform streaming anime modern yang dibangun dengan Next.js 16, menyediakan pengalaman menonton anime yang lancar dan responsif dengan fitur-fitur canggih.

## ✨ Fitur Utama

- 🎥 **Video Player Canggih** - Player dengan multiple quality options dan fullscreen support
- 🔍 **Pencarian Anime** - Cari anime favorit dengan mudah
- 📱 **Responsive Design** - Optimal di semua perangkat (mobile, tablet, desktop)
- 🔖 **Bookmark System** - Simpan episode favorit untuk ditonton nanti
- 🎭 **Genre Filtering** - Filter anime berdasarkan genre
- 📺 **Episode Tracking** - Lacak progress menonton
- 🌙 **Dark/Light Theme** - Tema yang dapat disesuaikan
- ⚡ **Fast Loading** - Optimasi performa dengan caching

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theme**: next-themes

## 📁 Struktur Project

```
nimestream/
├── app/                    # App Router pages
│   ├── anime/[slug]/      # Detail anime
│   ├── episode/[slug]/    # Halaman episode
│   ├── search/            # Pencarian
│   ├── bookmarks/         # Bookmark
│   ├── genre/[slug]/      # Filter genre
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── AnimeCard.tsx     # Card anime
│   ├── VideoPlayer.tsx   # Video player
│   └── SearchBar.tsx     # Search component
├── lib/                  # Utilities
│   ├── api.ts           # API functions
│   ├── parser.ts        # Data parser
│   └── utils.ts         # Helper functions
└── public/              # Static assets
```
 - Icon library
