'use client';
import React, { useState, useEffect } from 'react';
import loading2 from "@/app/public/loading2.gif";
import Image from 'next/image';
import ChatWindow from "@/app/components/ChatWindow";
// import Message from "@/app/components/Message";
import Protect from "@/app/components/Protect";

function page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center bg-white items-center h-screen">
        <Image src={loading2} alt="Loading..." width={250} height={250} />
      </div>
    );
  }
  return (
    <Protect>
      <h1>Chat</h1>
      <ChatWindow />
      {/* <Message /> */}
    </Protect>
  )
}

export default page;