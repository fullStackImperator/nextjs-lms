'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@clerk/clerk-react'
import { auth } from '@clerk/nextjs'
import { Camera, Lock, Star, Trophy } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'

interface UserBadge {
  badge: {
    id: string
    name: string
    imageUrl: string
    createdAt?: Date
    updatedAt?: Date
  }
}

type UserScoreBannerProps = {
  userPoints: number
  userBadges: UserBadge[]
}

export const UserScoreBanner = ({
  userPoints,
  userBadges,
}: UserScoreBannerProps) => {
  // const { userId } = auth()
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return redirect('/')
  }

  return (
    <div className="rounded-xl p-4 border shadow-sm bg-sky-600 text-white">
      <div className="flex items-center  w-full">
        <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-10 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-20 h-20 text-small bg-default text-default-foreground rounded-full ring-2 ring-offset-2 ring-offset-background ring-default">
          <Avatar className="flex object-cover w-full h-full transition-opacity ">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.username}</AvatarFallback>
          </Avatar>
        </span>

        <div className="space-y-1  ml-8 ">
          <p className="text-lg md:text-xl font-semibold">{user?.username}</p>
          <div className="flex items-center gap-x-2 text-xs md:text-sm">
            <Star className="h-4 w-4" />
            <p className="">XP Punkte: {userPoints}</p>
          </div>
          <div className="flex items-center gap-x-2 text-xs md:text-sm">
            <Trophy className="h-4 w-4" />
            <p className="">Level: </p>
          </div>
        </div>

        <div className="flex items-center ml-16">
          {userBadges.map((userBadge) => (
            <div
              key={userBadge.badge.id}
              className="badgeshadow text-center flex flex-col items-center mr-4 transition ease-in-out delay-100 hover:cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-105 rounded-lg p-2 bg-gradient-to-tr from-amber-200 to-yellow-500 border border-red-400 "
            >
              <Avatar className="h-12 w-12 border border-white">
                <AvatarImage
                  src={userBadge.badge.imageUrl}
                  alt={userBadge.badge.name}
                />
                <AvatarFallback>BG</AvatarFallback>
              </Avatar>
              <p className="mt-2 text-sm text-muted-foreground ">
                {userBadge.badge.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
