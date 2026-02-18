import Link from "next/link";
import { Play, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-dark py-12 border-t border-surface-hover mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Play className="size-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">AnimeHub</span>
        </div>
        <div className="flex gap-8 text-sm text-text-secondary">
          <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
          <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-white transition-colors" href="#">Cookie Policy</Link>
        </div>
        <div className="flex gap-4">
          <Link className="text-text-secondary hover:text-white transition-colors" href="#">
            <Twitter className="size-5" />
          </Link>
          <Link className="text-text-secondary hover:text-white transition-colors" href="#">
            <Instagram className="size-5" />
          </Link>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 text-center mt-8 text-xs text-text-secondary/50">
        © 2024 AnimeHub. All rights reserved. Not affiliated with any anime studios.
      </div>
    </footer>
  );
}
