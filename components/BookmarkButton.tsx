"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface BookmarkButtonProps {
    anime: {
        slug: string;
        title: string;
        poster: string;
        score: string | number;
        status: string;
        type: string;
    };
}

export default function BookmarkButton({ anime }: BookmarkButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    // Cek apakah anime sudah ada di favorit
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favoriteAnime') || '[]');
        setIsFavorite(favorites.some((a: any) => a.slug === anime.slug));
    }, [anime.slug]);

    // Toggle favorit anime
    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favoriteAnime') || '[]');
        let newFavorites;

        if (isFavorite) {
            // Hapus dari favorit
            newFavorites = favorites.filter((a: any) => a.slug !== anime.slug);
        } else {
            // Tambahkan ke favorit
            const newAnime = {
                slug: anime.slug,
                title: anime.title,
                poster: anime.poster,
                score: String(anime.score),
                status: anime.status,
                addedAt: new Date().toISOString()
            };
            newFavorites = [...favorites, newAnime];
        }

        localStorage.setItem('favoriteAnime', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);

        // Beritahu komponen lain (Header, BookmarksPage) untuk update
        window.dispatchEvent(new Event('watchlist-updated'));
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 ${isFavorite
                ? "bg-pink-500/10 text-pink-500 border border-pink-500/20 hover:bg-pink-500/20"
                : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                }`}
        >
            <Heart className={`size-5 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
        </button>
    );
}
