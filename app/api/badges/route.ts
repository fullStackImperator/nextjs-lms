import Mux from '@mux/mux-node'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'
import { UTApi } from 'uploadthing/server'

export async function POST(req: Request) {
  const utapi = new UTApi()
  try {
    const { userId } = auth()
    const values = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const badge = await db.badge.create({
      data: {
        ...values,
      },
    })

    return NextResponse.json(badge, { status: 200 })
  } catch (error) {
    console.log('[BADGES_CREATE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const utapi = new UTApi()
  try {
    const { userId } = auth()
    const values = await req.json()

    console.log('values :', values)

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Extract badge ID from values
    const { id, oldImageUrl, ...badgeData } = values

    // Update the badge with the specified ID
    const badge = await db.badge.update({
      where: { id }, // Specify the badge to update
      data: badgeData, // Update the badge data
    })

    // Extract filename from oldImageUrl
    // console.log('oldImageUrl: ', oldImageUrl)

    const filename = oldImageUrl.substring(oldImageUrl.lastIndexOf('/') + 1)

    // console.log('filename: ', filename)

    await utapi.deleteFiles(filename)

    return NextResponse.json(badge, { status: 200 })
  } catch (error) {
    console.log('[BADGES_UPDATE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const badges = await db.badge.findMany()

    return NextResponse.json(badges, { status: 200 })
  } catch (error) {
    console.log('[BADGES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const utapi = new UTApi()
  try {
    const { userId } = auth()
    const data = await req.json()

    console.log('data :', data)

    if (!userId || !isTeacher()) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Extract badge ID from values
    const { id, imageUrl } = data

    // delete badge from database
    await db.badge.delete({
      where: {
        id: id,
      },
    })

    // delete image in uploadthing
    // Extract filename from oldImageUrl
    // console.log('imageUrl: ', imageUrl)
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
    // console.log('filename: ', filename)
    await utapi.deleteFiles(filename)

    // Return success response
    return new NextResponse('Badge successfully deleted', { status: 200 })
  } catch (error) {
    console.log('[BADGES_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
