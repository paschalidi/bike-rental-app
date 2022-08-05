import { useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { BikeInfo } from '../../contexts/bikes';

const generateAllDatesInBetween = (
  filterStartDate: string,
  filterEndDate: string
) => {
  const date = new Date(filterStartDate);
  const endDate = new Date(filterEndDate);

  const dates = [];
  //
  while (date <= endDate) {
    const d = new Date(date);
    dates.push(format(d, 'yyyy/MM/dd'));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

export const useFilters = (bikes: BikeInfo[]) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | undefined>();

  const [selectedDates, setSelectedDates] = useState<
    (string | string[])[] | undefined
  >();
  const [activeDate, setActiveDate] = useState<'start' | 'end' | undefined>(
    undefined
  );

  const filteredBikes = useMemo(() => {
    const filtered = bikes.filter(
      ({
        model,
        color,
        location,
        rating,
        available,
        availability,
      }: BikeInfo) => {
        const isBikeIncludedAfterModelFiltering = selectedModels.includes(
          model.toLowerCase()
        );
        const isBikeIncludedAfterColorFiltering = selectedColors.includes(
          color.toLowerCase()
        );
        const isBikeIncludedAfterLocationFiltering = selectedLocations.includes(
          location.toLowerCase()
        );

        const dateFiltering = (
          filterStartDate: string,
          filterEndDate: string
        ) => {
          const dates = generateAllDatesInBetween(
            filterStartDate,
            filterEndDate
          );
          return dates
            .map((date) => availability[date]?.availability)
            .every((element) => element === true);
        };

        const rateFiltering = (givenRating: string, filterRating: string) =>
          parseInt(givenRating, 10) <= parseInt(filterRating, 10);

        const filterStartDate = selectedDates?.[0]?.[0];
        const filterEndDate = selectedDates?.[0]?.[1];
        // when all filters are untouched we want to show all bikes
        if (
          selectedModels.length === 0 &&
          selectedColors.length === 0 &&
          selectedLocations.length === 0 &&
          (filterStartDate === undefined || filterEndDate === undefined) &&
          !selectedRating
        ) {
          return true;
        }
        const dateFilterIsSet = filterStartDate && filterEndDate;
        const modelFilterIsSet = selectedModels.length > 0;
        const colorFilterIsSet = selectedColors.length > 0;
        const locationFilterIsSet = selectedLocations.length > 0;
        const ratingFilterIsSet = selectedRating;

        if (dateFilterIsSet) {
          const isBikeIncludedAfterDateFiltering = dateFiltering(
            filterStartDate,
            filterEndDate
          );
          const isBikeIncludedWithinRating = rateFiltering(
            selectedRating as string,
            rating
          );

          if (
            modelFilterIsSet ||
            colorFilterIsSet ||
            locationFilterIsSet ||
            ratingFilterIsSet
          ) {
            return (
              (isBikeIncludedAfterModelFiltering ||
                isBikeIncludedAfterColorFiltering ||
                isBikeIncludedAfterLocationFiltering ||
                isBikeIncludedWithinRating) &&
              isBikeIncludedAfterDateFiltering &&
              available
            );
          }

          return isBikeIncludedAfterDateFiltering && available;
        }

        if (
          selectedModels.length ||
          selectedColors.length ||
          selectedLocations.length ||
          selectedRating
        ) {
          const isBikeIncludedWithinRating = rateFiltering(
            selectedRating as string,
            rating
          );

          return (
            (isBikeIncludedAfterModelFiltering ||
              isBikeIncludedAfterColorFiltering ||
              isBikeIncludedAfterLocationFiltering ||
              isBikeIncludedWithinRating) &&
            available
          );
        }

        if (!selectedRating) {
          return (
            (isBikeIncludedAfterModelFiltering ||
              isBikeIncludedAfterColorFiltering ||
              isBikeIncludedAfterLocationFiltering) &&
            available
          );
        }

        const isWithinRating =
          parseInt(selectedRating as string, 10) <= parseInt(rating, 10);

        return (
          (isBikeIncludedAfterModelFiltering ||
            isBikeIncludedAfterColorFiltering ||
            isBikeIncludedAfterLocationFiltering ||
            isWithinRating) &&
          available
        );
      }
    );
    return filtered;
  }, [
    selectedDates,
    selectedModels,
    selectedColors,
    selectedLocations,
    selectedRating,
    bikes,
  ]);

  const startDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;
  const endDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;

  return {
    bikeModels: useMemo(() => {
      const b = bikes.map((bike) => bike.model.toLowerCase());
      return [...new Set(b)];
    }, [bikes]),
    bikeColors: useMemo(() => {
      const b = bikes.map((bike) => bike.color.toLowerCase());
      return [...new Set(b)];
    }, [bikes]),
    bikeLocations: useMemo(() => {
      const b = bikes.map((bike) => bike.location.toLowerCase());
      return [...new Set(b)];
    }, [bikes]),
    filteredBikes,

    startDateButton,
    endDateButton,

    activeDate,
    selectedDates,
    selectedModels,
    selectedColors,
    selectedLocations,
    selectedRating,

    setActiveDate,
    setSelectedDates,
    setSelectedModels,
    setSelectedColors,
    setSelectedLocations,
    setSelectedRating,
  };
};
