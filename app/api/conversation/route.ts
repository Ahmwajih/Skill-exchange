import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1911591',
  key: 'b85eae341f11d9507db7',
  secret: '45f52952bde088d9afc1',
  cluster: 'eu',
  useTLS: true,
});

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

    pusher.trigger('conversation-channel', 'new-conversation', newConversation);

    return NextResponse.json({ success: true, data: newConversation }, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await db();

  try {
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');
    const seekerId = searchParams.get('seekerId');

    if (!providerId || !seekerId) {
      return NextResponse.json({ success: false, error: "Provider and Seeker IDs are required" }, { status: 400 });
    }

    const conversation = await Conversation.findOne({ providerId, seekerId });

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: conversation }, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}