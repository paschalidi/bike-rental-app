import { useMemo, useRef, useState } from 'react';
import { BikeInfo } from '../../contexts/bikes';

export const useFilters = (bikes: BikeInfo[]) => {
  const bikeColors = useMemo(() => {
    const b = bikes.map((bike) => bike.color.toLowerCase());
    return [...new Set(b)];
  }, [bikes]);
  const bikeLocations = useMemo(() => {
    const b = bikes.map((bike) => bike.location.toLowerCase());
    return [...new Set(b)];
  }, [bikes]);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState([]);

  const [selectedDates, setSelectedDates] = useState<any>();
  const [activeDate, setActiveDate] = useState<'start' | 'end' | undefined>(
    undefined
  );
  const startDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;
  const endDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;

  const filteredBikes = useMemo(() => {
    const filtered = bikes.filter(
      ({ color, location, rating, available }: BikeInfo) => {
        const isColorOrLocation =
          selectedColors.includes(color) ||
          selectedLocations.includes(String(location));
        const isWithinRating = String(selectedRating) <= rating;

        return isColorOrLocation || (isWithinRating && available);
      }
    );
    return filtered;
  }, [selectedColors, selectedLocations, selectedRating, bikes]);

  return {
    selectedDates,
    setSelectedDates,
    activeDate,
    setActiveDate,
    startDateButton,
    endDateButton,
    selectedRating,
    selectedColors,
    selectedLocations,
    filteredBikes,
    bikeColors,
    bikeLocations,
    setSelectedColors,
    setSelectedLocations,
    setSelectedRating,
  };
};
