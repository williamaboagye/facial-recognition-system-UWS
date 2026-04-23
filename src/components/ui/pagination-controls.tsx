import { Table } from "@tanstack/react-table";
import React from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  setPageIndex: (page: number) => void;
  setPageSize: (size: number) => void;
  totalItems: number;
}

function DataTablePagination<TData>({
  table,
  setPageIndex,
  setPageSize,
  totalItems,
}: Readonly<DataTablePaginationProps<TData>>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white px-2 sm:px-4 py-3 mt-1 w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-sm font-medium text-[#000000] hidden md:inline">
            Showing
          </span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-8 w-[60px] sm:w-[70px] border-gray-300">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm font-medium text-[#000000] hidden sm:inline">
            items out of {totalItems}
          </span>
          <span className="text-xs font-medium text-[#000000] sm:hidden">
            / {totalItems}
          </span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setPageIndex(table.getState().pagination.pageIndex - 1)
            }
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 sm:h-10 sm:w-10 p-0 bg-[#F5F5F5] hover:bg-[#E5E5E5] disabled:opacity-50 text-gray-700 rounded-full"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          {getPageNumbers().map((page) => (
            <React.Fragment key={`page-${page}`}>
              {page === "..." ? (
                <span className="px-1 sm:px-2 text-gray-400 hidden sm:inline">
                  ...
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPageIndex((page as number) - 1)}
                  className={cn(
                    "h-7 min-w-[28px] px-2 sm:h-8 sm:min-w-[32px] sm:px-2.5 rounded-full hover:bg-gray-100 text-xs sm:text-sm",
                    currentPage === page &&
                      "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]",
                    page !== currentPage && "hidden sm:flex"
                  )}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setPageIndex(table.getState().pagination.pageIndex + 1)
            }
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 sm:h-10 sm:w-10 p-0 bg-[#F5F5F5] hover:bg-[#E5E5E5] disabled:opacity-50 text-gray-700 rounded-full"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTablePagination;
