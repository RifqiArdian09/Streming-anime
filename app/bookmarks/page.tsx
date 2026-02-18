"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Clock,
  Heart,
  Grid,
  List,
  Trash,
  Zap,
  Layers,
  ArrowRight,
  Bookmark as BookmarkIcon,
  Star,
  Film,
  Tv
} from "lucide-react";

// Interface untuk episode Tonton Nanti
interface WatchLaterEpisode {
  title: string;
  slug: string;
  animeTitle: string;
  animeSlug: string;
  poster: string;
  addedAt: string;
}

// Interface untuk anime Favorit
interface FavoriteAnime {
  title: string;
  slug: string;
  poster: string;
  score: string;
  status: string;
  addedAt: string;
}

// Tipe tab aktif
type ActiveTab = "watchlater" | "favorite";

export default function BookmarksPage() {
  const [watchLaterList, setWatchLaterList] = useState<WatchLaterEpisode[]>([]);
  const [favoriteList, setFavoriteList] = useState<FavoriteAnime[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("watchlater");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mounted, setMounted] = useState(false);

  // Modal konfirmasi hapus
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    type: ActiveTab;
    slug: string;
    title: string;
  }>({ show: false, type: "watchlater", slug: "", title: "" });

  // Ambil data dari localStorage
  useEffect(() => {
    setMounted(true);
    loadData();

    // Sinkronisasi data ketika ada perubahan dari tab lain
    const handleUpdate = () => loadData();
    window.addEventListener('watchlist-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('watchlist-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Fungsi untuk memuat data dari localStorage
  const loadData = () => {
    const savedWatchLater = JSON.parse(localStorage.getItem("watchLaterEpisodes") || "[]");
    setWatchLaterList(savedWatchLater);
    const savedFavorites = JSON.parse(localStorage.getItem("favoriteAnime") || "[]");
    setFavoriteList(savedFavorites);
  };

  // Hapus episode dari Tonton Nanti
  const removeWatchLater = (slug: string) => {
    const updated = watchLaterList.filter(e => e.slug !== slug);
    setWatchLaterList(updated);
    localStorage.setItem("watchLaterEpisodes", JSON.stringify(updated));
    window.dispatchEvent(new Event('watchlist-updated'));
    setDeleteModal({ show: false, type: "watchlater", slug: "", title: "" });
  };

  // Hapus anime dari Favorit
  const removeFavorite = (slug: string) => {
    const updated = favoriteList.filter(a => a.slug !== slug);
    setFavoriteList(updated);
    localStorage.setItem("favoriteAnime", JSON.stringify(updated));
    window.dispatchEvent(new Event('watchlist-updated'));
    setDeleteModal({ show: false, type: "favorite", slug: "", title: "" });
  };

  // Konfirmasi hapus
  const confirmDelete = () => {
    if (deleteModal.type === "watchlater") {
      removeWatchLater(deleteModal.slug);
    } else {
      removeFavorite(deleteModal.slug);
    }
  };

  // Statistik untuk hero section
  const stats = useMemo(() => [
    {
      label: "Tonton Nanti",
      count: watchLaterList.length,
      icon: <Clock className="text-purple-500 size-5" />,
      color: "border-purple-500/20 bg-purple-500/5",
      tab: "watchlater" as ActiveTab
    },
    {
      label: "Anime Favorit",
      count: favoriteList.length,
      icon: <Heart className="text-pink-500 size-5" />,
      color: "border-pink-500/20 bg-pink-500/5",
      tab: "favorite" as ActiveTab
    },
  ], [watchLaterList, favoriteList]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">

      {/* Hero Header */}
      <div className="relative h-[50vh] min-h-[450px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/attact.jpg"
            alt="My Collection"
            fill
            className="object-cover scale-105 blur-[1px] opacity-40 shadow-inner"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        </div>

        <div className="relative h-full max-w-[1440px] mx-auto px-6 sm:px-12 flex flex-col justify-end pb-28 gap-4">
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md">
              <BookmarkIcon className="size-3 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">My Library</span>
            </div>
            <span className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs uppercase tracking-tighter">
              <Zap className="size-3 fill-current" />
              Personal Collection
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter max-w-3xl leading-[0.85] drop-shadow-2xl animate-in fade-in slide-in-from-left-6 duration-1000">
            My <span className="text-primary italic">Collection.</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl leading-relaxed font-medium animate-in fade-in slide-in-from-left-8 duration-1000">
            Kelola daftar episode yang ingin ditonton nanti dan anime favorit Anda di satu tempat.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12 -mt-16 relative z-20 pb-20">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-3xl flex flex-col gap-12 min-h-[600px]">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab(stat.tab)}
                className={`relative overflow-hidden border ${activeTab === stat.tab ? "ring-2 ring-primary/40 " : ""}${stat.color} rounded-3xl p-6 flex flex-col justify-between group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 active:scale-95 cursor-pointer`}
              >
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-150 rotate-12">
                  {stat.icon}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                  <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-black text-white">{stat.count}</span>
                  <div className={`text-[10px] font-bold transition-opacity ${activeTab === stat.tab ? "text-primary opacity-100" : "text-primary opacity-0 group-hover:opacity-100"}`}>
                    {activeTab === stat.tab ? "ACTIVE" : "VIEW"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8 border-y border-white/5 py-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Layers className="size-6 text-primary" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter">
                  {activeTab === "watchlater" ? (
                    <>Tonton <span className="text-purple-500">Nanti</span></>
                  ) : (
                    <>Anime <span className="text-pink-500">Favorit</span></>
                  )}
                </h2>
              </div>
              <p className="text-slate-400 text-sm font-medium ml-1">
                Total {activeTab === "watchlater" ? watchLaterList.length : favoriteList.length} entri ditemukan
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 w-full xl:w-auto">
              {/* Tab Buttons */}
              <div className="flex p-2 bg-white/5 rounded-[1.25rem] border border-white/10 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab("watchlater")}
                  className={`flex items-center gap-2 px-8 py-2.5 text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-500 whitespace-nowrap ${activeTab === "watchlater"
                    ? "bg-purple-500 text-white shadow-xl shadow-purple-500/20 scale-105"
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Clock className="size-4" />
                  Tonton Nanti
                </button>
                <button
                  onClick={() => setActiveTab("favorite")}
                  className={`flex items-center gap-2 px-8 py-2.5 text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-500 whitespace-nowrap ${activeTab === "favorite"
                    ? "bg-pink-500 text-white shadow-xl shadow-pink-500/20 scale-105"
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Heart className="size-4" />
                  Favorit
                </button>
              </div>

              {/* View Mode */}
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "grid" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
                >
                  <Grid className="size-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "list" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
                >
                  <List className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ========== TAB: TONTON NANTI (Watch Later Episodes) ========== */}
          {activeTab === "watchlater" && (
            <>
              {watchLaterList.length > 0 ? (
                <div className={`${viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-12"
                  : "flex flex-col gap-5"
                  }`}>
                  {watchLaterList.map((ep, idx) => (
                    <div
                      key={ep.slug || idx}
                      className="group relative transition-all duration-500 animate-in fade-in zoom-in-95 duration-700"
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {viewMode === "grid" ? (
                        <div className="flex flex-col gap-4">
                          {/* Card Poster */}
                          <div className="relative aspect-[3/4.5] rounded-[2rem] overflow-hidden border border-white/10 bg-surface-dark shadow-2xl group/card">
                            <Image
                              src={ep.poster || "/placeholder.jpg"}
                              alt={ep.title}
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            {/* Badge Episode */}
                            <div className="absolute top-4 left-4 bg-purple-500/80 backdrop-blur-xl px-2.5 py-1 rounded-xl border border-purple-400/30 flex items-center gap-1.5 shadow-xl">
                              <Film className="size-3" />
                              <span className="text-[10px] font-black uppercase">Episode</span>
                            </div>

                            {/* Overlay saat hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover/card:opacity-100 transition-all duration-500 backdrop-blur-md bg-purple-500/10">
                              <Link
                                href={`/episode/${ep.slug}`}
                                className="size-14 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all outline-none"
                              >
                                <Play className="size-7 fill-current ml-1" />
                              </Link>
                              <button
                                onClick={() => setDeleteModal({ show: true, type: "watchlater", slug: ep.slug, title: ep.title })}
                                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-red-500 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 font-bold text-xs uppercase tracking-widest"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>

                          {/* Info Episode */}
                          <div className="px-2">
                            <h3 className="text-base font-black tracking-tight line-clamp-1 group-hover:text-purple-400 transition-colors duration-300">
                              {ep.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-1">
                              {ep.animeTitle}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* List View */
                        <div className="flex items-center gap-6 p-5 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:border-purple-500/50 group-hover:shadow-3xl">
                          <div className="relative aspect-[3/4.5] w-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                              src={ep.poster || "/placeholder.jpg"}
                              alt={ep.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute top-1 left-1 bg-purple-500/80 px-1.5 py-0.5 rounded-lg">
                              <Film className="size-2.5" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-xl font-black tracking-tight group-hover:text-purple-400 transition-colors line-clamp-1">
                                  {ep.title}
                                </h3>
                                <p className="text-sm text-slate-400 font-medium line-clamp-1">{ep.animeTitle}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-black text-purple-400 px-3 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">Tonton Nanti</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Link
                                  href={`/episode/${ep.slug}`}
                                  className="size-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-500/20 hover:scale-105 transition-all"
                                >
                                  <Play className="size-6 fill-current ml-0.5" />
                                </Link>
                                <button
                                  onClick={() => setDeleteModal({ show: true, type: "watchlater", slug: ep.slug, title: ep.title })}
                                  className="size-12 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center"
                                >
                                  <Trash className="size-5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-500 text-xs mt-4 font-medium italic">
                              Ditambahkan {new Date(ep.addedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State - Tonton Nanti */
                <EmptyState
                  icon={<Clock className="size-16 text-slate-800" />}
                  accentIcon={<Film className="size-6 text-white" />}
                  title="Belum ada episode."
                  description="Tandai episode yang ingin Anda tonton nanti dari halaman episode. Episode akan muncul di sini."
                  linkHref="/ongoing"
                  linkLabel="Jelajahi Anime"
                />
              )}
            </>
          )}

          {/* ========== TAB: FAVORIT ANIME ========== */}
          {activeTab === "favorite" && (
            <>
              {favoriteList.length > 0 ? (
                <div className={`${viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-12"
                  : "flex flex-col gap-5"
                  }`}>
                  {favoriteList.map((anime, idx) => (
                    <div
                      key={anime.slug || idx}
                      className="group relative transition-all duration-500 animate-in fade-in zoom-in-95 duration-700"
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {viewMode === "grid" ? (
                        <div className="flex flex-col gap-4">
                          <div className="relative aspect-[3/4.5] rounded-[2rem] overflow-hidden border border-white/10 bg-surface-dark shadow-2xl group/card">
                            <Image
                              src={anime.poster || "/placeholder.jpg"}
                              alt={anime.title}
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            {/* Badge Score */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-xl transition-transform group-hover:scale-110">
                              <Star className="size-3.5 text-yellow-500 fill-current" />
                              <span className="text-xs font-black">{anime.score}</span>
                            </div>

                            {/* Badge Favorit */}
                            <div className="absolute top-4 left-4 bg-pink-500/80 backdrop-blur-xl px-2.5 py-1 rounded-xl border border-pink-400/30 flex items-center gap-1.5 shadow-xl">
                              <Heart className="size-3 fill-current" />
                              <span className="text-[10px] font-black uppercase">Favorit</span>
                            </div>

                            {/* Overlay saat hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover/card:opacity-100 transition-all duration-500 backdrop-blur-md bg-pink-500/10">
                              <Link
                                href={`/anime/${anime.slug}`}
                                className="size-14 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-2xl shadow-pink-500/40 hover:scale-110 active:scale-95 transition-all outline-none"
                              >
                                <Play className="size-7 fill-current ml-1" />
                              </Link>
                              <button
                                onClick={() => setDeleteModal({ show: true, type: "favorite", slug: anime.slug, title: anime.title })}
                                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-red-500 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 font-bold text-xs uppercase tracking-widest"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>

                          {/* Info Anime */}
                          <div className="px-2">
                            <h3 className="text-base font-black tracking-tight line-clamp-1 group-hover:text-pink-400 transition-colors duration-300">
                              {anime.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] font-black text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-lg border border-pink-500/20 uppercase">
                                {anime.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* List View */
                        <div className="flex items-center gap-6 p-5 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:border-pink-500/50 group-hover:shadow-3xl">
                          <div className="relative aspect-[3/4.5] w-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                              src={anime.poster || "/placeholder.jpg"}
                              alt={anime.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-xl font-black tracking-tight group-hover:text-pink-400 transition-colors line-clamp-1">
                                  {anime.title}
                                </h3>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-black text-pink-400 px-3 py-1 bg-pink-500/10 rounded-lg border border-pink-500/20">Favorit</span>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Star className="size-3 text-yellow-500 fill-current" /> {anime.score}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Link
                                  href={`/anime/${anime.slug}`}
                                  className="size-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-xl shadow-pink-500/20 hover:scale-105 transition-all"
                                >
                                  <Play className="size-6 fill-current ml-0.5" />
                                </Link>
                                <button
                                  onClick={() => setDeleteModal({ show: true, type: "favorite", slug: anime.slug, title: anime.title })}
                                  className="size-12 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center"
                                >
                                  <Trash className="size-5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-500 text-xs mt-4 font-medium italic">
                              Ditambahkan {new Date(anime.addedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State - Favorit Anime */
                <EmptyState
                  icon={<Heart className="size-16 text-slate-800" />}
                  accentIcon={<Tv className="size-6 text-white" />}
                  title="Belum ada favorit."
                  description="Tandai anime favorit Anda dari halaman episode. Anime favorit akan muncul di sini."
                  linkHref="/ongoing"
                  linkLabel="Jelajahi Anime"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteModal({ ...deleteModal, show: false })} />
          <div className="relative bg-[#0d1117] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 fade-in duration-300">
            <div className="flex flex-col items-center text-center gap-5">
              <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash className="size-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight">Hapus Item?</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Apakah Anda yakin ingin menghapus <span className="text-white font-bold">&ldquo;{deleteModal.title}&rdquo;</span> dari {deleteModal.type === "watchlater" ? "Tonton Nanti" : "Favorit"}?
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setDeleteModal({ ...deleteModal, show: false })}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Empty State yang dapat digunakan ulang
function EmptyState({
  icon,
  accentIcon,
  title,
  description,
  linkHref,
  linkLabel
}: {
  icon: React.ReactNode;
  accentIcon: React.ReactNode;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-48 text-center gap-10">
      <div className="relative">
        <div className="size-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 rotate-12 transition-transform hover:rotate-0 duration-500">
          {icon}
        </div>
        <div className="absolute -top-4 -right-4 size-12 bg-primary rounded-2xl flex items-center justify-center animate-bounce shadow-2xl shadow-primary/40 rotate-12">
          {accentIcon}
        </div>
      </div>
      <div className="space-y-4 max-w-md">
        <h3 className="text-3xl font-black tracking-tight">
          {title.split(".")[0]}<span className="text-primary italic">.</span>
        </h3>
        <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      <Link
        href={linkHref}
        className="group flex items-center gap-4 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-95 transition-all"
      >
        <span>{linkLabel}</span>
        <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  );
}
