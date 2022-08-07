import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { format } from 'date-fns';

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { v4 as uuid } from 'uuid';
import { FormikErrors, FormikValues } from 'formik';
import { db } from '../../config/config.firebase';

export type BikeInfo = {
  model: string;
  rating: string;
  color: string;
  location: string;
  available: boolean;
  unavailableDates: string[];
  availability: {
    [key: string]: {
      availability: boolean;
      reservedBy?: string;
      reservationUid?: string;
    };
  };
  uid: string;
};

export type EditBikeRatingProps = Pick<BikeInfo, 'uid' | 'rating'>;
export type AddBikeProps = Omit<
  BikeInfo,
  'uid' | 'unavailableDates' | 'availability'
>;
export type EditBikeProps = Omit<BikeInfo, 'unavailableDates' | 'availability'>;

export type EditBikeAvailabilityProps = {
  dates: string[];
  uid: string;
  bikeModel: string;
  userUid?: string;
};

export type DeleteBikeReservationProps = {
  reservationUid: string;
  bikeUid: string;
  userUid?: string;
};

const BikesContext = createContext<{
  addBike: (v: AddBikeProps) => Promise<void>;
  deleteBike: (v: Pick<BikeInfo, 'uid'>) => Promise<void>;
  editBike: (v: EditBikeProps) => Promise<void>;
  editBikeRating: (v: EditBikeRatingProps) => Promise<void>;
  fetchBikes: () => Promise<void>;
  addBikeReservation: (v: EditBikeAvailabilityProps) => Promise<void>;
  deleteBikeReservation: (v: DeleteBikeReservationProps) => Promise<void>;
  formValidation: (v: FormikValues) => FormikErrors<any>;
  bikes: BikeInfo[];
} | null>(null);

export const useBikes = () => {
  const context = useContext(BikesContext);

  if (context === null) {
    throw new Error('useBikes must be used within a Provider');
  }

  return context;
};

const generateAvailabilityForTheComingYear = () => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(startDate.getFullYear() + 1);

  const date = new Date();
  const dates = {};

  while (date <= endDate) {
    const d = new Date(date);
    Object.assign(dates, { [format(d, 'yyyy/MM/dd')]: { availability: true } });
    date.setDate(date.getDate() + 1);
  }

  return dates;
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
  }: AddBikeProps) => {
    try {
      const uid = uuid();
      const docRef = doc(db, 'bikes', uid);
      const data = {
        model,
        rating,
        color,
        location,
        available,
        availability: generateAvailabilityForTheComingYear(),
        unavailableDates: [],
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
  }: EditBikeProps) => {
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

  const editBikeRating = async ({ rating, uid }: EditBikeRatingProps) => {
    try {
      const docRef = doc(db, 'bikes', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingRating = parseInt(docSnap.data().rating, 10);
        const incomingRating = parseInt(rating, 10);

        const data = {
          rating: Number(((incomingRating + existingRating) / 2).toFixed(1)),
          uid,
        };
        await updateDoc(docRef, data);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const addBikeReservation = async ({
    dates,
    uid,
    userUid,
    bikeModel,
  }: EditBikeAvailabilityProps) => {
    try {
      if (!userUid) {
        throw new Error(
          'addBikeReservation: bike with uid doesnt exist or userUid is undefined'
        );
      }

      const reservationUid = uuid();
      const docBikeRef = doc(db, 'bikes', uid);
      const docBikeSnap = await getDoc(docBikeRef);

      if (docBikeSnap.exists()) {
        const newAvailability = dates.reduce(
          (acc, current) => ({
            ...acc,
            [current]: {
              availability: false,
              reservationUid,
              reservedBy: userUid,
            },
          }),
          {}
        );

        const data = {
          availability: {
            ...docBikeSnap.data().availability,
            ...newAvailability,
          },
          unavailableDates: [...docBikeSnap.data().unavailableDates, ...dates],
          uid,
        };
        await updateDoc(docBikeRef, data);
      }

      const docUserRef = doc(db, 'users', userUid);
      const docUserSnap = await getDoc(docUserRef);
      if (docUserSnap.exists()) {
        const userReservations = docUserSnap.data().reservations ?? {};
        const existingReservations = userReservations[uid] ?? [];
        const newReservations = {
          [uid]: [
            ...existingReservations,
            { dates, bikeUid: uid, reservationUid, bikeModel },
          ],
        };

        const data = {
          reservations: { ...userReservations, ...newReservations },
          uid: userUid,
        };
        await updateDoc(docUserRef, data);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteBikeReservation = async ({
    reservationUid,
    bikeUid,
    userUid,
  }: DeleteBikeReservationProps) => {
    try {
      if (!userUid) {
        throw new Error(
          'addBikeReservation: bike with uid doesnt exist or userUid is undefined'
        );
      }

      const docBikeRef = doc(db, 'bikes', bikeUid);
      const docBikeSnap = await getDoc(docBikeRef);

      if (docBikeSnap.exists()) {
        const existingAvailability = docBikeSnap.data().availability;
        const updatedAvailabilities = Object.keys(existingAvailability).reduce(
          (acc, key) => {
            if (existingAvailability[key].reservationUid === reservationUid) {
              return { ...acc, [key]: { availability: true } };
            }
            return acc;
          },
          {}
        );
        const newAvailability = {
          ...docBikeSnap.data().availability,
          ...updatedAvailabilities,
        };

        const unavailableDates = Object.keys(newAvailability).filter(
          (key) => newAvailability[key].availability === false
        );

        const data = {
          availability: newAvailability,
          unavailableDates,
        };
        await updateDoc(docBikeRef, data);
      }

      const docUserRef = doc(db, 'users', userUid);
      const docUserSnap = await getDoc(docUserRef);
      if (docUserSnap.exists()) {
        const userReservations = docUserSnap.data().reservations ?? {};

        const existingReservationsForBike = userReservations[bikeUid] ?? [];

        const newReservationsForBike = existingReservationsForBike.filter(
          ({ reservationUid: uid }: { reservationUid: string }) =>
            uid !== reservationUid
        );

        const newReservations = {
          ...userReservations,
          [bikeUid]: newReservationsForBike,
        };

        const data = {
          reservations: Object.keys(newReservations).reduce((acc, current) => {
            if (newReservations[current].length > 0) {
              return { ...acc, [current]: newReservations[current] };
            }
            return acc;
          }, {}),
        };
        await updateDoc(docUserRef, data);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteBike = async ({ uid }: { uid: string }) => {
    try {
      await deleteDoc(doc(db, 'bikes', uid));
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

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
            unavailableDates: document.data().unavailableDates || [],
            availability: document.data().availability || {},
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
      deleteBikeReservation,
      fetchBikes,
      formValidation,
      editBike,
      addBikeReservation,
      editBikeRating,
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
