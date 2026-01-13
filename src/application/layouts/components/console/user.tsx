import { Bell, LogOut, Settings, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router"

import { useLogoutMutation } from "@/feature/auth/queries/use-logout-mutation"
import { routes } from "@/lib/constants/routes"
import { useAuthProfile } from "@/lib/hooks/use-auth-profile"
import { getInitials } from "@/lib/utils/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/base/avatar"
import { Button } from "@/ui/components/base/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/components/base/dropdown-menu"

export function NavUser() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthProfile()
  const logoutMutation = useLogoutMutation()

  if (!user) {
    return null
  }

  const initials = getInitials(user.name)

  const handleLogout = () => {
    if (logoutMutation.isPending) {
      return
    }
    logoutMutation.mutate()
    navigate(routes.auth.login, { replace: true })
  }

  const onSelectSettings = () => {
    // Navigate to settings with appearance hash
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: "setting-appearance",
      },
      { replace: true },
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 gap-3 px-2 text-left data-[state=open]:bg-accent data-[state=open]:text-accent-foreground rounded-full"
        >
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="rounded-lg">{initials || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={routes.user.profile}>
              <User />
              {t("console.userMenu.profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onSelectSettings}>
            <Settings />
            {t("console.userMenu.settings")}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={routes.user.notifications}>
              <Bell />
              {t("console.userMenu.notifications")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut />
          {logoutMutation.isPending
            ? t("console.userMenu.loggingOut")
            : t("console.userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
