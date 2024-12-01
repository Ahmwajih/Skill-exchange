import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "@/lib/features/auth/authSlice";

interface ChangePasswordModalProps {
  onClose: () => void;
  userId: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, userId }) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordChangeInfo = {
      currentPassword,
      newPassword,
    };

    await dispatch(changePassword(userId, passwordChangeInfo));

    onClose();
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Change Password
            </button>
            <button type="button" onClick={onClose} className="ml-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;