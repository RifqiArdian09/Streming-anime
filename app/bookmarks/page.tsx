"use client";
import { Suspense, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Plus,
  CheckCircle2,
  Clock,
  PauseCircle,
  Edit3,
  Star,
  History,
  Search,
  ChevronDown,
  Grid,
  List,
  MoreHorizontal,
  Trash
} from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedEpisodes') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const removeBookmark = (episodeSlug: string) => {
    const newBookmarks = bookmarks.filter(slug => slug !== episodeSlug);
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarkedEpisodes', JSON.stringify(newBookmarks));
  };

  // Mock stats for the UI as requested in the design
  const stats = [
    { label: "Watching", count: bookmarks.length > 0 ? 2 : 0, icon: <Play className="text-primary size-5" />, color: "hover:border-primary/50" },
    { label: "Completed", count: 45, icon: <CheckCircle2 className="text-green-500 size-5" />, color: "hover:border-green-500/50" },
    { label: "Plan to Watch", count: 28, icon: <Clock className="text-purple-500 size-5" />, color: "hover:border-purple-500/50" },
    { label: "On Hold", count: 3, icon: <PauseCircle className="text-orange-500 size-5" />, color: "hover:border-orange-500/50" },
  ];

  return (
    <main className="flex-grow container mx-auto px-4 lg:px-8 py-8 bg-background-dark min-h-screen text-white">
      {/* Header & Stats */}
      <div className="mb-10 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">My Collection</h1>
            <p className="text-text-secondary text-base">Kelola daftar tontonan dan pantau kemajuan Anda.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-dark hover:bg-surface-hover rounded-lg text-sm font-medium transition-colors border border-border-dark">
            <Edit3 className="size-[18px]" />
            Manage Lists
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-surface-dark border border-border-dark rounded-xl p-5 flex flex-col justify-between group ${stat.color} transition-colors cursor-pointer shadow-sm`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-white">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Watching Hero - Show if we have bookmarks */}
      {bookmarks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <History className="text-primary size-5" />
            <h2 className="text-xl font-bold">Lanjutkan Menonton</h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-surface-dark shadow-lg group">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5Q7gYetvH79LDg5sy_3_zljdEJu4bvGJaLb10QEin7xYzKFV8t4v7dmUDLnurBxEWEDhCY7PBYWIkwNrMn20-1Taac6LySXUPP3nbhiUjH8JufIfgFjraff_8eaYEmWA7qfFwmj3NZq-7oRQVPjFTHkLfhKocsx2Py2lVYZyMDqsJtAgRP59ahslWrklSDvUyyRGHtbEUOCIu5AIC_HhMT45lcOkVcSVgRiuyb68_LLmfAzJd2IhGtJdnEFx_l0qJfUc9RtGgXqaA"
                alt="Banner"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="relative z-20 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded uppercase tracking-wide border border-primary/20">Resume Ep 14</span>
                  <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                    <Star className="size-4 fill-current" /> 9.8
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">Attack on Titan: The Final Season</h3>
                  <p className="text-slate-300 line-clamp-2 max-w-2xl text-sm md:text-base">
                    Saat pertempuran antara Paradis dan Marley semakin sengit, niat sebenarnya Eren Yeager tetap misterius.
                  </p>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>21m tersisa</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_10px_rgba(19,91,236,0.5)]"></div>
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <Link href={`/episode/${bookmarks[0]}`} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-primary/30 active:scale-95">
                    <Play className="size-5 fill-current" />
                    Lanjut Menonton
                  </Link>
                  <button className="flex items-center justify-center size-10 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/10">
                    <Plus className="size-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Library Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sticky top-16 z-30 py-4 bg-background-dark/95 backdrop-blur-sm -mx-4 px-4 border-b border-border-dark/50">
        {/* Tabs */}
        <div className="flex p-1 bg-surface-dark rounded-lg overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {["All", "Watching", "Plan to Watch", "Completed"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded whitespace-nowrap transition-all ${filter === t ? "text-white bg-primary shadow-sm" : "text-text-secondary hover:text-white"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Sort/View */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:flex-none">
            <button className="flex items-center justify-between w-full sm:w-48 px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-sm text-slate-200 hover:border-slate-600 transition-colors">
              <span>Sort by: Recently Added</span>
              <ChevronDown className="size-4 text-text-secondary" />
            </button>
          </div>
          <div className="flex bg-surface-dark border border-border-dark rounded-lg p-1 hidden sm:flex">
            <button className="p-1.5 rounded bg-surface-hover text-primary shadow-sm">
              <Grid className="size-5" />
            </button>
            <button className="p-1.5 rounded text-text-secondary hover:text-white transition-colors">
              <List className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
        {bookmarks.length > 0 ? (
          bookmarks.map((slug, idx) => (
            <div key={idx} className="group relative flex flex-col gap-2">
              <Link href={`/episode/${slug}`} className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-dark shadow-md cursor-pointer border border-border-dark hover:border-primary/50 transition-colors">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7dQ9Tx6lGAWnlL82daae65ZnOwCBe2e78BZZfwpHFjg6cRejisoFIiQ3V1Vlx89OIAIB_JztPg_AAsfnNs1yyN_cOmlrTR4V2kQrCVh3E1rcjJCcdc3IU7c6XHffHiR-tGY8ff-U8o412UrDDWVmS2-Lq8R2fjfcn4uYkxIrWRDWK6pMhh4fs09wkUgiay4XX4ECfyJQtgKN89kwIGQGaDv7QBBVtWJtGWNL-dFo3BLEmZH03nei3AICRzcIg0w6bf2wOIY11DOI9"
                  alt={slug}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                    <Play className="size-5 fill-current ml-0.5" />
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); removeBookmark(slug); }}
                    className="size-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors border border-white/10"
                  >
                    <Trash className="size-5" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1 border border-white/10">
                  <Star className="size-3 text-yellow-500 fill-current" />
                  <span className="text-[10px] font-bold text-white">9.2</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div className="h-full bg-primary w-[45%] shadow-[0_0_5px_rgba(19,91,236,0.8)]"></div>
                </div>
              </Link>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors pr-2">
                  {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] sm:text-xs text-text-secondary">Eps Tersimpan</p>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/10">Watching</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-80">
            <div className="bg-surface-dark p-6 rounded-full mb-4 border border-border-dark group hover:border-primary/50 transition-colors">
              <History className="size-10 text-text-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Belum ada koleksi</h3>
            <p className="text-text-secondary max-w-sm text-sm">Mulai tambahkan anime ke koleksi Anda untuk memantau apa yang telah Anda tonton.</p>
            <Link href="/ongoing" className="mt-6 px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-primary/20">
              Jelajahi Anime
            </Link>
          </div>
        )}
      </div>

      {bookmarks.length > 0 && (
        <div className="mt-12 flex justify-center pb-12">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border-dark text-text-secondary hover:bg-surface-dark hover:text-white transition-all font-bold text-sm">
            Load More
            <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </main>
  );
}
