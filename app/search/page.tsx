import Container from "@/components/ui/Container";
import AnimeCard from "@/components/AnimeCard";
import { api, AnimeItem } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";
import { Search, Sparkles, Filter, Info } from "lucide-react";

async function getData(q: string) {
  try {
    const raw = await api<any>(`/anime/search/${encodeURIComponent(q)}`);
    return raw?.data || raw;
  } catch (error) {
    console.error("Search fetch failed:", error);
    return null;
  }
}

function pickList(obj: any): AnimeItem[] {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  if (Array.isArray(obj.animeList)) return obj.animeList;

  const keys = ["items", "data", "list", "result", "animeList"];
  for (const k of keys) if (Array.isArray(obj[k])) return obj[k];

  const merged: AnimeItem[] = [];
  Object.values(obj).forEach((v: any) => Array.isArray(v) && merged.push(...(v as AnimeItem[])));
  return merged;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};
  const q = (sp.q || "").toString().trim();

  let items: AnimeItem[] = [];
  if (q) {
    const data = await getData(q);
    items = pickList(data);
  }

  return (
    <main className="min-h-screen bg-background-dark pt-28 pb-20 overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -top-20 -left-20 size-96 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
      </div>

      <Container>
        <div className="relative z-10">
          {/* Enhanced Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                <Search className="size-4 text-primary animate-bounce-slow" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Discovery Engine</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">
                {q ? (
                  <>Mencari <span className="text-primary italic">"{q}"</span></>
                ) : (
                  <>Jelajahi <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic">Semesta</span> Anime</>
                )}
              </h1>

              {q && items.length > 0 && (
                <div className="flex items-center gap-2 text-slate-500 font-bold bg-white/5 w-fit px-3 py-1.5 rounded-xl border border-white/5">
                  <Sparkles className="size-4 text-yellow-500 animate-pulse" />
                  <span className="text-xs">Ditemukan {items.length} judul yang relevan</span>
                </div>
              )}
            </div>

            <div className="w-full lg:w-[450px]">
              <div className="p-1.5 bg-[#161d2a]/50 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <Suspense fallback={<div className="h-14 bg-white/5 rounded-2xl animate-pulse" />}>
                  <SearchBar placeholder="Ketik judul anime favoritmu..." />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Results Grid / Universal Search Layout */}
          <div className="w-full">
            {q ? (
              items && items.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  {items.map((it: AnimeItem, i: number) => (
                    <div key={(it.slug || it.title || i).toString()} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: `${i * 50}ms` }}>
                      <AnimeCard item={it} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-[#161d2a]/30 rounded-[3rem] border border-white/5 backdrop-blur-md px-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className="size-24 bg-[#161d2a] rounded-[2rem] flex items-center justify-center text-slate-700 mb-8 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500 mx-auto">
                      <Search className="size-10 opacity-30" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Pencarian Kosong</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed font-bold">
                      Maaf, semesta tidak menemukan judul <span className="text-primary italic">"{q}"</span>. <br />Mungkin anime ini masih tersegel di dunia lain?
                    </p>

                    <div className="flex flex-col items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Saran Pencarian</span>
                      <div className="flex flex-wrap justify-center gap-3">
                        {["Solo Leveling", "One Piece", "Naruto", "Maou Gakuin"].map(tag => (
                          <a
                            key={tag}
                            href={`/search?q=${tag}`}
                            className="px-6 py-2.5 bg-white/5 hover:bg-primary rounded-2xl text-xs font-black text-slate-300 hover:text-white transition-all border border-white/10 hover:border-primary shadow-xl"
                          >
                            {tag}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                {[
                  {
                    icon: <Sparkles className="size-6" />,
                    title: "Koleksi Terupdate",
                    desc: "Akses ribuan judul anime dari berbagai musim, lengkap dengan subtitle berkualitas.",
                    glow: "bg-primary/20"
                  },
                  {
                    icon: <Filter className="size-6" />,
                    title: "Algoritma Cerdas",
                    desc: "Cukup ketik sedikit nama, dan biarkan sistem kami menemukan anime yang Anda maksud.",
                    glow: "bg-blue-500/20"
                  },
                  {
                    icon: <Info className="size-6" />,
                    title: "Informasi Lengkap",
                    desc: "Lihat sinopsis, rating, status tayang, dan server download batch tercepat.",
                    glow: "bg-purple-500/20"
                  }
                ].map((feature, i) => (
                  <div key={i} className="relative p-10 bg-[#161d2a]/40 rounded-[2.5rem] border border-white/10 hover:border-primary/30 transition-all duration-500 group overflow-hidden">
                    <div className={`absolute top-0 right-0 size-32 ${feature.glow} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                    <div className="relative z-10">
                      <div className="size-14 bg-[#161d2a] rounded-2xl flex items-center justify-center text-primary mb-8 border border-white/10 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feature.title}</h3>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed font-bold opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
