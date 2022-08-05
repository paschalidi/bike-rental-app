import { useMemo, useRef, useState } from 'react';
import { BikeInfo } from '../../contexts/bikes';

export const useFilters = (bikes: BikeInfo[]) => {
  const bikeModels = useMemo(() => {
    const b = bikes.map((bike) => bike.model.toLowerCase());
    return [...new Set(b)];
  }, [bikes]);
  const bikeColors = useMemo(() => {
    const b = bikes.map((bike) => bike.color.toLowerCase());
    return [...new Set(b)];
  }, [bikes]);
  const bikeLocations = useMemo(() => {
    const b = bikes.map((bike) => bike.location.toLowerCase());
    return [...new Set(b)];
  }, [bikes]);

  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | undefined>();

  const [selectedDates, setSelectedDates] = useState<any>();
  const [activeDate, setActiveDate] = useState<'start' | 'end' | undefined>(
    undefined
  );
  const startDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;
  const endDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;

  const filteredBikes = useMemo(() => {
    const filtered = bikes.filter(
      ({ model, color, location, rating, available }: BikeInfo) => {
        const bikesAfterModelFilter = selectedModels.includes(
          model.toLowerCase()
        );
        const bikesAfterColorFilter = selectedColors.includes(
          color.toLowerCase()
        );
        const bikesAfterLocationFilter = selectedLocations.includes(
          location.toLowerCase()
        );

        // when all filters are untouched we want to show all bikes
        if (
          selectedModels.length === 0 &&
          selectedColors.length === 0 &&
          selectedLocations.length === 0 &&
          !selectedRating
        ) {
          return true;
        }
        // when _only_ rating is untouched we dont want to include its value on the filtering
        if (selectedRating === 'undefined') {
          return (
            (bikesAfterModelFilter ||
              bikesAfterColorFilter ||
              bikesAfterLocationFilter) &&
            available
          );
        }

        // when rating is touched we include all filters
        const isWithinRating =
          parseInt(selectedRating as string, 10) <= parseInt(rating, 10);

        return (
          (bikesAfterModelFilter ||
            bikesAfterColorFilter ||
            bikesAfterLocationFilter ||
            isWithinRating) &&
          available
        );
      }
    );
    return filtered;
  }, [
    selectedModels,
    selectedColors,
    selectedLocations,
    selectedRating,
    bikes,
  ]);

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
    bikeModels,
    selectedModels,
    setSelectedModels,
    bikeColors,
    bikeLocations,
    setSelectedColors,
    setSelectedLocations,
    setSelectedRating,
  };
};
