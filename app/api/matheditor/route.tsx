import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Authenticate user and extract userId
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if the user is a teacher
    if (!isTeacher()) {
      //   return res.status(403).json({ error: 'Forbidden' })
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Extract data from request body
    // Parse the JSON body asynchronously
    // Parse the JSON body if it's not null
    // Read the request body as text
    // const requestBodyText = await req.text()

    // // Parse the request body text into JSON
    // const requestBody = JSON.parse(requestBodyText)

    // // Extract data from request body
    // const { id, name, head, data, createdAt, updatedAt } = requestBody

    // console.log('id: ', id)
    // console.log('name: ', name)
    // console.log('head: ', head)
    // console.log('data: ', data)
    // console.log('createdAt: ', createdAt)
    // console.log('updatedAt: ', updatedAt)

    // console.log('req: ', req)
    // console.log('req.header: ', req.header)
    // console.log('req.body: ', req.body)

    const payload = await req.json()
    // const body = JSON.stringify(payload)

    // const dataME = JSON.stringify(payload.data)

    console.log('payload: ', payload)

    const jsonData = JSON.stringify(payload.data)


    console.log(' payload.data: ' , typeof payload.data) // Output: string
    console.log(' jsonData: ', typeof jsonData) // Output: string

    // console.log('body: ', body)
    // console.log('body: ', body)

    // // Extract data from request body
    // const { document } = body

    // Save document to database using Prisma Client
    const savedDocument = await db.mathEditorDocument.create({
      data: {
        // id: payload.id,
        name: payload.name,
        // head: document.head,
        // data: dataME,
        data: payload.data,
        // data: JSON.stringify(payload.data),
        // createdAt: payload.createdAt,
        // updatedAt: payload.updatedAt,
        // Add additional fields if needed
      },
    })

    // Respond with success message
    // return res.status(201).json({ message: 'Document saved successfully' })
    //     return NextResponse.json(course)
    return NextResponse.json({ message: 'Received' })
  } catch (error) {
    // console.error('Error saving document:', error)
    // return res.status(500).json({ error: 'Internal Server Error' })
    console.log('[MATHEDITOR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
