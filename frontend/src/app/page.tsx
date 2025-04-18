'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = 'token';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${TOKEN_COOKIE_NAME}=`))
      ?.split('=')[1];

    if (token) router.replace('/chatWithAI');
  }, [router]);

  const validate = () => {
    let emailError = '';
    let passwordError = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      emailError = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      emailError = 'Invalid email format.';
    }

    if (!formData.password) {
      passwordError = 'Password is required.';
    } else if (formData.password.length < 6) {
      passwordError = 'Password must be at least 6 characters.';
    }

    setValidationErrors({ email: emailError, password: passwordError });

    return !emailError && !passwordError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (data.token) {
        document.cookie = `${TOKEN_COOKIE_NAME}=${data.token}; path=/; max-age=86400; secure; samesite=strict`;
        router.push('/chatWithAI');
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-6 d-none d-md-block p-0">
          <div
            className="h-100"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1738168266307-1d1515cbca2b?w=500&auto=format&fit=crop&q=60')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <form onSubmit={handleSubmit} className="w-100 px-4" style={{ maxWidth: "400px" }}>
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Login</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                    placeholder="you@example.com"
                  />
                  {validationErrors.email && (
                    <div className="invalid-feedback">{validationErrors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter password"
                  />
                  {validationErrors.password && (
                    <div className="invalid-feedback">{validationErrors.password}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-success w-100">Login</button>

                <div className="text-end mt-2 mb-3">
                  <Link href="/forgotPassword" className="text-muted text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                <div className="text-center mt-3">
                  Don’t have an account?{" "}
                  <Link href="/signup" className="text-success text-decoration-none">
                    Sign Up
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
