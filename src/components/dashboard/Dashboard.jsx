import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Group after filter
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
        className={`w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer flex items-center justify-between ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-green-500"
        }`}
      >
        <span
          className={
            selectedValues.length > 0 ? "text-gray-900" : "text-gray-400"
          }
        >
          {selectedValues.length > 0
            ? `${selectedValues.length} tech selected`
            : "Select technologies..."}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {getSelectedLabels()}
        </div>
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
                    className="flex items-center px-2 py-1.5 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => toggleOption(option.value)}
                      className="mr-2 text-green-600 cursor-text focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-white border-t p-2 flex justify-between">
            <button
              onClick={() => onChange([])}
              className="text-xs px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Clear all
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [], // array of values (e.g. ['react', 'nodejs'])
    githubRepo: "",
    deployLink: "",
    demoVideoUrl: "",
  });

  // Check auth + load projects
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      navigate("/login");
    } else {
      loadProjects();
    }
  }, [navigate]);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch(`${API_URL}/projects`);
      const result = await res.json();
      if (result?.success && result?.data) setProjects(result.data);
      else if (Array.isArray(result)) setProjects(result);
    } catch (e) {
      console.error("Error loading projects:", e);
    } finally {
      setLoadingProjects(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleTechStackChange = (newTechStack) => {
    setFormData((p) => ({ ...p, techStack: newTechStack }));
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
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Add all form fields
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("githubRepo", formData.githubRepo);
      data.append("deployLink", formData.deployLink);
      data.append("demoVideoUrl", formData.demoVideoUrl);

      // Add techStack as JSON string
      data.append("techStack", JSON.stringify(formData.techStack));

      if (imageFile) data.append("image", imageFile);

      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          techStack: [],
          githubRepo: "",
          deployLink: "",
          demoVideoUrl: "",
        });
        setImageFile(null);
        setImagePreview(null);
        loadProjects();
        alert("Project berhasil ditambahkan!");
      } else {
        alert("Error: " + (result?.message || "Failed to add project"));
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Yakin ingin hapus project ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadProjects();
        alert("Project berhasil dihapus!");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // Badges by category color
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

  return (
    <div
      className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-green-400 via-green-500 to-green-600 cursor-pointer"
      style={{ cursor: "default" }}
    >
      {/* Header */}

      <header className="sticky top-0 z-40 bg-green-900/90 backdrop-blur text-white text-xs sm:text-sm">
        <div className="mx-auto max-w-6xl px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <h1 className="font-semibold italic">
            <span className="block sm:hidden text-[11px] leading-tight">
              Project
            </span>
            <span className="block sm:hidden text-[11px] leading-tight">
              Management
            </span>
            <span className="block sm:hidden text-[11px] leading-tight">
              System
            </span>
            <span className="hidden sm:block">Project Management System</span>
          </h1>

          {/* Mobile menu button */}
          <button
            className="lg:hidden inline-flex items-center gap-1 px-2 py-1 rounded bg-green-800 hover:bg-green-700"
            onClick={() => setMobileMenuOpen((s) => !s)}
          >
            <span className="text-[10px] sm:text-xs">Menu</span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden lg:block text-2xl md:text-3xl font-bold font-serif">
            ᴊ
          </div>
        </div>

        {/* Mobile tabs */}
        <div
          className={`lg:hidden transition-all overflow-hidden ${
            mobileMenuOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <nav className="mx-auto max-w-6xl px-2 sm:px-4 pb-2 flex gap-1">
            {["dashboard", "account"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 px-2 py-1 rounded text-xl sm:text-2xl font-medium ${
                  activeTab === tab
                    ? "bg-orange-400 text-white"
                    : "bg-green-800 hover:bg-green-700 text-white/90"
                }`}
              >
                {tab === "dashboard" ? "Dashboard" : "Info Account"}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="px-2 py-1 rounded text-[10px] sm:text-xs font-medium bg-red-600 hover:bg-red-700 text-white"
            >
              Log Out
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6 flex flex-col lg:flex-row gap-4">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:w-60 shrink-0">
          <div className="bg-yellow-100 rounded-2xl p-4 sticky top-20">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                  activeTab === "dashboard"
                    ? "bg-orange-400 text-white"
                    : "hover:bg-yellow-200 text-gray-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                  activeTab === "account"
                    ? "bg-orange-400 text-white"
                    : "hover:bg-yellow-200 text-gray-700"
                }`}
              >
                Info Account
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-yellow-200 text-gray-700 transition-colors text-sm font-medium cursor-pointer"
              >
                Log Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-6">
          {activeTab === "dashboard" ? (
            <>
              {/* Form */}
              <div className="bg-yellow-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-600 mb-4 sm:mb-6">
                  Tambah Proyekmu
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Judul
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white cursor-text"
                      placeholder="Nama project kamu"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Deskripsi
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y text-gray-900 bg-white cursor-text"
                        placeholder="Deskripsi project"
                      />

                      {/* Tech Stack Dropdown */}
                      <div className="mt-4 text-black">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Tech Stack
                        </label>
                        <MultiSelectDropdown
                          selectedValues={formData.techStack}
                          onChange={handleTechStackChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FieldUrl
                        label="Github repo"
                        name="githubRepo"
                        value={formData.githubRepo}
                        onChange={handleChange}
                        loading={loading}
                        placeholder="https://github.com/..."
                      />
                      <FieldUrl
                        label="Link Deploy"
                        name="deployLink"
                        value={formData.deployLink}
                        onChange={handleChange}
                        loading={loading}
                        placeholder="https://..."
                      />
                      <FieldUrl
                        label="Demo Video (YouTube/Drive)"
                        name="demoVideoUrl"
                        value={formData.demoVideoUrl}
                        onChange={handleChange}
                        loading={loading}
                        placeholder="https://youtube.com/... atau https://drive.google.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                        className="hidden"
                      />
                      <div className="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition cursor-text">
                        📁 Upload Image
                      </div>
                    </label>

                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Menyimpan..." : "Tambah Project"}
                  </button>
                </form>
              </div>

              {/* Projects List */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Your Projects
                </h3>

                {loadingProjects ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-600">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    No projects yet. Add your first project above!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((p) => (
                      <div
                        key={p._id || p.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                      >
                        {p.imageUrl && (
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-40 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {p.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {p.description}
                          </p>

                          {/* Tech Stack Badges */}
                          {p.techStack && p.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {getTechBadges(p.techStack)}
                            </div>
                          )}

                          <div className="flex gap-2 flex-wrap mb-3 cursor-pointer">
                            {p.githubRepo && (
                              <a
                                href={p.githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 cursor-pointer"
                              >
                                GitHub
                              </a>
                            )}
                            {p.deployLink && (
                              <a
                                href={p.deployLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                              >
                                🌐 Live Site
                              </a>
                            )}
                            {p.demoVideoUrl && (
                              <a
                                href={p.demoVideoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                📹 Demo Video
                              </a>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/dashboard/update/${p._id || p.id}`)
                              }
                              className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-medium cursor-pointer"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p._id || p.id)}
                              className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Account
            <div className="bg-yellow-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-4 sm:mb-6">
                Info Account
              </h2>

              <div className="space-y-4">
                <FieldReadOnly label="Username" value={user.username || ""} />
                <FieldReadOnly label="Email" value={user.email || ""} />
                <FieldReadOnly label="User ID" value={user.id || ""} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const FieldUrl = ({ label, name, value, onChange, loading, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      type="url"
      name={name}
      value={value}
      onChange={onChange}
      disabled={loading}
      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white cursor-text"
      placeholder={placeholder}
    />
  </div>
);

const FieldReadOnly = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-green-900 mb-1.5">
      {label}
    </label>
    <input
      type="text"
      value={value}
      disabled
      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900  cursor-text"
    />
  </div>
);

export default Dashboard;
