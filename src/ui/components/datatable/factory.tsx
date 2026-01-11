import { createContext, useContext, useState, type ReactNode } from "react"
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"

type DataTableSearch = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type DataTableDateRange = {
  value?: DateRange
  onChange: (value: DateRange | undefined) => void
  placeholder?: string
}

export type FacetedColumnFilter = {
  id: string
  title: string
  options: FacetedOption[]
}

export type FacetedOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export type DataTableState = {
  // internal @tanstack/react-table
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  columnVisibility: VisibilityState
  onColumnVisibilityChange: OnChangeFn<VisibilityState>

  // custom
  search?: DataTableSearch
  dateRange?: DataTableDateRange
  isFiltered: boolean
  onResetFilters: () => void
  permission?: string
  facetedColumnFilters?: FacetedColumnFilter[]
}

type CreateDataTableOptions = {
  permission?: string
  facetedColumnFilters?: FacetedColumnFilter[]
  searchPlaceholder?: string
  dateRangePlaceholder?: string
}

const DataTableStateContext = createContext<DataTableState | null>(null)

export function createDataTable(opt: CreateDataTableOptions) {
  const DataTableProvider = ({ children }: { children: ReactNode }) => {
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
    const search = opt.searchPlaceholder
      ? {
          value: searchValue,
          onChange: onSearchChange,
          placeholder: opt.searchPlaceholder,
        }
      : undefined
    const dateRange = opt.dateRangePlaceholder
      ? {
          value: dateRangeValue,
          onChange: onDateRangeChange,
          placeholder: opt.dateRangePlaceholder,
        }
      : undefined

    const value: DataTableState = {
      pagination,
      onPaginationChange: setPagination,
      sorting,
      onSortingChange,
      columnFilters,
      onColumnFiltersChange,
      columnVisibility,
      onColumnVisibilityChange: setColumnVisibility,
      search,
      dateRange,
      isFiltered,
      onResetFilters,
      permission: opt.permission,
      facetedColumnFilters: opt.facetedColumnFilters,
    }

    return <DataTableStateContext.Provider value={value}>{children}</DataTableStateContext.Provider>
  }

  const useDataTable = () => {
    const context = useOptionalDataTableContext()
    if (!context) {
      throw new Error("useDataTable must be used within a DataTableProvider")
    }
    return context
  }

  return { DataTableProvider, useDataTable }
}

export function useOptionalDataTableContext() {
  return useContext(DataTableStateContext)
}

export function useDataTableContext() {
  const context = useOptionalDataTableContext()
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider")
  }
  return context
}
