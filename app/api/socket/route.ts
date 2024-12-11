import { Server } from "socket.io";
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db"; // Ensure you have a database connection utility
import Conversation from "@/models/Conversation"; // Import your Conversation model

let io;

export async function GET(request) {
  if (!io) {
    io = new Server({
      cors: {
        origin: '*',
      },
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

        // Save message to conversation
        try {
          const conversation = await Conversation.findOneAndUpdate(
            { 
              $or: [
                { providerId: room },  // Assuming room is providerId
                { seekerId: room }     // Assuming room is seekerId
              ]
            },
            { 
              $push: { messages: { senderId, content: text, timestamp: new Date() } }
            },
            { new: true, upsert: true } // Create if not exists
          );

          io.to(room).emit("receive_message", message);
          console.log("Message saved to conversation:", conversation);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });

      socket.on("accept_deal", async ({ providerId, seekerId }) => {
        console.log(`${providerId} has accepted the deal.`);
        
        // Emit an event to both users to join the conversation
        const room = providerId; // Use providerId as room identifier
        socket.join(room); // Join the provider's room
        
        // Optionally create a new conversation in the DB here if needed
        const newConversation = await Conversation.create({
          providerId,
          seekerId,
          messages: [], // Start with an empty messages array
        });

        io.to(room).emit("deal_accepted", { providerId, seekerId });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ message: 'Socket server initialized' });
}
