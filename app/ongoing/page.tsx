import { api, AnimeItem } from "@/lib/api";
import OngoingSchedule from "@/components/OngoingSchedule";

async function getOngoingData() {
  try {
    const data = await api<any>(`/anime/ongoing-anime`, { cache: "force-cache", next: { revalidate: 3600 } });
    return data?.data?.animeList || [];
  } catch (error) {
    console.error('Failed to fetch ongoing data:', error);
    return [];
  }
}

function normalizeItem(v: any): AnimeItem {
  let rawSlug: any = v?.slug || v?.animeId || v?.anime_id || v?.link || v?.href;
  let slug: string | undefined = undefined;
  if (typeof rawSlug === "string") {
    const parts = rawSlug.split("/").filter(Boolean);
    slug = parts.pop();
  }
  return {
    title: v?.title || v?.name || v?.anime_title,
    slug,
    thumbnail: v?.thumbnail || v?.poster || v?.image || v?.thumb || v?.img || v?.cover,
    episode: v?.episode || v?.current_episode || v?.latest_episode || v?.episodes,
    status: v?.status || "Ongoing",
    score: v?.score,
    type: v?.type || "TV",
    releaseDay: v?.releaseDay,
  } as AnimeItem;
}

export default async function Page() {
  const rawOngoing = await getOngoingData();
  const ongoingList = rawOngoing.map(normalizeItem);

  return (
    <div className="pt-0"> {/* Remove extra padding since Sidebar is sticky below header */}
      <OngoingSchedule ongoingList={ongoingList} />
    </div>
  );
}
