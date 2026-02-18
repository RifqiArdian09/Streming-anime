import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  TrendingUp,
  ChevronDown,
  SortAsc,
  Zap,
  PlayCircle,
  ArrowRight,
  Filter
} from "lucide-react";
import { Suspense } from "react";

async function getGenres() {
  try {
    const data = await api<any>(`/anime/genre`, {
      cache: "force-cache",
      next: { revalidate: 3600 }
    });

    // Robust extraction of the list from various possible API structures
    let allList: any[] = [];
    if (Array.isArray(data)) {
      allList = data;
    } else if (data?.data?.genreList && Array.isArray(data.data.genreList)) {
      allList = data.data.genreList;
    } else if (data?.data && Array.isArray(data.data)) {
      allList = data.data;
    } else if (data?.data?.list && Array.isArray(data.data.list)) {
      allList = data.data.list;
    } else if (data?.genres && Array.isArray(data.genres)) {
      allList = data.genres;
    } else if (data?.list && Array.isArray(data.list)) {
      allList = data.list;
    }
    return allList;
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    return [];
  }
}

// Helper to get a decorative image for a genre
function getGenreImage(name: string) {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("action")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ14uZNiL02KvNOB9bmetTsZK5ZPBsPCdOk9FRTLafqzdIFvIh5E1TRXq_ii8lCPw5WXVkgUxuR3d_tb76fOfM9_f_DVsa6eQoTbWZexKb9s_SV9PSEy5A1JGiLCvG7J8SXi6udus258v2VpbuYDdqYjPH4S29IXP4DbAB7LkQPYXUThvFr5G5_9WdaSbh-nnxIG-d712emBys5rlrfaH-BpGxLV2-K7kE6JPsjP-m5vKvLu3ybSAU2JTlUf5O_Ljv_PZ_qyhnpf9k";
  if (lowercaseName.includes("romance")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuB1--InKeMrkUHnaFO7PN4VzqXfJysnapTmJRih2OBt_1UyWVv21LSTnC3e3Ppc3QIH2VSzGs9-8ihac_PZemsmPPahrTFQ35-rLd1jWVHewpq1og8ioZKCle5W6mZNAfvO286mByx3gBIF62pcYPSegAR7KBwwN5N6sAWLSP7oziyoUE_mmttEySIIQ7YDmwokaZLOUTQIVLNOhM7uLfcBSXv9PwbkxMZB3lLDAV5n3147sM0_QOdFUSQHUEOro-eKpCEVrDvhR3GB";
  if (lowercaseName.includes("sci-fi") || lowercaseName.includes("cyberpunk")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuDCfN8Y1yVXhtXAt6Clum3gESFZrRBi1HpDNImiPhqkm2998GpeSK1Yh3HlMSYmuBZkRrcL_KHXUTW-D5xnC9Un1Hv8NH86PWjoZribh87A86jK7iy5zrYrvuwpSKrzIPNQwODeDEuhHdNfgE0rUehnmX-uYOG0xO3aNNJP1Y9tVYyi5YEYejLeFhLj-eM8jMwDrbS091c7YVf-n4_gyFgk9J5JD8vSH90Gv-ekryVv9x6ECcXlIOekbkr0bhb6Y-W6KgfUe9iFec28";
  if (lowercaseName.includes("fantasy")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuDgoduIeFRwCUnBsKmykM4rB95A70SOVU19gqtxPn28EkSJI9rMkFpeN23qKeq8Mg3lwlUo8J5enMdxNNmobFg_WSOdsR-JfYOU7fFnRT390ghxGBGOiPYDXah4rcYU1tuRYgfw2OarribiHEYE-sp-3Do768BCBvY2NmsUVwBExs7u2VJ8DoI20Rh65PPJtJa_7kHBVzXs3epMAVJTkjLG1pU068-_5N8iovUq4YZ7OUAlgzFzIOxA1spmGj-8LpaX_2CVbp6I5eFU";
  if (lowercaseName.includes("slice of life")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuDptjkbE7zgixZeU4upamcw0e0yFG3EZAy7_973J2lVqIwq6YSvufLlYbfqaKHjRtIlfwQMuQgw4XFH51LMjpIGyFGqwIPPa8cud-YIws_pP1rsCKqtzJCkkFGNzPJYso5h8_pBDKWs1oncp5-1rotX6uf8TBkJ2UsGFKNxMOVJuICxZbSam8LnJ8O70-osWm0SdRdKhAAKVWLek_vZLMqz3G2P4B_-O2i8RYhODldOU_qPSraO4MYrOH9mlzNb7Ynf6k8-5BwUlxBx";
  if (lowercaseName.includes("horror")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuDZQilHguY3vIsSmdLpoxrTBTCCwRIf5bQ74RbVYE2c2GDPcmjp-bOIYJvCKjEGWRczX_08C9zQDHPmYAFzDzi3Qo7duGhCQ4qAyl7d5BFeVAU-1mYKF5kNjtIX4U0ZCcamS6BF0ige64d8BNdtqk0v14USSnGGj-xzr7hgN77UXkbE9QqHY0AlIt605zjWZEhifvQNmBkaV3zBRvDM_ah2-HNxK03j63FdhZcBkLRj-CubvVtBgIm0FtaY7UnZ6r191_5YWLUfIhnG";
  if (lowercaseName.includes("sports")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuBLoeTTxYoLooN2Q2efbMt9OfTkCpfziSbaQoFDbgU5ewxTkghZ1SQ4MQEtvxCxmn7uFhqAymsaQNI5KSF8RU7Ev6-vWpPjGcdzE5PFk1P8e0cu86S7FtPUTotItO6-FE1vqZqHaW31aouqx82AdVDe1cjc_rLa4Nno0bgSwAZ1xsfxEzOjs5JOuJbQhk75fLRPD-UsjRa2B1JZFDDDr3XwFXTUKSMbAi-fUBF5oApEy3PU1UGanwUKz-EVcEsFMA5cRCFNCe7mdN7g";
  if (lowercaseName.includes("mecha")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuAyS7_t1ihtiQowDC5Fa1XOktILSHopbxZAltXrhfF1g27K-ApycX9Q1c-2gYZZ6KlK7_MfUnRBGvVSLa5eacPIDB1mbjHFN0rDuanpsUqBQEFKJbCAZOGpkAdfGT23BoRSqayZ3jV_4UU40x9QWGG-6F-TOd-2FREFAq3tKi_sMPufLoqU0zTRN0YGKVI_GmkH9gNbZvXN9oyBvzrLNtBspUS1drLz-cA77I_q2pNNcFAzam11XsppoTYnqe5xZiKorcszjSAl-xeB";
  if (lowercaseName.includes("adventure")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuCaG3qHZJeRcM-dodWTG8i4A0CLHZOUWnCN-Knm5BbaEJ4I-7Anr6YVqN93JRv5ffnLjolRfd4wRi8Wm1E8AJCwJLpaCE5i8HQHv66pyzR6kF63NzczhUs_tiYJ-UH5l9o6_9GJ6MuS5bPUTOlX9Y9B2-Z380Qwgf1sYLVtTfKj3p-X4qUpbdYxKnPLWujFtgIj6TbjguG7Koe-T9Eh9uFCbJuBqowwNNC487ueCfehU4KhJ4rZFszWwTBzYgBWU2GlmM8zb97OcN6V";
  if (lowercaseName.includes("drama")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuBgvYxef3F9g59zBJzQvKTTvGrWcSNXGjNkvGMDoE1-1E3ZU7PJKmiH7WSN3Gmz3mgBFrg79GFWlQRdGVoPELdrsxE_jRLh4o_KUmAZtc7bD3-HacejcC4LYey17Vj7tWh_QGq3N2sYmgXOCoJ4Um6vfXCZaMcS5xZziIki68G9bGkJ4iBQMQW6Nl5BSG70ipxahQMmwbG2c3lOBcx-0lc8fg4SP5aXtBf99hu35Ov9J2yEn8xEF7wiCyhofTl6_3INYVTEPeKhg43O";

  // Generic fallback
  return "https://lh3.googleusercontent.com/aida-public/AB6AXuAgUL3UJkF18pnK-JuxaKYSod8x7-pCSjo-_LZmKXh3J2xwYZY9Edh_gJM4p9m3AWYzRxPXsBBDvs2gbXGLIneTXLbZOKL9a3Nxl5aqIBxrSEhtbL3saBWoYbqKdA7gRIBf9fx9J003so7rDYeQsthdWqaqLWeWVux_rF9d5KMCQRDnsnrcHMcbEPfO9unOD4WdUKah1K5aCfK_Wsq5A7Ops0Pm5BnpPN5MdjEeknaNsD_ZVt84-Ca7-cyMBq0TUDvJS1CgdpHbbnDH";
}

export default async function Page() {
  const list = await getGenres();

  return (
    <main className="flex-1 flex flex-col items-center w-full px-4 md:px-10 lg:px-20 xl:px-40 py-6 bg-background-dark min-h-screen text-white">
      <div className="flex flex-col max-w-[1200px] w-full flex-1 gap-8">

        {/* Hero Section */}
        <div className="w-full">
          <div className="relative w-full rounded-2xl overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

            {/* Hero Background */}
            <div
              className="w-full min-h-[400px] md:min-h-[500px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAl8P2XlZjc6RvbQewzbUqEhucn6X1BpQO9JndBOdYJuecteWIRm096XS3GXAldl7HYftSgVkzLdZ6ZevxByyvN9JrRT7bxWOi6EfR2Axt5CoXnMnzGbprXShvTzMYwLAFtzrP3sYI7GnSs4ZwvAhfftPGrFKpdR915t3pYoAbdPQKki1pQyMvtH12xIkHj7A6hTUxTm1se0Nr1BP9JZUvFpkErD3NlspHi8yxibiVa9vvmwwxs7t--Q7AvgZbgr8YrsFuou_dFuTk2')` }}
            />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20 flex flex-col items-start gap-4">
              <span className="inline-flex items-center rounded-md bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-inset ring-white/10 shadow-lg">
                Genre of the Month
              </span>
              <div className="flex flex-col gap-2 max-w-2xl">
                <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-2xl">
                  Cyberpunk
                </h1>
                <p className="text-slate-200 text-sm md:text-lg font-medium leading-relaxed max-w-xl drop-shadow-lg">
                  Dive into high-tech worlds and low-life societies. Featuring neon-soaked streets, advanced cybernetics, and dystopian rebellions.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 transition-all text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                  Explore Collection
                </button>
                <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all text-white text-sm font-bold tracking-wide hover:scale-105 active:scale-95">
                  <PlayCircle className="mr-2 size-5" />
                  Play Highlight
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border-dark pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Browse by Genre</h2>
            <p className="text-text-secondary text-sm">Temukan favorit baru di {list.length} kategori</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-border-dark hover:bg-surface-hover transition-colors px-4 border">
              <span className="text-slate-200 text-xs font-bold">Trending</span>
              <TrendingUp className="size-4 text-primary" />
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-5 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all group">
              <span className="text-xs font-bold">Popularitas</span>
              <ChevronDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-border-dark hover:bg-surface-hover transition-colors px-4">
              <span className="text-slate-200 text-xs font-bold">A-Z</span>
              <SortAsc className="size-4" />
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-border-dark hover:bg-surface-hover transition-colors px-4">
              <span className="text-slate-200 text-xs font-bold">Terbaru</span>
              <Zap className="size-4" />
            </button>
          </div>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
          {list.length > 0 ? (
            list.map((g: any, i: number) => {
              const slug = g?.genreId || g?.slug || g?.value || g?.name?.toLowerCase?.().replace(/\s+/g, "-") || `g-${i}`;
              const name = g?.name || g?.title || g?.label || slug;
              const count = Math.floor(Math.random() * 500) + 100; // Mock count

              return (
                <Link
                  key={slug}
                  href={`/genre/${slug}`}
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-surface-dark shadow-md border border-white/5 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${getGenreImage(name)}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                  <div className="absolute bottom-0 left-0 flex w-full flex-col p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                          {name}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1 group-hover:text-slate-200 transition-colors">
                          {count} TITLES
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 border border-white/20">
                        <ArrowRight className="size-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-surface-dark border border-dashed border-border-dark rounded-2xl">
              <Filter className="size-12 text-text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary font-medium">Belum ada genre untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
