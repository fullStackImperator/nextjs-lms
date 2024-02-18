'use client'
import { useState, useEffect } from 'react'
import axios from 'axios' // Assuming you are fetching badges from an API
import Image from 'next/image'
import { db } from '@/lib/db'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import useSWR from 'swr'


const fetcher = (url: string) => fetch(url).then((res) => res.json())
 

// Define the Badge type
type Badge = {
  id: string
  name: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

// Define the props interface
interface BadgeListProps {
  onOpenDialog: (badge: Badge) => void
}

const BadgeList = ({ onOpenDialog }: BadgeListProps) => {
//   const [badgesAll, setBadges] = useState<Badge[]>([])


  const { data: badges, error } = useSWR('/api/badges', fetcher)

  if (error) return <div>Failed to load</div>
  if (!badges) return <div>Loading...</div>

//   setBadges(data)

  
  return (
    <div className="flex flex-wrap justify-center">
      {badges.map((badge: Badge) => (
        <div
          key={badge.id}
          className="m-4 text-center flex flex-col items-center mr-4  transition ease-in-out delay-100 hover:cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-105   rounded-lg p-2 bg-orange-200  border border-red-400"
          onClick={() => onOpenDialog(badge)}
        >
          <Avatar className="h-20 w-20 border-2 border-white">
            <AvatarImage src={badge.imageUrl} alt={badge.name} />
            <AvatarFallback>BG</AvatarFallback>
          </Avatar>
          <p className="mt-2 text-muted-foreground text-sm">{badge.name}</p>
        </div>
      ))}
    </div>
  )
}

export default BadgeList
