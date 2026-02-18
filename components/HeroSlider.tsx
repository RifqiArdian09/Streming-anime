"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface HeroItem {
    title: string;
    description: string;
    image: string;
    slug: string;
    year: string;
    type: string;
    score: string;
}

interface HeroSliderProps {
    items: HeroItem[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [items.length]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    return (
        <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-background-dark -mt-16">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                    {/* Right-aligned Poster Backdrop */}
                    <div className="absolute right-0 top-0 w-full md:w-2/3 h-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center md:bg-right transition-transform duration-[15s] scale-110"
                            style={{ backgroundImage: `url('${item.image}')` }}
                        >
                        </div>
                        {/* Blending Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 md:via-background-dark/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-20 max-w-[1440px] mx-auto px-6 h-full flex flex-col justify-start items-start pt-32">
                        <div className={`bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1 transition-all duration-700 delay-200 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            <span className="text-[16px]">🔥</span>
                            Trending Now
                        </div>

                        <h2 className={`text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-4 max-w-2xl tracking-tighter transition-all duration-700 delay-300 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            {item.title}
                        </h2>

                        <div className={`flex items-center gap-4 text-sm text-gray-300 mb-6 font-medium transition-all duration-700 delay-500 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            <span className="text-[#46d369]">98% Match</span>
                            <span>{item.year}</span>
                            <span className="border border-gray-600 rounded px-1.5 text-xs">16+</span>
                            <span>{item.type}</span>
                            <span className="flex items-center gap-1"><Star className="size-4 text-yellow-500 fill-yellow-500" /> {item.score}</span>
                        </div>

                        <p className={`text-gray-300 max-w-xl text-lg/relaxed line-clamp-3 mb-8 transition-all duration-700 delay-700 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            {item.description}
                        </p>

                        <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-[900ms] ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            <Link href={`/anime/${encodeURIComponent(item.slug)}`} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-primary/25">
                                <Play className="fill-current size-5" />
                                Watch Now
                            </Link>
                            <Link href={`/anime/${encodeURIComponent(item.slug)}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-lg font-semibold transition-all backdrop-blur-sm">
                                <Info className="size-5" />
                                More Info
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
                <button
                    onClick={prev}
                    className="size-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all group"
                >
                    <ChevronLeft className="size-6 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                    onClick={next}
                    className="size-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all group"
                >
                    <ChevronRight className="size-6 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-10 z-30 flex gap-2">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-10 bg-primary" : "w-4 bg-white/20"}`}
                    />
                ))}
            </div>
        </div>
    );
}
