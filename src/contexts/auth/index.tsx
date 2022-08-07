import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc } from '@firebase/firestore';
import { auth, db } from '../../config/config.firebase';
import { Loading } from '../../components/Loading';

export enum Roles {
  Manager = 'manager',
  User = 'user',
}

export type BikeReservation = {
  dates: string[];
  reservationUid: string;
  bikeUid: string;
  bikeModel: string;
};

type ReservationsAttachedToUsersObject = {
  [key: string]: BikeReservation[];
};

type User = {
  uid: string;
  email: string | null;
  role: string;
  reservations: ReservationsAttachedToUsersObject;
};

const AuthContext = createContext<{
  login: (v: { email: string; password: string }) => void;
  signup: (v: {
    firebaseAuth: Auth;
    email: string;
    password: string;
    role: Roles;
  }) => void;
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
      setLoading(true);

      if (currentUser?.uid) {
        onSnapshot(doc(db, 'users', currentUser?.uid), (document) => {
          if (document.exists()) {
            setUser({
              email: document.data().email,
              uid: document.data().uid,
              role: document.data().roles[0],
              reservations: document.data().reservations ?? {},
            });
            setLoading(false);
          }
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async ({
    firebaseAuth,
    email,
    password,
    role,
  }: {
    firebaseAuth: Auth;
    email: string;
    password: string;
    role: Roles;
  }) => {
    try {
      const firebase = await createUserWithEmailAndPassword(
        firebaseAuth,
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
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};
