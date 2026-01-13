import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"

export type CrudSearch = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export type CrudDateRange = {
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

export type CrudState = {
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  columnVisibility: VisibilityState
  onColumnVisibilityChange: OnChangeFn<VisibilityState>

  search?: CrudSearch
  dateRange?: CrudDateRange
  isFiltered: boolean
  onResetFilters: () => void
  facets?: FacetedColumnFilter[]
}
