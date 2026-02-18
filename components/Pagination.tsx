import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({
  basePath,
  current,
  hasNext = true,
  mode = "segment",
  paramName = "page",
}: {
  basePath: string;
  current: number;
  hasNext?: boolean;
  mode?: "segment" | "query";
  paramName?: string;
}) {
  const prevNum = current > 1 ? current - 1 : 1;
  const nextNum = current + 1;

  const makeHref = (n: number) =>
    mode === "query" ? `${basePath}?${paramName}=${n}` : `${basePath}/${n}`;

  // Generating a small range around current page
  const range = [];
  for (let i = Math.max(1, current - 1); i <= current + (hasNext ? 1 : 0); i++) {
    range.push(i);
  }

  return (
    <UiPagination className="mt-12 select-none">
      <PaginationContent className="bg-surface-dark/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm shadow-2xl">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={makeHref(prevNum)}
            aria-disabled={current === 1}
            className={current === 1 ? "pointer-events-none opacity-20" : "hover:bg-primary/20 hover:text-primary"}
          />
        </PaginationItem>

        {/* Start shortcut */}
        {current > 3 && (
          <>
            <PaginationItem>
              <PaginationLink href={makeHref(1)} className="hover:bg-surface-hover">1</PaginationLink>
            </PaginationItem>
            {current > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Dynamic Range */}
        {range.map((n) => (
          <PaginationItem key={n}>
            <PaginationLink
              href={makeHref(n)}
              isActive={n === current}
              className={n === current ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-surface-hover"}
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* End Ellipsis (Since we don't know total, we just show ellipsis if there is more) */}
        {hasNext && current < 1000 && ( // Just a high bound
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={makeHref(nextNum)}
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-20" : "hover:bg-primary/20 hover:text-primary"}
          />
        </PaginationItem>
      </PaginationContent>
    </UiPagination>
  );
}
