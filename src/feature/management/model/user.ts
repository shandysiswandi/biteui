import type { Meta } from "@/lib/types/meta"

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
