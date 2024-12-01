import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Review from '@/models/Review';
import User from '@/models/User';
import mongoose from 'mongoose';
import admin from '@/lib/firebaseAdmin'; // Import Firebase Admin SDK

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

    const reviews = await Review.find(query).populate('user', 'name email reviewedBy');
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Error fetching reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await db();

  try {
    const { rating, comments, userId, skillId, reviewedBy, idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ success: false, error: 'ID token is required' }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUserId = decodedToken.uid; // Get user ID from the token

    // Find or create the user in the database
    let user = await User.findOne({ firebaseUid: firebaseUserId });

    if (!user) {
      user = new User({
        firebaseUid: firebaseUserId,
        email: decodedToken.email,
        name: decodedToken.name,
        role: 'provider', 
      });
      await user.save();
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: 'Valid user ID is required' }, { status: 400 });
    }

    const newReview = new Review({
      rating,
      comments,
      user: userId,
      skill: skillId,
      reviewedBy: user._id, // Use the MongoDB user ID
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

export async function PUT(req: NextRequest) {
  await db();

  try {
    const { reviewId, rating, comments, idToken } = await req.json();

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

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ success: false, error: 'Valid review ID is required' }, { status: 400 });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comments },
      { new: true }
    ).populate('user', 'name email');

    if (!updatedReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'Error updating review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await db();

  try {
    const { reviewId, idToken } = await req.json();

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

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ success: false, error: 'Valid review ID is required' }, { status: 400 });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(deletedReview.user, { $pull: { reviews: deletedReview._id } });

    return NextResponse.json({ success: true, data: deletedReview });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: 'Error deleting review' }, { status: 500 });
  }
}