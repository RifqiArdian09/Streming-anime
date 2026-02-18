import Link from "next/link";
import Image from "next/image";
import { api, AnimeItem } from "@/lib/api";
import { normalizeItem } from "@/lib/parser";
import { Archive, Sparkles } from "lucide-react";
import CollectionList from "../CollectionList";

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

async function getGenres() {
  try {
    const data = await api<any>(`/anime/genre`, {
      cache: "force-cache",
      next: { revalidate: 3600 }
    });

    if (!data) return [];

    // Handle multiple possible structures
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.genreList)) return data.data.genreList;
    if (Array.isArray(data.genres)) return data.genres;

    return [];
  } catch (error) {
    console.error("Genre fetch error:", error);
    return [];
  }
}


export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageParam } = await params;
  const pageNum = pageParam || "1";

  const [rawData, genres] = await Promise.all([
    getData(pageNum),
    getGenres()
  ]);

  const items = rawData.map(normalizeItem);

  // Featured Item for Hero
  const featuredItem = items[0];

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      {/* Immersive Hero Header */}
      <div className="relative h-[45vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/jujutsu.png"
            alt="Completed Anime Collection"
            fill
            className="object-cover scale-105 blur-[2px] opacity-40 transition-transform duration-1000 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-[1440px] mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md">
              <Archive className="size-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Library Collection</span>
            </div>
            <span className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs">
              <Sparkles className="size-3 fill-current" />
              Completed Series
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter max-w-3xl leading-[0.85] drop-shadow-2xl">
            Archive <span className="text-primary italic">Collections</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
            Temukan mahakarya anime yang telah tamat. Jelajahi ribuan judul legendaris dan tonton maraton seluruh episode tanpa hambatan.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12 -mt-8 relative z-20 pb-20">
        <CollectionList initialItems={items} initialPage={parseInt(pageNum, 10)} genres={genres} />
      </div>
    </div>
  );
}
