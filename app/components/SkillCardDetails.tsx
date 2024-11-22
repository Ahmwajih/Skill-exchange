"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { fetchSkillById } from '@/lib/features/skills/skillsSlice';
import avatar from '@/app/public/avatar.jpg';

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
  user: {
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const SkillCardDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchSkillById(id))
        .unwrap()
        .then((response) => {
          console.log('Fetched skill data:', response); 
          if (response.success) {
            setSkill(response.data); 
          } else {
            console.error('Failed to fetch skill: ', response.message);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch skill:', error);
          alert('An error occurred while fetching skill details.');
          setLoading(false);
        });
    }
  }, [dispatch, id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!skill) {
    return <p>Skill not found.</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4"><strong>Title:</strong> {skill.title}</h1>
      <img src={skill.photo || avatar} alt={skill.title} className="w-full h-64 object-cover mb-4" />
      <p className="text-gray-700 mb-4">{skill.description}</p>
      <p className="text-gray-700 mb-4"><strong>Category:</strong> {skill.category}</p>
      <p className="text-gray-700 mb-4"><strong>Country:</strong> {skill.user.country}</p>
      <p className="text-gray-700 mb-4"><strong>Created At:</strong> {new Date(skill.createdAt).toLocaleDateString()}</p>
      <p className="text-gray-700 mb-4"><strong>Updated At:</strong> {new Date(skill.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default SkillCardDetails;