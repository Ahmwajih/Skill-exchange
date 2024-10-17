import { NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  await db();

  try {
    const { id } = req.query;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  await db();

  try {
    const { id } = req.query;
    const body = await req.json();

    if (!id) {
      throw new Error('ID is required');
    }

    const user = await User.findByIdAndUpdate(id, body, { new: true });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// DELETE handler
export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { id } = req.query;

    if (!id) {
      throw new Error('ID is required');
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}