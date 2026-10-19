import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, setDoc, doc, handleFirestoreError, OperationType } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// In-memory cache for Google OAuth Access Token
let cachedAccessToken: string | null = null;

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Configure Google Auth scopes
    googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
    googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'Anonymous',
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          }, { merge: true });
        } catch (error) {
          console.error('Error syncing user profile:', error);
        }
      } else {
        cachedAccessToken = null;
        setAccessToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
        setAccessToken(credential.accessToken);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      cachedAccessToken = null;
      setAccessToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, accessToken, signIn, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
