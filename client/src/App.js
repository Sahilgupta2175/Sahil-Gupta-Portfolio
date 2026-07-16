import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SpeedInsights } from '@vercel/speed-insights/react';
import HomePage from './pages/HomePage';
import AllProjects from './pages/AllProjects';
import AllBlogs from './pages/AllBlogs';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequireAdmin from './pages/admin/RequireAdmin';
import Loader from './components/Loader/Loader';
import './App.css';

// Skip the intro SG loader when the user lands directly on (or refreshes)
// an admin page — they're an authenticated user doing real work, no need
// to make them sit through a 2.5s animation every time.
const isAdminPath = () =>
  typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

function App() {
  const [loading, setLoading] = useState(() => !isAdminPath());

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/blogs" element={<AllBlogs />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
          </Routes>
        )}
      </AnimatePresence>
      <SpeedInsights />
    </Router>
  );
}

export default App;
