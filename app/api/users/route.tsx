import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { paginationMiddleware } from "@/middleware/pagination";
import { sendMail } from "@/lib/mailer"; 


const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  await db();

  try {
    const paginationData = await paginationMiddleware(req);
    const users = await User.find({})
      .skip(paginationData.skip)
      .limit(paginationData.limit)
      .select('-password')
      // .populate('skills', 'title description category')
      // .populate('reviews', 'rating comments')
      .lean();


    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      success: true,
      data: users,
      Details: {
        total: totalUsers,
        page: paginationData.page,
        limit: paginationData.limit,
        pages: Math.ceil(totalUsers / paginationData.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await db();

  try {
    const body = await req.json();
    const { name, email, password, country, role, skillsLookingFor, bio, languages, Github, LinkedIn } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = new User({
      name,
      email,
      password,
      country,
      role,
      isActive: false, 
      isAdmin: false,
      skillsLookingFor,
      bio,
      languages,
      Github,
      LinkedIn,
    });
    const savedUser = await newUser.save();

    const activationToken = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: "1h" } 
    );

    // Send activation email
    const activationLink = `${BASE_URL}/api/auth/activate?token=${activationToken}`;
    await sendMail(email, 'Activate Your Account', `<p>Please activate your account by clicking the link: <a href="${activationLink}">${activationLink}</a></p>`);
    console.log("Activation link:", activationLink);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please check your email to activate your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Error creating user" },
      { status: 500 }
    );
  }
}