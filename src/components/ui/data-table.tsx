import * as React from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onRowClick,
  isLoading,
  emptyMessage = 'No data available.',
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [{ pageIndex, pageSize: currentPageSize }, setPagination] =
    React.useState({
      pageIndex: 0,
      pageSize,
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize: currentPageSize,
      },
    },
  });

  return (
    <div className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    onRowClick && 'cursor-pointer hover:bg-muted/50',
                    isLoading && 'opacity-50'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? 'Loading...' : emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          totalPages={table.getPageCount()}
          pageSize={table.getState().pagination.pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={table.setPageIndex}
          onPageSizeChange={table.setPageSize}
        />
      </div>
    </div>
  );
}

// Type-safe column helper
export function createColumn<TData, TValue = unknown>(
  column: ColumnDef<TData, TValue>
): ColumnDef<TData, TValue> {
  return column;
}

// Type-safe sorting helper
export function getSortedData<T>(
  data: T[],
  sortField: keyof T,
  sortDirection: 'asc' | 'desc' = 'asc'
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison =
      typeof aValue === 'string'
        ? aValue.localeCompare(bValue as string)
        : Number(aValue) - Number(bValue);

    return sortDirection === 'asc' ? comparison : -comparison;
  });
}

// Type-safe filter helper
export function getFilteredData<T>(
  data: T[],
  filters: Partial<Record<keyof T, unknown>>
): T[] {
  return data.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const itemValue = item[key as keyof T];
      if (typeof value === 'string') {
        return String(itemValue)
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return itemValue === value;
    })
  );
}
