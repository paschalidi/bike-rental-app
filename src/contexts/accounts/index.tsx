import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from '@firebase/firestore';
import { uuid } from 'uuidv4';
import { db } from '../../config/config.firebase';
import { Roles } from '../auth';

export type AccountInfo = {
  email: string;
  role: Roles;
  uid: string;
};

const AccountsContext = createContext<{
  addAccount: (v: Omit<AccountInfo, 'uid'>) => Promise<void>;
  deleteAccount: (v: Pick<AccountInfo, 'uid'>) => any;
  editAccount: (v: AccountInfo) => Promise<void>;
  fetchAccounts: () => Promise<void>;
  accounts: AccountInfo[];
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

  const addAccount = async ({ email, role }: Omit<AccountInfo, 'uid'>) => {
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

  const editAccount = async ({ role, uid }: Omit<AccountInfo, 'email'>) => {
    try {
      const docRef = doc(db, 'users', uid);
      const data = { roles: [role] };
      await updateDoc(docRef, data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteAccount = async ({ uid }: { uid: string }) => {
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
          });
        });
        setAccounts(listOfAccounts);
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
    }),
    [accounts]
  );

  return (
    <AccountsContext.Provider value={contextValues}>
      {children}
    </AccountsContext.Provider>
  );
};
