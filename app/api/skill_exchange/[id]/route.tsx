import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import SkillExchange from '@/models/SkillExchange';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const skillExchange = await SkillExchange.findById(id).populate('user', 'name email');
    if (!skillExchange) {
      return NextResponse.json({ success: false, error: 'SkillExchange not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: skillExchange });
  } catch (error) {
    console.error('Error fetching skillExchange:', error);
    return NextResponse.json({ success: false, error: 'Error fetching skillExchange' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const skillExchange = await SkillExchange.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate('user', 'name email');
    if (!skillExchange) {
      return NextResponse.json({ success: false, error: 'SkillExchange not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: skillExchange });
  } catch (error) {
    console.error('Error updating skillExchange:', error);
    return NextResponse.json({ success: false, error: 'Error updating skillExchange' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const skillExchange = await SkillExchange.findByIdAndDelete(id);
    if (!skillExchange) {
      return NextResponse.json({ success: false, error: 'SkillExchange not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: skillExchange });
  } catch (error) {
    console.error('Error deleting skillExchange:', error);
    return NextResponse.json({ success: false, error: 'Error deleting skillExchange' }, { status: 500 });
  }
}