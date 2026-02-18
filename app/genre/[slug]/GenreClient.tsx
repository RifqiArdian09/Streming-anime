"use client";

import { useState, useEffect, useCallback } from "react";
import AnimeCard from "@/components/AnimeCard";
import { Search, Grid, List, ChevronDown, Sparkles, Filter, Archive, SlidersHorizontal, Loader2, X } from "lucide-react";
import type { AnimeItem } from "@/lib/api";
import { normalizeItem } from "@/lib/parser";

export default function GenreClient({
  items,
  pageNum,
  slug,
  genreTitle,
}: {
  items: AnimeItem[];
  pageNum: string;
  slug: string;
  genreTitle: string;
}) {
  const [itemsState, setItemsState] = useState<AnimeItem[]>(items);
  const [page, setPage] = useState(parseInt(pageNum, 10) || 1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("Rating Tertinggi");
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = useCallback(
    async (pageNum: number, search: string) => {
      setLoading(true);
      try {
        let url = `/api/anime/genre/${slug}?page=${pageNum}`;
        if (search) {
          url = `/api/anime/search?q=${encodeURIComponent(search)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        let list: any[] = [];
        if (data?.data?.animeList) list = data.data.animeList;
        else if (Array.isArray(data)) list = data;
        else if (data?.data) list = data.data;

        const normalizedItems = list.map(normalizeItem);
        setItemsState(normalizedItems);
        setHasMore(normalizedItems.length > 0 && !search);

      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    },
    [slug]
  );

  // Effect for search or page change
  useEffect(() => {
    if (debouncedSearch) {
      setPage(1);
      fetchData(1, debouncedSearch);
    } else {
      fetchData(page, "");
    }
  }, [debouncedSearch, page, fetchData]);

  // Derived filtered and sorted items
  const displayItems = itemsState.filter((item) => {
    if (debouncedSearch && !item.title?.toLowerCase().includes(debouncedSearch.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "Rating Tertinggi") {
      return (
        parseFloat(b.score?.toString() || "0") -
        parseFloat(a.score?.toString() || "0")
      );
    }
    if (sortBy === "Abjad") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  const handlePageChange = (p: number) => {
    if (p < 1 || loading) return;
    setPage(p);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12 -mt-8 relative z-20">
      {/* Search & Filter bar - Premium Look */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Elegant Search Input */}
          <div className="relative w-full lg:max-w-md group">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors ${loading ? "text-primary animate-pulse" : "text-slate-500 group-focus-within:text-primary"}`}
            />
            <input
              className="w-full bg-white/5 border border-white/10 group-focus-within:border-primary/50 group-focus-within:bg-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 text-sm transition-all outline-none"
              placeholder={`Cari di ${genreTitle}...`}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full lg:w-48 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-2xl py-3.5 pl-12 pr-10 cursor-pointer hover:bg-white/10 transition-colors outline-none"
              >
                <option>Rating Tertinggi</option>
                <option>Terbaru</option>
                <option>Terpopuler</option>
                <option>Abjad</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1.5 gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-white/5 text-slate-500 hover:text-white"
                }`}
                aria-pressed={viewMode === "grid"}
                aria-label="Grid view"
              >
                <Grid className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-white/5 text-slate-500 hover:text-white"
                }`}
                aria-pressed={viewMode === "list"}
                aria-label="List view"
              >
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
            <h2 className="text-3xl font-black tracking-tighter">
              Genre <span className="text-primary">Results</span>
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-primary to-transparent opacity-20" />
          </div>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest hidden sm:block">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3 animate-spin text-primary" />
                Updating...
              </span>
            ) : (
              `Page ${page} • ${displayItems.length} Series Loaded`
            )}
          </span>
        </div>

        {/* Loading Spinner Overlay */}
        {loading && itemsState.length > 0 && (
          <div className="absolute inset-0 z-40 flex items-start justify-center pt-40 pointer-events-none">
            <div className="bg-background-dark/40 backdrop-blur-sm p-6 rounded-full border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-300">
              <Loader2 className="size-12 animate-spin text-primary" />
            </div>
          </div>
        )}

        {loading && itemsState.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/5" />
                <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
                <div className="h-3 w-1/2 bg-white/5 rounded-lg" />
              </div>
            ))}
          </div>
        ) : displayItems.length > 0 ? (
          <div
            className={`${viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10" : "flex flex-col gap-4"} transition-all duration-500 ${loading ? "opacity-20 blur-[2px] scale-[0.98]" : "opacity-100 blur-0 scale-100"}`}
          >
            {displayItems.map((item, i) => (
              <div
                key={item.slug || i}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <AnimeCard item={item} variant={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-40 text-center gap-6 bg-white/2 rounded-3xl border border-dashed border-white/10">
              <div className="size-20 bg-white/5 rounded-full flex items-center justify-center">
                <Archive className="size-10 text-slate-700" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Data Kosong</h3>
                <p className="text-slate-500 max-w-sm">
                  Maaf, saat ini belum ada koleksi anime untuk genre ini. Silakan cek kembali nanti.
                </p>
              </div>
            </div>
          )
        )}

        {/* Custom Pagination */}
        {!debouncedSearch && (
          <div className="flex justify-center items-center gap-4 pt-12 border-t border-white/5">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <span className="size-10 flex items-center justify-center bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
                {page}
              </span>
              {hasMore && (
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="size-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
                >
                  {page + 1}
                </button>
              )}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!hasMore || loading}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
