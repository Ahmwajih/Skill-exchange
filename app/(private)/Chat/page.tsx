'use client';
import React, { useState, useEffect } from 'react';
import loading2 from "@/app/public/loading2.gif";
import Image from 'next/image';
import ChatWindow from "@/app/components/ChatWindow";
import Protect from "@/app/components/Protect";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const dynamic = 'force-dynamic'; // force dynamic

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  const handleSearchResults = () => {
    // Handle search results if needed
  };

  if (loading) {
    return (
      <div className="flex justify-center bg-white items-center h-screen">
        <Image src={loading2} alt="Loading..." width={250} height={250} />
      </div>
    );
  }
  return (
    <Protect>
      <Navbar onSearchResults={handleSearchResults} />
      <ChatWindow dealId={undefined} /> {/* Pass the required dealId prop */}
      <Footer companyName="Community Skill Trade" year={new Date().getFullYear()} /> {/* Pass the required props */}
    </Protect>
  )
}

export default Page;