import { useState, type ReactNode } from "react"
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"

import {
  CrudDateRangeContext,
  CrudFiltersContext,
  CrudMetaContext,
  CrudPaginationContext,
  CrudSearchContext,
  CrudSortingContext,
  CrudVisibilityContext,
} from "./hooks"
import type { CrudState, FacetedColumnFilter } from "./types"

type CrudProviderOptions = {
  facets?: FacetedColumnFilter[]
  searchPlaceholder?: string
  dateRangePlaceholder?: string
}

export function CrudProvider({
  children,
  facets,
  searchPlaceholder,
  dateRangePlaceholder,
}: { children: ReactNode } & CrudProviderOptions) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [searchValue, setSearchValue] = useState("")
  const [dateRangeValue, setDateRangeValue] = useState<DateRange | undefined>(undefined)

  const resetPageIndex = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const onSortingChange: CrudState["onSortingChange"] = (updater) => {
    setSorting(updater)
    resetPageIndex()
  }

  const onColumnFiltersChange: CrudState["onColumnFiltersChange"] = (updater) => {
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

  const search = searchPlaceholder
    ? {
        value: searchValue,
        onChange: onSearchChange,
        placeholder: searchPlaceholder,
      }
    : undefined

  const dateRange = dateRangePlaceholder
    ? {
        value: dateRangeValue,
        onChange: onDateRangeChange,
        placeholder: dateRangePlaceholder,
      }
    : undefined

  const paginationValue = {
    pagination,
    onPaginationChange: setPagination,
  }
  const sortingValue = { sorting, onSortingChange }
  const filtersValue = { columnFilters, onColumnFiltersChange }
  const visibilityValue = {
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
  }
  const searchContextValue = { search }
  const dateRangeContextValue = { dateRange }
  const metaValue = { isFiltered, onResetFilters, facets }

  return (
    <CrudPaginationContext.Provider value={paginationValue}>
      <CrudSortingContext.Provider value={sortingValue}>
        <CrudFiltersContext.Provider value={filtersValue}>
          <CrudVisibilityContext.Provider value={visibilityValue}>
            <CrudSearchContext.Provider value={searchContextValue}>
              <CrudDateRangeContext.Provider value={dateRangeContextValue}>
                <CrudMetaContext.Provider value={metaValue}>{children}</CrudMetaContext.Provider>
              </CrudDateRangeContext.Provider>
            </CrudSearchContext.Provider>
          </CrudVisibilityContext.Provider>
        </CrudFiltersContext.Provider>
      </CrudSortingContext.Provider>
    </CrudPaginationContext.Provider>
  )
}
