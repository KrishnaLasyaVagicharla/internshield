/**
 * App Component
 * Syllabus: Exp 4, 7, 8 (React Router configuration, Route guards, Context providers hierarchy)
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Detector from './pages/Detector';
import ResumeBuilder from './pages/ResumeBuilder';
import Recommendations from './pages/Recommendations';
import RecruiterCheck from './pages/RecruiterCheck';
import SkillGap from './pages/SkillGap';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AlertProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/detector" element={<Detector />} />
                <Route path="/resume" element={<ResumeBuilder />} />
                <Route path="/recruiter-check" element={<RecruiterCheck />} />

                {/* Protected Student Routes (Require Active Express Session) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skillgap"
                  element={
                    <ProtectedRoute>
                      <SkillGap />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <ProtectedRoute>
                      <Alerts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
