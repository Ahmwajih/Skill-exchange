import { Server } from "socket.io";
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import Conversation from "@/models/Conversation";

let io: Server | undefined;

export async function GET(request: NextRequest) {
  await db();

  if (!io) {
    io = new Server({
      cors: {
        origin: 'http://localhost:3000',
      },
      path: '/api/socket', // Ensure this matches your client configuration
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      socket.on("send_message", async (message) => {
        const { text, room, senderId } = message;

        console.log(`Message received in room ${room}:`, text);

        try {
          const conversation = await Conversation.findOneAndUpdate(
            { 
              $or: [
                { providerId: room },
                { seekerId: room }
              ]
            },
            { 
              $push: { messages: { senderId, content: text, timestamp: new Date() } }
            },
            { new: true, upsert: true }
          );

          io.to(room).emit("receive_message", message);
          console.log("Message saved to conversation:", conversation);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });

      socket.on("accept_deal", async ({ providerId, seekerId }) => {
        console.log(`${providerId} has accepted the deal.`);
        
        const room = providerId;
        socket.join(room);
        
        const newConversation = await Conversation.create({
          providerId,
          seekerId,
          messages: [],
        });

        io.to(room).emit("deal_accepted", { providerId, seekerId });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Attach the Socket.io server to the HTTP server
    if (request.nextUrl && request.nextUrl.server) {
      request.nextUrl.server.io = io;
    } else {
      console.error("Failed to attach Socket.io server: request.nextUrl.server is undefined");
    }
  }

  return NextResponse.json({ message: 'Socket server initialized' });
}