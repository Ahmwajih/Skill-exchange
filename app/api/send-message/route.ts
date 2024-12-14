
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import Conversation from "@/models/Conversation";
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
    const { conversationId, senderId, content } = await req.json();

    if (!conversationId || !senderId || !content) {
      return NextResponse.json({ success: false, error: "Conversation ID, Sender ID, and Content are required" }, { status: 400 });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    const newMessage = { senderId, content, timestamp: new Date() };
    conversation.messages.push(newMessage);
    await conversation.save();

    pusher.trigger('conversation-channel', 'new-message', { conversationId, message: newMessage });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}