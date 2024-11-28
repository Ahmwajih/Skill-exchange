import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import DOMPurify from "dompurify"; 
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

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
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await db();

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account already activated" },
        { status: 400 }
      );
    }

    // Activate the user account
    user.isActive = true;
    await user.save();

    // Create a welcome message
    let welcomeMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; padding: 20px;">
          <img src="@/app/public/Logo.svg" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #333;">Welcome to Our Community!</h2>
          <p>Your account has been successfully activated. We are excited to have you as a part of our community.</p>
          <p>Feel free to explore and connect with others.</p>
        </div>
        <div style="text-align: center; padding: 20px; margin-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 0;">The Company Team</p>
          <p style="margin: 0;">
            <a href="https://your-website.com" style="color: #007bff; text-decoration: none;">your-website.com</a>
          </p>
        </div>
      </div>
    `;

    // Sanitize the welcome message
    welcomeMessage = purify.sanitize(welcomeMessage);

    // Return success response with welcome message
    return NextResponse.json(
      { success: true, message: "Account successfully activated", welcomeMessage },
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