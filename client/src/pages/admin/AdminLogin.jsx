import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiLogIn } from 'react-icons/fi';
import { login } from '../../services/authService';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import './Admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Admin sign in · Sahil Gupta';
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
    <main className="admin-login">
      <div className="admin-login-top">
        <Link to="/" className="admin-side-link"><FiArrowLeft aria-hidden="true" /> Back to site</Link>
        <ThemeToggle />
      </div>

      <div className="admin-login-grid">
        <div className="admin-login-hero">
          <span className="eyebrow">sahil.gupta / admin</span>
          <p className="admin-login-display" aria-hidden="true">Admin<span>.</span></p>
          <p>Manage projects, experience, blogs, current work and subscribers.</p>
        </div>

        <form className="admin-login-card" onSubmit={onSubmit}>
          <h1 className="admin-login-title">Sign in</h1>

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

          {error && <p className="admin-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <FiLogIn aria-hidden="true" /> {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
