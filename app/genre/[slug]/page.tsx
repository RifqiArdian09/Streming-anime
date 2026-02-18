import Link from "next/link";
import Image from "next/image";
import { api, AnimeItem } from "@/lib/api";
import Pagination from "@/components/Pagination";
import { normalizeItem } from "@/lib/parser";
import { Suspense } from "react";
import { Search, Grid, List, ChevronDown, Play, Star, Sparkles, Filter, Archive, SlidersHorizontal } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";

async function getData(slug: string, page?: string) {
  try {
    const qs = page ? `?page=${encodeURIComponent(page)}` : "";
    const data = await api<any>(`/anime/genre/${encodeURIComponent(slug)}${qs}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }
    });

    // Using a more robust extraction
    let list: any[] = [];
    if (data?.data?.animeList) list = data.data.animeList;
    else if (Array.isArray(data)) list = data;
    else if (data?.data) list = data.data;

    return list.map(normalizeItem);
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

  // Featured Item for Hero
  const featuredItem = items[0];

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      {/* Immersive Hero Header */}
      <div className="relative h-[45vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={featuredItem?.thumbnail || "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600"}
            alt={genreTitle || "Genre Selection"}
            fill
            className="object-cover scale-105 blur-[3px] opacity-40 transition-transform duration-1000 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-[1440px] mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md">
              <Filter className="size-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Genre Collection</span>
            </div>
            <span className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs">
              <Sparkles className="size-3 fill-current" />
              Exploration
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter max-w-3xl leading-[0.85] drop-shadow-2xl">
            {genreTitle} <span className="text-primary italic">Series</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
            Menjelajahi mahakarya dalam kategori {genreTitle}. Dari kisah mendalam hingga aksi yang memacu adrenalin, temukan yang terbaik di sini.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12 -mt-8 relative z-20">
        {/* Search & Filter bar - Premium Look */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Elegant Search Input */}
            <div className="relative w-full lg:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                className="w-full bg-white/5 border border-white/10 group-focus-within:border-primary/50 group-focus-within:bg-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 text-sm transition-all outline-none"
                placeholder={`Cari di ${genreTitle}...`}
                type="text"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
                <select className="appearance-none w-full lg:w-48 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-2xl py-3.5 pl-12 pr-10 cursor-pointer hover:bg-white/10 transition-colors outline-none">
                  <option>Rating Tertinggi</option>
                  <option>Terbaru</option>
                  <option>Terpopuler</option>
                  <option>Abjad</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1.5 gap-1 shadow-inner">
                <button className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                  <Grid className="size-5" />
                </button>
                <button className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                  <List className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        <div className="py-16 flex flex-col gap-12 relative overflow-hidden">
          {/* Visual decoration */}
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2" />
          <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-x-1/2" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter">Genre <span className="text-primary">Results</span></h2>
              <div className="h-px w-32 bg-gradient-to-r from-primary to-transparent opacity-20" />
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest hidden sm:block">Page {pageNum} &bull; {items.length} Series Loaded</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
            {items.map((item, i) => (
              <AnimeCard key={item.slug || i} item={item} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-center gap-6 bg-white/2 rounded-3xl border border-dashed border-white/10">
              <div className="size-20 bg-white/5 rounded-full flex items-center justify-center">
                <Archive className="size-10 text-slate-700" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Data Kosong</h3>
                <p className="text-slate-500 max-w-sm">Maaf, saat ini belum ada koleksi anime untuk genre ini. Silakan cek kembali nanti.</p>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center pt-8 border-t border-white/5">
            <Pagination basePath={`/genre/${slug}`} current={parseInt(pageNum, 10) || 1} mode="query" paramName="page" />
          </div>
        </div>
      </div>
    </div>
  );
}
