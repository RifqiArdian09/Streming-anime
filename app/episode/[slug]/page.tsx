import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Home,
  Share2,
  Download,
  Heart,
  Settings,
  Grid,
  List,
  AudioLines,
  Play,
  Star,
  Info,
  ChevronRight as ChevronRightIcon,
  Search,
  MessageSquare
} from "lucide-react";
import { redirect } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";

async function getData(slug: string) {
  try {
    const raw = await api<any>(`/anime/episode/${encodeURIComponent(slug)}`);
    return raw?.data || raw;
  } catch (error) {
    console.error('Failed to fetch episode data:', error);
    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = (() => {
    if (typeof decodedSlug !== "string") return decodedSlug as unknown as string;
    const parts = decodedSlug.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : decodedSlug;
  })();

  if (normalizedSlug !== decodedSlug) {
    redirect(`/episode/${encodeURIComponent(normalizedSlug)}`);
  }

  const data = await getData(normalizedSlug);
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white p-6">
        <div className="bg-surface-dark p-8 rounded-3xl border border-white/5 text-center max-w-md shadow-2xl">
          <Info className="size-16 text-primary mx-auto mb-6 opacity-30" />
          <h1 className="text-2xl font-bold mb-4">Episode Tidak Ditemukan</h1>
          <p className="text-slate-400 mb-8">Maaf, kami tidak dapat menemukan data untuk episode ini. Mungkin link sudah kedaluwarsa.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
            <Home className="size-5" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const title = data?.title || data?.name || data?.episode || slug;
  const animeTitle = data?.animeTitle || data?.anime_title || data?.anime?.title || "Anime Details";
  const streamUrl: string | undefined = data?.defaultStreamingUrl || data?.stream_url || data?.embed || data?.url;
  const animeSlug = data?.animeId || data?.anime_slug || data?.animeSlug || data?.anime?.slug;
  const episodeList = data?.episodeList || data?.episode_list || data?.allEpisodes || [];

  // Metadata for stats
  const metadata = [
    { label: "Season", value: data?.season || "Winter 2024" },
    { label: "Status", value: data?.status || "Ongoing" },
    { label: "Type", value: data?.type || "TV Series" },
    { label: "Studio", value: data?.studios || "Ufotable" }
  ];

  return (
    <main className="flex-grow bg-background-dark min-h-screen text-white font-display">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8">

        {/* Left Column: Player & Info */}
        <div className="flex flex-col gap-8">

          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium">
            <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5">
              <Home className="size-4" /> Home
            </Link>
            <ChevronRightIcon className="size-4 text-slate-600" />
            <Link href="/genres" className="text-slate-400 hover:text-primary transition-colors">Browse</Link>
            <ChevronRightIcon className="size-4 text-slate-600" />
            <Link href={animeSlug ? `/anime/${animeSlug}` : "#"} className="text-slate-400 hover:text-primary transition-colors line-clamp-1">{animeTitle}</Link>
            <ChevronRightIcon className="size-4 text-slate-600" />
            <span className="text-white font-bold opacity-100">{title}</span>
          </nav>

          {/* Player Area */}
          <div className="flex flex-col gap-6">
            <div className="relative group aspect-video w-full overflow-hidden rounded-2xl bg-[#0a0f18] shadow-2xl border border-white/5 ring-1 ring-white/10 ring-inset">
              <VideoPlayer src={streamUrl} episodeSlug={normalizedSlug} />
            </div>

            {/* Title & Actions */}
            <div className="flex flex-col gap-6 bg-surface-dark/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 tracking-tight">
                    {title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/10">Full HD</span>
                    <span className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/10">
                      <Star className="size-3 fill-current" /> 9.3
                    </span>
                    <span className="opacity-60">{data?.series_type || "Subtitles Available"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95">
                    <Heart className="size-4 fill-current" /> Favorites
                  </button>
                  <button className="flex items-center justify-center size-10 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 active:scale-95">
                    <Share2 className="size-5" />
                  </button>
                  <button className="flex items-center justify-center size-10 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 active:scale-95">
                    <Download className="size-5" />
                  </button>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Info className="size-4 text-primary" /> Sinopsis Episode
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                  {Array.isArray(data?.synopsis?.paragraphs) && data.synopsis.paragraphs.length > 0
                    ? data.synopsis.paragraphs[0]
                    : typeof data?.synopsis === 'string'
                      ? data.synopsis
                      : "Tidak ada deskripsi tersedia untuk episode ini. Ikuti terus petualangan serunya!"}
                </p>
              </div>
            </div>

            {/* Comments Placeholder */}
            <div className="bg-surface-dark/30 p-8 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <MessageSquare className="size-5 text-primary" /> Comments
                  <span className="text-xs font-medium bg-white/5 px-2 py-1 rounded text-slate-400">2,453</span>
                </h3>
                <div className="flex bg-white/5 p-1 rounded-lg">
                  <button className="px-3 py-1 text-xs font-bold bg-white/5 text-white rounded-md">Newest</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-white transition-colors">Popular</button>
                </div>
              </div>

              <div className="flex gap-4 items-start mb-10">
                <div className="size-10 rounded-full bg-primary/20 shrink-0 overflow-hidden ring-2 ring-primary/20 shadow-lg">
                  <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAti7wxYQlyicariNm0gQwkq2eCIohQKiN7Nhs7KDSlmzoVq1GuO3YnQ-uO0A0l_nbRBvEyIAag5vfE1StzyvBvCOKMgLUnRcd0Bpxi-OrDC3ANs2yspyxAWy8e9tphLi4L3fnhs2drVUU0chxuB_-wZah3usttHZoUQjMsN76fPJDNZMcT7WxHi1kpi4QJpgvU1Rnz5hZSNqtQXlSQtlsZKuIm_6FujGGNVPqiOfLP4B5wkSIWKaFEQdBPHF74O05nEWuF5nHO--VV" alt="Profile" width={40} height={40} className="object-cover" />
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500 min-h-[100px]"
                    placeholder="Apa pendapatmu tentang episode ini?"
                  />
                  <div className="flex justify-end">
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95">Post Comment</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className="flex flex-col gap-8">

          {/* Episode List Sidebar */}
          <div className="bg-surface-dark/40 rounded-3xl border border-white/5 p-5 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-120px)] sticky top-24">
            <div className="flex items-center justify-between mb-6 px-1">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Daftar Episode</h3>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{episodeList.length} Total EP</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-lg">
                <button className="p-1.5 bg-white/5 text-primary rounded-md shadow-sm"><List className="size-4" /></button>
                <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Grid className="size-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-premium">
              {episodeList.length > 0 ? (
                episodeList.map((ep: any, i: number) => {
                  const epSlug = ep?.episodeId || ep?.slug || ep?.id || ep?.href?.split("/")?.pop();
                  const isActive = normalizedSlug === epSlug;
                  const epTitle = ep?.title || ep?.episode || `Episode ${i + 1}`;

                  return (
                    <Link
                      key={i}
                      href={`/episode/${epSlug}`}
                      className={`group flex items-center gap-3 p-2.5 rounded-2xl border transition-all relative overflow-hidden ${isActive
                        ? "bg-primary/15 border-primary/40 shadow-[inset_0_0_20px_rgba(127,19,236,0.1)]"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                        }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(127,19,236,0.8)]"></div>}

                      <div className="relative size-16 shrink-0 aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5">
                        <Image
                          src={ep?.thumbnail || data?.thumbnail || "/placeholder.jpg"}
                          alt={epTitle}
                          fill
                          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isActive ? 'opacity-40' : ''}`}
                        />
                        {isActive ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <AudioLines className="size-5 text-primary animate-pulse" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all bg-primary/20">
                            <Play className="size-4 fill-current text-white translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-black px-1 py-0.5 rounded border border-white/10 text-white">24:00</div>
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                          {isActive ? "Tengah Diputar" : `Episode ${i + 1}`}
                        </p>
                        <h4 className={`text-xs font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {epTitle}
                        </h4>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-10 opacity-50">
                  <p className="text-xs font-bold">Daftar episode tidak tersedia.</p>
                </div>
              )}
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
}
