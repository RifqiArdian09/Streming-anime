"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, History } from "lucide-react";

interface WatchingItem {
    title: string;
    episode: string;
    image: string;
    progress: number;
    timeLeft: string;
}

const DUMMY_WATCHING: WatchingItem[] = [
    {
        title: "One Piece",
        episode: "Ep 1071 - Luffy's Peak",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsz_ZPrN8dJxVNDn7nPuAdl3fPzrytUymlRfI70WZ1Mx8GoylikTfppJJ1A6ebMqqR1VnDNtCxFTBDFuisD3I73dEfztEKyrAyyYs8rQzWSlmOWs63d1KIx8Ur0udYToMs6RIi9TLRlS-KZpdFxLRc4E76Xown_s7St9uE1-_RKGHIYMI-f6NllxWHpu0j8dk5pxOIv8R1hueDSlj7XhIDKBMtEkOFj66asPPDLjGNoIVkH_61GdXTZQQ7uDeHXrQAsDJMHeGft-OR",
        progress: 80,
        timeLeft: "21:40 left"
    },
    {
        title: "Jujutsu Kaisen",
        episode: "Ep 23 - Shibuya Incident",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWj6ZV1F1qKmqe5yK0y8zMwI0_b7OnOAZR2W03reevNgLVTnRUWZSQQKYlzTbhpxUoh5Rkf_f-a4E98GwhR3LvHkU5ZrzlUwqfLnEQvwo5nIWxXjEHBHFQPMd_x97tzxldCc1IzJRqfGWqfmNhcFpaHwtAyWPKgkR5NQ04cYGq8Up2gwPiFvLw5DVUN11jTV0t9aXqyxDg5AoDKbf0sPvMhLKgG7KuwkVHC7_452LKPQtVQee8E_slI6iV_WDnD0afTgz7WlBVGr_e",
        progress: 45,
        timeLeft: "12:05 left"
    },
    {
        title: "Cyberpunk: Edgerunners",
        episode: "Ep 1 - Let You Down",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCA6_yPQdtukAAkprv4XuRHsrZ5klMEMi2V14D7zPs9I0oSL2dY2xHmoFQz9tuqMXgB1zgjQ97HmEPdKkYsiF2qpRyhQzUnKC8NsG3v6r0m8AmfqAYuS5iyam8VQZD-R7udP1WuJTMNTYcYxjcIlRqttQ4KT1Sse0stwMDHWqZotwZ6soqTLgoD-IVVfEGzRHzwrFx-Hm1gXjlnl2u2nNqG3TBlgQYuI0pUwlo54vYGq8GyIaYbU6dVCA_0dJXTwACLd9oUvKOpmvJ",
        progress: 10,
        timeLeft: "20:15 left"
    },
    {
        title: "Demon Slayer",
        episode: "S3 E1 - Someone's Dream",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOdWyN5kCii2W9kEFSdYkn9_jkxXnjZilZoOOpfIUe1hFZQCNRjFUYwUu21N4AdJWDyMd1W0dEwNm64Rk6hw300pkgxm2tOGHnwUCatuHRT_iGiWEsMiduNnSdJym_Ppi52tCWmJCYFT_0x2X8PQGMUdH8U6wmCVIIIUHimP9PSeSRjI5tutO6W0yWuXJxpU1TziOGhKLI3ynj1i36dAydQPudtKwQhqm08LCgqgaWYxXuSqOFmutnj8JIsVrgXNy4YzUuHJKfeQU8",
        progress: 95,
        timeLeft: "01:30 left"
    }
];

export default function ContinueWatchingCarousel() {
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
                    <History className="text-primary size-6" />
                    Continue Watching
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
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x"
            >
                {DUMMY_WATCHING.map((item, i) => (
                    <div key={i} className="min-w-[280px] sm:min-w-[340px] group relative bg-surface-dark rounded-xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-1 cursor-pointer border border-transparent hover:border-surface-hover snap-start">
                        <div className="aspect-video relative overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                                style={{ backgroundImage: `url('${item.image}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="size-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm shadow-xl scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <Play className="text-white fill-current size-6" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-hover">
                                <div className="h-full bg-primary shadow-[0_0_10px_rgba(19,91,236,0.5)]" style={{ width: `${item.progress}%` }}></div>
                            </div>
                            <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-xs font-medium text-white">{item.timeLeft}</span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-white mb-1 truncate">{item.title}</h4>
                            <p className="text-text-secondary text-sm truncate">{item.episode}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
