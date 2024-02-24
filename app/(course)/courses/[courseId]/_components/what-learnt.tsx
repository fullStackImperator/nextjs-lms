import React from 'react'
import { WhatLearntItem } from './what-learnt-item'
import { Preview } from '@/components/previewQuill'

interface WhatLearntProps {
  kompetenzen: string
}

export const WhatLearnt = ({ kompetenzen }: WhatLearntProps) => {
  return (
    <section className="w-full flex justify-center py-10">
      <div className="border p-3 md:p-6 rounded md:w-10/12 w-11/12 lg:w-8/12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold my-4">
          Was du lernen wirst
        </h2>
        <Preview value={kompetenzen} />
        {/* <div className=" flex flex-col md:flex-row">
                <div>

                    <WhatLearntItem msg="Learn to use Python professionally, learning both Python 2 and Python 3!" />
                    <WhatLearntItem msg="Create games with Python, like Tic Tac Toe and Blackjack!" />

                </div>

                <div>
                    <WhatLearntItem msg=" Learn advanced Python features, like the collections module and how to work with timestamps!" />
                    <WhatLearntItem msg="Learn to use Object Oriented Programming with classes!" />
                    

                </div>

            </div> */}
      </div>
    </section>
  )
}


