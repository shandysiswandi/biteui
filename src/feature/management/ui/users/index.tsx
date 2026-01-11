import { Download, Plus, Upload } from "lucide-react"
import { useTranslation } from "react-i18next"

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
  searchPlaceholder: "management.users.searchPlaceholder",
  dateRangePlaceholder: "management.users.dateRangePlaceholder",
})

export default function Index() {
  return (
    <DataTableProvider>
      <Page />
    </DataTableProvider>
  )
}

function Page() {
  const { t } = useTranslation()
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
        <CardTitle className="text-xl">{t("management.users.title")}</CardTitle>
        <CardDescription>{t("management.users.description")}</CardDescription>
        <CardAction>
          {(canImport || canExport || canCreate) && (
            <ButtonGroup>
              {canImport && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Upload />
                        {t("management.users.actions.import")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{t("management.users.import.title")}</DialogTitle>
                        <DialogDescription>
                          {t("management.users.import.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-import-file">
                            {t("management.users.import.csvLabel")}
                          </Label>
                          <Input id="user-import-file" type="file" accept=".csv" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-import-notes">
                            {t("management.users.import.notesLabel")}
                          </Label>
                          <Input
                            id="user-import-notes"
                            placeholder={t("management.users.import.notesPlaceholder")}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost">{t("management.users.actions.cancel")}</Button>
                        </DialogClose>
                        <Button>{t("management.users.import.submit")}</Button>
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
                        {t("management.users.actions.export")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t("management.users.export.title")}</DialogTitle>
                        <DialogDescription>
                          {t("management.users.export.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label htmlFor="export-file-name">
                          {t("management.users.export.fileNameLabel")}
                        </Label>
                        <Input
                          id="export-file-name"
                          placeholder={t("management.users.export.fileNamePlaceholder")}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost">{t("management.users.actions.cancel")}</Button>
                        </DialogClose>
                        <Button>{t("management.users.export.submit")}</Button>
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
                      {t("management.users.actions.create")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{t("management.users.create.title")}</DialogTitle>
                      <DialogDescription>
                        {t("management.users.create.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="user-name">
                          {t("management.users.create.fullNameLabel")}
                        </Label>
                        <Input
                          id="user-name"
                          placeholder={t("management.users.create.fullNamePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="user-email">
                          {t("management.users.create.emailLabel")}
                        </Label>
                        <Input
                          id="user-email"
                          type="email"
                          placeholder={t("management.users.create.emailPlaceholder")}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="user-role">{t("management.users.create.roleLabel")}</Label>
                        <Input
                          id="user-role"
                          placeholder={t("management.users.create.rolePlaceholder")}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">{t("management.users.actions.cancel")}</Button>
                      </DialogClose>
                      <Button>{t("management.users.create.submit")}</Button>
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
