import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Skill from '@/models/Skill';

export async function GET() {
  await db();

  try {
    const skills = await Skill.find({});
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await db();

  try {
    const body = await req.json();
    const skills = await Skill.create(body);
    return NextResponse.json({ success: true, data: skills }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}