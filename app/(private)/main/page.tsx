'use client';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/app/components/Navbar';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import FiltredCountry from '@/app/components/FiltredCountry';
import Footer from "@/app/components/Footer";
import { useSelector } from "react-redux";



function Pages() {
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

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