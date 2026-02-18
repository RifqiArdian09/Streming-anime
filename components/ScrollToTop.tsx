"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button if scrolled more than 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        // Initial check
        toggleVisibility();

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50 pointer-events-none"
            }`}>
            <button
                onClick={scrollToTop}
                className="size-12 md:size-14 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 hover:bg-primary/95 hover:scale-110 active:scale-90 transition-all flex items-center justify-center group border border-white/20 backdrop-blur-sm"
                aria-label="Scroll to top"
            >
                <ChevronUp className="size-6 md:size-7 group-hover:-translate-y-1 transition-transform stroke-[3px]" />
            </button>
        </div>
    );
}
