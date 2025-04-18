'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.post(`${API_URL}/api/user/reset-password-request`,
        { email }
      );
      setSuccessMsg('Password reset link sent to your email!');
      setEmail('');
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-md-6 d-none d-md-block p-0">
          <div
            className="w-100 vh-100"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1738168266307-1d1515cbca2b?w=500&auto=format&fit=crop&q=60")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light py-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
              <h2 className="text-center mb-4">Forgot Password</h2>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              {successMsg && (
                <div className="alert alert-success text-center py-2">{successMsg}</div>
              )}

              <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center mt-3">
                <a href="/" className="text-success text-decoration-none">
                  ← Back to Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
