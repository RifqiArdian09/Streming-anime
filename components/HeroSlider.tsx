"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Play, Info } from "lucide-react";

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
        <div className="relative w-full h-[75vh] overflow-hidden bg-background-dark">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                    {/* Full Width Backdrop Image */}
                    <div className="absolute inset-0 w-full h-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${item.image}')` }}
                        >
                        </div>
                        {/* More complex blending gradients for full image coverage */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 md:via-background-dark/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/20"></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-20 w-full h-full flex flex-col justify-center items-start px-10 md:px-20 pt-16">

                        <h2 className={`text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-4 max-w-2xl tracking-tighter transition-all duration-700 delay-300 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            {item.title}
                        </h2>

                        <div className={`flex items-center gap-4 text-sm text-gray-300 mb-6 font-medium transition-all duration-700 delay-500 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            <span>{item.year}</span>
                            <span className="border border-gray-600 rounded px-1.5 text-xs">Full HD</span>
                            <span className="flex items-center gap-1"><Star className="size-4 text-yellow-500 fill-yellow-500" /> {item.score}</span>
                        </div>

                        <p className={`text-gray-300 max-w-xl text-lg/relaxed line-clamp-3 mb-8 transition-all duration-700 delay-700 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            {item.description}
                        </p>

                        <div className={`flex items-center gap-4 transition-all duration-700 delay-1000 ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            <Link href={`/anime/${item.slug}`} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group/btn">
                                <Play className="size-4 fill-current group-hover/btn:scale-110 transition-transform" />
                                <span>Watch Now</span>
                            </Link>
                            <Link href={`/anime/${item.slug}`} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border border-white/10 backdrop-blur-md transition-all hover:border-white/20 active:scale-95">
                                <Info className="size-4" />
                                <span>Anime Details</span>
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

            {/* Indicators - Centered Bottom */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-primary shadow-[0_0_10px_rgba(127,19,236,0.8)]" : "w-4 bg-white/20 hover:bg-white/40"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
