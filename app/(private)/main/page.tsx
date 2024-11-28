'use client';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/app/components/Navbar';
import Protect from "@/app/components/Protect"; 


import FiltredCountry from '@/app/components/FiltredCountry';
import Footer from "@/app/components/Footer";



function Pages() {
  const [searchResults, setSearchResults] = useState([]);
  // const router = useRouter();
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);


  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <Protect>
   
      <Navbar onSearchResults={handleSearchResults} />
      <FiltredCountry searchResults={searchResults} />
      <Footer />
      
    </Protect>
  );
}

export default Pages;