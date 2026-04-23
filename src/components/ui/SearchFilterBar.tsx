import { ChevronDown, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  placeholder?: string;
  filterOptions?: FilterOption[];
  onFilterChange?: (key: string, value: string) => void;
  filterLabel?: string;
  filterKey?: string;
  onExportClick?: () => void;
  title?: string;
  showSearch?: boolean;
  showExport?: boolean;
  filterPopoverContent?: React.ReactNode;
  filterPopoverOpen?: boolean;
  onFilterPopoverOpenChange?: (open: boolean) => void;
  searchContainerClassName?: string;
}

export function SearchFilterBar({
  searchKeyword,
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search",
  filterOptions,
  onFilterChange,
  filterLabel = "Filter by",
  filterKey = "riskLevel",
  title,
  showSearch = true,
  showExport = false,
  onExportClick,
  filterPopoverContent,
  filterPopoverOpen,
  onFilterPopoverOpenChange,
  searchContainerClassName,
}: Readonly<SearchFilterBarProps>) {
  return (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      {title && (
        <h2 className="text-lg sm:text-xl font-semibold whitespace-nowrap text-balance">
          {title}
        </h2>
      )}

      {showSearch && (
        <div
          className={cn(
            "relative w-full sm:max-w-md",
            searchContainerClassName,
          )}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10 pointer-events-none" />
          <Input
            placeholder={placeholder}
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchSubmit?.()}
            className="pl-10 h-11"
          />
        </div>
      )}

      <div className="flex flex-row flex-wrap gap-3 w-full sm:w-auto sm:items-center sm:justify-end ml-auto">
        {((filterOptions && filterOptions.length > 0 && onFilterChange) ||
          filterPopoverContent) &&
          (filterPopoverContent ? (
            <Popover
              open={filterPopoverOpen}
              onOpenChange={onFilterPopoverOpenChange}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 gap-2 text-black font-medium h-11 border-0 border-t-4 border-t-[#FFCC00] rounded-sm shadow-md"
                >
                  {filterLabel}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              {filterPopoverContent}
            </Popover>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 gap-2 text-black font-medium h-11  border-t-4 border-t-[#FFCC00] rounded-sm"
                >
                  {filterLabel}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {filterOptions?.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onFilterChange?.(filterKey, option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        {showExport && (
          <Button
            onClick={onExportClick}
            variant="outline"
            className="bg-[#FFCB05] hover:bg-[#FFDD5F] text-black font-medium h-11 min-w-[140px] px-6 flex items-center justify-center gap-2 disabled:bg-[#C4C4C4]"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}
