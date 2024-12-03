'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { selectedUserById } from '@/lib/features/dashboard/userSlice';
import { addSkillToUser } from '@/lib/features/skills/skillsSlice';
import Link from 'next/link';
import Image from 'next/image';

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    photo: '',
    followers: 0,
    memberSince: '',
    skills: [],
    skillsLookingFor: [],
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(selectedUserById(user.id))
        .unwrap()
        .then((response) => {
          setProfileData({
            name: response.data.name,
            email: response.data.email,
            location: response.data.country,
            photo: response.data.photo,
            followers: 0,
            memberSince: 'October 2024',
            skills: response.data.skills || [],
            skillsLookingFor: response.data.skillsLookingFor || [],
          });
        });
    }
  }, [dispatch, user]);

  const calculateProfileStrength = () => {
    const fields = ['name', 'email', 'location', 'photo', 'skills', 'skillsLookingFor'];
    const completedFields = fields.filter(field => 
      profileData[field] && 
      (Array.isArray(profileData[field]) ? profileData[field].length > 0 : true)
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
              <Image
                src={profileData.photo || '/default-avatar.png'}
                alt="Profile"
                layout="fill"
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-semibold">{profileData.name}</h2>
            <p className="text-gray-600">{profileData.location}</p>
            <p className="text-gray-500 text-sm mt-2">
              Member since {profileData.memberSince}
            </p>
            <div className="mt-4">
              <span className="text-gray-600">
                <span className="font-bold">{profileData.followers}</span> followers
              </span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="mt-6 flex justify-center gap-2">
            <span className="bg-blue-100 p-2 rounded-full">
              <Image src="/linkedin.svg" width={20} height={20} alt="LinkedIn Verified" />
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Strength */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg">
                Profile Strength: <span className="text-red-500">{calculateProfileStrength()}%</span>
              </h3>
              <Link href="/edit-profile" className="text-blue-500 hover:underline">
                Edit Profile
              </Link>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 rounded-full h-2" 
                style={{ width: `${calculateProfileStrength()}%` }}
              ></div>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Hey, I'm {profileData.name?.split(' ')[0]}!</h2>
              <div className="flex items-center gap-2">
                <span>Vacation Mode</span>
                <button 
                  onClick={() => setIsVacationMode(!isVacationMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isVacationMode ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`block w-4 h-4 ml-1 rounded-full bg-white transform transition-transform ${
                    isVacationMode ? 'translate-x-6' : ''
                  }`}></span>
                </button>
              </div>
            </div>
          </div>

          {/* Skills Sections */}
          <div className="space-y-6">
            {/* Looking For */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg">Looking for:</h3>
                <Link href="/edit-interests" className="text-blue-500 hover:underline">
                  Edit Interests
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skillsLookingFor.map((skill, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Offered Services */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg mb-4">Offered Services</h3>
              <button 
                onClick={() => dispatch(addSkillToUser({ title: '', description: '', category: '' }))}
                className="w-full border-2 border-dashed border-blue-500 rounded-lg p-4 text-blue-500 hover:bg-blue-50"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;