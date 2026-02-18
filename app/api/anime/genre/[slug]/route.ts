import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  try {
    const data = await api<any>(`/anime/genre/${slug}?page=${page}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
