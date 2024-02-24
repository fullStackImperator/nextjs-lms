import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'


// Define the type for a chapter
interface Chapter {
  title: string;
  // Add other properties if needed
}

interface KapitelProps {
  chapters: Chapter[]
}

export const Kapitel = ({ chapters }: KapitelProps) => {
  return (
    <section className="w-full flex justify-center py-10">
      <div className="w-10/12 md:w-8/12">
        <h3 className="text-lg md:text-2xl font-semibold mb-3">
          Projekt Inhalt
        </h3>

        {/* Map over chapters and render each chapter's title */}
        {chapters.map((chapter, index) => (
          <div key={index} className="mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {chapter.title}
                  {/* <div className='text-xs'>
                  {chapter.isFree ? 'Preview' : 'Lock'}
                  </div> */}
                </CardTitle>
                {/* <CardDescription>{chapter.isFree ? "Preview" : "Lock"}</CardDescription> */}
              </CardHeader>
              {/* <CardContent>
                <p>Card Content</p>
              </CardContent> */}
              {/* <CardFooter>
                <p>Card Footer</p>
              </CardFooter> */}
            </Card>
            {/* <h5 className="text-sm md:text-lg">{chapter.title}</h5> */}
          </div>
        ))}
      </div>
    </section>
  )
}
