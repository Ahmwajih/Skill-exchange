import { NextRequest, NextResponse } from 'next/server';
import { Server } from "socket.io";

let io;

export async function GET(req: NextRequest, res: NextResponse) {
    const { providerEmail, providerName } = req.query;


    if (!res.socket.server.io) {
      io = new Server(res.socket.server, {
        path: "/api/socket",
        cors: {
          origin: "*",
        },
      });

      res.socket.server.io = io;
      
      io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.join(providerEmail);

        socket.on("send_message", (message) => {
          console.log("Message received:", message);
          io.to(providerEmail).emit("receive_message", message); 
        });

        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
      });

    io.emit("deal_accepted", { providerEmail, providerName });

    return res.status(200).json({ success: true, message: "Deal accepted" });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}