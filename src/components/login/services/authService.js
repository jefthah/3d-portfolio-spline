// src/components/login/services/authService.js

import { API_URL } from '../../config/api';

class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;