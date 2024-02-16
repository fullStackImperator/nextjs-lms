import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser()

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            isPublished: true,
        }
    })

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: params.courseId,
            }
        }
    })


    if (purchase) {
        return new NextResponse("Du hast das Projekt bereits begonnen", {status: 400})
    }

    if (!course) {
        return new NextResponse("Nicht gefunden", {status: 404})
    }

    await db.purchase.create({
      data: {
        courseId: params.courseId,
        userId: user.id,
      },
    })

    return NextResponse.json('Success', { status: 200 })
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser()

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Delete the enrollment in course
    await db.purchase.deleteMany({
      where: {
        userId: user.id,
        courseId: params.courseId,
      },
    })

    // Delete the grading records associated with the course and user
    await db.grading.deleteMany({
      where: {
        userId: user.id,
        courseId: params.courseId,
      },
    })

    // Delete the user progress records associated with the course and user
    await db.userProgress.deleteMany({
      where: {
        userId: user.id,
        chapter: {
          courseId: params.courseId,
        },
      },
    })

    return NextResponse.json('Success', { status: 200 })
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
