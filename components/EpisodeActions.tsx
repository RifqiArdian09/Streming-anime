"use client";

import React, { useState } from "react";
import {
    Clock,
    Share2,
    Download,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Check,
    Copy,
    Heart
} from "lucide-react";

interface DownloadUrl {
    qualities: Array<{
        title: string;
        size: string;
        urls: Array<{
            title: string;
            url: string;
        }>;
    }>;
}

interface AnimeInfo {
    title: string;
    slug: string;
    poster: string;
    score: string;
    status: string;
}

interface EpisodeInfo {
    title: string;
    slug: string;
}

interface EpisodeActionsProps {
    anime: AnimeInfo;
    episode: EpisodeInfo;
    downloadUrl?: DownloadUrl;
}

export default function EpisodeActions({ anime, episode, downloadUrl }: EpisodeActionsProps) {
    const [isWatchLater, setIsWatchLater] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDownloads, setShowDownloads] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Check initial state
    React.useEffect(() => {
        // Check Watch Later (Episodes)
        const watchLaterList = JSON.parse(localStorage.getItem("watchLaterEpisodes") || "[]");
        setIsWatchLater(watchLaterList.some((e: any) => e.slug === episode.slug));

        // Check Favorites (Anime)
        const favoredAnime = JSON.parse(localStorage.getItem("favoriteAnime") || "[]");
        setIsFavorite(favoredAnime.some((a: any) => a.slug === anime.slug));
    }, [episode.slug, anime.slug]);

    const handleWatchLater = () => {
        const list = JSON.parse(localStorage.getItem("watchLaterEpisodes") || "[]");
        let newList;

        if (isWatchLater) {
            newList = list.filter((e: any) => e.slug !== episode.slug);
            setIsWatchLater(false);
        } else {
            const newEpisode = {
                ...episode,
                animeTitle: anime.title,
                animeSlug: anime.slug,
                poster: anime.poster,
                addedAt: new Date().toISOString()
            };
            newList = [...list, newEpisode];
            setIsWatchLater(true);
        }

        localStorage.setItem("watchLaterEpisodes", JSON.stringify(newList));
        window.dispatchEvent(new Event('watchlist-updated'));
    };

    const handleFavorite = () => {
        const list = JSON.parse(localStorage.getItem("favoriteAnime") || "[]");
        let newList;

        if (isFavorite) {
            newList = list.filter((a: any) => a.slug !== anime.slug);
            setIsFavorite(false);
        } else {
            const newAnime = {
                ...anime,
                addedAt: new Date().toISOString()
            };
            newList = [...list, newAnime];
            setIsFavorite(true);
        }

        localStorage.setItem("favoriteAnime", JSON.stringify(newList));
        window.dispatchEvent(new Event('watchlist-updated'));
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const shareText = `Nonton ${episode.title} dari anime ${anime.title} di NimeStream!`;
        const encodedText = encodeURIComponent(shareText);
        const encodedUrl = encodeURIComponent(url);

        let shareUrl = "";
        switch (platform) {
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case "telegram":
                shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                break;
            case "copy":
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
        }
        setShowShareModal(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={handleWatchLater}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${isWatchLater
                        ? "bg-purple-500 text-white shadow-purple-500/20"
                        : "bg-surface-drak border border-white/10 hover:bg-white/10 text-white"
                        }`}
                >
                    <Clock className={`size-4 ${isWatchLater ? "fill-current" : ""}`} />
                    {isWatchLater ? "Tonton Nanti" : "Tonton Nanti"}
                </button>

                <button
                    onClick={handleFavorite}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${isFavorite
                        ? "bg-pink-500 text-white shadow-pink-500/20"
                        : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                        }`}
                >
                    <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Favorit" : "Favorit"}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowShareModal(!showShareModal)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border active:scale-95 relative ${showShareModal
                            ? "bg-primary border-primary text-white"
                            : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                            }`}
                    >
                        <Share2 className="size-4" />
                        Share
                    </button>

                    {showShareModal && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowShareModal(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-[#0a0f18] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="grid grid-cols-1 gap-1">
                                    <button
                                        onClick={() => handleShare("whatsapp")}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-slate-300 hover:text-white"
                                    >
                                        <div className="size-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <svg className="size-4 fill-green-500" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.415 0 12.05c0 2.122.551 4.197 1.597 6.02L0 24l6.135-1.61a11.757 11.757 0 005.91 1.586h.005c6.637 0 12.05-5.415 12.05-12.057a11.816 11.816 0 00-3.417-8.423z" /></svg>
                                        </div>
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => handleShare("telegram")}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-slate-300 hover:text-white"
                                    >
                                        <div className="size-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                                            <svg className="size-4 fill-sky-500" viewBox="0 0 24 24"><path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.206 16.561c-.135.253-.456.402-.751.402-.218 0-.435-.07-.613-.207l-2.618-2.022-1.348 1.3c-.15.15-.355.234-.57.234-.103 0-.206-.02-.303-.06-.312-.132-.516-.433-.516-.772V12.16L5.594 10.3c-.365-.132-.59-.493-.563-.88.028-.387.29-.714.654-.817l12.42-3.52c.319-.09.658.006.873.25.215.244.27.587.142.888l-3.236 7.64 1.944 1.5c.244.188.358.503.284.805-.074.301-.326.544-.618.595z" /></svg>
                                        </div>
                                        Telegram
                                    </button>
                                    <button
                                        onClick={() => handleShare("twitter")}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-slate-300 hover:text-white"
                                    >
                                        <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center">
                                            <svg className="size-3 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                        </div>
                                        X (Twitter)
                                    </button>
                                    <div className="h-px bg-white/10 my-1 mx-2" />
                                    <button
                                        onClick={() => handleShare("copy")}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-slate-300 hover:text-white"
                                    >
                                        <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                                            {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                                        </div>
                                        {copied ? "Copied!" : "Salin Link"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {downloadUrl?.qualities && downloadUrl.qualities.length > 0 && (
                    <button
                        onClick={() => setShowDownloads(!showDownloads)}
                        className={`flex items-center justify-center size-10 rounded-xl transition-all border active:scale-95 ${showDownloads
                            ? "bg-primary border-primary text-white"
                            : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                            }`}
                        title="Download"
                    >
                        <Download className="size-5" />
                    </button>
                )}
            </div>

            {showDownloads && downloadUrl?.qualities && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Download className="size-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Download Links</span>
                    </div>

                    <div className="space-y-4">
                        {downloadUrl.qualities.map((q, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-300">{q.title}</span>
                                    <span className="text-[10px] font-medium bg-white/10 px-1.5 py-0.5 rounded text-slate-400">{q.size}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {q.urls.map((u, uIdx) => (
                                        <a
                                            key={uIdx}
                                            href={u.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold transition-all text-slate-400 hover:text-white"
                                        >
                                            {u.title} <ExternalLink className="size-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
