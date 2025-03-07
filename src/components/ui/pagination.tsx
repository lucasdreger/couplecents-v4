import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationProps {
  pageIndex: number; 
  totalPages: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  showFirstLastButtons?: boolean;
  showPageSize?: boolean;
}

export function Pagination({
  pageIndex,
  totalPages,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPageChange,
  onPageSizeChange,
  className,
  showFirstLastButtons = true,
  showPageSize = true,
}: PaginationProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-center gap-2">
        {onPageSizeChange && showPageSize ? (
          <div className="flex items-center gap-2 text-sm font-medium">
            Rows per page:
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                onPageSizeChange(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        {showFirstLastButtons && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <span className="flex items-center gap-1 text-sm font-medium">
          Page{" "}
          <span className="font-semibold">
            {pageIndex + 1} of {Math.max(1, totalPages)}
          </span>
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
        {showFirstLastButtons && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        )}
      </div>
    </div>
  );
}

// Type-safe page calculation helpers
export function calculateTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

export function calculatePageBounds(pageIndex: number, pageSize: number): {
  startIndex: number;
  endIndex: number;
} {
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  return { startIndex, endIndex };
}

// Helper hook for pagination state management
export function usePagination(options?: {
  initialPageSize?: number;
  initialPageIndex?: number;
}) {
  const [pageIndex, setPageIndex] = React.useState(options?.initialPageIndex ?? 0);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize ?? 10);

  const reset = React.useCallback(() => {
    setPageIndex(0);
  }, []);

  return {
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    reset,
  };
}
