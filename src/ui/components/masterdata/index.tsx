import { useRef, useState, type ComponentProps, type FormEvent } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import dayjs from "dayjs"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Download,
  Eye,
  EyeOff,
  FilterX,
  FunnelPlus,
  Inbox,
  Monitor,
  MoreHorizontal,
  PencilLine,
  Plus,
  Search,
  Settings2,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

import { camelToTitle } from "@/lib/utils/case"
import { cn } from "@/lib/utils/tailwind"
import { Button } from "@/ui/components/base/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/ui/components/base/button-group"
import { Calendar } from "@/ui/components/base/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/ui/components/base/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/ui/components/base/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/components/base/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/ui/components/base/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/components/base/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/base/select"
import { Separator } from "@/ui/components/base/separator"
import { Skeleton } from "@/ui/components/base/skeleton"
import {
  Table as BaseTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/base/table"

import { Badge } from "../base/badge"

const skeletonWidths = ["w-20", "w-24", "w-32", "w-40", "w-28", "w-16"]
const getSkeletonClass = (cellIndex: number, columnId?: string) => {
  if (columnId === "actions") {
    return "size-8 rounded-half"
  }

  return `h-4 ${skeletonWidths[cellIndex % skeletonWidths.length]}`
}

export function CellText({ text, className, ...props }: { text: string } & ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "min-w-0 flex-1 truncate md:max-w-56 lg:max-w-72 xl:max-w-96 2xl:max-w-md",
        className,
      )}
      title={text}
      {...props}
    >
      {text}
    </span>
  )
}

export function CellDate({
  date,
  formatTemplate = "DD MMM YYYY, HH:mm:ss",
  className,
  ...props
}: { date: Date; formatTemplate?: string } & ComponentProps<"span">) {
  const updatedAtLabel = dayjs(date).format(formatTemplate)
  return (
    <span className={cn("text-muted-foreground", className)} {...props}>
      {updatedAtLabel}
    </span>
  )
}

type HeaderCellProps<TData> = {
  column: Column<TData, unknown>
  title: string
  className?: string
}

