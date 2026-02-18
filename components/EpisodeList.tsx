"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ChevronDown, ChevronUp } from "lucide-react";

interface Episode {
    episodeId?: string;
    slug?: string;
    id?: string;
    href?: string;
    title?: string;
}

interface EpisodeListProps {
    episodes: Episode[];
    poster: string;
    aired?: string;
}

export default function EpisodeList({ episodes, poster, aired }: EpisodeListProps) {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_LIMIT = 12;

    const displayEpisodes = showAll ? episodes : episodes.slice(0, INITIAL_LIMIT);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayEpisodes.map((ep, i) => {
                    const epSlug = ep?.episodeId || ep?.slug || ep?.id || ep?.href?.split("/")?.pop();
                    const displayIdx = episodes.length - i;

                    return (
                        <Link
                            key={i}
                            href={`/episode/${epSlug}`}
                            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/5"
                        >
                            <div className="relative size-20 shrink-0 aspect-video rounded-xl overflow-hidden shadow-xl border border-white/10">
                                <Image
                                    src={poster || "/placeholder.jpg"}
                                    alt={`Episode ${displayIdx}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                                    <Play className="size-6 text-white fill-current translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">EPS {displayIdx}</span>
                                <h4 className="text-sm font-bold leading-snug line-clamp-1 group-hover:text-white transition-colors text-slate-300">
                                    {ep?.title || `Episode ${displayIdx}`}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-bold">{aired || "TBA"}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {episodes.length > INITIAL_LIMIT && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="mx-auto flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition-all active:scale-95 text-slate-300 hover:text-white"
                >
                    {showAll ? (
                        <>
                            Tampilkan Lebih Sedikit <ChevronUp className="size-4" />
                        </>
                    ) : (
                        <>
                            Tampilkan Semua {episodes.length} Episode <ChevronDown className="size-4" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
