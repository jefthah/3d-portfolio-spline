// src/components/dashboard/ProjectForm.jsx
import React, { useState } from 'react';

const ProjectForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubRepo: '',
    deployLink: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData object for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('githubRepo', formData.githubRepo);
      data.append('deployLink', formData.deployLink);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await onSubmit(data);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        githubRepo: '',
        deployLink: ''
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-100 rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-cyan-600 mb-6">Tambah Proyekmu</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nama project kamu"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Deskripsi project"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Github repo
              </label>
              <input
                type="url"
                name="githubRepo"
                value={formData.githubRepo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Deploy
              </label>
              <input
                type="url"
                name="deployLink"
                value={formData.deployLink}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition">
              📁 Upload Image
            </div>
          </label>
          
          {imagePreview && (
            <div className="mt-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-20 w-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : 'Tambah Project'}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;