import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('email_captures')
      .insert({ email, source: 'dispatch_footer' })

    if (error) {
      // code 23505 is Postgres unique violation — email already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Already on the list.' },
          { status: 200 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'You are on the list.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}