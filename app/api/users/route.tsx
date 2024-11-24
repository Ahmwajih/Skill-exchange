import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { paginationMiddleware } from "@/middleware/pagination";

const JWT_SECRET = process.env.JWT_SECRET;

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
    const { name, email, password, country, role, isActive, isAdmin, skillsLookingFor, bio, languages, Github, LinkedIn } = body;

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
      isActive,
      isAdmin,
      skillsLookingFor,
      bio,
      languages,
      Github,
      LinkedIn,
    });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;

    const response = NextResponse.json(
      {
        success: true,
        data: userWithoutPassword,
        message: "User created successfully",
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, 
    });

    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Error creating user" },
      { status: 500 }
    );
  }
}