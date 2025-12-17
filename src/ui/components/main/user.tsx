import { Bell, LogOut, Settings, User } from "lucide-react"
import { Link } from "react-router"

import { useLogoutMutation } from "@/feature/auth/shared/service/logout"
import { routes } from "@/lib/constants/routes"
import { useAuthStore } from "@/lib/stores/auth-store"
import { getInitials } from "@/lib/utils/user"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/components/base/avatar"
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
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogoutMutation()

  if (!user) {
    return null
  }

  const initials = getInitials(user.full_name)

  const handleLogout = () => {
    if (logoutMutation.isPending) {
      return
    }
    logoutMutation.mutate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 gap-3 px-2 text-left data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback className="rounded-lg">
              {initials || "U"}
            </AvatarFallback>
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
              <AvatarImage src={user.avatar_url} alt={user.full_name} />
              <AvatarFallback className="rounded-lg">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.full_name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={routes.me.profile}>
              <User />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={routes.me.setting}>
              <Settings />
              Setting
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={routes.me.notification}>
              <Bell />
              Notifications
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
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
