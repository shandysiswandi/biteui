import { useAuthStore } from "@/lib/stores/auth-store"

// import { ChangePasswordCard } from "./change-password-card"
import { ProfileCard } from "./profile-card"
import { ProfileSkeleton } from "./profile-skeleton"

export default function Page() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <ProfileSkeleton />
  }

  return (
    <div className="space-y-6">
      <ProfileCard user={user} />
      {/* <ChangePasswordCard /> */}
    </div>
  )
}
