import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth()
    const { isCompleted } = await req.json()

    console.log('userId', userId)
    console.log('params.chapterId', params.chapterId)

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // const userProgress = await db.userProgress.upsert({
    //   where: {
    //     userId_chapterId: {
    //       userId: userId,
    //       chapterId: params.chapterId,
    //     },
    //   },
    //   update: {
    //     isCompleted,
    //   },
    //   create: {
    //     userId,
    //     chapterId: params.chapterId,
    //     isCompleted,
    //   },
    // })

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
    })

    console.log('userProgress: ', userProgress)
    
    if (userProgress) {
      // User progress exists, update it
      await db.userProgress.update({
        where: {
          userId_chapterId: {
            userId,
            chapterId: params.chapterId,
          },
        },
        data: {
          isCompleted,
        },
      })
    } else {
      // User progress doesn't exist, create it
      await db.userProgress.create({
        data: {
          userId,
          chapterId: params.chapterId,
          isCompleted,
        },
      })
    }

    console.log('userProgress: ', userProgress)

    return NextResponse.json(userProgress)
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