function HeaderCell<TData>({ column, title, className }: HeaderCellProps<TData>) {
  "use no memo"
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span>{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="data-[state=open]:bg-accent size-8">
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
            <span className="sr-only">Open sort options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

type FacetOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

type Facet = {
  id: string // columnId
  title: string
  options: FacetOption[]
}

type MasterDataProps<TData extends { id: number | string }, TValue> = {
  title: string
  description: string

  // Data Table Content
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  facets?: Facet[]
  total?: number
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void

  // Feature toggles
  searchEnabled?: boolean
  dateRangeEnabled?: boolean
  createEnabled?: boolean
  viewEnabled?: boolean
  editEnabled?: boolean
  deleteEnabled?: boolean
  exportEnabled?: boolean
  importEnabled?: boolean
}

export const MasterData = <TData extends { id: number | string }, TValue>({
  title,
  description,
  //
  data,
  columns,
  facets,
  total,
  isLoading,
  isError,
  onRetry,
  //
  searchEnabled,
  dateRangeEnabled,
  createEnabled,
  viewEnabled,
  editEnabled,
  deleteEnabled,
  importEnabled,
  exportEnabled,
}: MasterDataProps<TData, TValue>) => {
  "use no memo"

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [searchValue, setSearchValue] = useState<string>("")
  const [dateRangeValue, setDateRangeValue] = useState<DateRange | undefined>(undefined)

  const resetPageIndex = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater)
    resetPageIndex()
  }

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    setColumnFilters(updater)
    resetPageIndex()
  }

  const onSearchChange = (value: string) => {
    setSearchValue(value)
    resetPageIndex()
  }

  const onDateRangeChange = (value: DateRange | undefined) => {
    setDateRangeValue(value)
    resetPageIndex()
  }

  const onResetFilters = () => {
    setSearchValue("")
    setColumnFilters([])
    setDateRangeValue(undefined)
    resetPageIndex()
  }

  const isFiltered =
    Boolean(searchValue.trim()) ||
    columnFilters.length > 0 ||
    Boolean(dateRangeValue?.from || dateRangeValue?.to)
  const search = searchEnabled
    ? {
        value: searchValue,
        onChange: onSearchChange,
        placeholder: "Searching ...",
      }
    : undefined
  const dateRange = dateRangeEnabled
    ? {
        value: dateRangeValue,
        onChange: onDateRangeChange,
        placeholder: "Date Range",
      }
    : undefined

  // see: https://github.com/TanStack/table/issues/6137
  const table = useReactTable({
    data,
    columns,
    //
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    //
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableMultiSort: false,
    rowCount: total,
    onPaginationChange: setPagination,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
  })

  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
  const [draftDateRange, setDraftDateRange] = useState<DateRange | undefined>(dateRange?.value)

  const dateRangeLabel = (
    value?: {
      from?: Date
      to?: Date
    },
    placeholder?: string,
  ) => {
    if (!value?.from) {
      return placeholder ?? "-"
    }

    const fromLabel = dayjs(value.from).format("DD MMM YYYY")
    if (!value.to) {
      return fromLabel
    }

    const toLabel = dayjs(value.to).format("DD MMM YYYY")
    return `${fromLabel} - ${toLabel}`
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!search) {
      return
    }
    const nextValue = searchInputRef.current?.value ?? ""
    search.onChange(nextValue)
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <CardAction className="hidden md:flex">
          {(importEnabled || exportEnabled || createEnabled) && (
            <ButtonGroup>
              {importEnabled && (
                <>
                  <Button size="sm">
                    <Upload />
                    Import
                  </Button>
                  {(exportEnabled || createEnabled) && <ButtonGroupSeparator />}
                </>
              )}
              {exportEnabled && (
                <>
                  <Button size="sm">
                    <Download />
                    Export
                  </Button>
                  {createEnabled && <ButtonGroupSeparator />}
                </>
              )}

              {createEnabled && (
                <Button size="sm">
                  <Plus />
                  Create
                </Button>
              )}
            </ButtonGroup>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex-col gap-4 hidden md:flex">
          {/* tollbar */}
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
              {search && (
                <form className="flex flex-1" onSubmit={handleSearchSubmit}>
                  <InputGroup>
                    <InputGroupInput
                      key={search?.value ?? ""}
                      name="search"
                      type="search"
                      enterKeyHint="search"
                      placeholder={search.placeholder}
                      className="h-8 w-full min-w-0"
                      defaultValue={search?.value ?? ""}
                      ref={searchInputRef}
                    />
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>
                  </InputGroup>
                </form>
              )}

              {dateRange && (
                <Popover
                  open={isDateRangeOpen}
                  onOpenChange={(nextOpen) => {
                    setIsDateRangeOpen(nextOpen)
                    if (nextOpen) {
                      setDraftDateRange(dateRange.value)
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                      <CalendarDays className="size-4" />
                      <span
                        className={cn(
                          "max-w-40 truncate",
                          !dateRange.value?.from && "text-muted-foreground",
                        )}
                      >
                        {dateRangeLabel(dateRange.value, dateRange.placeholder)}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                      selected={draftDateRange}
                      onSelect={setDraftDateRange}
                      autoFocus
                    />
                    <div className="flex justify-end border-t px-3 py-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          dateRange.onChange(draftDateRange)
                          setIsDateRangeOpen(false)
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {facets?.map((facet) => {
                const column = table.getColumn(facet.id)
                const facets = column?.getFacetedUniqueValues()
                const selectedValues = new Set(column?.getFilterValue() as string[])

                return (
                  <Popover key={column?.id}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <FunnelPlus />
                        {facet.title}
                        {selectedValues?.size > 0 && (
                          <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                              variant="secondary"
                              className="rounded-sm px-1 font-normal lg:hidden"
                            >
                              {selectedValues.size}
                            </Badge>
                            <div className="hidden gap-1 lg:flex">
                              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                {selectedValues.size} selected
                              </Badge>
                            </div>
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0" align="start">
                      <Command>
                        <CommandInput placeholder={facet.title} />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {facet.options.map((option) => {
                              const isSelected = selectedValues.has(option.value)
                              // const facetCount = facets?.get(option.value) ?? facets?.get(optionValue)
                              return (
                                <CommandItem
                                  key={option.value}
                                  onSelect={() => {
                                    if (isSelected) {
                                      selectedValues.delete(option.value)
                                    } else {
                                      selectedValues.add(option.value)
                                    }
                                    const filterValues = Array.from(selectedValues)
                                    column?.setFilterValue(
                                      filterValues.length ? filterValues : undefined,
                                    )
                                  }}
                                >
                                  <div
                                    className={cn(
                                      "flex size-4 items-center justify-center rounded-lg border",
                                      isSelected
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input [&_svg]:invisible",
                                    )}
                                  >
                                    <Check className="text-primary-foreground size-3.5" />
                                  </div>
                                  {option.icon && (
                                    <option.icon className="text-muted-foreground size-4" />
                                  )}
                                  <span>{option.label}</span>
                                  {facets?.get(option.value) && (
                                    <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                                      {facets.get(option.value)}
                                    </span>
                                  )}
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                          {selectedValues.size > 0 && (
                            <>
                              <CommandSeparator />
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => column?.setFilterValue(undefined)}
                                  className="justify-center text-center"
                                >
                                  Clear filters
                                </CommandItem>
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )
              })}

              {isFiltered && (
                <Button variant="ghost" size="sm" onClick={onResetFilters}>
                  Reset
                  <X />
                </Button>
              )}
            </div>

            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-8" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  title="Toggle columns"
                  variant="outline"
                  size="sm"
                  className="ml-auto hidden h-8 lg:flex"
                >
                  <Settings2 />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) => typeof column.accessorFn !== "undefined" && column.getCanHide(),
                  )
                  .map((column) => {
                    const labelKey =
                      typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : camelToTitle(column.id)

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {labelKey}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* content */}
          <div className="rounded-lg border">
            <BaseTable>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="whitespace-nowrap"
                      >
                        {header.isPlaceholder ? null : typeof header.column.columnDef.header ===
                            "string" || !header.column.columnDef.header ? (
                          <HeaderCell
                            column={header.column}
                            title={
                              typeof header.column.columnDef.header === "string"
                                ? header.column.columnDef.header
                                : camelToTitle(header.column.id)
                            }
                          />
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 &&
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.column.id === "actions" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="data-[state=open]:bg-muted size-8"
                                >
                                  <MoreHorizontal />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                {viewEnabled && (
                                  <DropdownMenuItem>
                                    <Eye />
                                    Detail
                                  </DropdownMenuItem>
                                )}

                                {editEnabled && (
                                  <DropdownMenuItem>
                                    <PencilLine />
                                    Edit
                                  </DropdownMenuItem>
                                )}

                                {deleteEnabled && (viewEnabled || editEnabled) && (
                                  <DropdownMenuSeparator />
                                )}
                                {deleteEnabled && (
                                  <DropdownMenuItem variant="destructive">
                                    <Trash2 />
                                    Delete
                                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {isLoading &&
                  !isError &&
                  table.getRowModel().rows.length === 0 &&
                  Array.from({ length: Math.max(table.getState().pagination.pageSize, 1) }).map(
                    (_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        {table.getVisibleLeafColumns().map((column, cellIndex) => (
                          <TableCell key={`skeleton-${index}-${column.id}`}>
                            <Skeleton className={getSkeletonClass(cellIndex, column.id)} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ),
                  )}

                {!isLoading && table.getRowModel().rows.length === 0 && !isError && (
                  <TableRow>
                    <TableCell
                      colSpan={Math.max(1, table.getVisibleLeafColumns().length)}
                      className="h-80"
                    >
                      <Empty>
                        <EmptyMedia>{isFiltered ? <FilterX /> : <Inbox />}</EmptyMedia>
                        <EmptyContent>
                          <EmptyHeader>
                            <EmptyTitle>
                              {isFiltered ? "No matches found" : "Nothing here yet"}
                            </EmptyTitle>
                            <EmptyDescription>
                              {isFiltered
                                ? "Try broadening your search or clear filters to see more rows."
                                : "Records will appear here once they are available."}
                            </EmptyDescription>
                          </EmptyHeader>
                        </EmptyContent>
                        {isFiltered && (
                          <Button variant="outline" size="sm" onClick={onResetFilters}>
                            Clear filters
                          </Button>
                        )}
                      </Empty>
                    </TableCell>
                  </TableRow>
                )}

                {isError && (
                  <TableRow>
                    <TableCell
                      colSpan={Math.max(1, table.getVisibleLeafColumns().length)}
                      className="h-80"
                    >
                      <Empty>
                        <EmptyMedia>
                          <AlertTriangle />
                        </EmptyMedia>
                        <EmptyContent>
                          <EmptyHeader>
                            <EmptyTitle>Something went wrong</EmptyTitle>
                            <EmptyDescription>
                              We couldn't load the data. Please try again.
                            </EmptyDescription>
                          </EmptyHeader>
                        </EmptyContent>
                        {onRetry && (
                          <Button variant="outline" size="sm" onClick={onRetry}>
                            Retry
                          </Button>
                        )}
                      </Empty>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </BaseTable>
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center md:space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${pagination.pageSize}`}
                  onValueChange={(value: string) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue placeholder={`${pagination.pageSize}`} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-25 items-center justify-center text-sm font-medium">
                Page {pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* fallback */}
        <div className="flex flex-col gap-4 md:hidden">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full border bg-muted">
                <Monitor className="size-5" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Desktop view required</p>
                <p className="text-muted-foreground text-sm text-balance">
                  This table is optimized for larger screens. Please open this page on a laptop or
                  desktop.
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
