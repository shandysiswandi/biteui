import { usePermission } from "@/lib/hooks/use-permission"
import { actions, permissions } from "@/lib/constants/permissions"
import Forbidden from "@/ui/pages/console-forbidden"

function Page() {
  return <>IAM</>
}

export default function Index() {
  const can = usePermission()
  if (!can(permissions.management.iam, actions.read)[0]) return <Forbidden />

  return <Page />
}
