import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc } from '@firebase/firestore';
import { v4 as uuid } from 'uuid';
import { FormikErrors, FormikValues } from 'formik';
import { db } from '../../config/config.firebase';

export type BikeInfo = {
  model: string;
  rating: number;
  color: string;
  location: string;
  available: boolean;
  uid: string;
};

const BikesContext = createContext<{
  addBike: (v: Omit<BikeInfo, 'uid'>) => Promise<void>;
  deleteBike: (v: Pick<BikeInfo, 'uid'>) => any;
  editBike: (v: BikeInfo) => Promise<void>;
  fetchBikes: () => Promise<void>;
  formValidation: (v: FormikValues) => FormikErrors<any>;
  bikes: BikeInfo[];
} | null>(null);

export const useBikes = () => {
  const context = useContext(BikesContext);

  if (context === null) {
    throw new Error('useAuth must be used within a Provider');
  }

  return context;
};

export const BikesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bikes, setBikes] = useState<BikeInfo[]>([]);

  const addBike = async ({
    model,
    rating,
    color,
    location,
    available,
  }: Omit<BikeInfo, 'uid'>) => {
    try {
      const uid = uuid();
      const docRef = doc(db, 'bikes', uid);
      const data = {
        model,
        rating,
        color,
        location,
        available,
        uid,
      };
      await setDoc(docRef, data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const editBike = async ({
    model,
    rating,
    color,
    location,
    available,
    uid,
  }: BikeInfo) => {
    try {
      const docRef = doc(db, 'bikes', uid);
      const data = {
        model,
        rating,
        color,
        location,
        available,
        uid,
      };
      await updateDoc(docRef, data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteBike = async () => {};

  const fetchBikes = useCallback(async () => {
    try {
      const colRef = collection(db, 'bikes');

      onSnapshot(colRef, (snapshot) => {
        const listOfBikes = [] as BikeInfo[];
        snapshot.docs.forEach((document) => {
          listOfBikes.push({
            model: document.data().model,
            color: document.data().color,
            rating: document.data().rating,
            location: document.data().location,
            available: document.data().available,
            uid: document.data().uid,
          });
        });
        setBikes(listOfBikes);
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  const formValidation = (values: FormikValues) => {
    const errors: FormikValues = {};

    if (!values.model) {
      errors.model = 'Required';
    } else if (values.model.length < 3) {
      errors.model = 'Must be 3 characters or more';
    }

    if (!values.color) {
      errors.color = 'Required';
    } else if (values.color.length < 3) {
      errors.color = 'Must be 3 characters or more';
    }

    if (!values.location) {
      errors.location = 'Required';
    } else if (values.location.length < 3) {
      errors.location = 'Must be 3 characters or more';
    }

    if (!values.rating) {
      errors.rating = 'Required';
    }

    return errors;
  };

  const contextValues = useMemo(
    () => ({
      addBike,
      bikes,
      fetchBikes,
      formValidation,
      editBike,
      deleteBike,
    }),
    [bikes]
  );

  return (
    <BikesContext.Provider value={contextValues}>
      {children}
    </BikesContext.Provider>
  );
};
