import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { CoursesList } from '@/components/courses-list'
import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { CheckCircle, Clock } from 'lucide-react'
// import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'

import Image from 'next/image'
import { InfoCard } from './_components/info-card'
import { redirect } from 'next/navigation'




export default async function Dashboard() {
  
  const {userId} =auth()

  if (!userId) {
    return redirect("/")
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses(userId)

  
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="Am Laufen"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Abgeschlossen"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}
