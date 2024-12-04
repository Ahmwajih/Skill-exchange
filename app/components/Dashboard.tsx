"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { selectedUserById } from "@/lib/features/dashboard/userSlice";
import { addSkillToUser } from "@/lib/features/skills/skillsSlice";
import { fetchSkillById } from "@/lib/features/skills/skillsSlice";
import ReactCountryFlag from "react-country-flag";
import AddSkillModal from "./AddSkillModal";
import Link from "next/link";
import Image from "next/image";
import LinkedIn from "@/app/public/LinkedIn.png";
import avatar from "@/app/public/avatar.jpg";

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  // const skills = useSelector((state: RootState) => state.skills.data);
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  console.log(user.id);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    location: "",
    photo: "",
    LinkedIn: "",
    followers: 0,
    memberSince: "",
    skills: [],
    skillsLookingFor: [],
    bio: "",
  });

  const handleAddSkill = () => {
    setShowAddSkillModal(true);
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(selectedUserById(user.id))
        .unwrap()
        .then((response) => {
          console.log(response.data.skills);
          setProfileData({
            name: response.data.name,
            email: response.data.email,
            country: response.data.country,
            photo: response.data.photo,
            followers: 0,
            memberSince: "October 2024",
            skills: response.data.skills || [],
            skillsLookingFor: response.data.skillsLookingFor || [],
            bio: response.data.bio || "No Bio",
          });
        });
    }
  }, [dispatch, user]);

  const calculateProfileStrength = () => {
    const fields = [
      "name",
      "email",
      "location",
      "photo",
      "skills",
      "skillsLookingFor",
    ];
    const completedFields = fields.filter(
      (field) =>
        profileData[field] &&
        (Array.isArray(profileData[field])
          ? profileData[field].length > 0
          : true)
    );
    return Math.round((completedFields.length / fields.length) * 100);
  };

  return (
    <div className="max-w-7xl w-2/3 bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={profileData.photo || avatar}
                alt="Profile"
                layout="fill"
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl text-brown font-semibold">
              {profileData.name}
            </h2>
            {profileData.country && (
              <ReactCountryFlag
                countryCode={profileData.country}
                svg
                style={{
                  width: "2em",
                  height: "2em",
                  marginRight: "0.5rem",
                }}
                title={profileData.country}
              />
            )}
            <p className="text-gray text-sm mt-2">
              Member since {profileData.memberSince}
            </p>
            <div className="mt-4">
              <span className="text-gray">
                <span className="font-bold">{profileData.followers}</span>{" "}
                followers
              </span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="mt-6 flex justify-center gap-2">
            {profileData.LinkedIn && (
              <span className="bg-blue p-2 rounded-full">
                <Link href={profileData.LinkedIn} passHref>
                  <a target="_blank" rel="noopener noreferrer">
                    <Image
                      src={LinkedIn}
                      width={20}
                      height={20}
                      alt="LinkedIn Verified"
                      className="hover:opacity-80 transition-opacity"
                    />
                  </a>
                </Link>
              </span>
            )}
          </div>
          <div className="mt-6">
            <p className="text-gray text-justify text-sm ">{profileData.bio}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Strength */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg text-gray">
                Profile Strength:{" "}
                <span className="text-red-500">
                  {calculateProfileStrength()}%
                </span>
              </h3>
              <Link href="/profile" className="text-blue hover:underline">
                Edit Profile
              </Link>
            </div>
            <div className="w-full bg-gray rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2"
                style={{ width: `${calculateProfileStrength()}%` }}
              ></div>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-gray">
                Hey, I'm {profileData.name?.split(" ")[0]}!
              </h2>
              <div className="flex items-center gap-2 text-gray">
                <span>Vacation Mode</span>
                <button
                  onClick={() => setIsVacationMode(!isVacationMode)}
                  className={`w-12 h-6 rounded-full  transition-colors ${
                    isVacationMode ? "bg-blue" : "bg-gray"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 ml-1 rounded-full bg-white transform transition-transform ${
                      isVacationMode ? "translate-x-6" : ""
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

          {/* Skills Sections */}
          <div className="space-y-6">
            {/* Looking For */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg text-gray">Looking for:</h3>
                <Link
                  href="/edit-interests"
                  className="text-blue hover:underline"
                >
                  Edit Interests
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skillsLookingFor.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Offered Services */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg text-gray mb-4">Offered Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profileData.skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="relative bg-white border rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    {/* Skill Image */}
                    <div
                      className="relative h-0 overflow-hidden"
                      style={{ paddingTop: "80%" }}
                    >
                      <img
                        src={skill.photo}
                        alt={skill.title}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg transition-opacity duration-300 hover:opacity-75"
                      />
                      {/* Hover Effect for Description */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 flex items-center justify-center p-4 rounded-t-lg transition-opacity duration-300">
                        <p className="text-center text-sm">
                          {skill.description}
                        </p>
                      </div>
                    </div>

                    {/* User Avatar */}
                    <div className="absolute top-2 left-2">
                      <img
                        src={profileData.photo || "/default-avatar.jpg"}
                        alt={profileData.name || "User"}
                        className="w-10 h-10 rounded-full border-2 border-white shadow"
                      />
                    </div>

                    {/* Title and Category */}
                    <div className="p-4 bg-white rounded-b-lg">
                      <h4 className="text-md font-semibold text-gray transition-opacity duration-300 hover:opacity-70">
                        {skill.title}
                      </h4>
                      <h6 className="text-sm text-gray transition-opacity duration-300 hover:opacity-50">
                        {skill.category}
                      </h6>
                    </div>
                  </div>
                ))}

                {/* Add Service Button Styled as a Card */}
                <button
                  onClick={handleAddSkill}
                  className="relative flex flex-col items-center justify-center border-dashed border-blue border rounded-lg p-4 text-blue hover:bg-blue-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 text-blue"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            {showAddSkillModal && (
              <AddSkillModal
                onClose={() => setShowAddSkillModal(false)}
                userId={user?.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
