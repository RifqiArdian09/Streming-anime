import Link from "next/link";
import Image from "next/image";
import { api, AnimeItem } from "@/lib/api";
import Pagination from "@/components/Pagination";
import { collectAnimeList } from "@/lib/parser";
import { Suspense } from "react";
import { Search, Grid, List, ChevronDown, Play, Star } from "lucide-react";

async function getData(page: string) {
  try {
    const data = await api<any>(`/anime/complete-anime?page=${encodeURIComponent(page)}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }
    });
    return data?.data?.animeList || [];
  } catch (error) {
    console.error('Failed to fetch completed data:', error);
    return [];
  }
}

function normalizeItem(v: any): AnimeItem {
  let rawSlug: any = v?.slug || v?.animeId || v?.anime_id || v?.link || v?.href;
  let slug: string | undefined = undefined;
  if (typeof rawSlug === "string") {
    const parts = rawSlug.split("/").filter(Boolean);
    slug = parts.pop();
  }
  return {
    title: v?.title || v?.name || v?.anime_title,
    slug,
    thumbnail: v?.thumbnail || v?.poster || v?.image || v?.thumb || v?.img || v?.cover,
    episode: v?.episode || v?.current_episode || v?.latest_episode || v?.total_episodes || v?.episodes,
    status: v?.status || "Completed",
    score: v?.score || "8.5",
    type: v?.type || "TV",
    releaseDay: v?.releaseDay,
  } as AnimeItem;
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageParam } = await params;
  const pageNum = pageParam || "1";
  const rawData = await getData(pageNum);
  const items = rawData.map(normalizeItem);

  return (
    <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 lg:px-8 bg-background-dark min-h-screen">
      <div className="flex flex-col w-full max-w-[1280px] flex-1 gap-6">

        {/* Hero Section */}
        <div className="relative w-full overflow-hidden rounded-xl min-h-[240px] flex items-end shadow-lg shadow-black/40 group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQU7_-aR5tBKsMSGLbI_hcVocrBlWqw5QNjrQiUFjtuOD5qimSRqduvcFEgGhbO1E_YNe0ExPnshaNrcp-pXch2Ot1i1fmdIFvmY0wWEeQRLVB6Gux_Z7TtDdpJirT9gIC6DOArKwlPPiS2h4HneQsv3jN26Q02BX-naZcY3eRhhY03bRvMiHFGezqvEPglpgoAgzKQmbtjhbwsYr0AUTj4DPtXJQHm4Dw3jMNTN9id5jAsqaKJDBY-q9W3amiqZWx_h25b1CsUx3r')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-[#111722]/60 to-transparent"></div>
          <div className="relative z-10 flex flex-col p-8 w-full max-w-3xl">
            <span className="inline-flex items-center gap-2 text-primary font-bold tracking-wider text-xs uppercase mb-2">
              <span className="size-2 rounded-full bg-primary animate-pulse"></span>
              Archive
            </span>
            <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-2">Completed Series</h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              Temukan koleksi anime yang telah selesai tayang. Dari klasik abadi hingga mahakarya modern, tonton maraton seluruh musim tanpa harus menunggu minggu depan.
            </p>
          </div>
        </div>

        {/* Search & Filters Container */}
        <div className="py-2">
          <div className="flex flex-col gap-4">
            {/* Top Filter Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="w-full bg-surface-dark border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm transition-all outline-none"
                  placeholder="Cari berdasarkan judul..."
                  type="text"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                <span className="text-slate-400 text-sm font-medium whitespace-nowrap">Urutkan:</span>
                <div className="relative">
                  <select className="appearance-none bg-surface-dark border border-border-dark text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-10 min-w-[160px] cursor-pointer hover:bg-border-dark/50 transition-colors outline-none">
                    <option>Rating Tertinggi</option>
                    <option>Terpopuler</option>
                    <option>Terbaru Ditambahkan</option>
                    <option>Abjad</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="flex bg-surface-dark rounded-lg border border-border-dark p-1 gap-1">
                  <button className="p-1.5 rounded bg-border-dark text-white shadow-sm">
                    <Grid className="size-5" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-border-dark/50 text-slate-400 hover:text-white transition-colors">
                    <List className="size-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Filter Row: Pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium border border-primary transition-all shadow-[0_0_10px_rgba(19,91,236,0.3)]">
                Semua Genre
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
              <div className="h-6 w-px bg-border-dark mx-1 hidden sm:block"></div>
              {["Tahun", "Studio", "Rating", "Audio"].map((filter) => (
                <button key={filter} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-dark hover:bg-border-dark text-slate-300 text-sm font-medium border border-border-dark transition-colors">
                  {filter}
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              ))}
              <button className="ml-auto text-sm text-primary hover:text-blue-400 font-medium transition-colors">Hapus Semua</button>
            </div>
          </div>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-2">
          {items.map((item: AnimeItem, i: number) => (
            <Link
              key={item.slug || i}
              href={`/anime/${item.slug}`}
              className="group relative flex flex-col gap-3 cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-dark shadow-md group-hover:shadow-primary/20 transition-all">
                <Image
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.title || "Anime"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10">
                  <Star className="size-3 text-yellow-500 fill-current" />
                  <span className="text-white text-xs font-bold">{item.score || "8.5"}</span>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-primary hover:bg-blue-600 text-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                    <Play className="size-7 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Quality/Audio Badges */}
                <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
                  <span className="bg-primary/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">HD</span>
                  <span className="bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">Sub | Indo</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-white text-sm md:text-base font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="text-slate-300">{item.episode || "?"} Eps</span>
                  <span className="size-1 rounded-full bg-slate-600"></span>
                  <span className="text-primary/80">{item.type || "TV"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-24 bg-surface-dark/30 rounded-2xl border border-dashed border-border-dark">
            <p className="text-slate-500">Tidak ada koleksi anime untuk ditampilkan.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8 pb-10">
          <Pagination basePath="/complete" current={parseInt(pageNum, 10) || 1} />
        </div>
      </div>
    </div>
  );
}
