import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'

export async function GET(req: Request) {
  try {
    // Fetch events from the database using Prisma
    const events = await db.event.findMany()

    // console.log('events: ', events)

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.log('[KALENDER_EVENTS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    // const { userId } = auth()
    const data = await req.json()

    console.log('data: ', data)

    // Destructure the required fields from the data
    const { Subject, StartTime, EndTime, Description, IsAllDay, IsReadonly } =
      data

    // Validate required fields
    if (!Subject || !StartTime || !EndTime) {
      return new NextResponse('Subject, StartTime and EndTime are required', {
        status: 400,
      })
    }

    // Check if the event with the given Id already exists in the database
    const existingEvent = await db.event.findUnique({
      where: {
        Id: data.Id,
      },
    })

    if (existingEvent) {
      // If the event exists, update its details
      const updatedEvent = await db.event.update({
        where: {
          Id: data.Id,
        },
        data: {
          Subject,
          StartTime: new Date(StartTime),
          EndTime: new Date(EndTime),
          Description,
          IsAllDay,
          IsReadonly,
        },
      })
      return NextResponse.json(updatedEvent, { status: 200 })
    } else {
      // Create a new event in the database using Prisma client
      const newEvent = await db.event.create({
        data: {
          Subject,
          StartTime: new Date(StartTime),
          EndTime: new Date(EndTime),
          Description,
          IsAllDay,
          IsReadonly,
        },
      })
      // return new NextResponse(JSON.stringify(newCard), { status: 201 })
      return NextResponse.json(newEvent, { status: 200 })
    }
  } catch (error) {
    console.error('[KALENDER_EVENTS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
