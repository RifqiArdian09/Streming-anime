"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border-dark bg-[#1a1122]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-4 sm:gap-10 text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">AnimeStream</h2>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-white border-b-2 border-primary pb-0.5" : "text-slate-400 hover:text-white"}`}>Home</Link>
            <Link href="/ongoing" className={`text-sm font-medium transition-colors ${pathname === "/ongoing" ? "text-white border-b-2 border-primary pb-0.5" : "text-slate-400 hover:text-white"}`}>Ongoing</Link>
            <Link href="/complete/1" className={`text-sm font-medium transition-colors ${pathname.startsWith("/complete") ? "text-white border-b-2 border-primary pb-0.5" : "text-slate-400 hover:text-white"}`}>Completed</Link>
            <Link href="/genres" className={`text-sm font-medium transition-colors ${pathname.startsWith("/genres") ? "text-white border-b-2 border-primary pb-0.5" : "text-slate-400 hover:text-white"}`}>Genres</Link>
            <Link href="/bookmarks" className={`text-sm font-medium transition-colors ${pathname === "/bookmarks" ? "text-white border-b-2 border-primary pb-0.5" : "text-slate-400 hover:text-white"}`}>My List</Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3 sm:gap-4 items-center">
          <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20">
            <span>Sign In</span>
          </button>

          <button className="flex size-9 items-center justify-center rounded-lg bg-surface-dark hover:bg-border-dark text-white transition-colors">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <div
            className="size-8 rounded-full bg-surface-dark border border-border-dark overflow-hidden bg-cover bg-center cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-tmDoDg8F4krahLjDnoTDOgSZlSDuMAf6CHQl_AraCZsR8f8fSvNW4WPnQymC9BLZ6OXYlX0Lzo74BsJGEWPyRhqt0uYel7YwgNbfd2uMPThUsXQdQJqWNgBPfj-7jUDhzNNa2ckgPwe9brLbKNOzEvPf24FZOb8JRiIfWTArthKT567w7mERDf-Nt6My8Za4U4eLimmSXXdNIuDpdo-kICPOnqg59YCg0RawwCbmt-eUF22-25wdU9IJs9h7ZutayQhXfBKgxNuO')" }}
          />

          <button onClick={toggleMenu} className="md:hidden flex size-9 items-center justify-center rounded-lg hover:bg-surface-dark text-white transition-colors">
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#1a1122]/98 backdrop-blur-xl border-b border-border-dark p-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="/ongoing" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">Ongoing</Link>
            <Link href="/complete/1" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">Completed</Link>
            <Link href="/genres" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">Genres</Link>
            <Link href="/bookmarks" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors">My List</Link>
            <button className="mt-4 w-full bg-primary py-3 rounded-lg font-bold text-white shadow-lg shadow-primary/20 transition-transform active:scale-95">
              Sign In
            </button>
          </nav>
        </div>
      )}
    </nav>
  );
}
