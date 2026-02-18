"use client";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, Sparkles } from "lucide-react";
import { AnimeItem } from "@/lib/api";

interface AnimeCardProps {
  item: AnimeItem;
  variant?: "grid" | "list";
}

export default function AnimeCard({ item, variant = "grid" }: AnimeCardProps) {
  if (variant === "list") {
    return (
      <Link
        href={`/anime/${item.slug}`}
        className="group relative flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
      >
        <div className="relative aspect-[3/4] w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/5">
          <Image
            src={item.poster || item.thumbnail || "/placeholder.jpg"}
            alt={item.title || "Anime"}
            fill
            sizes="100px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <Play className="size-6 text-white fill-current" />
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-white text-base md:text-lg font-black leading-tight line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
              {item.title}
            </h3>
            <div className="bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10 shrink-0">
              <Star className="size-3 text-yellow-500 fill-current" />
              <span className="text-white text-[10px] font-bold">{item.score || "8.5"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-primary">{item.status || "Ongoing"}</span>
            <span className="size-1 rounded-full bg-slate-700"></span>
            <span className="text-slate-400">{item.release || item.releaseDay || "2024"}</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            {item.episode && (
              <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded border border-primary/20">
                {String(item.episode).includes('Eps') ? item.episode : `${item.episode} Eps`}
              </span>
            )}
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-1">
              <Sparkles className="size-3 text-primary/60" />
              Watch Now
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/anime/${item.slug}`}
      className="group relative flex flex-col gap-3 cursor-pointer"
    >
      <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-2xl bg-[#0a0f18] shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:shadow-[0_8px_30px_rgba(12,91,236,0.2)] transition-all duration-500 border border-white/5 group-hover:border-primary/30">
        <Image
          src={item.poster || item.thumbnail || "/placeholder.jpg"}
          alt={item.title || "Anime"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Rating Badge - Premium Floating Style */}
        <div className="absolute top-2.5 right-2.5 bg-[#0a0f18]/80 backdrop-blur-xl px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10 z-10 transition-transform duration-500 group-hover:scale-110 group-hover:border-primary/30">
          <Star className="size-3 text-yellow-500 fill-current" />
          <span className="text-white text-[10px] font-black tracking-tighter">{item.score || "8.5"}</span>
        </div>

        {/* Hover State: Glassmorphism Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
          <div className="bg-primary/90 hover:bg-primary text-white rounded-full p-4 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-[0_0_20px_rgba(12,91,236,0.5)] active:scale-90">
            <Play className="size-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Episode Badge - Minimalist Tag */}
        <div className="absolute bottom-2.5 left-2.5 flex gap-1.5 flex-wrap z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          {item.episode && (
            <span className="bg-primary/95 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-[0_4px_10px_rgba(0,0,0,0.3)] uppercase tracking-wider">
              {String(item.episode).includes('Eps') ? item.episode : `${item.episode} Eps`}
            </span>
          )}
        </div>

        {/* Subtle Bottom Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
      </div>

      <div className="flex flex-col gap-1.5 px-1.5">
        <h3 className="text-white text-[13px] md:text-[14px] font-black leading-tight line-clamp-2 group-hover:text-primary transition-colors tracking-tight duration-300">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">
          <span className="text-primary/70">{item.status || "Ongoing"}</span>
          <span className="size-1 rounded-full bg-slate-800"></span>
          <span className="text-slate-500/80">{item.release || item.releaseDay || "2024"}</span>
        </div>
      </div>
    </Link>
  );
}
