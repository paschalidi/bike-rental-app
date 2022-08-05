import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { v4 as uuid } from 'uuid';
import { db } from '../../config/config.firebase';
import { Roles } from '../auth';

export type BikeReservation = {
  dates: string[];
  reservationUid: string;
  bikeUid: string;
  bikeModel: string;
};

type ReservationsArrayProps = Array<
  { email: string; uid: string } & BikeReservation
>;

type ReservationsAttachedToUsersObject = {
  [key: string]: BikeReservation[];
};

export type AccountInfo = {
  email: string;
  role: Roles;
  uid: string;
  reservations: ReservationsAttachedToUsersObject;
};

type AddAccountProps = Omit<AccountInfo, 'uid'>;
type EditAccountProps = Omit<AccountInfo, 'reservations'>;
type DeleteAccountProps = Pick<AccountInfo, 'uid'>;

const AccountsContext = createContext<{
  addAccount: (v: AddAccountProps) => Promise<void>;
  deleteAccount: (v: DeleteAccountProps) => Promise<void>;
  editAccount: (v: EditAccountProps) => Promise<void>;
  fetchAccounts: () => Promise<void>;
  accounts: AccountInfo[];
  reservations: ReservationsArrayProps | null;
} | null>(null);

export const useAccounts = () => {
  const context = useContext(AccountsContext);

  if (context === null) {
    throw new Error('useAccounts must be used within a Provider');
  }

  return context;
};

export const AccountsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [reservations, setReservations] =
    useState<ReservationsArrayProps | null>(null);

  const addAccount = async ({ email, role }: AddAccountProps) => {
    try {
      const uid = uuid();
      const docRef = doc(db, 'users', uid);
      const data = {
        role,
        email,
      };
      await setDoc(docRef, data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const editAccount = async ({ role, uid }: EditAccountProps) => {
    try {
      const docRef = doc(db, 'users', uid);
      const data = { roles: [role] };
      await updateDoc(docRef, data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteAccount = async ({ uid }: DeleteAccountProps) => {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const fetchAccounts = useCallback(async () => {
    try {
      const colRef = collection(db, 'users');

      onSnapshot(colRef, (snapshot) => {
        const listOfAccounts = [] as AccountInfo[];
        snapshot.docs.forEach((document) => {
          listOfAccounts.push({
            email: document.data().email,
            role: document.data().roles[0],
            uid: document.data().uid,
            reservations: document.data().reservations,
          });
        });
        setAccounts(listOfAccounts);
        const reservationsMade = listOfAccounts
          .map(({ reservations: userReservationsPerBike = {}, uid, email }) =>
            Object.values(userReservationsPerBike)
              .filter((r) => r.length > 0)
              .map((bikeReservations) =>
                bikeReservations.map((reservation) => ({
                  ...reservation,
                  uid,
                  email,
                }))
              )
          )
          .filter((r) => r.length > 0)
          .flat(Infinity) as ReservationsArrayProps;

        setReservations(reservationsMade);
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  const contextValues = useMemo(
    () => ({
      accounts,
      addAccount,
      fetchAccounts,
      editAccount,
      deleteAccount,
      reservations,
    }),
    [accounts, reservations]
  );

  return (
    <AccountsContext.Provider value={contextValues}>
      {children}
    </AccountsContext.Provider>
  );
};
