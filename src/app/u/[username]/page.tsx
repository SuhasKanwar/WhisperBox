import { Suspense } from 'react'
import UserProfile from './UserProfile'
import { Skeleton } from "@/components/ui/skeleton"

export default function UserProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile username={params.username} />
      </Suspense>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <Skeleton className="h-4 w-[300px]" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  )
}