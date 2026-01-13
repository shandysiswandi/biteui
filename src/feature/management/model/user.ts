import type { Meta } from "@/lib/types/meta"

export const statusOptions = [
  { value: 1, label: "Unverified" },
  { value: 2, label: "Active" },
  { value: 3, label: "Banned" },
  { value: 4, label: "Deleted" },
]

export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string
  status: number
  updatedAt: Date
}

type Users = { users: User[] }

export type UsersInput = {
  page?: number
  size?: number
  status?: number | number[]
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  dateFrom?: string
  dateTo?: string
}

export type UsersOutput = Users & { meta?: Meta }

export type CreateUserInput = {
  name: string
  email: string
  status: number
  password: string
}

export type UpdateUserInput = {
  id: string
  name?: string
  email?: string
  password?: string
  status?: number
}
