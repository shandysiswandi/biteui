import type { ColumnFiltersState } from "@tanstack/react-table"

import { usePermission } from "@/lib/hooks/use-permission"
import { actions, permissions } from "@/lib/constants/permissions"
import {
  useCrudDateRange,
  useCrudFilters,
  useCrudMeta,
  useCrudPagination,
  useCrudSearch,
  useCrudSorting,
  useCrudVisibility,
} from "@/ui/components/crud"

import type { CreateUserInput, UpdateUserInput, User } from "../model/user"
import { useCreateUserMutation } from "../queries/use-create-user-mutation"
import { useDeleteUserMutation } from "../queries/use-delete-user-mutation"
import { useUpdateUserMutation } from "../queries/use-update-user-mutation"
import { useUserExportQuery } from "../queries/use-user-export-query"
import { useUserImportMutation } from "../queries/use-user-import-mutation"
import { useUsersQuery } from "../queries/use-users-query"

const sortKeyMap: Record<string, string> = {
  name: "full_name",
  email: "email",
  status: "status",
  lastUpdated: "updated_at",
}

export function useUsers() {
  const can = usePermission()
  const [canImport, canExport, canCreate, canRead, canUpdate, canDelete] = can(
    permissions.management.users,
    actions.import,
    actions.export,
    actions.create,
    actions.read,
    actions.update,
    actions.delete,
  )
  const { pagination, onPaginationChange } = useCrudPagination()
  const { sorting, onSortingChange } = useCrudSorting()
  const { columnFilters, onColumnFiltersChange } = useCrudFilters()
  const { columnVisibility, onColumnVisibilityChange } = useCrudVisibility()
  const { search } = useCrudSearch()
  const { dateRange } = useCrudDateRange()
  const { isFiltered, onResetFilters } = useCrudMeta()

  const facets = [
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Unverified", value: "1" },
        { label: "Active", value: "2" },
        { label: "Banned", value: "3" },
        { label: "Deleted", value: "4" },
      ],
    },
  ]

  const status = normalizeStatusFilter(columnFilters)

  const activeSort = sorting[0]
  const sortBy = activeSort ? (sortKeyMap[activeSort.id] ?? activeSort.id) : undefined
  const sortOrder = activeSort ? (activeSort.desc ? "desc" : "asc") : undefined

  const dateFrom = dateRange?.value?.from ? dateRange?.value.from.toISOString() : undefined
  const dateTo = dateRange?.value?.to ? dateRange?.value.to.toISOString() : undefined

  const createUserMutation = useCreateUserMutation()
  const deleteUserMutation = useDeleteUserMutation()
  const exportQuery = useUserExportQuery(
    {
      status,
      search: search?.value?.trim().length ? search?.value.trim() : undefined,
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
    },
    { enabled: false },
  )
  const importUserMutation = useUserImportMutation()
  const updateUserMutation = useUpdateUserMutation()

  const onCreate = async (data: CreateUserInput) => {
    await createUserMutation.mutateAsync(data)
  }

  const onEdit = async (data: UpdateUserInput) => {
    await updateUserMutation.mutateAsync(data)
  }

  const onDelete = async (data: User) => {
    await deleteUserMutation.mutateAsync(data.id)
  }

  const onExport = async (format: string, fileName?: string) => {
    const { data } = await exportQuery.refetch()
    const users = data ?? []
    const csv = buildUsersCsv(users)
    downloadExport(csv, `${fileName ?? "users"}.${format || "csv"}`)
    return users
  }

  const onImport = async (file: File) => {
    const payload = await parseImportFile(file)
    await importUserMutation.mutateAsync(payload)
  }

  const query = useUsersQuery({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    search: search?.value?.trim().length ? search?.value.trim() : undefined,
    status,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
  })

  return {
    canImport,
    canExport,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canSearch: true,
    canDateRange: true,
    onExport,
    onImport,
    facets,
    data: query.data?.users ?? [],
    meta: {
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      total: query.data?.meta?.total ?? 0,
    },
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
    onRetry: query.refetch,
    onRefresh: query.refetch,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    columnVisibility,
    onColumnVisibilityChange,
    onResetFilters,
    isFiltered,
    search,
    dateRange,
    onDelete,
    onCreate,
    onEdit,
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

const csvHeaders = ["id", "email", "full_name", "avatar_url", "status", "updated_at"]

const escapeCsvValue = (value: string) => {
  if (!/["\n,]/.test(value)) {
    return value
  }
  return `"${value.replace(/"/g, '""')}"`
}

const buildUsersCsv = (users: User[]) => {
  const rows = users.map((user) => [
    user.id,
    user.email,
    user.name,
    user.avatarUrl,
    String(user.status),
    user.updatedAt.toISOString(),
  ])
  const lines = [csvHeaders.join(","), ...rows.map((row) => row.map(escapeCsvValue).join(","))]
  return `${lines.join("\n")}\n`
}

const downloadExport = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}

const parseImportFile = async (file: File) => {
  if (file.name.toLowerCase().endsWith(".csv")) {
    const text = await file.text()
    return parseCsvImport(text)
  }

  const text = await file.text()
  return JSON.parse(text) as Array<{
    email: string
    password?: string
    full_name?: string
    status?: number
  }>
}

const parseCsvImport = (text: string) => {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (rows.length <= 1) {
    return []
  }

  const parseRow = (row: string) => {
    const values: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < row.length; i += 1) {
      const char = row[i]
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"'
          i += 1
        } else {
          inQuotes = !inQuotes
        }
        continue
      }
      if (char === "," && !inQuotes) {
        values.push(current)
        current = ""
        continue
      }
      current += char
    }
    values.push(current)
    return values.map((value) => value.trim())
  }

  const header = parseRow(rows[0]).map((value) => value.toLowerCase())
  const getIndex = (name: string) => header.indexOf(name)
  const emailIndex = getIndex("email")
  if (emailIndex < 0) {
    throw new Error("Import CSV must include an email column.")
  }

  const passwordIndex = getIndex("password")
  const nameIndex = getIndex("full_name")
  const statusIndex = getIndex("status")

  return rows.slice(1).map((row) => {
    const values = parseRow(row)
    const statusRaw = statusIndex >= 0 ? values[statusIndex] : ""
    const statusValue = statusRaw ? Number(statusRaw) : undefined
    return {
      email: values[emailIndex],
      password: passwordIndex >= 0 ? values[passwordIndex] || undefined : undefined,
      full_name: nameIndex >= 0 ? values[nameIndex] || undefined : undefined,
      status: Number.isFinite(statusValue) ? statusValue : undefined,
    }
  })
}
