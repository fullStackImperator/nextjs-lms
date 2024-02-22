import { NextResponse } from 'next/server'

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  
  if (eventType === 'user.created' || eventType === 'user.updated') {
    
    // const { email_addresses, primary_email_address_id, first_name, last_name, username, created_at  } =
    // const { email_addresses, primary_email_address_id, first_name, last_name, username, updated_at, created_at  } =
    const { email_addresses, primary_email_address_id, first_name, last_name, id, username } =
      evt.data
    
      const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id
    })
    
    if (!emailObject) {
      return new NextResponse('No Email error', { status: 400 })
    }

    await db.user.upsert({
      where: { id: id },
      update: {
        firstName: `${first_name || ''}`,
        lastName: `${last_name || ''}`,
        userName: `${username || ''}`,
        email: emailObject.email_address,
        // updatedAt: `${updated_at || ''}`,
      },
      create: {
        id: id,
        firstName: `${first_name || ''}`,
        lastName: `${last_name || ''}`,
        userName: `${username || ''}`,
        email: emailObject.email_address,
        // createdAt: `${created_at || ''}`,   // gets filled by default
      },
    })
  }

  console.log(`User ${id} was ${eventType}`)

  // const payload: WebhookEvent = await req.json()
  // console.log(payload)

  return NextResponse.json({ message: 'Received' })
}

export async function GET() {
  return NextResponse.json({ message: 'Hello World!' })
}
