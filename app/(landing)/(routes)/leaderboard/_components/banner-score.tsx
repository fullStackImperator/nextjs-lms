'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@clerk/clerk-react'
import { auth } from '@clerk/nextjs'
import { Camera, Lock, Star, Trophy } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'

type UserScoreBannerProps = {
  userPoints: number
}

export const UserScoreBanner = ({ userPoints }: UserScoreBannerProps) => {
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
      <div className="flex items-center space-x-4 w-full">
        <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-10 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-14 h-14 text-small bg-default text-default-foreground rounded-full ring-2 ring-offset-2 ring-offset-background ring-default">
          <Avatar className="flex object-cover w-full h-full transition-opacity ">
            {/* className="h-5 w-5" */}
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.username}</AvatarFallback>
          </Avatar>

          {/* <Image
            width={240}
            height={240}
            className="inline-block rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="user-avatar"
          /> */}
        </span>
        <div className="space-y-1">
          <p className="text-lg md:text-xl font-semibold">
            {' '}
            {/* {userId} */}
            {user?.username}
          </p>
          <div className="flex items-center gap-x-2 text-xs md:text-sm">
            <Star className="h-4 w-4" />
            <p className="">XP Punkte: {userPoints}</p>
          </div>
          <div className="flex items-center gap-x-2 text-xs md:text-sm">
            <Trophy className="h-4 w-4" />
            <p className="">Level: </p>
          </div>
        </div>
      </div>
    </div>
  )
}
