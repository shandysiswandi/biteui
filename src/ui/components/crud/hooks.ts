import { createContext, useContext } from "react"

import type { CrudState } from "./types"

type CrudPaginationState = Pick<CrudState, "pagination" | "onPaginationChange">
type CrudSortingState = Pick<CrudState, "sorting" | "onSortingChange">
type CrudFiltersState = Pick<CrudState, "columnFilters" | "onColumnFiltersChange">
type CrudVisibilityState = Pick<CrudState, "columnVisibility" | "onColumnVisibilityChange">
type CrudSearchState = Pick<CrudState, "search">
type CrudDateRangeState = Pick<CrudState, "dateRange">
type CrudMetaState = Pick<CrudState, "isFiltered" | "onResetFilters" | "facets">

export const CrudPaginationContext = createContext<CrudPaginationState | null>(null)
export const CrudSortingContext = createContext<CrudSortingState | null>(null)
export const CrudFiltersContext = createContext<CrudFiltersState | null>(null)
export const CrudVisibilityContext = createContext<CrudVisibilityState | null>(null)
export const CrudSearchContext = createContext<CrudSearchState | null>(null)
export const CrudDateRangeContext = createContext<CrudDateRangeState | null>(null)
export const CrudMetaContext = createContext<CrudMetaState | null>(null)

function useRequiredContext<T>(context: React.Context<T | null>, name: string) {
  const value = useContext(context)
  if (!value) {
    throw new Error(`${name} must be used within a CrudProvider`)
  }
  return value
}

export function useCrudPagination() {
  return useRequiredContext(CrudPaginationContext, "useCrudPagination")
}

export function useCrudSorting() {
  return useRequiredContext(CrudSortingContext, "useCrudSorting")
}

export function useCrudFilters() {
  return useRequiredContext(CrudFiltersContext, "useCrudFilters")
}

export function useCrudVisibility() {
  return useRequiredContext(CrudVisibilityContext, "useCrudVisibility")
}

export function useCrudSearch() {
  return useRequiredContext(CrudSearchContext, "useCrudSearch")
}

export function useCrudDateRange() {
  return useRequiredContext(CrudDateRangeContext, "useCrudDateRange")
}

export function useCrudMeta() {
  return useRequiredContext(CrudMetaContext, "useCrudMeta")
}
