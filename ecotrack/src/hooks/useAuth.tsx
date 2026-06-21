import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebaseConfig.js';
import { authService } from '../services/authService.js';
import { firestoreService } from '../services/firestoreService.js';
import { initAnalytics } from '../services/firebaseConfig.js';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signInWithEmail: typeof authService.signInWithEmail;
  signInWithGoogle: typeof authService.signInWithGoogle;
  signUp: typeof authService.signUp;
  forgotPassword: typeof authService.forgotPassword;
  logout: typeof authService.logout;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Listen for Firestore User Profile changes
  useEffect(() => {
    if (!user) return;

    const unsubscribeProfile = firestoreService.subscribeToProfile(user.uid, (userProfile) => {
      setProfile(userProfile);
      setLoading(false);
      
      // Initialize or toggle Analytics based on user consent preference
      if (userProfile && userProfile.analyticsConsent !== undefined) {
        initAnalytics(userProfile.analyticsConsent);
      }
    });

    return () => unsubscribeProfile();
  }, [user]);

  const updateProfile = async (data: any) => {
    if (user) {
      await firestoreService.updateProfile(user.uid, data);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signInWithEmail: authService.signInWithEmail,
    signInWithGoogle: authService.signInWithGoogle,
    signUp: authService.signUp,
    forgotPassword: authService.forgotPassword,
    logout: authService.logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
