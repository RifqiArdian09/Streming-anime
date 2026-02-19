import { api, AnimeItem, normalizeAnimeItem } from "@/lib/api";
import {
  Flame,
} from "lucide-react";
import AnimeCarousel from "@/components/AnimeCarousel";
import HeroSlider from "@/components/HeroSlider";

async function getHome() {
  try {
    const data = await api<any>("/anime/home", { cache: "force-cache", next: { revalidate: 3600 } });
    return data;
  } catch (e) {
    console.error("Failed to fetch home data", e);
    return {};
  }
}

async function getAnimeDetail(slug: string) {
  try {
    const data = await api<any>(`/anime/anime/${encodeURIComponent(slug)}`, { cache: "force-cache", next: { revalidate: 3600 } });
    return data?.data || data;
  } catch (e) {
    console.error("Failed to fetch anime detail", e);
    return null;
  }
}

// Local normalizeItem removed in favor of lib/api version

function deepCollect(obj: any, acc: any[] = []): any[] {
  if (!obj) return acc;
  if (Array.isArray(obj)) {
    acc.push(...obj);
    return acc;
  }
  if (typeof obj === "object") {
    for (const value of Object.values(obj)) {
      deepCollect(value, acc);
    }
  }
  return acc;
}

function pickList(obj: any): AnimeItem[] {
  const raw = deepCollect(obj).filter((x) => typeof x === "object");
  const items = raw.filter((x: any) => x?.slug || x?.title || x?.poster || x?.thumbnail || x?.animeId);
  return items.map(normalizeAnimeItem).filter(it => it.slug);
}

function extractText(val: any): string {
  if (typeof val === "string") return val;
  if (!val) return "";
  if (Array.isArray(val)) return val.join("\n\n");
  if (typeof val === "object") {
    if (Array.isArray(val.paragraphs)) return val.paragraphs.join("\n\n");
    if (val.text) return extractText(val.text);
    return "";
  }
  return String(val);
}

export default async function Home() {
  const homeData = await getHome();

  const allItems = pickList(homeData);
  const ongoingRaw = homeData?.data?.ongoing?.animeList || [];
  const completedRaw = homeData?.data?.completed?.animeList || [];

  const trendingItems = ongoingRaw.map(normalizeAnimeItem).filter((it: AnimeItem) => it.slug);
  const completedItems = completedRaw.map(normalizeAnimeItem).filter((it: AnimeItem) => it.slug);

  // Fetch Real Hero Data
  const heroSlugs = [
    { slug: "1piece-sub-indo", image: "/hero/one.png" },
    { slug: "jjk-sub-indo", image: "/hero/jujutsu.png" },
    { slug: "kimetsu-yaiba-subtitle-indonesia", image: "/hero/kimetsu.png" },
    { slug: "shingekyo-subtitle-indonesia", image: "/hero/attact.jpg" }
  ];

  const heroDetails = await Promise.all(
    heroSlugs.map(async (h) => {
      const detail = await getAnimeDetail(h.slug);
      if (!detail) return null;
      return {
        title: detail.title || "",
        description: extractText(detail.synopsis) || detail.description || "",
        image: h.image,
        slug: h.slug,
        year: detail.aired || detail.year || detail.release || "",
        score: detail.score || "0.0"
      };
    })
  );

  const heroItems = heroDetails.filter(Boolean) as any[];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlider items={heroItems} />

      {/* Content Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 mt-4 relative z-20 pb-20 space-y-12">

        {/* Trending Now Section */}
        <AnimeCarousel
          title="Trending Now"
          items={trendingItems}
          icon={<Flame className="text-yellow-500 size-6 fill-current" />}
        />

        {/* New Releases Section */}
        {completedItems.length > 0 && (
          <AnimeCarousel
            title="Selesai Tayang"
            items={completedItems}
          />
        )}
      </div>
    </div>
  );
}
