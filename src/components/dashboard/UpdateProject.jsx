// src/components/dashboard/UpdateProject.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../components/config/api";
import { TECH_BY_CATEGORY, ALL_TECH_OPTIONS } from "../constants/techStack";

// Multi-Select Dropdown Component
const MultiSelectDropdown = ({ selectedValues, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = ALL_TECH_OPTIONS.filter(
    (o) =>
      o.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = filtered.reduce((acc, o) => {
    (acc[o.category] ||= []).push(o);
    return acc;
  }, {});

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const getSelectedLabels = () =>
    selectedValues
      .map((val) => ALL_TECH_OPTIONS.find((opt) => opt.value === val)?.label)
      .filter(Boolean)
      .join(", ");

  return (
    <div className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white flex items-center justify-between ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-green-500 cursor-pointer"
        }`}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <span className={selectedValues.length > 0 ? "text-gray-900" : "text-gray-400"}>
          {selectedValues.length > 0
            ? `${selectedValues.length} tech selected`
            : "Select technologies..."}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">Selected: {getSelectedLabels()}</div>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
          <div className="sticky top-0 bg-white p-2 border-b">
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500 cursor-text"
              style={{ cursor: 'text' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="p-2">
            {Object.entries(grouped).map(([category, options]) => (
              <div key={category} className="mb-3">
                <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                  {category}
                </div>
                {options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => toggleOption(option.value)}
                      className="mr-2 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-white border-t p-2 flex justify-between">
            <button 
              onClick={() => onChange([])} 
              className="text-xs px-3 py-1 text-gray-600 hover:text-gray-800 cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              Clear all
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [],
    githubRepo: "",
    deployLink: "",
    demoVideoUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadProject();
  }, [id, navigate]);

  const loadProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      console.log("Loaded project data:", result); // Debug log

      if (result.success && result.data) {
        // Ensure techStack is array
        const techStackArray = Array.isArray(result.data.techStack) 
          ? result.data.techStack 
          : [];
        
        console.log("Tech stack loaded:", techStackArray); // Debug log
        
        setFormData({
          title: result.data.title || "",
          description: result.data.description || "",
          techStack: techStackArray,
          githubRepo: result.data.githubRepo || "",
          deployLink: result.data.deployLink || "",
          demoVideoUrl: result.data.demoVideoUrl || "",
        });
        
        if (result.data.imageUrl) {
          setImagePreview(result.data.imageUrl);
        }
      }
    } catch (err) {
      console.error("Error loading project:", err);
      alert("Failed to load project");
    } finally {
      setLoadingProject(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechStackChange = (newTechStack) => {
    console.log("Tech stack changed:", newTechStack); // Debug log
    setFormData((prev) => ({ ...prev, techStack: newTechStack }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("Submitting with tech stack:", formData.techStack); // Debug log
    
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("githubRepo", formData.githubRepo);
      data.append("deployLink", formData.deployLink);
      data.append("demoVideoUrl", formData.demoVideoUrl);
      
      // IMPORTANT: Send techStack as JSON string
      data.append("techStack", JSON.stringify(formData.techStack));
      
      if (imageFile) data.append("image", imageFile);

      // Debug log FormData
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      
      const result = await response.json();

      if (response.ok) {
        alert("Project berhasil diupdate!");
        navigate("/dashboard");
      } else {
        alert("Error: " + (result.message || "Failed to update project"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/dashboard");

  // Badges preview
  const getTechBadges = (techStack) => {
    if (!techStack || techStack.length === 0) return null;

    const colors = {
      Frontend: "bg-blue-100 text-blue-700",
      Backend: "bg-green-100 text-green-700",
      Language: "bg-purple-100 text-purple-700",
      Database: "bg-orange-100 text-orange-700",
      Tools: "bg-gray-100 text-gray-700",
    };

    return techStack
      .map((tech) => {
        const info = ALL_TECH_OPTIONS.find((opt) => opt.value === tech);
        if (!info) return null;
        return (
          <span
            key={tech}
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              colors[info.category] || "bg-gray-100 text-gray-700"
            }`}
          >
            {info.label}
          </span>
        );
      })
      .filter(Boolean);
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 pt-6 sm:pt-8">
      {/* Add global cursor styles */}
      <style jsx global>{`
        * {
          cursor: auto;
        }
        input, textarea {
          cursor: text !important;
        }
        button, a, label {
          cursor: pointer !important;
        }
        button:disabled {
          cursor: not-allowed !important;
        }
      `}</style>

      <header className="bg-green-900 text-white p-4 flex justify-between items-center rounded-t-2xl mx-4">
        <h1 className="text-xl font-semibold italic">Update Project</h1>
        <div className="text-3xl font-bold font-serif">ᴊ</div>
      </header>

      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 rounded-2xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-600">Update Proyekmu</h2>
              <button 
                onClick={handleCancel} 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                ← Kembali
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white cursor-text"
                  style={{ cursor: loading ? 'not-allowed' : 'text' }}
                  placeholder="Nama project kamu"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-900 bg-white cursor-text"
                    style={{ cursor: loading ? 'not-allowed' : 'text' }}
                    placeholder="Deskripsi project"
                  />

                  {/* Tech Stack Dropdown */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                    <MultiSelectDropdown
                      selectedValues={formData.techStack}
                      onChange={handleTechStackChange}
                      disabled={loading}
                    />

                    {/* Preview */}
                    {formData.techStack.length > 0 && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Preview:</p>
                        <div className="flex flex-wrap gap-1">{getTechBadges(formData.techStack)}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Github repo</label>
                    <input
                      type="url"
                      name="githubRepo"
                      value={formData.githubRepo}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white cursor-text"
                      style={{ cursor: loading ? 'not-allowed' : 'text' }}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Deploy</label>
                    <input
                      type="url"
                      name="deployLink"
                      value={formData.deployLink}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white cursor-text"
                      style={{ cursor: loading ? 'not-allowed' : 'text' }}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demo Video (YouTube/Drive)
                    </label>
                    <input
                      type="url"
                      name="demoVideoUrl"
                      value={formData.demoVideoUrl}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white cursor-text"
                      style={{ cursor: loading ? 'not-allowed' : 'text' }}
                      placeholder="https://youtube.com/... atau https://drive.google.com/..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Project</label>

                {imagePreview && (
                  <div className="mb-3">
                    <img src={imagePreview} alt="Preview" className="h-40 w-auto object-cover rounded border" />
                  </div>
                )}

                <label className="cursor-pointer" style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <div className="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition cursor-pointer">
                    📁 {imagePreview ? "Ganti Gambar" : "Upload Gambar"}
                  </div>
                </label>

                {imageFile && (
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="ml-3 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  >
                    Batalkan gambar baru
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition disabled:opacity-50"
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? "Menyimpan..." : "Update Project"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;