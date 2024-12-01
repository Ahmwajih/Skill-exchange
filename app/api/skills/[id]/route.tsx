import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Skill from '@/models/Skill';
import User from '@/models/User';
import mongoose from 'mongoose';
import admin from '@/lib/firebaseAdmin'; // Import Firebase Admin SDK

// Helper function to verify Firebase ID token
async function verifyFirebaseIdToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
    const skill = await Skill.findById(id).populate('user', 'name email country bio photo');
    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json({ success: false, error: 'Error fetching skill' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;
  const idToken = req.headers.get('Authorization')?.split('Bearer ')[1]; // Get the ID token from the Authorization header

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ success: false, error: 'Authorization token is required' }, { status: 400 });
  }

  try {
    // Verify the Firebase ID token and get the UID of the user
    const userId = await verifyFirebaseIdToken(idToken);

    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    // Check if the user is the owner of the skill
    if (skill.user.toString() !== userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized to modify this skill' }, { status: 403 });
    }

    const body = await req.json();
    const updatedSkill = await Skill.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate('user', 'name email');
    if (!updatedSkill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedSkill });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error updating skill' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db();

  const { id } = params;
  const idToken = req.headers.get('Authorization')?.split('Bearer ')[1]; // Get the ID token from the Authorization header

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ success: false, error: 'Authorization token is required' }, { status: 400 });
  }

  try {
    // Verify the Firebase ID token and get the UID of the user
    const userId = await verifyFirebaseIdToken(idToken);

    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    // Check if the user is the owner of the skill
    if (skill.user.toString() !== userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized to delete this skill' }, { status: 403 });
    }

    const deletedSkill = await Skill.findByIdAndDelete(id);
    if (!deletedSkill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deletedSkill });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error deleting skill' }, { status: 500 });
  }
}
