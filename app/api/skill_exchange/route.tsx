import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import SkillExchange from '@/models/SkillExchange';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await db();

  const userId = req.nextUrl.searchParams.get('userId');

  try {
    let query = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
      }
      query = { user: userId };
    }

    const skillExchanges = await SkillExchange.find(query).populate('user', 'name email');
    return NextResponse.json({ success: true, data: skillExchanges });
  } catch (error) {
    console.error('Error fetching skill exchanges:', error);
    return NextResponse.json({ success: false, error: 'Error fetching skill exchanges' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await db();

  try {
    const { title, description, category, userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: 'Valid user ID is required' }, { status: 400 });
    }

    const newSkillExchange = new SkillExchange({
      title,
      description,
      category,
      user: userId,
    });

    await newSkillExchange.save();
    await User.findByIdAndUpdate(userId, { $push: { skillExchanges: newSkillExchange._id } });

    const populatedSkillExchange = await SkillExchange.findById(newSkillExchange._id).populate('user', 'name email');

    return NextResponse.json({ success: true, data: populatedSkillExchange });
  } catch (error) {
    console.error('Error creating skill exchange:', error);
    return NextResponse.json({ success: false, error: 'Error creating skill exchange' }, { status: 500 });
  }
}