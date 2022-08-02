import React, { createContext, useContext, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDoc } from '@firebase/firestore';
import { db } from '../../config.firebase';

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
  }: BikeInfo) => {
    try {
      await addDoc(collection(db, 'bikes'), {
        model,
        rating,
        color,
        location,
        available,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const editBike = async () => {};

  const deleteBike = async () => {};

  const fetchBikes = async () => {};

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
