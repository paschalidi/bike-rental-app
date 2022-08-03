import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { auth, db } from '../../config/config.firebase';

export enum Roles {
  Manager = 'manager',
  User = 'user',
}

type User = {
  uid: string;
  email: string | null;
  role: string;
};

const AuthContext = createContext<{
  login: (v: { email: string; password: string }) => void;
  signup: (v: { email: string; password: string; role: Roles }) => void;
  logout: () => void;
  user: User | null;
} | null>(null);

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.uid) {
        const docRef = doc(db, 'users', currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({
            email: docSnap.data().email,
            uid: docSnap.data().uid,
            role: docSnap.data().roles[0],
          });
        } else {
          setUser(null);
        }
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

  const contextValues = useMemo(
    () => ({ user, login, signup, logout }),
    [user]
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
