// src/components/login/auth/LoginForm.jsx
import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black  " >
      <Input
        label="username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        error={fieldErrors.username}
        disabled={loading}
        placeholder="Enter your username"
      />

      <Input
        label="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        disabled={loading}
        placeholder="Enter your password"
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button className="cursor-pointer" type="submit" loading={loading} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
