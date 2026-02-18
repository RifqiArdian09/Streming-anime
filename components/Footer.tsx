"use client";
import Link from "next/link";
import { Twitter, Instagram, Github, Youtube } from "lucide-react";

export default function Footer() {

  return (
    <footer className="bg-[#0c0d10] pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-96 bg-accent/5 blur-[120px] rounded-full" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">

          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="size-10 bg-gradient-to-br from-primary via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-all duration-300 relative overflow-hidden">
                <svg className="size-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M9.5 7.5V16.5L17 12L9.5 7.5Z" fill="currentColor" />
                  <path d="M17.5 5L18.2 6.5L19.8 6.8L18.6 7.9L18.9 9.5L17.5 8.7L16.1 9.5L16.4 7.9L15.2 6.8L16.8 6.5L17.5 5Z" fill="currentColor" opacity="0.7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white leading-none">ANI</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary leading-none uppercase">VERSE</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Platform streaming anime terbaik di Indonesia dengan kualitas Full HD dan update tercepat.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Github, label: "Github" },
                { Icon: Youtube, label: "Youtube" },
              ].map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-primary hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-90"
                >
                  <Icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              Navigasi Cepat
            </h4>
            <ul className="grid grid-cols-1 gap-4">
              {[
                { name: "Beranda", href: "/" },
                { name: "Ongoing Anime", href: "/ongoing" },
                { name: "Tamat (Completed)", href: "/complete/1" },
                { name: "Daftar Genre", href: "/genres" },
                { name: "Jadwal Rilis", href: "/schedule" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              Genre Populer
            </h4>
            <ul className="grid grid-cols-1 gap-4 text-sm font-medium">
              {[
                "Action", "Adventure", "Comedy", "Fantasy", "Romance", "Game"
              ].map((genre) => (
                <li key={genre}>
                  <Link href={`/genre/${genre.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                    <span>{genre}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all">Hot</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar — Centered & Premium */}
        <div className="pt-10 border-t border-white/5 flex flex-col items-center justify-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-7 bg-gradient-to-br from-primary via-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/10 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
              <svg className="size-4 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
                <path d="M9.5 7.5V16.5L17 12L9.5 7.5Z" fill="currentColor" />
                <path d="M17.5 5L18.2 6.5L19.8 6.8L18.6 7.9L18.9 9.5L17.5 8.7L16.1 9.5L16.4 7.9L15.2 6.8L16.8 6.5L17.5 5Z" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
            <span className="text-sm font-black tracking-tighter text-white">ANI<span className="text-primary">VERSE</span></span>
          </Link>
          <p className="text-slate-500 text-xs font-medium text-center">
            © 2026 <span className="text-slate-300 font-bold">ANIVERSE</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
