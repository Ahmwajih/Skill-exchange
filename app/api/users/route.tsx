import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  await db();

  try {
    const query = {};
    const users = await User.find(query)
      .populate('skills', 'title description category')
      // .populate('reviews', 'rating comments skill');
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  await db();

  try {
    const body = await req.json();
    const {name, email, password, country, role, isActive, isAdmin} = body;
    const user =  await User.findOne({email});
    if(user) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }
    const newUser = new User({
      name,
      email,
      password,
      country,
      role,
      isActive,
      isAdmin
    });
    const registerUser = await newUser.save();
    //  send email to user to after confirmation OF HIS IDENTITY 
    return NextResponse.json({ success: true, data: registerUser, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}