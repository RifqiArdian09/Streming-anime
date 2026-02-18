"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
    title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: `NimeStream - ${title}`,
            text: `Nonton anime ${title} gratis di NimeStream!`,
            url: url,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error("Share failed:", err);
                }
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                toast.success("Link berhasil disalin ke clipboard!");
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                toast.error("Gagal menyalin link.");
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-white/10 flex items-center justify-center gap-2 active:scale-95"
        >
            {copied ? (
                <Check className="size-4 text-green-500" />
            ) : (
                <Share2 className="size-4" />
            )}
            <span>{copied ? "Copied" : "Share"}</span>
        </button>
    );
}
