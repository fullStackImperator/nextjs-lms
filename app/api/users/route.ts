import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'

interface UpdateData {
  userId: string
  isTeacher: boolean
}


export async function PATCH(req: Request) {
  try {
    const { userId } = auth()
    const updateData: UpdateData[] = await req.json()

    if (!userId || !isTeacher()) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // console.log('updateData:', updateData)

    for (const { userId, isTeacher } of updateData) {
      await db.user.update({
        where: { id: userId },
        data: { isTeacher: isTeacher },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ALL_USERS_CHANGE_ROLE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
