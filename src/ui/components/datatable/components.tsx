"use client"

import { useRef, useState, type ComponentProps, type FormEvent } from "react"
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
  Eye,
  EyeOff,
  FilterX,
  FunnelPlus,
  Inbox,
  Monitor,
  MoreHorizontal,
  PencilLine,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useTranslation } from "react-i18next"

import { usePermission } from "@/lib/auth/permissions"
import { actions } from "@/lib/constants/permissions"
import type { Meta } from "@/lib/types/meta"
import { camelToTitle } from "@/lib/utils/case"
import { cn } from "@/lib/utils/tailwind"
import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import { Calendar } from "@/ui/components/base/calendar"
import { Card, CardContent } from "@/ui/components/base/card"
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

import {
  useDataTableContext,
  useOptionalDataTableContext,
  type DataTableState,
  type FacetedOption,
} from "./factory"

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

type HasId = { id: string }

type DataTableRowActionsProps<TData extends HasId> = {
  row: Row<TData>
  permission?: string
}

export function RowActions<TData extends HasId>({
  row,
  permission,
}: DataTableRowActionsProps<TData>) {
  const { t } = useTranslation()
  const dataTableContext = useOptionalDataTableContext()
  const resolvedPermission = permission ?? dataTableContext?.permission
  const can = usePermission()
  const rowId = row.original.id
  const canDetail = resolvedPermission ? can(resolvedPermission, actions.read) : true
  const canEdit = resolvedPermission ? can(resolvedPermission, actions.update) : true
  const canDelete = resolvedPermission ? can(resolvedPermission, actions.delete) : true
  const hasActions = canDetail || canEdit || canDelete

  if (!hasActions) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
          <MoreHorizontal />
          <span className="sr-only">{t("datatable.actions.openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {canDetail && (
          <DropdownMenuItem>
            <Eye />
            {t("datatable.actions.detail", { id: rowId })}
          </DropdownMenuItem>
        )}

        {canEdit && (
          <DropdownMenuItem>
            <PencilLine />
            {t("datatable.actions.edit")}
          </DropdownMenuItem>
        )}

        {canDelete && (canDetail || canEdit) && <DropdownMenuSeparator />}
        {canDelete && (
          <DropdownMenuItem variant="destructive">
            <Trash2 />
            {t("datatable.actions.delete")}
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  meta?: Meta
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
}

export function DataTable<TData, TValue>({
  data,
  columns,
  meta,
  isLoading,
  isError,
  onRetry,
}: DataTableProps<TData, TValue>) {
  "use no memo"

  const state = useDataTableContext()
  const {
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    columnVisibility,
    onColumnVisibilityChange,
  } = state

  // see: https://github.com/TanStack/table/issues/6137
  // eslint-disable-next-line react-hooks/incompatible-library
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
    rowCount: meta?.total ?? data.length,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
  })

  return (
    <>
      <div className="flex-col gap-4 hidden md:flex">
        <Toolbar table={table} state={state} />
        <Content
          table={table}
          state={state}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
        />
        <Pagination table={table} state={state} />
      </div>

      <Fallback />
    </>
  )
}

type ContentProps<TData> = {
  table: Table<TData>
  state: DataTableState
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
}

const skeletonWidths = ["w-20", "w-24", "w-32", "w-40", "w-28", "w-16"]

type HeaderCellProps<TData> = {
  column: Column<TData, unknown>
  title: string
  className?: string
}

