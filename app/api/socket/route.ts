import Pusher from 'pusher';
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import Conversation from "@/models/Conversation";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function GET(request: NextRequest) {
  await db();

  pusher.trigger('my-channel', 'my-event', {
    message: 'hello world'
  });

  return NextResponse.json({ message: 'Pusher server initialized' });
}