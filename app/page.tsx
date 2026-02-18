import { api, AnimeItem } from "@/lib/api";
import {
  Flame,
} from "lucide-react";
import AnimeCarousel from "@/components/AnimeCarousel";
import ContinueWatchingCarousel from "@/components/ContinueWatchingCarousel";
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

function normalizeItem(v: any): AnimeItem {
  let rawSlug: any = v?.slug || v?.animeId || v?.anime_id || v?.link || v?.href;
  let slug: string | undefined = undefined;
  if (typeof rawSlug === "string") {
    if (rawSlug === "#" || rawSlug === "") {
      slug = undefined;
    } else if (rawSlug.includes("://") || rawSlug.includes("/")) {
      const parts = rawSlug.split("/").filter(Boolean);
      slug = parts.pop();
    } else {
      slug = rawSlug;
    }
  }
  return {
    title: v?.title || v?.name || v?.anime_title,
    slug,
    thumbnail: v?.thumbnail || v?.poster || v?.image || v?.thumb || v?.img || v?.cover,
    episode: v?.episode || v?.current_episode || v?.latest_episode,
    status: v?.status,
    score: v?.score,
    type: v?.type || "Anime",
    release: v?.release || v?.newest_release_date || v?.year || v?.releaseDay,
  } as AnimeItem;
}

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
  const items = raw.filter((x: any) => x?.slug || x?.title || x?.poster || x?.thumbnail);
  return items.map(normalizeItem);
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

  const trendingItems = ongoingRaw.map(normalizeItem);
  const completedItems = completedRaw.map(normalizeItem);

  // Get top 5 candidates for the Hero section
  const heroCandidates = trendingItems.length >= 5 ? trendingItems.slice(0, 5) : allItems.slice(0, 5);

  const heroItems = await Promise.all(
    heroCandidates.map(async (candidate) => {
      let detail = null;
      if (candidate.slug) {
        detail = await getAnimeDetail(candidate.slug);
      }

      return {
        title: detail?.title || candidate.title || "Unknown Anime",
        description: extractText(detail?.synopsis || detail?.description) || "Nikmati streaming anime terbaru dengan kualitas terbaik dan subtitle Indonesia hanya di NimeStream.",
        image: detail?.thumbnail || detail?.poster || candidate.thumbnail || "",
        slug: candidate.slug || "",
        year: detail?.year || detail?.release_year || candidate.release || "2024",
        type: detail?.type || candidate.type || "TV",
        score: detail?.score || detail?.rating || candidate.score || "9.5"
      };
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlider items={heroItems} />

      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto px-6 mt-4 relative z-20 pb-20 space-y-12">

        {/* Continue Watching Section */}
        <ContinueWatchingCarousel />

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
