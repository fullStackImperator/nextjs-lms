import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'


export async function GET(req: Request) {
  try {
    const cards = await db.card.findMany()

    // console.log("cards: ", cards)

    return NextResponse.json(cards, { status: 200 })
  } catch (error) {
    console.log('[KANBAN_CARDS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}



export async function DELETE(req: Request) {
    try {
        const { userId } = auth()
        const data = await req.json()
        
        const cardId = data.cardId
        // const { cardId } = req.json()
        
        if (!cardId) {
            return new NextResponse('Card ID is required', { status: 400 })
        }
        
        // Assuming db.card.deleteOne() is a function to delete a card by ID
        await db.card.delete({
            where: {
                id: String(cardId),
            },
        })
        
        return new NextResponse('Card deleted successfully', { status: 200 })
    } catch (error) {
        console.error('[KANBAN_DELETE_CARD]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}



// export async function POST(req: Request) {
//   try {
//     const { userId } = auth()
//     const values = await req.json()

//     if (!userId || !isTeacher()) {
//       return new NextResponse('Unauthorized', { status: 401 })
//     }

//     const badge = await db.badge.create({
//       data: {
//         ...values,
//       },
//     })

//     return NextResponse.json(badge, { status: 200 })
//   } catch (error) {
//     console.log('[BADGES_CREATE]', error)
//     return new NextResponse('Internal Error', { status: 500 })
//   }
// }


export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const data = await req.json()

    const { title, columnId } = data

    if (!title || !columnId) {
      return new NextResponse('Title and Column ID are required', {
        status: 400,
      })
    }

    // Assuming db.card.create() is a function to create a new card
    const newCard = await db.card.create({
      data: {
        title,
        columnId: String(columnId),
      },
    })

    // return new NextResponse(JSON.stringify(newCard), { status: 201 })
    return NextResponse.json(newCard, { status: 200 })
  } catch (error) {
    console.error('[KANBAN_CREATE_CARD]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}



export async function PATCH(req: Request) {
  try {
    const { userId } = auth()
    const values = await req.json()

    console.log('values :', values)

    if (!userId || !isTeacher()) {
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

    return NextResponse.json(badge, { status: 200 })
  } catch (error) {
    console.log('[BADGES_UPDATE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
