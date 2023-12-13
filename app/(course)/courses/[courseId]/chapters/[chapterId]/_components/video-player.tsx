"use client"

import axios from "axios"
import MuxPlayer from "@mux/mux-player-react"
import { useState } from "react"
import {toast} from "react-hot-toast"
import { useRouter } from "next/navigation"
import {Loader2, Lock} from "lucide-react"

import { cn } from "@/lib/utils"
import { useConfettiStore } from "@/hooks/use-confetti-store"


type VieoPlayerProps = {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

export const VideoPlayer = ({
     playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title,   
}: VieoPlayerProps) => {
    const [isReady, setIsReady] = useState(false)
    const router = useRouter()

  const onEnded = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        })
      }

      if ( !nextChapterId ) {
        confetti.onOpen()
      }

      if ( nextChapterId ) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}`)
      }

    } catch (error) {
      toast.error("Something went wrong")
    }
  }


    return (
      <div className="relative aspect-video">
        {!isReady && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        )}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
            <Lock className="h-8 w-8" />
            <p className="text-sm">Dieses Kapitel is gesperrt</p>
          </div>
        )}
        {!isLocked && (
          <MuxPlayer
            title={title}
            className={cn(!isReady && 'hidden')}
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnded}
            autoPlay
            playbackId={playbackId}
          />
        )}
      </div>
    )
}