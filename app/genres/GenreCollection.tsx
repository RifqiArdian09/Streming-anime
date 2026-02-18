"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Grid, Layout } from "lucide-react";

interface Genre {
    name: string;
    slug: string;
}

interface GenreCollectionProps {
    genres: Genre[];
}

export default function GenreCollection({ genres }: GenreCollectionProps) {
    const [viewMode, setViewMode] = useState<"layout" | "grid">("layout");

    return (
        <div className="flex flex-col gap-12">
            {/* Search & Layout Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black tracking-tighter">
                            Available <span className="text-primary">Categories</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                        Total {genres.length} genre unik untuk dieksplorasi
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setViewMode("layout")}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === "layout"
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "text-slate-200 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Layout className="size-5" />
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === "grid"
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "text-slate-500 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Grid className="size-5" />
                    </button>
                </div>
            </div>

            {/* Dynamic Genre Grid */}
            <div
                className={`grid gap-6 transition-all duration-500 ${viewMode === "layout"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                    }`}
            >
                {genres.map((genre, i) => (
                    <Link
                        key={genre.slug || i}
                        href={`/genre/${genre.slug}`}
                        className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a212e]/50 hover:bg-[#252d3d] transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${viewMode === "layout" ? "h-28" : "h-24"
                            }`}
                        style={{ animationDelay: `${i * 30}ms` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className={`relative z-10 h-full p-5 flex items-center justify-between ${viewMode === "grid" ? "flex-col !justify-center gap-2 text-center" : ""}`}>
                            <div className="flex flex-col">
                                {viewMode === "layout" && (
                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-1 opacity-80">
                                        Explore
                                    </span>
                                )}
                                <h3
                                    className={`font-black text-white tracking-tight group-hover:text-primary transition-colors duration-300 ${viewMode === "layout" ? "text-xl" : "text-sm text-center"
                                        }`}
                                >
                                    {genre.name}
                                </h3>
                            </div>
                            <div
                                className={`rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 shadow-lg ${viewMode === "layout" ? "size-10" : "size-8"
                                    }`}
                            >
                                <ArrowRight className={viewMode === "layout" ? "size-5" : "size-4"} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
