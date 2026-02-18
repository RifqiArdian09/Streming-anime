import Link from "next/link";
import Image from "next/image";
import { api, AnimeItem } from "@/lib/api";
import Pagination from "@/components/Pagination";
import { collectAnimeList } from "@/lib/parser";
import { Suspense } from "react";
import { Search, Grid, List, ChevronDown, Play, Star, Sparkles, Filter } from "lucide-react";

async function getData(slug: string, page?: string) {
  try {
    const qs = page ? `?page=${encodeURIComponent(page)}` : "";
    const data = await api<any>(`/anime/genre/${encodeURIComponent(slug)}${qs}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }
    });
    return collectAnimeList(data);
  } catch (error) {
    console.error('Failed to fetch genre data:', error);
    return [];
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const pageNum = sp?.page || "1";
  const items = await getData(slug, pageNum);

  const genreTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 lg:px-8 bg-background-dark min-h-screen text-white">
      <div className="flex flex-col w-full max-w-[1280px] flex-1 gap-6">

        {/* Animated Hero Section */}
        <div className="relative w-full overflow-hidden rounded-2xl min-h-[300px] flex items-end shadow-2xl group border border-white/5">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCfN8Y1yVXhtXAt6Clum3gESFZrRBi1HpDNImiPhqkm2998GpeSK1Yh3HlMSYmuBZkRrcL_KHXUTW-D5xnC9Un1Hv8NH86PWjoZribh87A86jK7iy5zrYrvuwpSKrzIPNQwODeDEuhHdNfgE0rUehnmX-uYOG0xO3aNNJP1Y9tVYyi5YEYejLeFhLj-eM8jMwDrbS091c7YVf-n4_gyFgk9J5JD8vSH90Gv-ekryVv9x6ECcXlIOekbkr0bhb6Y-W6KgfUe9iFec28')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-[#111722]/60 to-transparent"></div>
          <div className="relative z-10 flex flex-col p-8 md:p-12 w-full max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest border border-primary/30 backdrop-blur-md">
                Genre Archive
              </span>
              <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                <Star className="size-3 fill-current" /> Popular Selection
              </span>
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tighter">
              {genreTitle}
            </h1>
            <p className="text-slate-200 text-sm md:text-lg max-w-2xl leading-relaxed font-medium opacity-90">
              Menjelajahi dunia {genreTitle}. Dari kisah mendalam hingga aksi yang memacu adrenalin, temukan koleksi terbaik kami khusus untuk genre favorit Anda.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="py-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border-dark pb-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <h2 className="text-white text-xl font-bold tracking-tight">Koleksi {genreTitle}</h2>
                </div>
                <p className="text-text-secondary text-sm">Menampilkan hasil untuk halaman {pageNum}</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                <div className="relative">
                  <select className="appearance-none bg-surface-dark border border-border-dark text-white text-xs font-bold rounded-full block py-2 px-5 pr-10 min-w-[160px] cursor-pointer hover:bg-surface-hover transition-all outline-none">
                    <option>Rating Tertinggi</option>
                    <option>Terpopuler</option>
                    <option>Terbaru</option>
                    <option>A-Z</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="flex bg-surface-dark rounded-full border border-border-dark p-1">
                  <button className="p-1.5 rounded-full bg-primary text-white shadow-lg">
                    <Grid className="size-4" />
                  </button>
                  <button className="p-1.5 rounded-full text-text-secondary hover:text-white transition-colors">
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 mt-2">
          {items.map((item, i) => (
            <Link
              key={item.slug || i}
              href={`/anime/${item.slug}`}
              className="group relative flex flex-col gap-3 cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-dark shadow-xl hover:shadow-primary/20 transition-all border border-white/5">
                <Image
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.title || "Anime"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Episode Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="bg-primary/95 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl backdrop-blur-sm border border-white/10">
                    EP {item.episode || "?"}
                  </span>
                </div>

                {/* Score Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10 shadow-lg">
                  <Star className="size-3 text-yellow-500 fill-current" />
                  <span className="text-white text-[10px] font-black">{item.score || "8.5"}</span>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl scale-90 group-hover:scale-100">
                    <Play className="size-8 fill-current ml-1" />
                  </div>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 flex-wrap">
                  <span className="bg-primary/95 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg border border-white/10">HD</span>
                  <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/10">{item.type || "TV"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 px-1">
                <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] font-bold text-text-secondary uppercase tracking-tight">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3 text-primary/60" />
                    {item.status || "Ongoing"}
                  </span>
                  <span className="text-slate-500">{item.episode || "?"} EPS</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-surface-dark/20 rounded-3xl border border-dashed border-border-dark group hover:border-primary/30 transition-colors">
            <Filter className="size-16 text-text-secondary mb-4 opacity-30 group-hover:text-primary group-hover:opacity-50 transition-all" />
            <p className="text-text-secondary font-bold text-lg">Tidak ada anime yang ditemukan.</p>
            <Link href="/genres" className="mt-4 text-primary hover:underline font-bold text-sm">Kembali ke Daftar Genre</Link>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12 pb-16">
          <Pagination basePath={`/genre/${slug}`} current={parseInt(pageNum, 10) || 1} mode="query" paramName="page" />
        </div>
      </div>
    </div>
  );
}
