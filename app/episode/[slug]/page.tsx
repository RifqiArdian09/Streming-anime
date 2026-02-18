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
  MessageSquare,
  Sparkles
} from "lucide-react";
import { redirect } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeActions from "@/components/EpisodeActions";

import EpisodeSidebar from "@/components/EpisodeSidebar";

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
          <p className="text-slate-400 mb-8">Maaf, kami tidak dapat menemukan data for episode ini. Mungkin link sudah kedaluwarsa.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
            <Home className="size-5" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const title = data?.title || data?.name || data?.episode || slug;
  const animeTitle = data?.animeTitle || data?.anime_title || data?.anime?.title || data?.info?.title || "Anime Details";
  const streamUrl: string | undefined = data?.defaultStreamingUrl || data?.stream_url || data?.embed || data?.url;
  const animeSlug = data?.animeId || data?.anime_slug || data?.animeSlug || data?.anime?.slug || data?.info?.animeId;
  const episodeList = data?.episodeList || data?.episode_list || data?.allEpisodes || data?.all_episodes || data?.info?.episodeList || data?.info?.episode_list || data?.info?.episodes || [];

  // Fetch Anime Data for Poster and Synopsis
  let animeData = null;
  if (animeSlug) {
    try {
      const resp = await api<any>(`/anime/anime/${encodeURIComponent(animeSlug)}`);
      animeData = resp?.data || resp;
    } catch (e) {
      console.error("Failed to fetch anime details for images:", e);
    }
  }

  const poster = animeData?.poster || data?.info?.poster || data?.anime?.poster || data?.poster || "/placeholder.jpg";
  const synopsis = animeData?.synopsis || data?.synopsis || data?.info?.synopsis || "No description available.";

  // Metadata for stats
  const metadata = [
    { label: "Season", value: data?.season || data?.info?.season || data?.aired || "Winter 2024" },
    { label: "Status", value: data?.status || data?.info?.status || "Ongoing" },
    { label: "Studio", value: data?.studios || data?.info?.studios || data?.info?.studio || "Ufotable" }
  ];

  return (
    <main className="flex-grow bg-background-dark min-h-screen text-white font-display pt-24 lg:pt-28">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8">

        {/* Left Column: Player & Info */}
        <div className="flex flex-col gap-6">

          {/* Breadcrumbs - Slimmer & Darker */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
            <Link href="/" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5">
              <Home className="size-3" /> Home
            </Link>
            <ChevronRightIcon className="size-3 text-slate-700" />
            <Link href={animeSlug ? `/anime/${animeSlug}` : "#"} className="text-slate-500 hover:text-primary transition-colors max-w-[150px] truncate">{animeTitle}</Link>
            <ChevronRightIcon className="size-3 text-slate-700" />
            <span className="text-primary">{title}</span>
          </nav>

          {/* Player Area - Premium Cinematic Container */}
          <div className="flex flex-col gap-6">
            <div className="relative group aspect-video w-full overflow-hidden rounded-[2rem] bg-[#05080f] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5">
              <VideoPlayer src={streamUrl} episodeSlug={normalizedSlug} />
              <div className="absolute inset-0 pointer-events-none border-[6px] border-white/5 rounded-[2rem] z-10" />
            </div>

            {/* Content Info Card */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-8 bg-[#161d2a]/60 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl relative group/info">
              {/* Decorative Glow - Wrapped in its own overflow container */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                <div className="absolute -top-24 -right-24 size-48 bg-primary/10 blur-[80px] rounded-full group-hover/info:bg-primary/20 transition-all duration-700" />
              </div>

              <div className="relative z-10 flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-[1.1] mb-4 tracking-tighter drop-shadow-sm">
                    {title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Play className="size-3 fill-current" /> Auto Play
                    </div>
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Star className="size-3 fill-current" /> {data?.score || "9.3"} IMDB
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{data?.season || "Winter 2024"}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                    <Info className="size-4" /> Storyline
                  </h3>
                  <div className="text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl">
                    {typeof synopsis === 'string' ? synopsis : (synopsis?.paragraphs?.[0] || "")}
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col justify-center">
                <EpisodeActions
                  anime={{
                    title: animeTitle,
                    slug: animeSlug,
                    poster: poster,
                    score: data?.score || "N/A",
                    status: data?.status || "Ongoing"
                  }}
                  episode={{
                    title: title,
                    slug: normalizedSlug
                  }}
                  downloadUrl={data?.downloadUrl}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar with Refined List */}
        <aside className="relative">
          <div className="sticky top-24 flex flex-col gap-6">
            <EpisodeSidebar episodes={episodeList} poster={poster} currentSlug={normalizedSlug} />
          </div>
        </aside>
      </div>
    </main>
  );
}
