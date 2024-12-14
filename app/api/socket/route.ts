import Pusher from 'pusher';
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import Conversation from "@/models/Conversation";

const pusher = new Pusher({
  appId: '1911591',
  key: 'b85eae341f11d9507db7',
  secret: '45f52952bde088d9afc1',
  cluster: 'eu',
  useTLS: true,
});

export async function GET(request: NextRequest) {
  await db();

  pusher.trigger('my-channel', 'my-event', {
    message: 'hello world'
  });

  return NextResponse.json({ message: 'Pusher server initialized' });
}