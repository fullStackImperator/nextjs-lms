"use client"

import ReactConfetti from "react-confetti"

// zustand
import { useConfettiStore } from "@/hooks/use-confetti-store"

// recoil
// import { useRecoilState } from 'recoil'
// import { confettiState } from "@/atoms/confettiState" 

export const ConfettiProvider = () => {
    const confetti = useConfettiStore()
    // const [confetti, setConfetti] = useRecoilState(confettiState)


    if (!confetti.isOpen) return null;

    return (
        <ReactConfetti 
            className="pointer-events-none z-[100]"
            numberOfPieces={500}
            recycle={false}
            onConfettiComplete={()=>{
                // setConfetti({ isOpen: false });
                confetti.onClose()
            }}
        />
    )

}

