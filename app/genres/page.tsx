import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Sparkles, Compass, Zap } from "lucide-react";
import GenreCollection from "./GenreCollection";

async function getGenres() {
  try {
    const data = await api<any>(`/anime/genre`, {
      cache: "force-cache",
      next: { revalidate: 3600 }
    });

    // Comprehensive extraction
    let rawList: any[] = [];
    if (Array.isArray(data)) rawList = data;
    else if (data?.data?.genreList) rawList = data.data.genreList;
    else if (data?.data) rawList = Array.isArray(data.data) ? data.data : (data.data.genreList || []);
    else if (data?.genres) rawList = data.genres;
    else if (data?.genreList) rawList = data.genreList;

    // Normalize properties to ensure 'name' and 'slug' exist
    return rawList.map(g => ({
      name: g?.name || g?.title || g?.label || "Unknown",
      slug: g?.slug || g?.id || g?.genreId || g?.value || ""
    })).filter(g => g.slug);
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

export default async function Page() {
  const genres = await getGenres();

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      {/* Immersive Hero Header */}
      <div className="relative h-[40vh] min-h-[350px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/kimetsu.png"
            alt="Anime Discovery Library"
            fill
            className="object-cover scale-105 blur-[2px] opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-[1440px] mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md">
              <Compass className="size-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Discovery Mode</span>
            </div>
            <span className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs uppercase tracking-tighter">
              <Zap className="size-3 fill-current" />
              Genre Library
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter max-w-3xl leading-[0.85] drop-shadow-2xl">
            Choose Your <span className="text-primary italic">Vibe.</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
            Jelajahi perpustakaan genre kami yang luas. Dari adrenalin Action hingga kehangatan Slice of Life, temukan takdir menonton Anda hari ini.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12 -mt-10 relative z-20 pb-20">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-12 min-h-[500px]">
          <GenreCollection genres={genres} />

          {genres.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-3xl gap-6">
              <div className="size-20 bg-white/5 rounded-full flex items-center justify-center">
                <Sparkles className="size-10 text-slate-700" />
              </div>
              <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">Library Temporarily Unavailable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
