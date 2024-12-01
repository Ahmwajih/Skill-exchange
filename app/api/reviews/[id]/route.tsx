import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Review from '@/models/Review';
import User from '@/models/User';
import mongoose from 'mongoose';
import admin from '@/lib/firebaseAdmin'; 

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const review = await Review.findById(id).populate('user', 'name email reviewedBy');
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ success: false, error: 'Error fetching review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const { rating, comments, idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ success: false, error: 'ID token is required' }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUserId = decodedToken.uid; // Get user ID from the token

    // Find the user in the database
    const user = await User.findOne({ firebaseUid: firebaseUserId });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comments },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'Error updating review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ success: false, error: 'ID token is required' }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUserId = decodedToken.uid; // Get user ID from the token

    // Find the user in the database
    const user = await User.findOne({ firebaseUid: firebaseUserId });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(review.user, { $pull: { reviews: review._id } });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: 'Error deleting review' }, { status: 500 });
  }
}