"use client"

import { useId, useRef, useState, type ComponentProps, type FormEvent, type ReactNode } from "react"
import type { Column, ColumnDef, Row, Table } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
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
  RefreshCw,
  Search,
  Settings2,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useDropzone } from "react-dropzone"

import type { Meta } from "@/lib/types/meta"
import { camelToTitle } from "@/lib/utils/case"
import { cn } from "@/lib/utils/tailwind"
import { Badge } from "@/ui/components/base/badge"
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/base/dialog"
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
import { Input } from "@/ui/components/base/input"
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

import {
  useCrudDateRange,
  useCrudFilters,
  useCrudMeta,
  useCrudPagination,
  useCrudSearch,
  useCrudSorting,
  useCrudVisibility,
} from "./hooks"
import type { FacetedOption } from "./types"

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

type FormMode = "create" | "edit" | "view"

type CrudFormRenderProps<TData, TCreate, TUpdate> = {
  mode: FormMode
  data?: TData
  onSubmit: (data: TCreate | TUpdate) => void
  onCancel: () => void
  isSubmitting: boolean
  formId: string
}

type CrudProps<TData, TValue, TCreate = TData, TUpdate = TData> = {
  title?: string
  description?: string
  resourceLabel?: string
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  meta?: Meta
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  onRefresh?: () => void
  headerActions?: ReactNode
  toolbarActions?: ReactNode

  createEnabled?: boolean
  viewEnabled?: boolean
  editEnabled?: boolean
  deleteEnabled?: boolean
  importEnabled?: boolean
  exportEnabled?: boolean
  onImport?: (file: File) => Promise<void>
  onExport?: (format: string, fileName?: string) => Promise<unknown>
  onCreate?: (data: TCreate) => Promise<void>
  onEdit?: (data: TUpdate) => Promise<void>
  onDelete?: (data: TData) => Promise<void>
  // renderForm should include a <form id={formId} onSubmit={...}> wrapper if using the default footer.
  renderForm?: (props: CrudFormRenderProps<TData, TCreate, TUpdate>) => ReactNode
  formFooter?: "default" | "none"
  renderRowActions?: (row: Row<TData>) => ReactNode
}

type RowActionsProps<TData> = {
  row: Row<TData>
  viewEnabled?: boolean
  editEnabled?: boolean
  deleteEnabled?: boolean
  onView?: (data: TData) => void
  onEdit?: (data: TData) => void
  onDelete?: (data: TData) => void
}

const skeletonWidths = ["w-20", "w-24", "w-32", "w-40", "w-28", "w-16"]

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

type HeaderCellProps<TData> = {
  column: Column<TData, unknown>
  title: string
  className?: string
}

const getSkeletonClass = (cellIndex: number, columnId?: string) => {
  if (columnId === "actions") {
    return "size-8 rounded-half"
  }

  return `h-4 ${skeletonWidths[cellIndex % skeletonWidths.length]}`
}

