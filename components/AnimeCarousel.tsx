"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import Link from "next/link";
import { AnimeItem } from "@/lib/api";
import AnimeCard from "./AnimeCard";

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
                {items.map((item, i) => (
                    <div key={i} className="min-w-[160px] sm:min-w-[200px] lg:min-w-[220px] snap-start">
                        <AnimeCard item={item} />
                    </div>
                ))}
            </div>
        </section>
    );
}
