'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Protect from "@/app/components/Protect";
import Footer from "@/app/components/Footer";
import loading2 from "@/app/public/loading2.gif";
import Image from 'next/image';
import FiltredCountry from '@/app/components/FiltredCountry';


function Page() {
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

//   if (loading) {
//     return (
//       <div className="flex justify-center bg-white items-center h-screen">
//         <Image src={loading2} alt="Loading..." width={250} height={250} />
//       </div>
//     );
//   }

  return (
    <Protect>
      <Navbar onSearchResults={handleSearchResults} />
      {/* <FiltredCountry searchResults={searchResults} /> */}

      <Footer />
    </Protect>
  );
}

export default Page;