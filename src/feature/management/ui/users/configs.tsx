"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { getInitials } from "@/lib/utils/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/base/avatar"
import { Badge } from "@/ui/components/base/badge"
import { CellDate, CellText, RowActions, type FacetedColumnFilter } from "@/ui/components/datatable"

import type { User } from "../../model/user"

type StatusBadge = {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
}

const statusBadges: Record<number, StatusBadge> = {
  0: { label: "Unknown", variant: "outline" },
  1: { label: "Unverified", variant: "secondary" },
  2: { label: "Active", variant: "default" },
  3: { label: "Banned", variant: "destructive" },
  4: { label: "Deleted", variant: "destructive" },
}

export const facetedColumnFilters: FacetedColumnFilter[] = [
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      const initials = getInitials(user.name)

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8 shrink-0 rounded-full">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="rounded-full">{initials || "U"}</AvatarFallback>
          </Avatar>

          <CellText text={row.original.name} />
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <CellText text={row.original.email} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const badge = statusBadges[row.original.status] ?? {
        label: "Unknown",
        variant: "outline",
      }

      return <Badge variant={badge.variant}>{badge.label}</Badge>
    },
  },
  {
    accessorKey: "updatedAt",
    id: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => <CellDate date={row.original.updatedAt} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
    meta: {
      sticky: "right",
    },
  },
]
