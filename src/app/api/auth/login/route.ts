import { NextResponse } from 'next/server';
import { authenticateDbUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = authenticateDbUser(username, password);

    if (user) {
      return NextResponse.json({
        success: true,
        user,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
