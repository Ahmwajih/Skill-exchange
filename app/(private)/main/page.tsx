"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/Navbar";
import Protect from "@/app/components/Protect";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import {
  searchSkills,
  setSearchResults,
} from "@/lib/features/skills/skillsSlice";

import FiltredCountry from "@/app/components/FiltredCountry";
import Footer from "@/app/components/Footer";

function Pages() {
  const searchResults = useSelector(
    (state: RootState) => state.skills.searchResults
  );


  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <Protect>
      <Navbar />
      <FiltredCountry searchResults={searchResults} />
      <Footer />
    </Protect>
  );
}

export default Pages;
