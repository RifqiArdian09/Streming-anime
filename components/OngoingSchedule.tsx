"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Clock, Timer, CheckCircle2, CalendarDays, Search, Bell, Menu } from "lucide-react";
import { AnimeItem } from "@/lib/api";

interface OngoingScheduleProps {
    ongoingList: AnimeItem[];
}

const DAYS_MAP: Record<string, string> = {
    "All Days": "All Days",
    "Senin": "Monday",
    "Selasa": "Tuesday",
    "Rabu": "Wednesday",
    "Kamis": "Thursday",
    "Jumat": "Friday",
    "Jum'at": "Friday",
    "Sabtu": "Saturday",
    "Minggu": "Sunday",
};

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

const DAYS_ORDER = ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function OngoingSchedule({ ongoingList }: OngoingScheduleProps) {
    const [selectedDay, setSelectedDay] = useState("All Days");

    // Detect Today
    const today = useMemo(() => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[new Date().getDay()];
    }, []);

    const filteredList = useMemo(() => {
        if (selectedDay === "All Days") return ongoingList;
        return ongoingList.filter(item => {
            const day = item.releaseDay || "";
            return ID_TO_EN[day] === selectedDay;
        });
    }, [ongoingList, selectedDay]);

    // Hero Item (Top 1)
    const heroItem = ongoingList[0];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background-light dark:bg-background-dark">
            {/* Sidebar Filter (Desktop) */}
            <aside className="hidden lg:flex w-72 flex-col gap-6 border-r border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] p-6 overflow-y-auto scrollbar-hide sticky top-[65px] h-[calc(100vh-65px)]">
                <div className="flex flex-col gap-1">
                    <h3 className="text-slate-900 dark:text-white text-base font-bold leading-normal">Schedule</h3>
                    <p className="text-slate-500 dark:text-[#92a4c9] text-sm font-normal">Filter by release day</p>
                </div>

                <div className="flex flex-col gap-1">
                    {DAYS_ORDER.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${selectedDay === day
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232f48] hover:text-primary dark:hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">
                                    {day === "All Days" ? "calendar_month" : "today"}
                                </span>
                                <span className="text-sm font-medium">{day}</span>
                            </div>
                            {day === today && selectedDay !== day && (
                                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider group-hover:bg-primary group-hover:text-white transition-colors">
                                    Today
                                </span>
                            )}
                        </button>
                    ))}
                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#101622] p-4 lg:p-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">

                    {/* Hero Section */}
                    {heroItem && (
                        <div className="relative overflow-hidden rounded-2xl min-h-[360px] flex items-end p-6 md:p-10 shadow-xl ring-1 ring-white/10 group">
                            {/* Background with zoom effect */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{
                                    backgroundImage: `linear-gradient(to top, rgba(17, 23, 34, 1) 0%, rgba(17, 23, 34, 0.6) 50%, rgba(17, 23, 34, 0.2) 100%), url("${heroItem.thumbnail}")`
                                }}
                            />

                            <div className="relative z-10 max-w-2xl flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Trending Now</span>
                                    <span className="text-[#39ff14] flex items-center gap-1 text-xs font-bold uppercase tracking-wider animate-pulse">
                                        <span className="size-2 bg-[#39ff14] rounded-full"></span> New Episode
                                    </span>
                                </div>
                                <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                                    {heroItem.title}
                                </h1>
                                <p className="text-slate-200 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                                    {heroItem.releaseDay ? `Rilis setiap hari ${heroItem.releaseDay}` : "Tonton episode terbaru sekarang dengan kualitas terbaik."}
                                </p>
                                <div className="flex gap-4 mt-2">
                                    <Link
                                        href={`/anime/${heroItem.slug}`}
                                        className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/25"
                                    >
                                        <span className="material-symbols-outlined">play_arrow</span> Watch Now
                                    </Link>
                                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors border border-white/10">
                                        <span className="material-symbols-outlined">add</span> My List
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule Header & Grid */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Simulcast Schedule</h2>
                                <p className="text-slate-500 dark:text-[#92a4c9] text-base">Track ongoing series and catch new episodes as they air.</p>
                            </div>

                            {/* Mobile Filter Dropdown */}
                            <div className="lg:hidden">
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="w-full bg-white dark:bg-[#232f48] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-primary focus:border-primary"
                                >
                                    {DAYS_ORDER.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Anime Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredList.map((item, i) => (
                                <div key={item.slug || i} className="group relative flex flex-col gap-3 rounded-xl bg-white dark:bg-[#1a2332] p-3 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all hover:-translate-y-1 border border-slate-100 dark:border-white/5">
                                    <Link href={`/anime/${item.slug}`} className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                                        <Image
                                            src={item.thumbnail || "/placeholder.jpg"}
                                            alt={item.title || "Anime"}
                                            fill
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Countdown Overlay */}
                                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                            <div className="bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5 border border-white/10">
                                                <span className="material-symbols-outlined text-[14px] text-primary">timer</span>
                                                <span>{item.releaseDay || "Unknown"}</span>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-[#39ff14]/90 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(57,255,20,0.4)]">
                                                NEW EPISODE
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="flex flex-col gap-1 px-1">
                                        <Link href={`/anime/${item.slug}`}>
                                            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <span>{item.episode ? `Episode ${item.episode}` : "Ongoing"}</span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {item.releaseDay || "TBA"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredList.length === 0 && (
                            <div className="text-center py-20 bg-white dark:bg-[#1a2332] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-[#92a4c9]">No anime scheduled for this day.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
