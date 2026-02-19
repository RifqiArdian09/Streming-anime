"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, Bookmark, History, LayoutGrid, Sparkles, Loader2 } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Re-check scroll on navigation to handle page-specific heights or instant resets
  useEffect(() => {
    // Small delay to ensure Next.js has completed scroll restoration
    const timeoutId = setTimeout(() => {
      setScrolled(window.scrollY > 20);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setIsSearchOpen(false);

      // Reset searching state after a short delay or when pathname changes
      setTimeout(() => setIsSearching(false), 2000);
    }
  };

  // Reset search state when pathname changes
  useEffect(() => {
    setIsSearching(false);
    setSearchQuery("");
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const watchLater = JSON.parse(localStorage.getItem('watchLaterEpisodes') || '[]');
      const favorites = JSON.parse(localStorage.getItem('favoriteAnime') || '[]');
      setWatchlistCount(watchLater.length + favorites.length);
    };
    updateCount();
    window.addEventListener('watchlist-updated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('watchlist-updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/", icon: <Sparkles className="size-4" /> },
    { name: "Ongoing", href: "/ongoing", icon: <LayoutGrid className="size-4" /> },
    { name: "Completed", href: "/complete/1", icon: <History className="size-4" /> },
    { name: "Genre", href: "/genres", icon: <LayoutGrid className="size-4" /> },
    { name: "Watchlist", href: "/bookmarks", icon: <Bookmark className="size-4" />, count: watchlistCount },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
      ? "bg-background-dark/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl"
      : "bg-transparent py-6 border-transparent shadow-none"
      }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 flex items-center justify-between gap-8">

        {/* Left: Logo */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="size-10 bg-gradient-to-br from-primary via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="size-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer hexagonal frame */}
                <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
                {/* Play triangle */}
                <path d="M9.5 7.5V16.5L17 12L9.5 7.5Z" fill="currentColor" />
                {/* Star accent */}
                <path d="M17.5 5L18.2 6.5L19.8 6.8L18.6 7.9L18.9 9.5L17.5 8.7L16.1 9.5L16.4 7.9L15.2 6.8L16.8 6.5L17.5 5Z" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white leading-none">ANI</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary leading-none uppercase">VERSE</span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative group flex items-center gap-2 ${pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                ? "text-primary bg-primary/10"
                : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
            >
              <span className="shrink-0">{link.icon}</span>
              <span>{link.name}</span>
              {(link as any).count > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-primary text-[9px] font-black text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  {(link as any).count}
                </span>
              )}
              {(pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) && (
                <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(127,19,236,0.8)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
            <input
              type="text"
              placeholder="Cari anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/25 focus:border-primary/50 rounded-2xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-300 transition-all outline-none w-[200px] lg:w-[280px] backdrop-blur-md ${isSearching ? "opacity-70 pointer-events-none" : ""}`}
            />
            {isSearching ? (
              <Loader2 className="absolute left-3 size-4 text-primary animate-spin z-10" />
            ) : (
              <Search className="absolute left-3 size-4 text-slate-200 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
            )}
            <kbd className="absolute right-3 hidden xl:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[9px] text-slate-300 font-mono">
              <span className="text-[10px]">↵</span>
            </kbd>
          </form>

          {/* Search Icon - Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden flex size-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all border border-white/20 active:scale-95"
          >
            <Search className="size-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="lg:hidden flex size-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all border border-white/20 active:scale-95">
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background-dark/95 backdrop-blur-xl border-b border-white/5 p-4 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-primary animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-primary" />
              )}
              <input
                autoFocus
                type="text"
                placeholder="Cari anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-primary"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            <div className="lg:hidden fixed inset-0 top-0 bg-black/80 backdrop-blur-md z-[51]" onClick={closeMenu} />
            <div className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-[#0c0d10] border-l border-white/5 p-8 z-[52] animate-in slide-in-from-right duration-300 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <Sparkles className="size-5" />
                  </div>
                  <span className="text-lg font-black text-white">Menu</span>
                </div>
                <button onClick={closeMenu} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400">
                  <X className="size-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border ${pathname === link.href
                      ? "bg-primary/10 border-primary/20 text-primary font-black shadow-lg shadow-primary/5"
                      : "text-slate-400 hover:bg-white/5 border-transparent"
                      }`}
                  >
                    {link.icon}
                    <span className="text-[15px] flex-grow">{link.name}</span>
                    {(link as any).count > 0 && (
                      <span className="size-6 bg-primary/20 text-primary text-[10px] font-black rounded-lg flex items-center justify-center border border-primary/20">
                        {(link as any).count}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
