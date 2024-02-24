import { CheckCircle } from 'lucide-react'


export const WhatLearntItem = ({ msg }) => {
  return (
    <div className="flex my-2 md:my-0">
      <div className="mr-2 text-xl">
        <CheckCircle />
      </div>
      <p>{msg}</p>
    </div>
  )
}
