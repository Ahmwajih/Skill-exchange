'use client';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/app/components/Navbar';
import Protect from "@/app/components/Protect"; // Adjust the path to your Protect component

// import { useRouter } from "next/navigation";
// import { useEffect } from 'react';
import FiltredCountry from '@/app/components/FiltredCountry';
import Footer from "@/app/components/Footer";
// import { useSelector } from "react-redux";



function Pages() {
  const [searchResults, setSearchResults] = useState([]);
  // const router = useRouter();
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);


  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <Protect>
    <div>
      <Navbar onSearchResults={handleSearchResults} />
      <FiltredCountry searchResults={searchResults} />
      <Footer />
      
    </div>
    </Protect>
  );
}

export default Pages;