import { api, AnimeItem, normalizeAnimeItem } from "@/lib/api";
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

// Local normalizeItem removed in favor of lib/api version

export default async function Page() {
  const rawOngoing = await getOngoingData();
  const ongoingList = rawOngoing.map(normalizeAnimeItem).filter((it: AnimeItem) => it.slug);

  return (
    <div className="pt-0"> {/* Remove extra padding since Sidebar is sticky below header */}
      <OngoingSchedule ongoingList={ongoingList} />
    </div>
  );
}
