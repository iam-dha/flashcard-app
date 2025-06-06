import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildPaginationUrl } from "@/routes/router";
import { useGetFolderList } from "../hooks/useGetFolderList";

export default function FolderListPagePagination() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page, setPage, totalPages } = useGetFolderList();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);

    // Build URL with pagination parameters
    const url = buildPaginationUrl("/folders", {
      page: newPage,
      limit: parseInt(searchParams.get("limit") || "12"),
      sort: searchParams.get("sort") || "createdAt",
      order: (searchParams.get("order") as "asc" | "desc") || "desc",
    });

    navigate(url);
  };

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <Pagination>
      <PaginationContent className="select-none">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => canGoPrevious && handlePageChange(page - 1)}
            className={!canGoPrevious ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* Show current page */}
        {Array.from({ length: totalPages }, (_, idx) => {
          const pageNum = idx + 1;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                className={pageNum === page ? "bg-accent/80" : "cursor-pointer"}
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNum !== page) handlePageChange(pageNum);
                }}
                aria-current={pageNum === page ? "page" : undefined}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => canGoNext && handlePageChange(page + 1)}
            className={!canGoNext ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
