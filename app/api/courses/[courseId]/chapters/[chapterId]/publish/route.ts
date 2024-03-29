import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth()
    // const { isPublished, ...values } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // const chapter = await db.chapter.update({
    //   where: {
    //     id: params.chapterId,
    //     courseId: params.courseId,
    //   },
    //   data: {
    //     isPublished: true,
    //     ...values,
    //   },
    // })


    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      }
    })

    // const muxData = await db.muxData.findUnique({
    //   where: {
    //     chapterId: params.chapterId,
    //   },
    // })

    if (!chapter || !chapter.title || !chapter.descriptionEditor) {
        return new NextResponse("Missing required fields", { status: 401 })
    }

    const publishedChapter = await db.chapter.update({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
        data: {
          isPublished: true,
        },
    })

    return NextResponse.json(publishedChapter)
  } catch (error) {
    console.log('[CHAPTER_PUBLISH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
