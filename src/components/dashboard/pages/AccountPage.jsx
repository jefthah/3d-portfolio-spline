// src/components/dashboard/pages/AccountPage.jsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const AccountPage = () => {
  const { user } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    skills: user?.skills || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call API to update user info
      console.log('Updating user info:', formData);
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <div className="bg-yellow-100 rounded-2xl p-8 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-900">Info Account</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg border ${
                isEditing 
                  ? 'border-green-500 bg-white' 
                  : 'border-gray-300 bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg border ${
                isEditing 
                  ? 'border-green-500 bg-white' 
                  : 'border-gray-300 bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-900 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border ${
              isEditing 
                ? 'border-green-500 bg-white' 
                : 'border-gray-300 bg-gray-100'
            } focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-900 mb-2">
            Skills
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 rounded-lg border ${
              isEditing 
                ? 'border-green-500 bg-white' 
                : 'border-gray-300 bg-gray-100'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="React, Node.js, Python..."
          />
        </div>

        {isEditing && (
          <button
            type="submit"
            className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition"
          >
            Save Changes
          </button>
        )}
      </form>

      {/* Account Info */}
      <div className="mt-8 pt-8 border-t border-yellow-300">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Account Details</h3>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">User ID:</span> {user?.id}</p>
          <p><span className="font-medium">Member Since:</span> {new Date().toLocaleDateString()}</p>
          <p><span className="font-medium">Status:</span> <span className="text-green-600">Active</span></p>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;