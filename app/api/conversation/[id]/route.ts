import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

// Create a new conversation
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

// Fetch all conversations for a specific user or the most recent conversation
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await db();
  const userId = params.id;
  const { searchParams } = new URL(req.url);
  const fetchRecent = searchParams.get('recent') === 'true';

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
  }

  try {
    if (fetchRecent) {
      const conversation = await Conversation.findOne({
        $or: [{ providerId: userId }, { seekerId: userId }],
      }).sort({ createdAt: -1 }).populate("providerId seekerId", "name email");

      if (!conversation) {
        return NextResponse.json({ success: false, error: 'No conversations found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: conversation }, { status: 200 });
    } else {
      const conversations = await Conversation.find({
        $or: [{ providerId: userId }, { seekerId: userId }],
      }).populate("providerId seekerId", "name email");

      return NextResponse.json({ success: true, data: conversations }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ success: false, error: "Error fetching conversations" }, { status: 500 });
  }
}