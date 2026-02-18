"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Calendar, Clock, ChevronRight, ChevronLeft, Sparkles, Filter } from "lucide-react";
import { AnimeItem } from "@/lib/api";
import AnimeCard from "./AnimeCard";

interface OngoingScheduleProps {
    ongoingList: AnimeItem[];
}

const ID_TO_EN: Record<string, string> = {
    "Senin": "Monday",
    "Selasa": "Tuesday",
    "Rabu": "Wednesday",
    "Kamis": "Thursday",
    "Jum'at": "Friday",
    "Jumat": "Friday",
    "Sabtu": "Saturday",
    "Minggu": "Sunday",
};

const EN_TO_ID: Record<string, string> = {
    "Monday": "Senin",
    "Tuesday": "Selasa",
    "Wednesday": "Rabu",
    "Thursday": "Kamis",
    "Friday": "Jumat",
    "Saturday": "Sabtu",
    "Sunday": "Minggu",
};

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function OngoingSchedule({ ongoingList }: OngoingScheduleProps) {
    const [selectedDay, setSelectedDay] = useState("All Days");
    const containerRef = useRef<HTMLDivElement>(null);

    // Detect Today
    const today = useMemo(() => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[new Date().getDay()];
    }, []);

    const groupedData = useMemo(() => {
        const groups: Record<string, AnimeItem[]> = {};
        DAYS_ORDER.forEach(day => groups[day] = []);

        ongoingList.forEach(item => {
            const dayEn = ID_TO_EN[item.releaseDay || ""] || "Other";
            if (groups[dayEn]) {
                groups[dayEn].push(item);
            }
        });
        return groups;
    }, [ongoingList]);

    const filteredDays = useMemo(() => {
        if (selectedDay === "All Days") return DAYS_ORDER;
        return [selectedDay];
    }, [selectedDay]);

    // Hero Item (Featured Ongoing)
    const heroItem = useMemo(() => {
        // Find one from "Today" if possible
        const todaysAnime = groupedData[today];
        return todaysAnime?.[0] || ongoingList[0];
    }, [groupedData, today, ongoingList]);

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white">
            {/* Immersive Hero Header */}
            {heroItem && (
                <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src={heroItem.thumbnail || "/placeholder.jpg"}
                            alt={heroItem.title || "Anime"}
                            fill
                            className="object-cover scale-105 blur-[2px] opacity-40"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent" />
                    </div>

                    <div className="relative h-full max-w-[1440px] mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 gap-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                Recommended Today
                            </span>
                            <span className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs">
                                <Sparkles className="size-3 fill-current" />
                                Trending Ongoing
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter max-w-3xl leading-[0.9] drop-shadow-2xl">
                            {heroItem.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                            <span className="flex items-center gap-2">
                                <Calendar className="size-4 text-primary" />
                                Rilis setiap {heroItem.releaseDay || EN_TO_ID[today]}
                            </span>
                            <span className="size-1 rounded-full bg-slate-700" />
                            <span className="flex items-center gap-2">
                                <Clock className="size-4 text-primary" />
                                Episode {heroItem.episode}
                            </span>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Link
                                href={`/anime/${heroItem.slug}`}
                                className="bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/20"
                            >
                                <Play className="size-5 fill-current" /> Tonton Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Day Selector Navigation */}
            <div className="sticky top-[64px] z-30 bg-background-dark/80 backdrop-blur-xl border-y border-white/5">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-12 flex items-center justify-between gap-8 h-16">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1 py-2">
                        <button
                            onClick={() => setSelectedDay("All Days")}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${selectedDay === "All Days"
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                : "border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            Semua Hari
                        </button>
                        <div className="w-px h-4 bg-white/10 shrink-0 mx-2" />
                        {DAYS_ORDER.map((day) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${selectedDay === day
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                    : "border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {day === today && <span className="size-1.5 rounded-full bg-primary-foreground animate-pulse" />}
                                {EN_TO_ID[day]}
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm font-bold border-l border-white/10 pl-6">
                        <Filter className="size-4" />
                        <span>Filter Jadwal</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12 flex flex-col gap-16 relative z-10 overflow-hidden">
                {/* Visual Background Blurs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-x-1/2" />

                {filteredDays.map(day => {
                    const items = groupedData[day];
                    if (items.length === 0 && selectedDay !== "All Days") {
                        return (
                            <div key={day} className="flex flex-col items-center justify-center py-32 text-center gap-4 bg-surface-dark/30 rounded-3xl border border-white/5">
                                <div className="size-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600 mb-2">
                                    <Calendar className="size-8" />
                                </div>
                                <h3 className="text-xl font-bold">Tidak Ada Jadwal</h3>
                                <p className="text-slate-400 max-w-sm">Maaf, belum ada jadwal rilis anime untuk hari {EN_TO_ID[day]} saat ini.</p>
                            </div>
                        );
                    }
                    if (items.length === 0) return null;

                    return (
                        <div key={day} className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4">
                                        Hari {EN_TO_ID[day]}
                                        <span className="text-primary/40 text-sm font-bold uppercase tracking-[0.3em] font-sans">/ {day}</span>
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="h-1 w-12 bg-primary rounded-full" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {items.length} Judul Anime
                                        </span>
                                    </div>
                                </div>
                                {day === today && (
                                    <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Today
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
                                {items.map((item, idx) => (
                                    <div key={item.slug || idx} className="h-full">
                                        <AnimeCard item={item} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {selectedDay === "All Days" && ongoingList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 text-center gap-4">
                        <Sparkles className="size-12 text-slate-700" />
                        <h3 className="text-2xl font-bold">Data Sedang Disiapkan</h3>
                        <p className="text-slate-500">Jadwal anime terbaru akan segera muncul di sini.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
