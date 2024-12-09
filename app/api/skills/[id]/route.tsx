import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import Skill from '@/models/Skill';
import mongoose from 'mongoose';

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

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
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

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
  }

  try {
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



// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   await db();

//   const { id } = params;

//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//     return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
//   }

//   try {
//     const skill = await Skill.findById(id);

//     if (!skill) {
//       return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
//     }

//     const populatedSkill = await Skill.aggregate([
//       { $match: { _id: skill._id } },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'user',
//           foreignField: '_id',
//           as: 'user',
//         },
//       },
//       {
//         $lookup: {
//           from: 'reviews',
//           localField: 'reviews',
//           foreignField: '_id',
//           as: 'reviews',
//         },
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'category',
//           foreignField: '_id',
//           as: 'category',
//         },
//       },
//       {
//         $project: {
//           'user.password': 0, // Remove password field from user
//         },
//       },
//     ]);

//     if (!populatedSkill || populatedSkill.length === 0) {
//       return NextResponse.json({ success: false, error: 'Error populating skill data' }, { status: 500 });
//     }

//     // Validate response structure
//     const skillData = populatedSkill[0];
//     return NextResponse.json({ success: true, data: skillData });
//   } catch (error) {
//     console.error('Error fetching skill with populate:', error);
//     return NextResponse.json({ success: false, error: 'Error fetching skill' }, { status: 500 });
//   }
// }