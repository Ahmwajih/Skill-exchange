import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/lib/store";
import { setUser, logoutUser } from "@/lib/features/auth/authSlice";
import { selectedUserById, createUserProfile } from "@/lib/features/dashboard/userSlice";
import { addSkillToUser } from "@/lib/features/skills/skillsSlice";
import avatarPlaceholder from "@/app/public/avatar.jpg";
import AddSkillModal from "./AddSkillModal";
import ChangePasswordModal from "./ChangePasswordModal";
import Image from 'next/image';
import germanyFlag from '@/app/public/germany.png'; 
import canadaFlag from '@/app/public/canada.png'; 

const countryFlags = {
    Germany: germanyFlag,
    Canada: canadaFlag,
};

const Profile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const skill = useSelector((state: RootState) => state.skills.skill);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    country: '',
    skillsLookingFor: '',
    skills: [],
    avatar: avatarPlaceholder,
    photoBase64: '',
  });
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      dispatch(selectedUserById(user.id)).then((response) => {
        if (response.payload) {
          const userData = response.payload.data;
          setProfile({
            name: userData.name,
            email: userData.email,
            country: userData.country,
            skillsLookingFor: userData.skillsLookingFor.join(", "),
            skills: userData.skills,
            avatar: userData.avatar || avatarPlaceholder,
            photoBase64: '',
          });
        }
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (firebaseUser) {
      const displayName = firebaseUser.displayName || firebaseUser.email.split('@')[0] || "Guest";
      const photoURL = firebaseUser.photoURL || avatarPlaceholder;
    

      if (!user) {
        dispatch(setUser({
          id: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email,
          photo: photoURL,
        }));
      }

      setProfile(prevProfile => ({
        ...prevProfile,
        name: displayName,
        email: firebaseUser.email,
        photo: photoURL,
      }));
    }
  }, [user, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prevProfile => ({
          ...prevProfile,
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
      ...profile,
      skillsLookingFor: profile.skillsLookingFor.split(",").map(skill => skill.trim()),
    };
    if (user && user.id) {
      dispatch(createUserProfile({ id: user.id, userData: dataToSubmit }));
      router.push("/main");
    }
  };

  const onAddSkill = async (skill) => {
    await dispatch(addSkillToUser(skill));
    }

  const handleDeleteAccount = () => {
    // Implement delete account functionality here
  };

  return (
    <div className="container bg-white mx-auto p-6 sm:px-4 lg:px-8 w-full">
      <h2 className="text-2xl text-brown font-bold mb-4">
        Welcome, {profile.name || "Guest"}!
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
            src={profile.photo}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-brown">Country</label>
          <select
            name="country"
            value={profile.country}
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
          <div className="bg-white mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            {profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (
                <div key={index} className="mb-2">
                  <strong>{skill.title}</strong> - {skill.category}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Skills will be added here</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowSkillModal(true)}
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
            value={profile.skillsLookingFor}
            onChange={handleChange}
            placeholder="Enter skills looking for separated by commas"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange text-white py-3 rounded-md hover:bg-blue-600"
        >
          Create Profile
        </button>
      </form>

      <button
        type="button"
        onClick={handleDeleteAccount}
        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 mt-4"
      >
        Delete Account
      </button>

      <button
        type="button"
        onClick={() => setShowPasswordModal(true)}
        className="w-full bg-blue text-white py-3 rounded-md hover:bg-blue-700 mt-4"
      >
        Change Password
      </button>

      {showSkillModal && (
        <AddSkillModal
          onClose={() => setShowSkillModal(false)}
          onAddSkill={onAddSkill}
          userId={user?.id} // Pass the user ID to the AddSkillModal
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          userId={user?.id} // Pass the user ID to the ChangePasswordModal
        />
      )}
    </div>
  );
};

export default Profile;