'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { selectedUserById } from '@/lib/features/dashboard/userSlice';
import avatar from '@/app/public/avatar.jpg';
import Image from 'next/image';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import ModalConversation from '@/app/components/ModalConversation';

interface Provider {
  _id: string;
  name: string;
  email: string;
  country: string;
  bio?: string;
  photo?: string;
  languages: string[];
  LinkedIn?: string;
  Github?: string;
  skillsLookingFor: string[];
  skills: string[];
}

const SkillProviderDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  
    useEffect(() => {
      if (id) {
        dispatch(selectedUserById(id))
          .unwrap()
          .then((response) => {
            if (response.success) {
              setProvider(response.data);
            } else {
              console.error('Failed to fetch provider:', response.message);
            }
          })
          .catch((error) => {
            console.error('Failed to fetch provider:', error);
            alert('An error occurred while fetching provider details.');
          });
      }
    }, [dispatch, id]);
  
    const handleStartConversation = () => {
      setShowModal(true);
      console.log('Start a conversation');
    };
  
    const handleCancelConversation = () => {
      setShowModal(false);
      console.log('Cancel conversation'); 
    };


  if (!provider) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-600">Provider not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-full max-h-full p-6 bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex items-center gap-6 mt-3 mb-8 max-w-6xl">
        <Image
          src={provider.photo || avatar}
          alt={provider.name}
          width={120}
          height={120}
          className="rounded-full border border-gray object-cover"
        />
        <div>
          <h1 className="text-3xl  font-bold text-brown">{provider.name}</h1>
          <p className="text-gray pt-3 text-justify text-wrap ">{provider.bio || 'No bio available'}</p>
        </div>
      </div>

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-brown">Location</h2>
          <p className="text-gray">{provider.country || 'Not specified'}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-brown">Languages</h2>
          <p className="text-gray">
            {provider.languages.length > 0
              ? provider.languages.join(', ')
              : 'No languages specified'}
          </p>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-6 mb-8">
        {provider.LinkedIn && (
          <a
            href={provider.LinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue hover:text-blue transition"
          >
            <FaLinkedin size={24} />
            <span>LinkedIn</span>
          </a>
        )}
        {provider.Github && (
          <a
            href={provider.Github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black hover:text-gray-600 transition"
          >
            <FaGithub size={24} />
            <span>GitHub</span>
          </a>
        )}
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-brown mb-4">Skills Offered</h2>
          {provider.skills.length > 0 ? (
            <ul className="list-disc list-inside text-gray">
              {provider.skills.map((skill, index) => (
                <li key={index}>{skill.title}</li> 
              ))}
            </ul>
          ) : (
            <p className="text-gray">No skills offered</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-brown mb-4">Skills Needed</h2>
          {provider.skillsLookingFor.length > 0 ? (
            <ul className="list-disc list-inside text-gray">
              {provider.skillsLookingFor.map((skill, index) => (
                <li key={index}>{skill.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray">No skills needed</p>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick= { handleStartConversation } 
          className="bg-blue text-white py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition">
          Start a Conversation
        </button>
        {showModal && (<ModalConversation providerName={provider.name} providerEmail={provider.email} closeModal={handleCancelConversation} />)}
          
      </div>
     

    </div>
  );
};

export default SkillProviderDetails;