function RowActions<TData>({
  row,
  viewEnabled,
  editEnabled,
  deleteEnabled,
  onView,
  onEdit,
  onDelete,
}: RowActionsProps<TData>) {
  const rowData = row.original
  const hasActions = viewEnabled || editEnabled || deleteEnabled

  if (!hasActions) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {viewEnabled && (
          <DropdownMenuItem onSelect={() => onView?.(rowData)}>
            <Eye />
            Detail
          </DropdownMenuItem>
        )}

        {editEnabled && (
          <DropdownMenuItem onSelect={() => onEdit?.(rowData)}>
            <PencilLine />
            Edit
          </DropdownMenuItem>
        )}

        {deleteEnabled && (viewEnabled || editEnabled) && <DropdownMenuSeparator />}
        {deleteEnabled && (
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(rowData)}>
            <Trash2 />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type ContentProps<TData> = {
  table: Table<TData>
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  onView?: (data: TData) => void
  onEdit?: (data: TData) => void
  onDelete?: (data: TData) => void
  viewEnabled?: boolean
  editEnabled?: boolean
  deleteEnabled?: boolean
  renderRowActions?: (row: Row<TData>) => ReactNode
}

function Content<TData>({
  table,
  isLoading,
  isError,
  onRetry,
  onView,
  onEdit,
  onDelete,
  viewEnabled,
  editEnabled,
  deleteEnabled,
  renderRowActions,
}: ContentProps<TData>) {
  "use no memo"

  const { isFiltered, onResetFilters } = useCrudMeta()
  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const columnCount = Math.max(1, visibleColumns.length)
  const shouldShowReset = Boolean(isFiltered && onResetFilters)
  const shouldShowSkeleton = isLoading && !isError && rows.length === 0
  const skeletonRowCount = Math.max(table.getState().pagination.pageSize, 1)

  const emptyTitle = isFiltered ? "No matches found" : "Nothing here yet"
  const emptyDescription = isFiltered
    ? "Try broadening your search or clear filters to see more rows."
    : "Records will appear here once they are available."

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border">
        <BaseTable>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
            {rows.length > 0 &&
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "actions" ? (
                        renderRowActions ? (
                          renderRowActions(row)
                        ) : (
                          <RowActions
                            row={row}
                            viewEnabled={viewEnabled}
                            editEnabled={editEnabled}
                            deleteEnabled={deleteEnabled}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        )
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {shouldShowSkeleton &&
              Array.from({ length: skeletonRowCount }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {visibleColumns.map((column, cellIndex) => (
                    <TableCell key={`skeleton-${index}-${column.id}`}>
                      <Skeleton className={getSkeletonClass(cellIndex, column.id)} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && rows.length === 0 && !isError && (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-80">
                  <Empty>
                    <EmptyMedia>{isFiltered ? <FilterX /> : <Inbox />}</EmptyMedia>
                    <EmptyContent>
                      <EmptyHeader>
                        <EmptyTitle>{emptyTitle}</EmptyTitle>
                        <EmptyDescription>{emptyDescription}</EmptyDescription>
                      </EmptyHeader>
                    </EmptyContent>
                    {shouldShowReset && (
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
                <TableCell colSpan={columnCount} className="h-80">
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
    </div>
  )
}

type ToolbarProps<TData> = {
  table: Table<TData>
  toolbarActions?: ReactNode
  onRefresh?: () => void
}

function Toolbar<TData>({ table, toolbarActions, onRefresh }: ToolbarProps<TData>) {
  "use no memo"
  const { search } = useCrudSearch()
  const { dateRange } = useCrudDateRange()
  const { isFiltered, onResetFilters, facets: facetedColumnFilters } = useCrudMeta()
  const shouldShowReset = Boolean(isFiltered && onResetFilters)
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
      return placeholder ?? "Select date range"
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
                placeholder={search.placeholder ?? "Search"}
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
                <span className="max-w-40 truncate">
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

        {facetedColumnFilters?.map((facet) => {
          const column = table.getColumn(facet.id)
          const facets = column?.getFacetedUniqueValues()
          const selectedValues = new Set(column?.getFilterValue() as string[])

          return (
            <FacetFilter
              key={column?.id}
              columnId={facet.id}
              title={facet.title}
              options={facet.options}
              facets={facets}
              selectedValues={selectedValues}
              onSelect={(value) => {
                if (selectedValues.has(value)) {
                  selectedValues.delete(value)
                } else {
                  selectedValues.add(value)
                }
                const filterValues = Array.from(selectedValues)
                column?.setFilterValue(filterValues.length ? filterValues : undefined)
              }}
              onClear={() => column?.setFilterValue(undefined)}
            />
          )
        })}

        {shouldShowReset && (
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Reset
            <X />
          </Button>
        )}
      </div>

      <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-8" />

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            title="Refresh"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onRefresh}
          >
            <span className="sr-only">Refresh</span>
            <RefreshCw />
          </Button>
        )}

        {toolbarActions}
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
              .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
              .map((column) => {
                const label =
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
                    {label}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

type FacetFilterProps = {
  columnId: string
  title: string
  options: FacetedOption[]
  facets?: Map<unknown, number>
  selectedValues: Set<string>
  onSelect: (value: string) => void
  onClear: () => void
}

function FacetFilter({
  columnId,
  title,
  options,
  facets,
  selectedValues,
  onSelect,
  onClear,
}: FacetFilterProps) {
  "use no memo"
  return (
    <Popover key={columnId}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <FunnelPlus />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
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
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem key={option.value} onSelect={() => onSelect(option.value)}>
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
                    {option.icon && <option.icon className="text-muted-foreground size-4" />}
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
                  <CommandItem onSelect={onClear} className="justify-center text-center">
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
}

type PaginationProps<TData> = {
  table: Table<TData>
}

function Pagination<TData>({ table }: PaginationProps<TData>) {
  "use no memo"
  const { pagination } = useCrudPagination()
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center md:space-x-2 lg:space-x-4">
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
        <div className="flex w-28 items-center justify-center text-sm font-medium">
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
  )
}

function Fallback() {
  return (
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
  )
}

export function Crud<
  TData extends { id: string | number },
  TCreate = TData,
  TUpdate = TData,
  TValue = unknown,
>({
  title,
  description,
  resourceLabel,
  data,
  columns,
  meta,
  isLoading,
  isError,
  onRetry,
  onRefresh,
  headerActions,
  toolbarActions,
  createEnabled,
  viewEnabled,
  editEnabled,
  deleteEnabled,
  importEnabled,
  exportEnabled,
  onImport,
  onExport,
  onCreate,
  onEdit,
  onDelete,
  renderForm,
  formFooter = "default",
  renderRowActions,
}: CrudProps<TData, TValue, TCreate, TUpdate>) {
  "use no memo"

  const { pagination, onPaginationChange } = useCrudPagination()
  const { sorting, onSortingChange } = useCrudSorting()
  const { columnFilters, onColumnFiltersChange } = useCrudFilters()
  const { columnVisibility, onColumnVisibilityChange } = useCrudVisibility()

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<TData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>("create")
  const [formTarget, setFormTarget] = useState<TData | null>(null)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importFiles, setImportFiles] = useState<File[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportFileName, setExportFileName] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const formId = useId()
  const importInputId = `crud-import-${formId}`
  const exportFileNameId = `crud-export-filename-${formId}`

  const showCreate = Boolean(createEnabled && renderForm && onCreate)
  const showImport = Boolean(importEnabled && onImport)
  const showExport = Boolean(exportEnabled && onExport)
  const canView = Boolean(viewEnabled && renderForm)
  const canEdit = Boolean(editEnabled && renderForm && onEdit)
  const canDelete = Boolean(deleteEnabled && onDelete)
  const hasHeaderActions = Boolean(headerActions || showCreate || showImport || showExport)

  const handleFormOpen = (mode: FormMode, target?: TData) => {
    setFormMode(mode)
    setFormTarget(target ?? null)
    setIsFormOpen(true)
    setFormError(null)
  }

  const handleFormClose = () => {
    if (isFormSubmitting) {
      return
    }
    setIsFormOpen(false)
    setFormTarget(null)
    setFormError(null)
  }

  const handleFormSubmit = async (formData: TCreate | TUpdate) => {
    if (formMode === "view") {
      handleFormClose()
      return
    }
    setIsFormSubmitting(true)
    setFormError(null)
    try {
      if (formMode === "create") {
        if (!onCreate) {
          return
        }
        await onCreate(formData as TCreate)
      } else {
        if (!onEdit) {
          return
        }
        await onEdit(formData as TUpdate)
      }
      setIsFormOpen(false)
      setFormTarget(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong."
      setFormError(message)
    } finally {
      setIsFormSubmitting(false)
    }
  }

  const handleDeleteOpen = (target: TData) => {
    setDeleteTarget(target)
    setIsDeleteOpen(true)
    setDeleteError(null)
  }

  const handleDeleteClose = () => {
    if (isDeleting) {
      return
    }
    setIsDeleteOpen(false)
    setDeleteTarget(null)
    setDeleteError(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !onDelete) {
      return
    }
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await onDelete(deleteTarget)
      setIsDeleteOpen(false)
      setDeleteTarget(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed. Please try again."
      setDeleteError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const resolvedResourceLabel = resourceLabel?.trim() || title?.trim() || "item"

  const getDefaultExportName = () => {
    const base = resolvedResourceLabel.replace(/\s+/g, "-")
    const timestamp = dayjs().format("YYYYMMDD_HHmmss")
    return `${base}_${timestamp}`
  }

  const handleImportOpenChange = (open: boolean) => {
    setIsImportOpen(open)
    if (!open) {
      setImportFiles([])
      setImportError(null)
      setIsImporting(false)
    }
  }

  const handleExportOpenChange = (open: boolean) => {
    setIsExportOpen(open)
    if (!open) {
      setExportError(null)
      setIsExporting(false)
    } else {
      setExportFileName(getDefaultExportName())
    }
  }

  const handleImportSubmit = async () => {
    const file = importFiles[0]
    if (!file || !onImport) {
      return
    }
    setIsImporting(true)
    setImportError(null)
    try {
      await onImport(file)
      setImportFiles([])
      setIsImportOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed. Please try again."
      setImportError(message)
    } finally {
      setIsImporting(false)
    }
  }

  const handleExportSubmit = async () => {
    if (!onExport) {
      return
    }
    setIsExporting(true)
    setExportError(null)
    try {
      const defaultName = getDefaultExportName()
      const rawName = exportFileName.trim() || defaultName
      const fileName = rawName.replace(/\.(csv|xlsx)$/i, "")
      await onExport(exportFormat, fileName)
      setIsExportOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed. Please try again."
      setExportError(message)
    } finally {
      setIsExporting(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    multiple: false,
    onDrop: (files) => {
      setImportFiles(files)
      setImportError(null)
    },
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableMultiSort: false,
    rowCount: meta?.total ?? data.length,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
  })

  const formTitle =
    formMode === "create"
      ? `Create ${resolvedResourceLabel}`
      : formMode === "edit"
        ? `Edit ${resolvedResourceLabel}`
        : `View ${resolvedResourceLabel}`
  const formDescription =
    formMode === "create"
      ? `Fill in the details to create ${resolvedResourceLabel}.`
      : formMode === "edit"
        ? `Update the details for this ${resolvedResourceLabel}.`
        : `Review the details for this ${resolvedResourceLabel}.`

  return (
    <Card>
      {(title || description || hasHeaderActions) && (
        <CardHeader>
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {hasHeaderActions && (
            <CardAction className="hidden md:flex">
              <ButtonGroup>
                {headerActions}
                {headerActions && (showImport || showExport || showCreate) && (
                  <ButtonGroupSeparator />
                )}
                {showImport && (
                  <>
                    <Dialog open={isImportOpen} onOpenChange={handleImportOpenChange}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Upload />
                          Import
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Import {resolvedResourceLabel}</DialogTitle>
                          <DialogDescription>
                            Upload a CSV or XLSX file to add or update records.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                          <div
                            {...getRootProps()}
                            className={cn(
                              "border-muted-foreground/30 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4 text-center transition",
                              isDragActive ? "border-primary bg-primary/5" : "bg-muted/30",
                            )}
                          >
                            <input
                              {...getInputProps({
                                className: "sr-only",
                                id: importInputId,
                                name: importInputId,
                              })}
                            />
                            <Upload className="text-muted-foreground size-5" />
                            <span className="text-sm font-medium">
                              {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              or click to browse
                            </span>
                          </div>
                          {importFiles.length > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Selected:</span>{" "}
                              {importFiles[0]?.name}
                            </div>
                          )}
                          {importError && (
                            <div className="text-destructive text-sm">{importError}</div>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" disabled={isImporting}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            type="button"
                            onClick={handleImportSubmit}
                            disabled={!importFiles[0] || isImporting}
                          >
                            {isImporting ? "Importing..." : "Import"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {(showExport || showCreate) && <ButtonGroupSeparator />}
                  </>
                )}
                {showExport && (
                  <>
                    <Dialog open={isExportOpen} onOpenChange={handleExportOpenChange}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Download />
                          Export
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Export {resolvedResourceLabel}</DialogTitle>
                          <DialogDescription>
                            Choose a format and download the current dataset.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                          <div className="grid gap-1">
                            <span className="text-sm font-medium">File name</span>
                            <Input
                              id={exportFileNameId}
                              name={exportFileNameId}
                              value={exportFileName}
                              onChange={(event) => setExportFileName(event.target.value)}
                              placeholder={getDefaultExportName()}
                            />
                          </div>
                          <Select value={exportFormat} onValueChange={setExportFormat}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="xlsx">XLSX</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-muted-foreground text-xs">
                            Export includes the current filters and sorting.
                          </p>
                          {exportError && (
                            <div className="text-destructive text-sm">{exportError}</div>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" disabled={isExporting}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="button" onClick={handleExportSubmit} disabled={isExporting}>
                            {isExporting ? "Exporting..." : "Export"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {showCreate && <ButtonGroupSeparator />}
                  </>
                )}
                {showCreate && (
                  <Button size="sm" onClick={() => handleFormOpen("create")}>
                    <Plus />
                    Create
                  </Button>
                )}
              </ButtonGroup>
            </CardAction>
          )}
        </CardHeader>
      )}

      <CardContent>
        <div className="hidden flex-col gap-4 md:flex">
          <Toolbar table={table} toolbarActions={toolbarActions} onRefresh={onRefresh} />
          <Content
            table={table}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            viewEnabled={canView}
            editEnabled={canEdit}
            deleteEnabled={canDelete}
            onView={(rowData) => handleFormOpen("view", rowData)}
            onEdit={(rowData) => handleFormOpen("edit", rowData)}
            onDelete={(rowData) => handleDeleteOpen(rowData)}
            renderRowActions={renderRowActions}
          />
          <Pagination table={table} />
        </div>

        <Fallback />
        <Dialog open={isFormOpen} onOpenChange={(open) => (!open ? handleFormClose() : null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{formTitle}</DialogTitle>
              <DialogDescription>{formDescription}</DialogDescription>
            </DialogHeader>
            {renderForm?.({
              mode: formMode,
              data: formTarget ?? undefined,
              onSubmit: handleFormSubmit,
              onCancel: handleFormClose,
              isSubmitting: isFormSubmitting,
              formId: `crud-form-${formId}-${formMode}`,
            })}
            {formError && <div className="text-destructive text-sm">{formError}</div>}
            {renderForm && formFooter === "default" && (
              <DialogFooter>
                <Button variant="outline" onClick={handleFormClose} disabled={isFormSubmitting}>
                  {formMode === "view" ? "Close" : "Cancel"}
                </Button>
                {formMode !== "view" && (
                  <Button
                    type="submit"
                    form={`crud-form-${formId}-${formMode}`}
                    disabled={isFormSubmitting}
                  >
                    {isFormSubmitting ? "Saving..." : formMode === "create" ? "Create" : "Save"}
                  </Button>
                )}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteOpen} onOpenChange={(open) => (!open ? handleDeleteClose() : null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete {resolvedResourceLabel}</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deleteTarget?.id && (
              <div className="text-muted-foreground text-sm">Selected ID: {deleteTarget.id}</div>
            )}
            {deleteError && <div className="text-destructive text-sm">{deleteError}</div>}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                type="button"
                onClick={handleDeleteConfirm}
                disabled={!deleteTarget || !onDelete || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
