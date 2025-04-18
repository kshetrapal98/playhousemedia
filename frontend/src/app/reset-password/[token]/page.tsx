'use client';

import { use } from 'react';
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const router = useRouter();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMsg('');
  };

  const validatePassword = (password: string) => password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/user/reset-password/${token}`, {
        newPassword: password,
        confirmPassword,
      });

      setSuccessMsg('Password reset successful! Redirecting to login...');
      setFormData({ password: '', confirmPassword: '' });

      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred. Please try again.');
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
              backgroundImage:
                'url("https://images.unsplash.com/photo-1738168266307-1d1515cbca2b?w=500&auto=format&fit=crop&q=60")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light py-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
              <h2 className="text-center mb-4">Reset Password</h2>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${error && !formData.password ? 'is-invalid' : ''}`}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${error && !formData.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {error && <div className="text-danger mb-3">{error}</div>}
              {successMsg && <div className="text-success mb-3">{successMsg}</div>}

              <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="text-center mt-3">
                <a href="/" className="text-success text-decoration-none">← Back to Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
