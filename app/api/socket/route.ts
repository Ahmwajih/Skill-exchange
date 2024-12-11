import { Server } from "socket.io";
import { NextRequest, NextResponse } from 'next/server';

let io: Server | undefined;

export async function GET(request: NextRequest) {
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

      socket.on("send_message", (message) => {
        const { text, room } = message;
        console.log(`Message received in room ${room}:`, text);
        io.to(room).emit("receive_message", message);
      });

      socket.on("accept_deal", ({ providerEmail, providerName, seekerEmail, seekerName }) => {
        console.log(`${providerName} has accepted the deal.`);
        io.to(providerEmail).emit("deal_accepted", { providerEmail, providerName, seekerEmail, seekerName });
        io.to(seekerEmail).emit("deal_accepted", { providerEmail, providerName, seekerEmail, seekerName });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ message: 'Socket server initialized' });
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };