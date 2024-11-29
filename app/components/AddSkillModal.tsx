'use client';
import React, { useState } from 'react';

const AddSkillModal = ({ onClose, onAddSkill, userId }) => {
  const [skillTitle, setSkillTitle] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [skillPhoto, setSkillPhoto] = useState(null);
  const [photoBase64, setPhotoBase64] = useState('');

  const categories = [
    "Machine Learning",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Cybersecurity",
    "DevOps",
    "AI Development",
    "Graphic Design",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSkillPhoto(file); // Store the file for submission
        setPhotoBase64(reader.result.split(',')[1]); // Store base64 for submission
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (skillTitle && skillDescription && skillCategory) {
      const newSkill = {
        title: skillTitle,
        description: skillDescription,
        category: skillCategory,
        photo: photoBase64, // Include the Base64 photo data
        userId: userId, // Associate the skill with the user ID
      };
      
      onAddSkill(newSkill); 
      clearFields();
    }
  };

  const clearFields = () => {
    setSkillTitle('');
    setSkillDescription('');
    setSkillCategory('');
    setSkillPhoto(null);
    setPhotoBase64('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg text-brown font-semibold mb-4">Add New Skill</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-brown text-sm font-medium">Title</label>
            <input 
              type="text" 
              value={skillTitle}
              onChange={(e) => setSkillTitle(e.target.value)}
              required
              className="mt-1 block bg-white w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-brown text-sm font-medium">Description</label>
            <textarea 
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
              required
              rows={3}
              className="mt-1 block bg-white w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-brown text-sm font-medium">Category</label>
            <select 
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-brown text-sm font-medium">Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray text-white py-1 px-3 rounded-md hover:bg-gray-400 transition duration-200">
              Cancel
            </button>
            <button type="submit" className="bg-orange text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200">
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;