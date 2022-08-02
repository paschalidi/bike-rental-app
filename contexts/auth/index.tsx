import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../../config.firebase';

export enum Roles {
  Manager = 'manager',
  User = 'user',
}

const AuthContext = createContext<{
  login?: (v: { email: string; password: string }) => any;
  signup?: (v: { email: string; password: string; role: Roles }) => any;
  logout?: () => any;
  user: {
    uid?: string;
    email?: string;
  } | null;
}>({ user: null });

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within a Provider');
  }

  return context;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async ({
    email,
    password,
    role,
  }: {
    email: string;
    password: string;
    role: Roles;
  }) => {
    try {
      const firebase = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(db, 'users', firebase.user.uid);

      const data = {
        email,
        roles: [role],
        uid: firebase.user.uid,
      };

      await setDoc(docRef, data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const login = ({ email, password }: { email: string; password: string }) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
