'use client';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/app/components/Navbar';
import FiltredCountry from '@/app/components/FiltredCountry';

function Pages() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <div>
      <Navbar onSearchResults={handleSearchResults} />
      <FiltredCountry searchResults={searchResults} />
    </div>
  );
}

export default Pages;