import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Review from '@/models/Review';

// GET handler
export async function GET() {
  await db();

  try {
    const reviews = await Review.find({});
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// POST handler
export async function POST(req: Request) {
  await db();

  try {
    const body = await req.json();
    const reviews = await Review.create(body);
    return NextResponse.json({ success: true, data: reviews }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}