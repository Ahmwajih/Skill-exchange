import { NextResponse } from 'next/server';
import db from '@/lib/db';
import SkillExchange from '@/models/SkillExchange';

export async function GET() {
  await db();

  try {
    const skillExchange = await SkillExchange.find({});
    return NextResponse.json({ success: true, data: skillExchange });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await db();

  try {
    const body = await req.json();
    const skillExchange = await SkillExchange.create(body);
    return NextResponse.json({ success: true, data: skillExchange }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}