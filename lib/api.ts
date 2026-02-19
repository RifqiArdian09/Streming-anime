export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.sankavollerei.com";

export async function api<T>(path: string, init?: RequestInit, retries = 3): Promise<T> {
  const url = `${BASE_URL}${path}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        next: { revalidate: 0 },
        ...init,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
          Referer: BASE_URL,
          Accept: "application/json",
          ...(init?.headers || {}),
        },
      });

      // Handle transient errors with retry
      if ([500, 502, 503, 504].includes(res.status) && attempt < retries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`API temporary error ${res.status} for ${path}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (!res.ok) {
        console.error(`API error ${res.status} for ${path}`);
        return {} as T;
      }

      const data = await res.json();

      if (data?.error || data?.message?.includes('Error')) {
        console.error(`API response error for ${path}:`, data);
        return {} as T;
      }

      return data as T;
    } catch (error) {
      if (attempt < retries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`Network error for ${path}. Retrying in ${delay}ms...:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      console.error(`Final network error for ${path}:`, error);
      return {} as T;
    }
  }

  return {} as T;
}

export type AnimeItem = {
  title?: string;
  slug?: string;
  thumbnail?: string;
  episode?: string | number;
  status?: string;
  score?: string | number;
  type?: string;
  release?: string;
  [key: string]: any;
};

export function normalizeAnimeItem(v: any): AnimeItem {
  if (!v) return {} as AnimeItem;

  let rawSlug: any = v?.slug || v?.animeId || v?.anime_id || v?.link || v?.href || v?.url;
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
    ...v,
    title: v?.title || v?.name || v?.anime_title,
    slug,
    thumbnail: v?.thumbnail || v?.poster || v?.image || v?.thumb || v?.img || v?.cover,
    episode: v?.episode || v?.current_episode || v?.latest_episode || v?.episodes,
    status: v?.status,
    score: v?.score || v?.rating || v?.rate || v?.stars,
    type: v?.type || "TV",
    release: v?.release || v?.newest_release_date || v?.year || v?.releaseDay,
  } as AnimeItem;
}
