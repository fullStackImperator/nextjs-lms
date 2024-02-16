import Image from 'next/image'
import Link from 'next/link'
import { IconBadge } from '@/components/icon-badge'
import { BookOpen } from 'lucide-react'
import { Wrench } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { CourseProgress } from './course-progress'
import { Separator } from '@/components/ui/separator'

import { CourseEnrollButton } from '@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button'

type CourseCardProps = {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  level: number
  progress?: number | null
  category: string
  prerequisites: string
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  level,
  progress,
  category,
  prerequisites,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group shadow-lg hover:bg-muted border transition overflow-hidden rounded-lg p-3 h-full flex flex-col">
        <div className='flex-1'>
          <div className="relative w-full aspect-video rounded-md overflow-hidden
          duration-700 ease-in-out scale-100 blur-0 grayscale-0 object-cover">
            <Image fill className="object-cover" alt={title} src={imageUrl} />
          </div>
          <div className="flex flex-col pt-2">
            <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
              {title}
            </div>
            <p className="text-xs text-muted-foreground">{category}</p>
            <div className="my-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-x-2 text-slate-500">
                <IconBadge size="sm" icon={BookOpen} />
                <span>
                  {chaptersLength} {chaptersLength === 1 ? 'Kapitel' : 'Kapitel'}
                </span>
              </div>
              <div className="flex items-center gap-x-2 text-slate-500">
                <IconBadge size="sm" icon={Wrench} />
                <p className="text-md md:text-sm text-slate-500 font-medium">
                  Level: {level}
                </p>
              </div>
            </div>
            {/* <p className="flex-1 text-sm md:text-sm text-slate-500  font-medium">
              Benötigtes Material:
            </p> */}
            {prerequisites ? (
              <div className="flex flex-col p-2 mt-2 bg-rose-50 rounded-md">
                <p className="flex-1 text-md md:text-sm text-slate-500  font-medium">
                  {prerequisites}
                </p>
              </div>
            ) : (
              <div className="flex flex-col p-2 mt-2 bg-emerald-50 rounded-md">
                <p className="flex-1 text-md md:text-sm text-slate-500 font-medium">
                  Keine Materialien benötigt <br />
                </p>
              </div>
            )}
            <Separator className="my-4" />
            {progress !== null ? (
              <div>
                <CourseProgress
                  variant={progress === 100 ? 'success' : 'default'}
                  size="sm"
                  value={progress!}
                />
              </div>
            ) : (
              <CourseEnrollButton courseId={id} level={level} />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
