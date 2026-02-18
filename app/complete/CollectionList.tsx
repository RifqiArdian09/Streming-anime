"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search, Grid, List, ChevronDown, Play, Star, Archive, Filter,
    SlidersHorizontal, Sparkles, Loader2, X
} from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import { AnimeItem } from "@/lib/api";
import { normalizeItem, collectAnimeList } from "@/lib/parser";

interface CollectionListProps {
    initialItems: AnimeItem[];
    initialPage: number;
    genres: any[];
}

export default function CollectionList({ initialItems, initialPage, genres }: CollectionListProps) {
    const [items, setItems] = useState<AnimeItem[]>(initialItems);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState("Rating Tertinggi");
    const [selectedGenre, setSelectedGenre] = useState("Semua Genre");
    const [selectedYear, setSelectedYear] = useState("Semua Tahun");
    const [selectedScore, setSelectedScore] = useState("Semua Rating");
    const [hasMore, setHasMore] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle data fetching
    const fetchData = useCallback(async (pageNum: number, search: string) => {
        setLoading(true);
        try {
            let url = `/api/anime/complete?page=${pageNum}`;
            if (search) {
                url = `/api/anime/search?q=${encodeURIComponent(search)}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            const newList = collectAnimeList(data);
            setItems(newList);
            setHasMore(newList.length > 0 && !search);
        } catch (err) {
            console.error("Failed to fetch:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect for search or page change
    useEffect(() => {
        if (debouncedSearch) {
            fetchData(1, debouncedSearch);
        } else {
            fetchData(page, "");
        }
    }, [debouncedSearch, page, fetchData]);

    // Derived filtered and sorted items
    const displayItems = useMemo(() => {
        let result = [...items];

        // Client-side filtering
        if (selectedGenre !== "Semua Genre") {
            // Note: This only filters the current page's data.
            // Ideally, the API would support genre filtering.
            // For now, we filter what we have.
            result = result.filter(it => (it.genres || []).includes(selectedGenre));
        }


        if (selectedYear !== "Semua Tahun") {
            result = result.filter(it => it.release?.includes(selectedYear) || it.releaseDay?.includes(selectedYear));
        }

        if (selectedScore !== "Semua Rating") {
            const minScore = parseFloat(selectedScore);
            result = result.filter(it => parseFloat(it.score?.toString() || "0") >= minScore);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "Rating Tertinggi") {
                return parseFloat(b.score?.toString() || "0") - parseFloat(a.score?.toString() || "0");
            }
            if (sortBy === "Abjad") {
                return (a.title || "").localeCompare(b.title || "");
            }
            if (sortBy === "Terbaru Ditambahkan") {
                return 0; // Default order
            }
            return 0;
        });

        // Limit to 24 cards
        return result.slice(0, 24);
    }, [items, sortBy, selectedGenre, selectedYear, selectedScore]);

    const handlePageChange = (p: number) => {
        if (p < 1 || loading) return;
        setPage(p);
        window.scrollTo({ top: 400, behavior: "smooth" });
    };

    const years = Array.from({ length: 15 }, (_, i) => (2025 - i).toString());

    return (
        <div className="py-2 flex flex-col gap-8">
            {/* Search & Filter bar */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Elegant Search Input */}
                    <div className="relative w-full lg:max-w-md group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors ${loading ? "text-primary animate-pulse" : "text-slate-500 group-focus-within:text-primary"}`} />
                        <input
                            className="w-full bg-white/5 border border-white/10 group-focus-within:border-primary/50 group-focus-within:bg-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 text-sm transition-all outline-none"
                            placeholder="Cari koleksi seri..."
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
                        {/* Sort Dropdown */}
                        <div className="relative flex-1 lg:flex-none">
                            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-full lg:w-48 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-2xl py-3.5 pl-12 pr-10 cursor-pointer hover:bg-white/10 transition-colors outline-none"
                            >
                                <option value="Rating Tertinggi">Rating Tertinggi</option>
                                <option value="Terbaru Ditambahkan">Terbaru Ditambahkan</option>
                                <option value="Terpopuler">Terpopuler</option>
                                <option value="Abjad">Abjad</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
                        </div>

                        {/* View Switcher */}
                        <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1.5 gap-1 shadow-inner">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-xl transition-all duration-300 ${viewMode === "grid" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-white"}`}
                            >
                                <Grid className="size-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-xl transition-all duration-300 ${viewMode === "list" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
                            >
                                <List className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Filter Pills */}
                <div className="flex flex-wrap gap-2.5 items-center border-t border-white/5 pt-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mr-2">Filter By:</span>

                    {/* Genre Filter */}
                    <div className="relative">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all appearance-none cursor-pointer pr-8 bg-surface-dark ${selectedGenre !== "Semua Genre"
                                ? "border-primary/30 text-primary"
                                : "border-white/10 text-white"}`}
                        >
                            <option value="Semua Genre">Semua Genre</option>
                            {genres.map(g => (
                                <option key={g.genreId || g.name} value={g.name} className="bg-surface-dark text-white">{g.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 opacity-50 pointer-events-none" />
                    </div>

                    {/* Year Filter */}
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all appearance-none cursor-pointer pr-8 bg-surface-dark ${selectedYear !== "Semua Tahun"
                                ? "border-primary/30 text-primary"
                                : "border-white/10 text-white"}`}
                        >
                            <option value="Semua Tahun">Tahun</option>
                            {years.map(y => (
                                <option key={y} value={y} className="bg-surface-dark text-white">{y}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 opacity-50 pointer-events-none" />
                    </div>

                    {/* Rating Filter */}
                    <div className="relative">
                        <select
                            value={selectedScore}
                            onChange={(e) => setSelectedScore(e.target.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all appearance-none cursor-pointer pr-8 bg-surface-dark ${selectedScore !== "Semua Rating"
                                ? "border-primary/30 text-primary"
                                : "border-white/10 text-white"}`}
                        >
                            <option value="Semua Rating">Rating</option>
                            {[9, 8, 7, 6].map(s => (
                                <option key={s} value={s.toString()} className="bg-surface-dark text-white">{s}+</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 opacity-50 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            disabled
                            className="bg-transparent border border-white/5 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-not-allowed uppercase"
                        >
                            <option>Status: Completed</option>
                        </select>
                    </div>

                    {(searchQuery || selectedGenre !== "Semua Genre" || selectedYear !== "Semua Tahun" || selectedScore !== "Semua Rating") && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedGenre("Semua Genre");
                                setSelectedYear("Semua Tahun");
                                setSelectedScore("Semua Rating");
                                setPage(1);
                            }}
                            className="ml-auto text-xs text-primary hover:text-blue-400 font-bold transition-colors"
                        >
                            Hapus Semua
                        </button>
                    )}
                </div>
            </div>

            {/* Series Grid Component */}
            <div className="flex flex-col gap-12 relative min-h-[600px]">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black tracking-tighter">Collection <span className="text-primary">List</span></h2>
                    <div className="h-px bg-gradient-to-r from-primary to-transparent flex-1 opacity-20" />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="size-3 animate-spin text-primary" />
                                Updating...
                            </span>
                        ) : `${displayItems.length} Series ${searchQuery ? "found" : "loaded"}`}
                    </span>
                </div>

                {/* Loading Spinner Overlay for smoother transitions */}
                {loading && items.length > 0 && (
                    <div className="absolute inset-0 z-40 flex items-start justify-center pt-40 pointer-events-none">
                        <div className="bg-background-dark/40 backdrop-blur-sm p-6 rounded-full border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-300">
                            <Loader2 className="size-12 animate-spin text-primary" />
                        </div>
                    </div>
                )}

                {loading && items.length === 0 ? (
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
                    <div className={`${viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10" : "flex flex-col gap-4"} transition-all duration-500 ${loading ? "opacity-20 blur-[2px] scale-[0.98]" : "opacity-100 blur-0 scale-100"}`}>
                        {displayItems.map((item, i) => (
                            <div key={item.slug || i} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 30}ms` }}>
                                <AnimeCard item={item} variant={viewMode} />
                            </div>
                        ))}
                    </div>
                ) : !loading && (
                    <div className="flex flex-col items-center justify-center py-40 text-center gap-6 bg-white/2 rounded-3xl border border-dashed border-white/10">
                        <div className="size-20 bg-white/5 rounded-full flex items-center justify-center">
                            <Archive className="size-10 text-slate-700" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold">Tidak Menemukan Hasil</h3>
                            <p className="text-slate-500 max-w-sm">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {
                !searchQuery && (
                    <div className="flex justify-center items-center gap-4 pt-12 border-t border-white/5">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || loading}
                            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="size-10 flex items-center justify-center bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">{page}</span>
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
                )
            }
        </div >
    );
}