function HeaderCell<TData>({ column, title, className }: HeaderCellProps<TData>) {
  "use no memo"
  const { t } = useTranslation()
  const translatedTitle = t(title)

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{translatedTitle}</div>
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span>{translatedTitle}</span>
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
            <span className="sr-only">{t("datatable.sort.open")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            {t("datatable.sort.asc")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            {t("datatable.sort.desc")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            {t("datatable.sort.hide")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const getSkeletonClass = (cellIndex: number, columnId?: string) => {
  if (columnId === "actions") {
    return "size-8 rounded-half"
  }

  return `h-4 ${skeletonWidths[cellIndex % skeletonWidths.length]}`
}

function Content<TData>({ table, state, isLoading, isError, onRetry }: ContentProps<TData>) {
  "use no memo"
  const { t } = useTranslation()

  const { isFiltered, onResetFilters } = state
  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const columnCount = Math.max(1, visibleColumns.length)
  const shouldShowReset = Boolean(isFiltered && onResetFilters)
  const shouldShowSkeleton = isLoading && !isError && rows.length === 0
  const skeletonRowCount = Math.max(table.getState().pagination.pageSize, 1)

  const emptyTitle = isFiltered
    ? t("datatable.empty.filtered.title")
    : t("datatable.empty.default.title")
  const emptyDescription = isFiltered
    ? t("datatable.empty.filtered.description")
    : t("datatable.empty.default.description")
  const EmptyIcon = isFiltered ? FilterX : Inbox

  const errorTitle = t("datatable.error.title")
  const errorDescription = t("datatable.error.description")

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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                    <EmptyMedia>
                      <EmptyIcon />
                    </EmptyMedia>
                    <EmptyContent>
                      <EmptyHeader>
                        <EmptyTitle>{emptyTitle}</EmptyTitle>
                        <EmptyDescription>{emptyDescription}</EmptyDescription>
                      </EmptyHeader>
                    </EmptyContent>
                    {shouldShowReset && (
                      <Button variant="outline" size="sm" onClick={onResetFilters}>
                        {t("datatable.filters.clear")}
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
                        <EmptyTitle>{errorTitle}</EmptyTitle>
                        <EmptyDescription>{errorDescription}</EmptyDescription>
                      </EmptyHeader>
                    </EmptyContent>
                    {onRetry && (
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        {t("datatable.error.retry")}
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
  state: DataTableState
}

function Toolbar<TData>({ table, state }: ToolbarProps<TData>) {
  "use no memo"
  const { t } = useTranslation()

  const { search, dateRange, facetedColumnFilters, isFiltered, onResetFilters } = state
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
      return placeholder ? t(placeholder) : t("datatable.dateRange.placeholder")
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
                placeholder={
                  search.placeholder ? t(search.placeholder) : t("datatable.search.placeholder")
                }
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
                  {t("datatable.dateRange.apply")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {facetedColumnFilters?.map((col) => (
          <FacetedFilter
            key={col.id}
            columnId={col.id}
            title={col.title}
            options={col.options}
            table={table}
          />
        ))}

        {shouldShowReset && (
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            {t("datatable.filters.reset")}
            <X />
          </Button>
        )}
      </div>

      <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-8" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            title={t("datatable.columns.toggle")}
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>{t("datatable.columns.toggle")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
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
                  {t(labelKey)}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

interface FacetedFilterProps<TData> {
  columnId: string
  title: string
  options: FacetedOption[]
  table: Table<TData>
}

const getSelectedValues = (value: unknown) =>
  new Set(
    (Array.isArray(value)
      ? value.map((item) => String(item))
      : value !== undefined && value !== null
        ? [String(value)]
        : []
    ).filter((item) => item.length > 0),
  )

function FacetedFilter<TData>({ columnId, title, options, table }: FacetedFilterProps<TData>) {
  "use no memo"
  const { t } = useTranslation()

  const column = table.getColumn(columnId)
  const facets = column?.getFacetedUniqueValues()
  const filterValue = column?.getFilterValue()
  const selectedValues = getSelectedValues(filterValue)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <FunnelPlus />
          {t(title)}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {t("datatable.filters.selected", { count: selectedValues.size })}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="start">
        <Command>
          <CommandInput placeholder={t(title)} />
          <CommandList>
            <CommandEmpty>{t("datatable.command.empty")}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionValue = String(option.value)
                const isSelected = selectedValues.has(optionValue)
                const facetCount = facets?.get(option.value) ?? facets?.get(optionValue)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (!column) {
                        return
                      }
                      column.setFilterValue((prev: unknown) => {
                        const nextSelectedValues = getSelectedValues(prev)
                        if (nextSelectedValues.has(optionValue)) {
                          nextSelectedValues.delete(optionValue)
                        } else {
                          nextSelectedValues.add(optionValue)
                        }
                        const filterValues = Array.from(nextSelectedValues)
                        return filterValues.length ? filterValues : undefined
                      })
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
                    {option.icon && <option.icon className="text-muted-foreground size-4" />}
                    <span>{t(option.label)}</span>
                    {facetCount ? (
                      <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {facetCount}
                      </span>
                    ) : null}
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
                    {t("datatable.filters.clear")}
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
  state: DataTableState
}

function Pagination<TData>({ table, state }: PaginationProps<TData>) {
  "use no memo"
  const { t } = useTranslation()

  const { pagination, onPaginationChange } = state

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    if (!Number.isFinite(nextPageSize)) {
      return
    }
    onPaginationChange((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: nextPageSize,
    }))
  }
  const pageCount = Math.max(table.getPageCount(), 1)
  const currentPage = pagination.pageIndex + 1
  const lastPageIndex = Math.max(pageCount - 1, 0)
  const goToFirstPage = () => table.setPageIndex(0)
  const goToPreviousPage = () => table.previousPage()
  const goToNextPage = () => table.nextPage()
  const goToLastPage = () => table.setPageIndex(lastPageIndex)

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {t("datatable.pagination.rowsSelected", {
          selected: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("datatable.pagination.rowsPerPage")}</p>
          <Select value={`${pagination.pageSize}`} onValueChange={handlePageSizeChange}>
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
          {t("datatable.pagination.pageOf", {
            current: currentPage,
            total: pageCount,
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={goToFirstPage}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("datatable.pagination.first")}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={goToPreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("datatable.pagination.previous")}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={goToNextPage}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("datatable.pagination.next")}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={goToLastPage}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("datatable.pagination.last")}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Fallback() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 md:hidden">
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border bg-muted">
            <Monitor className="size-5" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">{t("datatable.fallback.title")}</p>
            <p className="text-muted-foreground text-sm">{t("datatable.fallback.description")}</p>
          </div>

          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            {t("datatable.fallback.refresh")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
