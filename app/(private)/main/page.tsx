'use client';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/app/components/Navbar';
import FiltredCountry from '@/app/components/FiltredCountry';
import Footer from "@/app/components/Footer";


function Pages() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <div>
      <Navbar onSearchResults={handleSearchResults} />
      <FiltredCountry searchResults={searchResults} />
      <Footer />
      
    </div>
  );
}

export default Pages;