"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { List, Grid, Play, AudioLines, ChevronRight } from "lucide-react";

interface Episode {
    episodeId?: string;
    slug?: string;
    id?: string;
    href?: string;
    title?: string;
    episode?: string;
    thumbnail?: string;
}

interface EpisodeSidebarProps {
    episodes: Episode[];
    poster: string;
    currentSlug: string;
}

export default function EpisodeSidebar({ episodes, poster, currentSlug }: EpisodeSidebarProps) {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    return (
        <div className="bg-[#161d2a]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] flex flex-col h-[calc(100vh-120px)]">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Episodes</h3>
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{episodes.length} Chapters</p>
                    </div>
                </div>
                <div className="bg-white/5 p-1 rounded-2xl flex border border-white/5">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === "list"
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-slate-500 hover:text-white"
                            }`}
                    >
                        <List className="size-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === "grid"
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-slate-500 hover:text-white"
                            }`}
                    >
                        <Grid className="size-4" />
                    </button>
                </div>
            </div>

            {/* Enhanced Episode List/Grid */}
            <div className={`flex-1 overflow-y-auto pr-2 scrollbar-premium ${viewMode === "grid" ? "grid grid-cols-2 gap-3 pb-4" : "space-y-4"}`}>
                {episodes.map((ep, i) => {
                    const epSlug = ep?.episodeId || ep?.slug || ep?.id || ep?.href?.split("/")?.pop() || "";
                    const isActive = currentSlug === epSlug;
                    const epTitle = ep?.title || ep.episode || `Episode ${i + 1}`;

                    if (viewMode === "grid") {
                        return (
                            <Link
                                key={i}
                                href={`/episode/${epSlug}`}
                                className={`group relative p-4 rounded-2xl border transition-all duration-500 text-center ${isActive
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                    }`}
                            >
                                <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${isActive ? 'text-white/80' : 'text-primary'}`}>
                                    EP {i + 1}
                                </span>
                                <p className="text-xs font-bold line-clamp-1">
                                    {epTitle}
                                </p>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={i}
                            href={`/episode/${epSlug}`}
                            className={`group flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden ${isActive
                                ? "bg-primary/10 border-primary/30 shadow-[inset_0_0_30px_rgba(12,91,236,0.1)]"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-x-1"
                                }`}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`size-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm border transition-colors ${isActive
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-white/5 text-slate-500 border-white/5 group-hover:text-primary group-hover:border-primary/30"
                                    }`}>
                                    {i + 1}
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                                        {isActive ? "Streaming Now" : `Chapter ${i + 1}`}
                                    </span>
                                    <h4 className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-primary'}`}>
                                        {epTitle}
                                    </h4>
                                </div>
                            </div>

                            {isActive ? (
                                <AudioLines className="size-5 text-primary animate-pulse" />
                            ) : (
                                <div className="size-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                    <ChevronRight className="size-4 text-slate-600 group-hover:text-white" />
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
