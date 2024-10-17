import { NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  await db();

  try {
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await db();

  try {
    const body = await req.json();
    const user = await User.create(body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}