import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {addSkillToUser} from "@/lib/features/skills/skillsSlice"

interface AddSkillModalProps {
  onClose: () => void;
  onAddSkill: (newSkill: {
    title: string;
    category: string;
    description?: string;
    photo?: string;
  }) => void;
  userId: string;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({
  onClose,
  // onAddSkill,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const dispatch = useDispatch();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result?.toString().split(",")[1] || "");
      };
      reader.readAsDataURL(file);
      console.log(photoBase64)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onAddSkill({ title, description, category, photo: photoBase64, user:userId });
    console.log(userId)
    await dispatch(addSkillToUser({title, description, category, photo: photoBase64, userId:userId}))
    console.log('skill added');
    setTitle("");
    setDescription("");
    setCategory("");
    setPhotoBase64("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-4 text-brown">
          Add Skill
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-brown"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-brown"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-brown"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-brown"
            >
              Upload a Photo
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray text-white py-2 px-4 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
