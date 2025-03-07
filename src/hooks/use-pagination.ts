import { useState } from 'react';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

interface UsePaginationProps {
  initialPageIndex?: number;
  initialPageSize?: number;
  total?: number;
}

interface UsePaginationReturn {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  nextPage: () => void;
  prevPage: () => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  canNextPage: boolean;
  canPrevPage: boolean;
}

export function usePagination({
  initialPageIndex = 0,
  initialPageSize = 10,
  total = 0
}: UsePaginationProps = {}): UsePaginationReturn {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize
  });

  const pageCount = Math.ceil(total / pageSize);
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);
  const canNextPage = pageIndex < pageCount - 1;
  const canPrevPage = pageIndex > 0;

  const setPageIndex = (newPageIndex: number) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.max(0, Math.min(newPageIndex, pageCount - 1))
    }));
  };

  const setPageSize = (newPageSize: number) => {
    setPagination(prev => {
      const currentRow = prev.pageIndex * prev.pageSize;
      const newPageIndex = Math.floor(currentRow / newPageSize);
      
      return {
        pageIndex: newPageIndex,
        pageSize: newPageSize
      };
    });
  };

  const nextPage = () => {
    if (canNextPage) {
      setPageIndex(pageIndex + 1);
    }
  };

  const prevPage = () => {
    if (canPrevPage) {
      setPageIndex(pageIndex - 1);
    }
  };

  return {
    pageIndex,
    pageSize,
    pageCount,
    from,
    to,
    total,
    nextPage,
    prevPage,
    setPageIndex,
    setPageSize,
    canNextPage,
    canPrevPage
  };
}