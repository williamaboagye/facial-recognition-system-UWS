"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  //getFilteredRowModel,
  //getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  GripVertical,
  // Search,
  Calendar,
  Trash2,
  RotateCw,
  ListFilter,
} from "lucide-react";

// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
// import { Input } from "./input";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
// import { useRowSelection } from "@/core/contexts/table-row-selection-hooks";

// import DataTablePagination from "./pagination-controls";

import { cn } from "@/lib/utils";
import DataTablePagination from "./pagination-controls";
import { SearchFilterBar } from "./SearchFilterBar";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  placeholder?: string;
  includePagination?: boolean;
  emptyDataMessage?: string;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  enableSearch?: boolean;
  limitRows?: number;
  viewMoreLink?: string;
  isLoading?: boolean;
  skeletonRowLength?: number;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  setPageIndex: (page: number) => void;
  setPageSize: (size: number) => void;
  onSearch?: (value: string) => void;
  tableTitle?: string;
  useEnhancedHeader?: boolean;
  showFilter?: boolean;
  showRefresh?: boolean;
  showCalendar?: boolean;
  showRecall?: boolean;
  showExport?: boolean;
  onFilterClick?: () => void;
  onRefreshClick?: () => void;
  onCalendarClick?: () => void;
  onRecallClick?: () => void;
  onExportClick?: () => void;
  addNew?: React.ReactNode;
  addBulk?: React.ReactNode;
  editBtn?: boolean;
  showSearchFilter?: boolean;
  searchPlaceholder?: string;
  onFilterChange?: (key: string, value: string) => void;
  onSearchSubmit?: () => void;
  showSearchInput?: boolean;
  renderEmptyState?: () => React.ReactNode;
  externalSearchValue?: string;
  // onFilterButtonClick?: () => void;
  filterPopoverContent?: React.ReactNode;
  filterPopoverOpen?: boolean;
  onFilterPopoverOpenChange?: (open: boolean) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  manualSorting?: boolean;
  showBorder?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showBorder = true,
  // placeholder,
  includePagination = true,
  emptyDataMessage,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  // enableSearch = true,
  limitRows,
  viewMoreLink,
  isLoading = false,
  skeletonRowLength = 10,
  pageIndex,
  pageSize,
  totalRows,
  setPageIndex,
  setPageSize,
  onSearch,
  tableTitle,
  useEnhancedHeader = false,
  showFilter = false,
  showRefresh = false,
  showCalendar = false,
  showRecall = false,
  showExport = false,
  onFilterClick,
  onRefreshClick,
  onCalendarClick,
  onRecallClick,
  onExportClick,
  addNew,
  addBulk,
  editBtn,
  showSearchFilter = true,
  searchPlaceholder = "Search",
  onFilterChange,
  onSearchSubmit,
  showSearchInput = true,
  renderEmptyState,
  externalSearchValue,
  // onFilterButtonClick
  filterPopoverContent,
  filterPopoverOpen,
  onFilterPopoverOpenChange,
  sorting: externalSorting,
  onSortingChange: onExternalSortingChange,
  manualSorting = false,
}: Readonly<DataTableProps<TData, TValue>>) {
  // const { setSelectedRows } = useRowSelection<TData>();
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>(
    externalSorting ?? [],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [reorderable, setReorderable] = React.useState(false);

  const [rowData, setRowData] = React.useState<TData[]>(data);

  React.useEffect(() => {
    setRowData(data);
  }, [data]);

  React.useEffect(() => {
    if (externalSearchValue === undefined) return;
    setSearchValue(externalSearchValue);
  }, [externalSearchValue]);

  React.useEffect(() => {
    if (externalSorting) {
      setSorting(externalSorting);
    }
  }, [externalSorting]);

  const selectionColumn: ColumnDef<TData, any> = {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(event) => {
            table.toggleAllPageRowsSelected(event.target.checked);
          }}
          aria-label="Select all rows"
          className="h-4 w-4 rounded border-gray-300 text-slate-900"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(event) => {
            row.toggleSelected(event.target.checked);
          }}
          aria-label="Select row"
          className="h-4 w-4 rounded border-gray-300 text-slate-900"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  let allColumns = columns;
  if (enableRowSelection) {
    if (!columns.some((col) => col.id === "select")) {
      allColumns = [selectionColumn, ...columns];
    }
  }

  const tableData = viewMoreLink ? rowData.slice(0, limitRows || 5) : rowData;

  const table = useReactTable({
    data: tableData,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: (updater) => {
    //   const nextSorting =
    //     typeof updater === "function" ? updater(sorting) : updater;
    //   setSorting(nextSorting);
    //   onExternalSortingChange?.(nextSorting);
    // },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting,
      columnFilters,
      expanded,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: false,
    manualSorting,
    pageCount: Math.ceil(totalRows / pageSize),
    enableRowSelection,
    enableMultiRowSelection,
  });

  const renderSkeletonRow = () => {
    return (
      <TableRow>
        {columns.map((_, index) => (
          <TableCell key={index}>
            <Skeleton className="w-full h-6 bg-slate-200/60" />
          </TableCell>
        ))}
      </TableRow>
    );
  };

  React.useEffect(() => {
    if (enableRowSelection) {
      // const selectedRows = table
      //   .getFilteredSelectedRowModel()
      //   .rows.map((row) => row.original);
      // setSelectedRows(selectedRows);
    }
  }, [rowSelection, enableRowSelection, table]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue);
        if (searchValue !== "" && pageIndex !== 0) {
          setPageIndex(0);
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearch]);

  const handleSearchSubmit = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
    } else if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const shouldShowEmptyState = !isLoading && !table.getRowModel().rows?.length;

  const emptyStateContent = renderEmptyState ? (
    renderEmptyState()
  ) : (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <p className="text-gray-500">{emptyDataMessage ?? "No results."}</p>
    </div>
  );

  return (
    <div className="pb-10 ">
      <div className={cn("rounded-md", showBorder && "border")}>
        {showSearchFilter && (
          <div className="p-4 border-b">
            <SearchFilterBar
              searchKeyword={searchValue}
              onSearchChange={setSearchValue}
              onSearchSubmit={handleSearchSubmit}
              placeholder={searchPlaceholder}
              // filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              filterLabel="Filter by"
              onExportClick={onExportClick}
              title={tableTitle}
              showSearch={showSearchInput}
              showExport={showExport}
              filterPopoverContent={filterPopoverContent}
              filterPopoverOpen={filterPopoverOpen}
              onFilterPopoverOpenChange={onFilterPopoverOpenChange}
            />
          </div>
        )}
        {useEnhancedHeader && tableTitle && (
          <div className="px-6 py-4 border-b bg-gray-50/50">
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-lg font-semibold">{tableTitle}</h2>
              </div>

              <div className="flex items-center gap-5">
                {/* {enableSearch && (
                <div className="relative">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2" />
                  <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-3 border-gray-400 w-80 focus:bg-white placeholder:text-xs"
                  />
                </div>
              )} */}

                {showRecall && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRecallClick}
                    className="flex items-center gap-2 font-light hover:text-gray-900"
                  >
                    <Trash2 className="w-4 h-4" />
                    Recall
                  </Button>
                )}

                {showFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFilterClick}
                    className="flex items-center gap-2 font-light hover:text-gray-900"
                  >
                    <ListFilter className="w-4 h-4" />
                    Filter
                  </Button>
                )}

                {/* {showExport && (
                  <PermissionGuard
                    permission={Permission.GENERATE_EXPORT_REPORTS}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onExportClick}
                      className="flex items-center gap-2 font-light hover:text-gray-900"
                    >
                      <CloudDownload className="w-4 h-4" />
                      Export
                    </Button>
                  </PermissionGuard>
                )} */}

                {showRefresh && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefreshClick}
                    className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                )}

                {showCalendar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCalendarClick}
                    className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                )}

                {addNew && <div className="shrink-0">{addNew}</div>}
                {addBulk && <div className="shrink-0">{addBulk}</div>}
                {editBtn && (
                  <Button
                    variant="outline"
                    onClick={() => setReorderable((prev) => !prev)}
                    className="flex items-center gap-2 font-light hover:text-gray-900"
                  >
                    {reorderable ? "Done" : "Edit"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {shouldShowEmptyState ? (
          <div className="px-6 py-16 flex justify-center">
            {emptyStateContent}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {reorderable && (
                      <TableHead className="w-6 text-center"></TableHead>
                    )}
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          (header.column.columnDef.meta as any)
                            ?.headerClassName,
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              {/* {reorderable ? (
                <DragDropContext
                  onDragEnd={(result: DropResult) => {
                    if (!result.destination) return;

                    const updatedData = Array.from(rowData);
                    const [removed] = updatedData.splice(
                      result.source.index,
                      1,
                    );
                    updatedData.splice(result.destination.index, 0, removed);

                    setRowData(updatedData);
                  }}
                >
                  <Droppable droppableId="table-body">
                    {(provided) => (
                      <TableBody
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {table.getRowModel().rows.map((row, index) => (
                          <Draggable
                            key={row.id}
                            draggableId={row.id}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                data-state={row.getIsSelected() && "selected"}
                              >
                                <TableCell className="w-6 text-gray-400 cursor-grab hover:text-gray-600 hover:bg-amber-300/70">
                                  <span {...provided.dragHandleProps}>
                                    <GripVertical className="w-4 h-4" />
                                  </span>
                                </TableCell>

                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                  </Droppable>
                </DragDropContext> */}
                <TableBody>
                  {isLoading
                    ? Array.from({ length: skeletonRowLength }).map(
                        (_, index) => (
                          <React.Fragment key={index}>
                            {renderSkeletonRow()}
                          </React.Fragment>
                        ),
                      )
                    : table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                </TableBody>
            </Table>

            {includePagination && (
              <div className="flex items-center w-full py-4 space-x-2 justify-center md:justify-start ">
                <DataTablePagination
                  table={table}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  totalItems={totalRows}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


