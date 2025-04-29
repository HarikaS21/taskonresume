import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../components/Auth/ForgotPassword';
import Dashboard from '../components/Dashboard/Dashboard';
import PrivateRoute from '../components/PrivateRoute';
import ResumeBuilder from '../pages/ResumeBuilder';
import SavedResumes from '../pages/SavedResumes';
import SavedResumeView from '../pages/SavedResumeView';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/saved-resumes" element={<SavedResumes />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/resume-builder/:templateType"
        element={
          <PrivateRoute>
            <ResumeBuilder />
          </PrivateRoute>
        }
      />

      <Route
        path="/saved-resumes"
        element={
          <PrivateRoute>
            <SavedResumes />
          </PrivateRoute>
        }
      />

      <Route
        path="/saved-resume/:id"
        element={
          <PrivateRoute>
            <SavedResumeView />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
