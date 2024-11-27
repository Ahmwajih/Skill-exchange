import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token not found" },
      { status: 400 }
    );
  }

  if (!JWT_SECRET) {
    return NextResponse.json(
      { success: false, error: "JWT_SECRET is not defined" },
      { status: 500 }
    );
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Connect to database
    await db();

    // Find the user by ID from decoded token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is already active
    if (user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account already activated" },
        { status: 400 }
      );
    }

    // Activate user account
    user.isActive = true;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Account successfully activated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during activation:", error);
    return NextResponse.json(
      { success: false, error: "Error activating account" },
      { status: 500 }
    );
  }
}