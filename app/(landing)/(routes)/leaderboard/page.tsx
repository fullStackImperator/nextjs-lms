import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { CoursesList } from '@/components/courses-list'
import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { CheckCircle, Clock } from 'lucide-react'
// import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'

import Image from 'next/image'

import { redirect } from 'next/navigation'
import { DataTableScores } from './_components/data-table-score'
import { db } from '@/lib/db'
import { columnsScore } from './_components/columns-score'

export default async function Dashboard() {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

//   const { userScore } = await getUserScore(userId)

  const courses = await db.course.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="p-6 space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      </div>
      <div className="flex flex-col relative gap-4 w-full">
        <div className="w-full p-4 z-0 flex flex-col relative justify-between gap-4 overflow-auto rounded-lg shadow-sm">
            <DataTableScores columns={columnsScore} data={courses} />
        </div>
      </div>
    </div>
  )
}
