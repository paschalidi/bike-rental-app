import React, { createContext, useContext, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDoc } from '@firebase/firestore';
import { db } from '../../config.firebase';

export type BikeInfo = {
  model: string;
  rating: number;
  color: string;
  location: string;
  available: boolean;
};

const BikesContext = createContext<{
  addBike?: (v: BikeInfo) => Promise<void>;
  deleteBike?: () => any;
  editBike?: () => any;
  fetchBikes?: () => any;
  bikes: [] | null;
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
  const [bikes, setBikes] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const contextValues = useMemo(() => ({ addBike, bikes }), [bikes]);

  return (
    <BikesContext.Provider value={{ addBike, bikes }}>
      {children}
    </BikesContext.Provider>
  );
};
