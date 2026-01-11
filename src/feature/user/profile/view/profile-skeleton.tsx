import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Skeleton } from "@/ui/components/base/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Fetching your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-52" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <Skeleton className="h-3 w-36 sm:mt-2 sm:w-40" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <Skeleton className="h-3 w-28 sm:mt-2 sm:w-40" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <Skeleton className="h-3 w-44 sm:mt-2 sm:w-40" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
