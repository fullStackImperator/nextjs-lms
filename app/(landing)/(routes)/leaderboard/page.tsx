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
import { getLeaderboard } from '@/actions/get-leaderboard'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserScoreBanner } from './_components/banner-score'
import { getUserPoints } from '@/actions/get-userPoints'
import { getUserBadges } from '@/actions/get-userBadges'



export default async function Dashboard() {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const leaderboard = await getLeaderboard()
  const userPoints = await getUserPoints()
  const userBadges = await getUserBadges()

  let rank = 0 // Initialize the rank counter

  return (
    <div className="p-6 space-y-4">
      <UserScoreBanner userPoints={userPoints} userBadges={userBadges} />
      <div className="flex flex-col relative gap-4 w-full">
        <div className="w-full p-4 z-0 flex flex-col relative justify-between gap-4 overflow-auto rounded-lg shadow-small">
          <Table className="min-w-full h-auto table-auto w-full">
            {/* <TableCaption>Points for enrolled students</TableCaption> */}
            <TableHeader className="border-b-0 h-25 font-semibold">
              <TableRow className="bg-zinc-100 border-b-0">
                <TableHead className="rounded-s-lg">Rang</TableHead>
                <TableHead>Schüler</TableHead>
                <TableHead className="rounded-e-lg">Punkte</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="rounded-s-lg">{++rank}.</TableCell>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell className="rounded-e-lg ">
                    <div className="relative max-w-fit inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-6 text-sm rounded-full bg-green-500/20 text-green-600">
                      <span className="flex-1 text-inherit font-normal px-1">
                        {user.totalPoints}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
