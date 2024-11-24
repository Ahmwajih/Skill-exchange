'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { selectedUserById } from '@/lib/features/dashboard/userSlice';
import avatar from '@/app/public/avatar.jpg';
import Image from 'next/image';
import loading2 from '@/app/public/loading2.gif';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

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
  const [message, setMessage] = useState('');
  const [timeFrame, setTimeFrame] = useState('1 day');
  const [showDealFields, setShowDealFields] = useState(false);
  const [skillsOffered, setSkillsOffered] = useState('');
  const [numberOfSessions, setNumberOfSessions] = useState(1);

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
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch provider:', error);
          alert('An error occurred while fetching provider details.');
          setLoading(false);
        });
    }
  }, [dispatch, id]);

  const handleStartConversation = () => {
    setShowModal(true);
  };

  const handleSend = () => {
    const dealDetails = showDealFields
      ? `\nProposed Deal:\nTime Frame: ${timeFrame}\nSkills Offered: ${skillsOffered}\nNumber of Sessions: ${numberOfSessions}`
      : '';

    alert(`Message sent to the provider:\nMessage: ${message}${dealDetails}`);
    setShowModal(false);
    resetFields();
  };

  const handleCancel = () => {
    setShowModal(false);
    resetFields();
  };

  const resetFields = () => {
    setMessage('');
    setTimeFrame('1 day');
    setShowDealFields(false);
    setSkillsOffered('');
    setNumberOfSessions(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center bg-white items-center h-screen">
        <Image src={loading2} alt="Loading..." width={200} height={200} />
      </div>
    );
  }

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
                <li key={index}>{skill}</li>
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
                <li key={index}>{skill}</li>
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
          onClick={handleStartConversation}
          className="bg-blue text-white py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Start a Conversation
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog
          id="conversation-modal"
          open
          className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
        >
          <div className="modal-box w-11/12 max-w-5xl bg-white p-6 rounded-md shadow-lg">
            <h3 className="font-bold text-brown text-xl mb-4">
              Start a Conversation with {provider.name}
            </h3>
            <p className="text-gray mb-6">
              Please introduce yourself with a brief message and mention what
              you are looking for and what you can offer.
            </p>

            {/* Message Input */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-brown mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border bg-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g Hi, I'm a frontend developer looking to improve my skills. I can offer help with React and JavaScript. I'm interested in learning more about Node.js and backend development."
                rows={4}
              />
            </div>

            {/* Propose a Deal Dropdown */}
            <div className="mb-4">
              <button
                onClick={() => setShowDealFields(!showDealFields)}
                className="w-full bg-orange text-white py-2 px-4 border rounded-md hover:bg-orange"
              >
                {showDealFields ? 'Remove Deal' : 'Propose a Deal'}
              </button>
            </div>

            {/* Deal Fields */}
            {showDealFields && (
              <div className="deal-fields">
                {/* Time Frame Dropdown */}
                <div className="mb-4">
                  <label
                    htmlFor="timeFrame"
                    className="block text-sm font-medium text-brown mb-2"
                  >
                    Time Frame
                  </label>
                  <select
                    id="timeFrame"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="w-full px-4 bg-white py-2 border text-gray rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1 day">1 day</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                  </select>
                </div>

                {/* Skills Offered */}
                <div className="mb-4">
                  <label
                    htmlFor="skillsOffered"
                    className="block text-sm font-medium text-brown mb-2"
                  >
                    Skills Offered
                  </label>
                  <textarea
                    id="skillsOffered"
                    value={skillsOffered}
                    onChange={(e) => setSkillsOffered(e.target.value)}
                    className="w-full bg-white px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List the skills you can offer (e.g., Web Development, Graphic Design)..."
                    rows={3}
                  />
                </div>

                {/* Number of Sessions Desired */}
                <div className="mb-4">
                  <label
                    htmlFor="numberOfSessions"
                    className="block text-sm font-medium text-brown mb-2"
                  >
                    Number of Sessions Desired
                  </label>
                  <input
                    type="number"
                    id="numberOfSessions"
                    value={numberOfSessions}
                    onChange={(e) =>
                      setNumberOfSessions(Number(e.target.value))
                    }
                    className="w-full bg-white px-4 py-2 text-gray border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    placeholder="Enter the number of sessions"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-action flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="btn bg-gray text-white py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="btn bg-blue text-white py-2 px-6 rounded-md hover:bg-blue"
              >
                Send
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default SkillProviderDetails;