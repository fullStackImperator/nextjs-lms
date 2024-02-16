"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AbmeldenModal } from '@/components/modals/abmelden-modal'
import { UserMinus } from 'lucide-react'

type CourseUnEnrollButtonProps = {
    level: number;
    courseId: string;
}


export const CourseUnEnrollButton = ({
    level,
    courseId,
}: CourseUnEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.delete(`/api/courses/${courseId}/checkout`)

            toast.success('Erfolgreich abgemeldet')
            
            router.refresh()

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
      <AbmeldenModal onConfirm={onClick}>
        <Button
        //   onClick={onClick}
          disabled={isLoading}
          size="sm"
          className="w-full"
        >
          {/* <UserMinus className="h-4 w-4" /> */}
          Abmelden
        </Button>
      </AbmeldenModal>
    )
}