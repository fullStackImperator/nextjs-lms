import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'

export async function PATCH(req: Request) {
  try {
    const { userId } = auth()
    const updateData = await req.json()

    if (!userId || !isTeacher()) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log('updateData:', updateData)

    // Loop through updateData and update the database accordingly
    for (const { userId, badgeId } of updateData) {
      // Check if the combination of userId and badgeId already exists
      const existingUserBadge = await db.userBadge.findFirst({
        where: {
          userId,
          badgeId,
        },
      })

      // If the combination already exists, skip creating a new record
      if (!existingUserBadge) {
        // Create a new record if it doesn't exist
        await db.userBadge.create({
          data: {
            userId,
            badgeId,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[BADGES_GIVE_USERS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    console.log('IN DELETE')
    // for clarity
    // const { userId } = auth()
    const { userId: authUserId } = auth()

    const data = await req.json()
    const { userId, badgeId, userBadgeId } = data

    console.log('data:', data)

    if (!authUserId || !isTeacher()) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!userId || !badgeId) {
      return new NextResponse('Invalid data', { status: 400 })
    }

    await db.userBadge.delete({
      where: {
        id: userBadgeId,
        userId: userId,
        badgeId: badgeId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[BADGES_DELTE_USER]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
