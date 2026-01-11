import { Download, Plus, Upload } from "lucide-react"

import { usePermission } from "@/lib/auth/permissions"
import { actions, permissions } from "@/lib/constants/permissions"
import { Button } from "@/ui/components/base/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/ui/components/base/button-group"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/base/dialog"
import { Input } from "@/ui/components/base/input"
import { Label } from "@/ui/components/base/label"
import { createDataTable, DataTable } from "@/ui/components/datatable"

import { useUsers } from "../../hooks/use-users"
import { columns, facetedColumnFilters } from "./configs"

const { DataTableProvider, useDataTable } = createDataTable({
  permission: permissions.management.users,
  facetedColumnFilters: facetedColumnFilters,
  searchPlaceholder: "Search users...",
  dateRangePlaceholder: "Date Range",
})

export default function Index() {
  return (
    <DataTableProvider>
      <Page />
    </DataTableProvider>
  )
}

function Page() {
  const { pagination, sorting, columnFilters, search, dateRange } = useDataTable()

  const { isError, isLoading, isFetching, refetch, users, meta } = useUsers({
    pagination,
    sorting,
    columnFilters,
    search: search?.value,
    dateRange: dateRange?.value,
  })
  const can = usePermission()
  const [canImport, canExport, canCreate] = can(permissions.management.users, [
    actions.import,
    actions.export,
    actions.create,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Workspace Users</CardTitle>
        <CardDescription>Review and manage account for your workspace.</CardDescription>
        <CardAction>
          {(canImport || canExport || canCreate) && (
            <ButtonGroup>
              {canImport && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Upload />
                        Import
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Import users</DialogTitle>
                        <DialogDescription>
                          Upload a CSV to add multiple users at once.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-import-file">CSV file</Label>
                          <Input id="user-import-file" type="file" accept=".csv" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-import-notes">Notes</Label>
                          <Input
                            id="user-import-notes"
                            placeholder="Optional label for this import"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button>Import users</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {(canExport || canCreate) && <ButtonGroupSeparator />}
                </>
              )}

              {canExport && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Download />
                        Export
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Export users</DialogTitle>
                        <DialogDescription>
                          Download a CSV export of the current user list.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label htmlFor="export-file-name">File name</Label>
                        <Input id="export-file-name" placeholder="users-export" />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button>Export CSV</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {canCreate && <ButtonGroupSeparator />}
                </>
              )}

              {canCreate && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus />
                      Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create user</DialogTitle>
                      <DialogDescription>
                        Add a new user and assign their primary role.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="user-name">Full name</Label>
                        <Input id="user-name" placeholder="Jane Doe" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input id="user-email" type="email" placeholder="jane@company.com" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="user-role">Role</Label>
                        <Input id="user-role" placeholder="Member" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button>Create user</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </ButtonGroup>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <DataTable
          data={users}
          columns={columns}
          meta={meta}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRetry={refetch}
        />
      </CardContent>
    </Card>
  )
}
