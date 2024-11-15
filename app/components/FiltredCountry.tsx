'use client';

import React, { useState, useEffect } from "react";
import RadioButton from "@/app/components/RadioButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, filterUsersByCountry } from "@/lib/features/dashboard/userSlice";
import { getSkills } from "@/lib/features/skills/skillsSlice";
import SkillCard from "@/app/components/SkillCard";
import avatar from "@/app/public/avatar.jpg";

const CountryFilter = () => {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const dispatch = useDispatch();

  const filteredUsers = useSelector((state: any) => state.users.filteredUsers);
  const skills = useSelector((state: any) => state.data);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(getSkills());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterUsersByCountry(selectedCountry));
  }, [selectedCountry, dispatch]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    <div className="bg-white">
      <div className="p-6 bg-white rounded-md shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray">Filter by Country</h2>
        <RadioButton
          options={["Canada", "Germany", "All"]}
          selectedOption={selectedCountry}
          onChange={handleCountryChange}
        />
        <p className="mt-4 text-gray">
          Selected Country: <strong>{selectedCountry}</strong>
        </p>
      </div>

      <div className="container sm:mx-2 bg-white mx-auto lg:px-2 mt-6">
        <div className="grid cardContainer sm:mx-2 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: any) => (
              <SkillCard
                key={user._id}
                imageSrc={user.photo || avatar}
                title={user.name}
                category={user.country}
              />
            ))
          ) : (
            <p className="text-gray">No users found for the selected country.</p>
          )}
        </div>
      </div>

      <div className="container bg-white mx-auto lg:px-2 mt-6">
        <div className="grid cardContainer sm:mx-2 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
          {skills && skills.length > 0 ? (
            skills.map((skill: any) => (
              <SkillCard
                key={skill._id}
                imageSrc={skill.photo || avatar}
                title={skill.title}
                category={skill.category}
              />
            ))
          ) : (
            <p className="text-gray">No skills found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryFilter;
