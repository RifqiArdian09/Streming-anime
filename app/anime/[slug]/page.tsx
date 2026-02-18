import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  Star,
  Clock,
  Calendar,
  Database,
  BadgeCheck,
  Share2,
  Heart,
  Info,
  ChevronRight,
  Download,
  List
} from "lucide-react";
import { redirect } from "next/navigation";

async function getAnimeData(slug: string) {
  try {
    const raw = await api<any>(`/anime/anime/${encodeURIComponent(slug)}`);
    return raw?.data || raw;
  } catch (error) {
    console.error('Failed to fetch anime data:', error);
    return null;
  }
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAnimeData(slug);

  if (!data || !data.title) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white p-6">
        <div className="bg-surface-dark p-8 rounded-3xl border border-white/5 text-center max-w-md shadow-2xl">
          <Info className="size-16 text-primary mx-auto mb-6 opacity-30" />
          <h1 className="text-2xl font-bold mb-4">Anime Tidak Ditemukan</h1>
          <p className="text-slate-400 mb-8">Maaf, kami tidak dapat menemukan data untuk anime ini.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const episodeList = data?.episodeList || data?.episode_list || [];
  const genres = data?.genreList || data?.genres || [];

  return (
    <main className="flex-grow bg-background-dark min-h-screen text-white font-display">
      {/* Cinematic Banner */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('${data?.poster || "/placeholder.jpg"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 -mt-64 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left: Poster & Basic Info */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={data?.poster || "/placeholder.jpg"}
                alt={data.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg">
                <Star className="size-4 text-yellow-500 fill-current" />
                <span className="text-sm font-black">{data?.score || "8.5"}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95">
                <Heart className="size-5" /> Tambah ke Koleksi
              </button>
              <div className="flex gap-3">
                <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2">
                  <Share2 className="size-4" /> Share
                </button>
                {data?.batch?.batchId && (
                  <Link href={`/batch/${data.batch.batchId}`} className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2">
                    <Download className="size-4" /> Batch
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="mt-8 bg-surface-dark/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</span>
                  <span className="text-sm font-bold text-slate-200">{data?.type || "TV Series"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
                  <span className="text-sm font-bold text-primary">{data?.status || "Ongoing"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Episodes</span>
                  <span className="text-sm font-bold text-slate-200">{data?.episodes || episodeList.length || "?"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</span>
                  <span className="text-sm font-bold text-slate-200">{data?.duration || "24 min"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Release</span>
                  <span className="text-sm font-bold text-slate-200">{data?.aired || "TBA"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Studio</span>
                  <span className="text-sm font-bold text-slate-200 line-clamp-1">{data?.studios || "TBA"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Info */}
          <div className="flex-1 lg:pt-16">
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre: any, i: number) => (
                <Link
                  key={i}
                  href={`/genre/${genre?.genreId || genre?.slug || ""}`}
                  className="px-3 py-1 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5 transition-all"
                >
                  {genre?.title || genre?.name}
                </Link>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-2xl">
              {data.title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="size-5 text-primary" />
                <span className="text-sm font-bold">{data?.duration || "24 Menit"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="size-5 text-primary" />
                <span className="text-sm font-bold">{data?.aired || "Oct 2025"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Database className="size-5 text-primary" />
                <span className="text-sm font-bold uppercase">{data?.type || "TV"}</span>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="size-5 text-primary" /> Synopsis
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-4xl font-medium opacity-90">
                {Array.isArray(data?.synopsis?.paragraphs) && data.synopsis.paragraphs.length > 0
                  ? data.synopsis.paragraphs.join(' ')
                  : typeof data?.synopsis === 'string'
                    ? data.synopsis
                    : "Tidak ada sinopsis tersedia untuk anime ini. Ikuti terus petualangan serunya!"}
              </p>
            </div>

            {/* Episode List Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <List className="size-6 text-primary" /> Daftar Episode
                  <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-slate-500">{episodeList.length} Items</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {episodeList.map((ep: any, i: number) => {
                  const epSlug = ep?.episodeId || ep?.slug || ep?.id || ep?.href?.split("/")?.pop();
                  return (
                    <Link
                      key={i}
                      href={`/episode/${epSlug}`}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-surface-dark/40 border border-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-lg"
                    >
                      <div className="relative size-20 shrink-0 aspect-video rounded-xl overflow-hidden shadow-xl">
                        <Image
                          src={data?.poster || "/placeholder.jpg"}
                          alt={`Episode ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                          <Play className="size-6 text-white fill-current translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">EPS {episodeList.length - i}</span>
                        <h4 className="text-sm font-bold leading-snug line-clamp-1 group-hover:text-white transition-colors text-slate-300">
                          {ep?.title || `Episode ${episodeList.length - i}`}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-bold">{data?.aired || "TBA"}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
