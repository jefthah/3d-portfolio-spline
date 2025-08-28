// src/components/login/routes/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';
import authService from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        
        navigate('/dashboard'); 
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex flex-col cursor-pointer">
      {/* Header */}
      <header className="bg-green-900 text-white p-4 mx-4 mt-4 rounded-t-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold italic">
            Project Management System
          </h1>
          <div className="text-3xl font-bold font-serif">
            ᴊ
          </div>
        </div>
      </header>

      {/* Login Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-yellow-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-green-900 mb-2">
              Login
            </h2>
            <p className="text-sm text-gray-700">
              Achieve your goals by managing projects smarter with our management system
            </p>
          </div>

          <LoginForm 
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;