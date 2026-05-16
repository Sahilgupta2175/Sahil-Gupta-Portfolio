import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { login } from '../../services/authService';
import './Admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem('admin_token', res.token);
      localStorage.setItem('admin_email', res.email);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <div className="animated-bg" />
      <div className="noise-overlay" />
      <main className="admin-login">
        <form className="admin-login-card glass" onSubmit={onSubmit}>
          <h1 className="admin-login-title gradient-text">Admin Login</h1>
          <p className="admin-login-sub">Sign in to manage projects, experience and blogs</p>

          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <FiLogIn /> {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminLogin;
