// src/components/dashboard/services/projectService.js
import { API_URL } from '../../../config/api';

class ProjectService {
  async createProject(formData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project');
      }

      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async getProjects() {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }

      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { data: [] };
    }
  }

  async getProject(id) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch project');
      }

      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  async updateProject(id, formData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update project');
      }

      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete project');
      }

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

const projectService = new ProjectService();
export default projectService;


