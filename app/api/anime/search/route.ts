import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q) return NextResponse.json({ data: [] });

    try {
        const data = await api<any>(`/anime/search/${encodeURIComponent(q)}`);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
