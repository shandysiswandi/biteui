import { usePermission } from "@/lib/auth/permissions"
import { actions, permissions } from "@/lib/constants/permissions"
import { MasterData } from "@/ui/components/masterdata"

export default function Page() {
  const can = usePermission()
  const [canImport, canExport, canCreate, canDetail, canUpdate, canDelete] = can(
    permissions.management.users,
    [actions.import, actions.export, actions.create, actions.read, actions.update, actions.delete],
  )

  return (
    <MasterData
      title="Workspace IAM"
      description="Review and manage Policies for your workspace."
      columns={[
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "email",
          header: "Email",
        },
        {
          accessorKey: "status",
          header: "Status",
        },
        {
          id: "lastUpdated",
          accessorKey: "updatedAt",
          header: "Last Updated",
        },
        {
          id: "actions", // if id === "actions" automatically render detail, edit, delete buttons
        },
      ]}
      facets={[
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
      ]}
      data={[]}
      total={10}
      isLoading={false}
      isError={false}
      onRetry={() => {}}
      //
      searchEnabled={true}
      dateRangeEnabled={true}
      importEnabled={canImport}
      exportEnabled={canExport}
      createEnabled={canCreate}
      viewEnabled={canDetail}
      editEnabled={canUpdate}
      deleteEnabled={canDelete}
    />
  )
}
