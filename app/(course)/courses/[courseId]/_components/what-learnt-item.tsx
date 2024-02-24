import { CheckCircle } from 'lucide-react'

interface WhatLearntItemProps {
  msg: string
}

export const WhatLearntItem = ({ msg }: WhatLearntItemProps) => {
  return (
    <div className="flex my-2 md:my-0">
      <div className="mr-2 text-xl">
        <CheckCircle />
      </div>
      <p>{msg}</p>
    </div>
  )
}
