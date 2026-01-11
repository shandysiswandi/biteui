import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"

import { useUsersQuery } from "../queries/use-users-query"

const sortKeyMap: Record<string, string> = {
  name: "full_name",
  email: "email",
  status: "status",
  lastUpdated: "updated_at",
}

type UsersState = {
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
  search?: string
  dateRange?: DateRange
}

export function useUsers({ pagination, sorting, columnFilters, search, dateRange }: UsersState) {
  const status = normalizeStatusFilter(columnFilters)

  const activeSort = sorting[0]
  const sortBy = activeSort ? (sortKeyMap[activeSort.id] ?? activeSort.id) : undefined
  const sortOrder = activeSort ? (activeSort.desc ? "desc" : "asc") : undefined

  const dateFrom = dateRange?.from ? dateRange.from.toISOString() : undefined
  const dateTo = dateRange?.to ? dateRange.to.toISOString() : undefined

  const query = useUsersQuery({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    search: search?.trim().length ? search.trim() : undefined,
    status,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
  })

  return {
    ...query,
    users: query.data?.users ?? [],
    meta: query.data?.meta,
  }
}

const normalizeStatusFilter = (columns: ColumnFiltersState) => {
  const statusFilter = columns.find((filter) => filter.id === "status")
  if (statusFilter?.value == null) {
    return undefined
  }

  const values = (Array.isArray(statusFilter?.value) ? statusFilter?.value : [statusFilter?.value])
    ?.map((item) => (typeof item === "number" ? item : Number(item)))
    .filter((item) => Number.isFinite(item))

  return values.length > 0 ? values : undefined
}
