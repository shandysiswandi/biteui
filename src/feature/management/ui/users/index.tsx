import { usePermission } from "@/lib/hooks/use-permission"
import { actions, permissions } from "@/lib/constants/permissions"
import { Crud, CrudProvider } from "@/ui/components/crud"
import Forbidden from "@/ui/pages/console-forbidden"

import { useUsers } from "../../hooks/use-users"
import type { CreateUserInput, UpdateUserInput, User } from "../../model/user"
import { columns, facets } from "./config"
import { UserForm } from "./user-form"

function Page() {
  const {
    data,
    meta,
    isLoading,
    isError,
    onRetry,
    onRefresh,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canImport,
    canExport,
    onCreate,
    onEdit,
    onDelete,
    onImport,
    onExport,
  } = useUsers()

  return (
    <Crud<User, CreateUserInput, UpdateUserInput>
      title="Management Users"
      description="Review and manage users for your workspace."
      resourceLabel="User"
      data={data}
      columns={columns}
      meta={meta}
      isLoading={isLoading}
      isError={isError}
      onRefresh={onRefresh}
      onRetry={onRetry}
      importEnabled={canImport}
      exportEnabled={canExport}
      onImport={onImport}
      onExport={onExport}
      createEnabled={canCreate}
      viewEnabled={canRead}
      editEnabled={canUpdate}
      deleteEnabled={canDelete}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      renderForm={(props) => (
        <UserForm key={`${props.mode}-${props.data?.id ?? "new"}`} {...props} />
      )}
    />
  )
}

export default function Index() {
  const can = usePermission()
  if (!can(permissions.management.users, actions.read)[0]) return <Forbidden />

  return (
    <CrudProvider
      searchPlaceholder="Searching Users..."
      dateRangePlaceholder="Date Range"
      facets={facets}
    >
      <Page />
    </CrudProvider>
  )
}
