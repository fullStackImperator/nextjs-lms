import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { name } = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const category = await db.category.create({
      data: {
        name,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
