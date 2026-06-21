import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.js';

// Page Imports
import LandingPage from './pages/LandingPage.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import ForgotPassword from './pages/ForgotPassword.js';
import Dashboard from './pages/Dashboard.js';
import LogPicker from './pages/LogPicker.js';
import LogForm from './pages/LogForm.js';
import Trends from './pages/Trends.js';
import Tips from './pages/Tips.js';
import MapPage from './pages/MapPage.js';
import Goals from './pages/Goals.js';
import Community from './pages/Community.js';
import Settings from './pages/Settings.js';
import NotFound from './pages/NotFound.js';

// Shared Components
import Navbar from './components/Navbar.js';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Only Route (Login/Signup/Forgot Password)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {

  // Force dark mode as standard visual system
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Skip to Main Content Link (A11y Requirement) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Render Navbar only if logged in or on landing page */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 outline-none" tabIndex={-1}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/log" element={
            <ProtectedRoute>
              <LogPicker />
            </ProtectedRoute>
          } />

          <Route path="/log/:category" element={
            <ProtectedRoute>
              <LogForm />
            </ProtectedRoute>
          } />

          <Route path="/trends" element={
            <ProtectedRoute>
              <Trends />
            </ProtectedRoute>
          } />

          <Route path="/tips" element={
            <ProtectedRoute>
              <Tips />
            </ProtectedRoute>
          } />

          <Route path="/map" element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          } />

          <Route path="/goals" element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } />

          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          <Route path="/settings/privacy" element={
            <ProtectedRoute>
              <Settings defaultTab="privacy" />
            </ProtectedRoute>
          } />

          {/* Fallback 404 Route */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EcoTrack. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Data sourced from DEFRA, EPA eGRID, EPA WARM models, and Poore & Nemecek (2018).
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
