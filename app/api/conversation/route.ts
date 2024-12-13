import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await db();

  try {
    const { providerId, seekerId, messages } = await req.json();

    if (!providerId || !seekerId) {
      return NextResponse.json({ success: false, error: "Provider and Seeker IDs are required" }, { status: 400 });
    }

    const [provider, seeker] = await Promise.all([
      User.findById(providerId),
      User.findById(seekerId),
    ]);

    if (!provider || !seeker) {
      return NextResponse.json({ success: false, error: "Provider or Seeker not found" }, { status: 404 });
    }

    const newConversation = await Conversation.create({
      providerId,
      seekerId,
      messages: messages.map((message) => ({
        senderId: message.senderId,
        content: message.content,
        timestamp: new Date(),
      })),
    });

    return NextResponse.json({ success: true, data: newConversation }, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}