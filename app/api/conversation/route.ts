import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

export async function POST(req) {
  await db();

  try {
    const body = await req.json();
    const { providerId, seekerId } = body;

    // Validate input
    if (!providerId || !seekerId) {
      return NextResponse.json({ success: false, error: "Provider and Seeker IDs are required" }, { status: 400 });
    }

    const provider = await User.findById(providerId);
    const seeker = await User.findById(seekerId);

    if (!provider || !seeker) {
      return NextResponse.json({ success: false, error: "Provider or Seeker not found" }, { status: 404 });
    }

    const newConversation = new Conversation({
      providerId,
      seekerId,
      messages: [], 
    });

    const conversation = await newConversation.save();

    return NextResponse.json(
      { success: true, data: conversation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { success: false, error: "Error creating conversation" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }) {
   await db();
   const userId = params.userId;

   try {
     const conversations = await Conversation.find({
       $or: [{ providerId: userId }, { seekerId: userId }],
     }).populate('providerId seekerId', 'name email');

     return NextResponse.json({ success: true, data: conversations }, { status: 200 });
   } catch (error) {
     console.error("Error fetching conversations:", error);
     return NextResponse.json({ success: false, error: "Error fetching conversations" }, { status: 500 });
   }
}
