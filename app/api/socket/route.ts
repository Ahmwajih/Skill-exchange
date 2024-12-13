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
      path: '/api/socket', 
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
          let conversation = await Conversation.findOne({ _id: room });
      
          if (!conversation) {
            conversation = await Conversation.create({
              providerId: senderId,
              messages: [],
            });
          }
      
          const newMessage = { senderId, content: text, timestamp: new Date() };
          conversation.messages.push(newMessage);
          await conversation.save();
      
          io.to(room).emit("receive_message", newMessage);
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

    console.log("Socket.io server initialized");
  }

  return NextResponse.json({ message: 'Socket server initialized' });
}