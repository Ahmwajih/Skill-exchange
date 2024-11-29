"use client";
import React, { useState, useEffect  } from "react";
import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createUserProfile } from "@/lib/features/dashboard/userSlice";
import avatarPlaceholder from "@/app/public/avatar.jpg";
import AddSkillModal from "./AddSkillModal";
import Image from "next/image";
import germanyFlag from '@/app/public/germany.png'; 
import canadaFlag from '@/app/public/canada.png'; 

const countryFlags = {
  Germany: germanyFlag,
  Canada: canadaFlag,
};

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    country: "",
    skillsLookingFor: "",
    skills: [],
    avatar: avatarPlaceholder,
    photoBase64: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.displayName || "Guest",
        email: user.email || "",
      }));
    }
  }, []);

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          avatar: URL.createObjectURL(file),
          photoBase64: reader.result?.toString().split(",")[1] || "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...profileData,
      skillsLookingFor: profileData.skillsLookingFor
        .split(",")
        .map((skill) => skill.trim()),
    };

    dispatch(createUserProfile(dataToSubmit));
    router.push("/main");
  };

  const addSkill = (newSkill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setShowModal(false);
  };

  return (
    <div className="container bg-white mx-auto p-6">
      <h2 className="text-2xl text-brown font-bold mb-4">
        Welcome, {profileData.name || "Guest"}!
      </h2>
      <p className="text-lg text-brown mb-4">Create your profile</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-brown">Avatar</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <img
            src={profileData.avatar}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-brown">Country</label>
          <select
            name="country"
            value={profileData.country}
            onChange={handleChange}
            className="bg-white mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select your country</option>
            {Object.keys(countryFlags).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-brown">Skills</label>
          <textarea
            name="skills"
            value={profileData.skills.join(", ")}
            readOnly
            placeholder="Skills will be added here"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            rows={3}
          />
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-2 bg-blue text-white py-1 px-3 rounded-md hover:bg-blue-600"
          >
            Add Skill
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-brown">
            Skills Looking For
          </label>
          <textarea
            name="skillsLookingFor"
            value={profileData.skillsLookingFor}
            onChange={handleChange}
            placeholder="Enter skills looking for separated by commas"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-orange text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Create Profile
        </button>
      </form>

      {showModal && (
        <AddSkillModal
          onClose={() => setShowModal(false)}
          onAddSkill={addSkill}
          userId={profileData.id}
        />
      )}
    </div>
  );
};

export default Profile;
