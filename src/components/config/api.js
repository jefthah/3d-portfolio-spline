// src/config/api.js

export const API_URL = import.meta.env.VITE_API_URL

// Export configuration
export const config = {
  API_URL,
  endpoints: {
    projects: `${API_URL}/projects`,
    auth: {
      login: `${API_URL}/auth/login`,
      register: `${API_URL}/auth/register`,
      verify: `${API_URL}/auth/verify`,
    },
    health: `${API_URL}/health`,
  },
};

// Helper function untuk fetch dengan error handling
export const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default config;