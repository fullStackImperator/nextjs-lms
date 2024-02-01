"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


type CourseEnrollButtonProps = {
    level: number;
    courseId: string;
}


export const CourseEnrollButton = ({
    level,
    courseId,
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.post(`/api/courses/${courseId}/checkout`)

            toast.success('Erfolgreich angemeldet')
            
            router.refresh()

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
      <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        className="w-full md:w-auto"
      >
        Anmelden
      </Button>
    )
}