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
import BookmarkButton from "@/components/BookmarkButton";
import EpisodeList from "@/components/EpisodeList";
import ShareButton from "@/components/ShareButton";
import { Home } from "lucide-react";

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
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 blur-[2px] opacity-40"
          style={{ backgroundImage: `url('${data?.poster || "/placeholder.jpg"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 -mt-[350px] relative z-20 pb-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 px-2">
          <Link href="/" className="hover:text-primary flex items-center gap-1.5 transition-colors">
            <Home className="size-3" /> Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-white/50">Details</span>
          <ChevronRight className="size-3" />
          <span className="text-primary truncate max-w-[200px]">{data.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">

          {/* Left: Poster & Basic Info */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="relative aspect-[3/4.5] rounded-3xl overflow-hidden shadow-3xl border border-white/10 group bg-surface-dark">
              <Image
                src={data?.poster || "/placeholder.jpg"}
                alt={data.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-6 right-6 bg-primary backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-2xl">
                <Star className="size-5 text-yellow-400 fill-current" />
                <span className="text-lg font-black">{data?.score || "8.5"}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <BookmarkButton
                anime={{
                  slug: slug,
                  title: data.title,
                  poster: data.poster || "/placeholder.jpg",
                  score: data.score || "8.5",
                  status: data.status || "Ongoing",
                  type: data.type || "TV"
                }}
              />
              <div className="flex gap-4">
                <ShareButton title={data.title} />
                {data?.batch?.batchId && (
                  <Link href={`/batch/${data.batch.batchId}`} className="flex-1 bg-white/10 hover:bg-white/15 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-white/10 flex items-center justify-center gap-2 active:scale-95 text-primary">
                    <Download className="size-4" /> Download Batch
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="mt-10 bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-4">Anime Intelligence</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><BadgeCheck className="size-4" /></div>
                    <span className="text-xs font-bold text-slate-400">Status</span>
                  </div>
                  <span className="text-sm font-black text-primary">{data?.status || "Ongoing"}</span>
                </div>
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20"><List className="size-4" /></div>
                    <span className="text-xs font-bold text-slate-400">Episodes</span>
                  </div>
                  <span className="text-sm font-black text-white">{data?.episodes || episodeList.length || "?"}</span>
                </div>
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20"><Clock className="size-4" /></div>
                    <span className="text-xs font-bold text-slate-400">Duration</span>
                  </div>
                  <span className="text-sm font-black text-white">{data?.duration || "24 min"}</span>
                </div>
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20"><Calendar className="size-4" /></div>
                    <span className="text-xs font-bold text-slate-400">Released</span>
                  </div>
                  <span className="text-sm font-black text-white">{data?.aired || "TBA"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Info */}
          <div className="flex-1 lg:pt-20">
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre: any, i: number) => (
                <Link
                  key={i}
                  href={`/genre/${genre?.genreId || genre?.slug || ""}`}
                  className="px-4 py-1.5 bg-white/10 hover:bg-primary/20 text-white hover:text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all shadow-sm"
                >
                  {genre?.title || genre?.name}
                </Link>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tighter text-white drop-shadow-2xl">
              {data.title}
            </h1>

            <div className="flex flex-wrap gap-8 mb-12">
              <div className="flex items-center gap-3 group">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Clock className="size-5" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</span>
                  <span className="text-sm font-bold">{data?.duration || "24 Menit"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Calendar className="size-5" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Released</span>
                  <span className="text-sm font-bold">{data?.aired || "Oct 2024"}</span>
                </div>
              </div>
            </div>

            <div className="mb-16 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Info className="size-24" />
              </div>
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white"><Info className="size-4" /></div>
                Story <span className="text-primary italic">Overview</span>
              </h3>
              <p className="text-slate-300 text-base md:text-xl leading-relaxed max-w-4xl font-medium opacity-90 first-letter:text-4xl first-letter:font-black first-letter:text-primary first-letter:mr-1">
                {Array.isArray(data?.synopsis?.paragraphs) && data.synopsis.paragraphs.length > 0
                  ? data.synopsis.paragraphs.join(' ')
                  : typeof data?.synopsis === 'string'
                    ? data.synopsis
                    : "Tidak ada sinopsis tersedia untuk anime ini. Ikuti terus petualangan serunya!"}
              </p>
            </div>

            {/* Episode List Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                    <List className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter">Episode <span className="text-primary italic">List</span></h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Available for streaming now</p>
                  </div>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-bold text-xs">
                  {episodeList.length} <span className="text-slate-500 uppercase tracking-widest ml-1">Items</span>
                </div>
              </div>

              <EpisodeList episodes={episodeList} poster={data?.poster} aired={data?.aired} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
