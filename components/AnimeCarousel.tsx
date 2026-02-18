"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import Link from "next/link";
import { AnimeItem } from "@/lib/api";

interface AnimeCarouselProps {
    title: string;
    items: AnimeItem[];
    icon?: React.ReactNode;
}

export default function AnimeCarousel({ title, items, icon }: AnimeCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    {icon}
                    {title}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="size-8 rounded-full bg-surface-dark hover:bg-surface-hover flex items-center justify-center transition-colors text-white"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="size-8 rounded-full bg-surface-dark hover:bg-surface-hover flex items-center justify-center transition-colors text-white"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide snap-x"
            >
                {items.map((item, i) => {
                    const itemSlug = item.slug ? `/anime/${encodeURIComponent(item.slug)}` : "#";
                    return (
                        <div key={i} className="min-w-[160px] sm:min-w-[200px] lg:min-w-[220px] snap-start group cursor-pointer">
                            <Link href={itemSlug} className="block relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                                    style={{ backgroundImage: `url('${item.thumbnail || "/placeholder.jpg"}')` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-10">
                                    <div className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-bold text-sm mb-2 flex items-center justify-center gap-1 transition-colors">
                                        <Play className="size-4 fill-current" /> Play
                                    </div>
                                    <div className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded font-bold text-sm flex items-center justify-center gap-1 transition-colors backdrop-blur-sm">
                                        <Plus className="size-4" /> List
                                    </div>
                                </div>
                                {item.episode && (
                                    <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                        {item.episode}
                                    </div>
                                )}
                            </Link>
                            <Link href={itemSlug}>
                                <h4 className="font-bold text-white text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1" title={item.title}>
                                    {item.title}
                                </h4>
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                <span className="truncate max-w-[80px]">{item.type || "Anime"}</span>
                                <span className="text-gray-600">•</span>
                                <span>{item.release || "2024"}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
