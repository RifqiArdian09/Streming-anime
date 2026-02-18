import { api } from "@/lib/api";
import Empty from "@/components/ui/Empty";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ExternalLinkIcon, FolderIcon, Info } from "lucide-react";
import Image from "next/image";

async function getData(slug: string) {
  try {
    const raw = await api<any>(`/anime/batch/${encodeURIComponent(slug)}`);
    return raw?.data || raw;
  } catch (error) {
    console.warn("Failed to fetch batch data:", error);
    return null;
  }
}

function extractText(val: any): string {
  if (typeof val === "string") return val;
  if (!val) return "";
  if (Array.isArray(val)) return val.join("\n\n");
  if (typeof val === "object") {
    if (Array.isArray(val.paragraphs)) return val.paragraphs.join("\n\n");
    if (val.text) return extractText(val.text);
    return JSON.stringify(val);
  }
  return String(val);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Normalize slug (handle double encoded or nested paths)
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = (() => {
    if (typeof decodedSlug !== "string") return decodedSlug;
    const parts = decodedSlug.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : decodedSlug;
  })();

  const data = await getData(normalizedSlug);

  // Ensure links is always an array
  let links: any[] = [];
  if (Array.isArray(data)) {
    links = data;
  } else if (data) {
    // Aggressive extraction from all possible known fields
    const rawLinks =
      data.links ||
      data.downloads ||
      data.data ||
      data.items ||
      data.list ||
      data.download_links ||
      data.batch_links ||
      data.downloadLinks ||
      data.download_list ||
      data.link_list ||
      data.download_url ||
      data.downloadUrl ||
      [];

    if (Array.isArray(rawLinks)) {
      links = rawLinks;
    }
    else if (rawLinks && typeof rawLinks === "object") {
      // 1. Handle Hanako-kun style: { formats: [ { qualities: [ { urls: [] } ] } ] }
      const formats = (rawLinks as any).formats || [];
      if (Array.isArray(formats) && formats.length > 0) {
        links = formats.flatMap((f: any) => {
          const qs = f.qualities || [];
          return Array.isArray(qs) ? qs.flatMap((q: any) => {
            const urls = q.urls || q.links || [];
            const quality = q.title || q.quality || "Lainnya";
            const size = q.size || "";
            return Array.isArray(urls) ? urls.map((u: any) => ({
              ...(typeof u === 'object' ? u : { url: u }),
              quality,
              size
            })) : [];
          }) : [];
        });
      }

      // 2. Handle direct qualities: { qualities: [ { title: '...', urls: [] } ] }
      if (links.length === 0) {
        const qualities = (rawLinks as any).qualities || (rawLinks as any).list || [];
        if (Array.isArray(qualities) && qualities.length > 0) {
          links = qualities.flatMap((q: any) => {
            const qLinks = q.urls || q.links || q.url || [];
            const quality = q.title || q.quality || q.resolution || "Lainnya";
            const size = q.size || q.filesize || "";
            if (Array.isArray(qLinks)) {
              return qLinks.map((l: any) => ({
                ...(typeof l === 'object' ? l : { url: l }),
                quality,
                size: l.size || size
              }));
            }
            return [];
          });
        } else {
          // Handle direct quality mapping: { "480p": [...], "720p": [...] }
          links = Object.entries(rawLinks).flatMap(([quality, val]: [string, any]) => {
            if (Array.isArray(val)) {
              return val.map(l => (typeof l === 'object' ? { ...l, quality } : { url: l, quality }));
            }
            return [];
          });
        }
      }
    }

    // Fallback for direct data.qualities or resolutions or formats
    if (links.length === 0) {
      const fallbackQualities = data.qualities || data.resolutions || data.downloadUrl?.qualities || data.download_url?.qualities || [];
      const fallbackFormats = data.formats || data.downloadUrl?.formats || data.download_url?.formats || [];

      if (Array.isArray(fallbackFormats) && fallbackFormats.length > 0) {
        links = fallbackFormats.flatMap((f: any) => {
          const qs = f.qualities || [];
          return Array.isArray(qs) ? qs.flatMap((q: any) => {
            const urls = q.urls || q.links || [];
            const quality = q.title || q.quality || "Lainnya";
            const size = q.size || "";
            return Array.isArray(urls) ? urls.map((u: any) => ({
              ...(typeof u === 'object' ? u : { url: u }),
              quality,
              size
            })) : [];
          }) : [];
        });
      } else if (Array.isArray(fallbackQualities) && fallbackQualities.length > 0) {
        links = fallbackQualities.flatMap((q: any) => {
          const qLinks = q.urls || q.links || q.url || q.serverList || [];
          const quality = q.title || q.quality || q.resolution || "Lainnya";
          const size = q.size || q.filesize || "";
          if (Array.isArray(qLinks)) {
            return qLinks.map((l: any) => ({
              ...(typeof l === 'object' ? l : { url: l }),
              quality,
              size: l.size || size
            }));
          }
          return [];
        });
      }
    }
  }

  // Extract title and metadata
  const title = data?.title || data?.name || data?.anime_title || slug;
  const description = extractText(data?.description || data?.synopsis || "");
  const poster = data?.poster || data?.thumbnail || "/placeholder.jpg";

  // Group links by quality or type
  const groupedLinks = links.reduce((acc: any, link: any) => {
    if (!link) return acc;
    const quality = link?.quality || link?.resolution || link?.type || 'Lainnya';
    if (!acc[quality]) acc[quality] = [];
    acc[quality].push(link);
    return acc;
  }, {});

  return (
    <main className="flex-grow bg-background-dark min-h-screen text-white font-display pt-24">
      {/* Universal Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 size-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 size-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Cinematic Hero Section */}
      <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
        <Image
          src={poster}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-1000 scale-110 blur-[8px] opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-dark to-transparent"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 -mt-64 relative z-10 pb-24">
        <div className="flex flex-col gap-12">

          {/* Premium Header Card */}
          <div className="bg-[#161d2a]/60 p-8 md:p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group/header">
            {/* Decorative Inner Glow */}
            <div className="absolute -top-24 -left-24 size-64 bg-primary/10 blur-[80px] rounded-full transition-all duration-1000 group-hover/header:bg-primary/20" />

            <div className="flex flex-col xl:flex-row gap-10 items-center xl:items-start relative z-10 text-center xl:text-left">
              <div className="relative w-[180px] md:w-[240px] aspect-[3/4.5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 shrink-0 group/poster self-center xl:self-start">
                <Image
                  src={poster}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover/poster:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity" />
              </div>

              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3">
                    <div className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/20 px-4 py-1.5 rounded-full">
                      <FolderIcon className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Batch</span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-1.5 rounded-full">
                      <DownloadIcon className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Direct Download</span>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter text-white drop-shadow-2xl max-w-4xl mx-auto xl:mx-0">
                    {title}
                  </h1>
                </div>

                {description && (
                  <div className="space-y-4 max-w-3xl mx-auto xl:mx-0">
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center justify-center xl:justify-start gap-2">
                      <Info className="size-4" /> Storyline Overview
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed bg-white/5 p-6 rounded-[2rem] border border-white/5 opacity-80 hover:opacity-100 transition-opacity duration-500">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download Matrix Section */}
          <div className="space-y-16">
            <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-2">
                <DownloadIcon className="size-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">Pilih Kualitas Berkas</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">High Speed Content Delivery Network</p>
            </div>

            {links.length === 0 ? (
              <div className="bg-[#161d2a]/30 p-24 rounded-[3rem] border border-white/5 text-center backdrop-blur-xl">
                <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                  <FolderIcon className="size-10 opacity-20" />
                </div>
                <Empty>Maaf, tidak ada link download batch yang tersedia saat ini.</Empty>
              </div>
            ) : (
              <div className="grid gap-16">
                {Object.entries(groupedLinks).map(([quality, qualityLinks]: [string, any]) => (
                  <div key={quality} className="space-y-8">
                    <div className="flex items-center gap-4 bg-white/5 w-fit px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
                      <div className="size-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(12,91,236,1)]"></div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">
                        {quality} Quality
                      </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      {qualityLinks.map((link: any, i: number) => {
                        const label = link?.label || link?.title || link?.server || link?.provider || `Primary Server`;
                        const size = link?.size || link?.filesize || "MB";
                        const url = link?.url || link?.link || "";

                        return (
                          <div
                            key={i}
                            className="group relative bg-[#161d2a]/50 hover:bg-primary/20 border border-white/5 hover:border-primary/50 p-6 rounded-[2rem] transition-all duration-500 shadow-2xl active:scale-95 overflow-hidden backdrop-blur-xl"
                          >
                            <div className="absolute -right-8 -top-8 size-24 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10 flex flex-col gap-6">
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors">Server Choice</span>
                                  <span className="text-sm font-black text-white group-hover:text-primary transition-colors">
                                    {label}
                                  </span>
                                </div>
                                <div className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 text-[10px] font-black text-slate-400 group-hover:border-primary/30">
                                  {size}
                                </div>
                              </div>

                              <Button asChild className="w-full bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white text-xs font-black uppercase tracking-widest transition-all gap-3 py-7 rounded-[1.25rem] shadow-xl group/btn overflow-hidden relative" size="sm">
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLinkIcon className="size-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                  Mulai Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
