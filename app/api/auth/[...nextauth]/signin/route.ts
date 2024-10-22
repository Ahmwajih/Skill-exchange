// app/api/auth/signin/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  await db();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ success: true, token });
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}