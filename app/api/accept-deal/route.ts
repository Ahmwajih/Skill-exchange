import { NextRequest, NextResponse } from 'next/server';
import { Server } from "socket.io";

let io;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const providerEmail = searchParams.get('providerEmail');
  const providerName = searchParams.get('providerName');
  const seekerEmail = searchParams.get('seekerEmail');
  const seekerName = searchParams.get('seekerName');
  const { id } = params;

  if (!providerEmail || !providerName || !seekerEmail || !seekerName) {
    return NextResponse.json({ success: false, error: "Missing providerEmail, providerName, seekerEmail, or seekerName" }, { status: 400 });
  }

  if (!io) {
    io = new Server({
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.join(providerEmail);
      socket.join(seekerEmail);

      socket.on("send_message", (message) => {
        console.log("Message received:", message);
        io.to(providerEmail).emit("receive_message", message);
        io.to(seekerEmail).emit("receive_message", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    io.listen(3001); 
  }

  io.emit("deal_accepted", { providerEmail, providerName, seekerEmail, seekerName });

  return NextResponse.redirect(`${BASE_URL}/chat?providerEmail=${providerEmail}&providerName=${providerName}&seekerEmail=${seekerEmail}&seekerName=${seekerName}&id=${id}`);
}