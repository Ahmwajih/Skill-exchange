"use client";

import React, { useState, useEffect } from "react";
import RadioButton from "@/app/components/RadioButton";
import SkillCard from "@/app/components/SkillCard";
import avatar from "@/app/public/avatar.jpg";

const FiltredCountry: React.FC<{ searchResults: any[] }> = ({
  searchResults,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [filteredSkills, setFilteredSkills] = useState(searchResults);

  useEffect(() => {
    setFilteredSkills(searchResults);
  }, [searchResults]);

  useEffect(() => {
    if (selectedCountry === "All") {
      setFilteredSkills(searchResults);
    } else {
      setFilteredSkills(
        searchResults.filter(
          (skill) =>
            skill.user.country.toLowerCase() === selectedCountry.toLowerCase()
        )
      );
    }
  }, [selectedCountry, searchResults]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    <div className="bg-white">
      <div className="p-6 bg-white rounded-md shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray">Filter by Country</h2>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="block bg-white w-full mt-1 rounded-md border-gray shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="All">All</option>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
        </select>
        <p className="mt-4 text-gray">
          Selected Country: <strong>{selectedCountry}</strong>
        </p>
      </div>

      <div className="container sm:mx-2 bg-white mx-auto lg:px-2 mt-6">
        <div className="grid cursor-pointer cardContainer sm:mx-2 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill: any) => (
              <SkillCard
                key={skill._id}
                id={skill._id}
                imageSrc={skill.photo || avatar}
                title={skill.title}
                category={skill.category}
              />
            ))
          ) : (
            <p className="text-gray">
              No skills found for the selected country.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltredCountry;
