import Mux from '@mux/mux-node'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'


interface Category {
  id: string
  name: string
}


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const { categories } = await req.json() // Extract categories from request body

    if (!userId || !isTeacher()) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Ensure that the user has permission to update the course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        categories: true, // Include the current categories of the course
      },
    })

    if (!course) {
      return new NextResponse('Course not found', { status: 404 })
    }

    // Extract the IDs of the selected categories
    const selectedCategoryIds = categories.map(
      (category: { id: string }) => category.id
    )

    // Disconnect the categories that are no longer selected
    const categoriesToDisconnect = course.categories.filter(
      (category) => !selectedCategoryIds.includes(category.id)
    )
    await db.course.update({
      where: { id: courseId },
      data: {
        categories: {
          disconnect: categoriesToDisconnect.map((category) => ({
            id: category.id,
          })),
        },
      },
    })

    // Connect the newly selected categories
    const categoriesToConnect = categories.filter((category: { id: string }) =>
      selectedCategoryIds.includes(category.id)
    )
    await db.course.update({
      where: { id: courseId },
      data: {
        categories: {
          connect: categoriesToConnect.map((category: { id: string }) => ({
            id: category.id,
          })),
        },
      },
    })

    return NextResponse.json({ message: 'Categories updated successfully' })
  } catch (error) {
    console.error('[PATCH Course]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
