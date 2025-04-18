'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await axios.post('http://localhost:5500/api/auth/signup', formData);
      alert('Sign Up Successful!');
      router.push('/');
    } catch (err: any) {
      setGeneralError(err?.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-6 d-none d-md-block p-0">
          <div
            className="h-100"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1738168266307-1d1515cbca2b?w=500&auto=format&fit=crop&q=60")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <form onSubmit={handleSubmit} className="w-100 px-4" style={{ maxWidth: '400px' }}>
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Sign Up</h2>

                {generalError && <div className="alert alert-danger">{generalError}</div>}

                <InputField
                  label="Username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  error={errors.username}
                />

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={errors.email}
                />

                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  error={errors.password}
                />

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  error={errors.confirmPassword}
                />

                <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>

                <div className="text-center mt-3">
                  Already have an account?{' '}
                  <Link href="/" className="text-success text-decoration-none">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

function InputField({ label, name, type, value, onChange, placeholder, error }: InputFieldProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? 'is-invalid' : ''}`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
