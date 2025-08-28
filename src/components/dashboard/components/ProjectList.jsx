// src/components/dashboard/components/ProjectList.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';

const ProjectList = ({ projects, loading, onDelete }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Your Projects</h3>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No projects yet. Add your first project above!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id || project.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {project.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex gap-2 mb-3">
                  {project.githubRepo && (
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                    >
                      GitHub
                    </a>
                  )}
                  {project.deployLink && (
                    <a
                      href={project.deployLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Live Demo
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/update/${project._id || project.id}`)}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDelete(project._id || project.id)}
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
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
  );
};

export default ProjectList;