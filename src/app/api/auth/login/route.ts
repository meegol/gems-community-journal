import { NextResponse } from 'next/server';
import { loginDbUserByEmail, authenticateDbUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    // Legacy username/password (admin credentials)
    if (username) {
      const user = authenticateDbUser(username, password);
      if (user) return NextResponse.json({ success: true, user });
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    // Email + password login
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = loginDbUserByEmail(email.trim(), password);
    if (user) return NextResponse.json({ success: true, user });

    return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
