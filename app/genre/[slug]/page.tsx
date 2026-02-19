import Link from "next/link";
import Image from "next/image";
import { api, AnimeItem, normalizeAnimeItem } from "@/lib/api";
import { Suspense } from "react";
import { Search, Grid, List, ChevronDown, Play, Star, Sparkles, Filter, Archive, SlidersHorizontal } from "lucide-react";
import GenreClient from "./GenreClient";

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

    return list.map(normalizeAnimeItem).filter((it: AnimeItem) => it.slug);
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

      <GenreClient items={items} pageNum={pageNum} slug={slug} genreTitle={genreTitle} />
    </div>
  );
}
