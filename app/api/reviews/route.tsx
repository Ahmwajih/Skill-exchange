import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Review from '@/models/Review';
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

    const reviews = await Review.find(query).populate('user', 'name email');
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Error fetching reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await db();

  try {
    const { title, description, rating, userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: 'Valid user ID is required' }, { status: 400 });
    }

    const newReview = new Review({
      title,
      description,
      rating,
      user: userId,
    });

    await newReview.save();
    await User.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });

    const populatedReview = await Review.findById(newReview._id).populate('user', 'name email');

    return NextResponse.json({ success: true, data: populatedReview }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: 'Error creating review' }, { status: 500 });
  }
}