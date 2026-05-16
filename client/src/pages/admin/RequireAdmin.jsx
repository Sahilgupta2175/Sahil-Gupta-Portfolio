import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthed } from '../../services/authService';

// Route guard for /admin. If no JWT in localStorage, bounce to login.
const RequireAdmin = ({ children }) => {
  if (!isAuthed()) return <Navigate to="/admin/login" replace />;
  return children;
};

export default RequireAdmin;
