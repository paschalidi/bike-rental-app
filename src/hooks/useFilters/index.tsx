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
    const filtered = bikes
      .filter(({ available }) => available)
      .filter(({ model, color, location, rating, availability }: BikeInfo) => {
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

        const rateFiltering = (bikeRating: string, filterRating: string) =>
          Boolean(Number(bikeRating) - Number(filterRating) >= 0);

        const isBikeIncludedAfterModelFiltering = selectedModels.includes(
          model.toLowerCase()
        );
        const isBikeIncludedAfterColorFiltering = selectedColors.includes(
          color.toLowerCase()
        );
        const isBikeIncludedAfterLocationFiltering = selectedLocations.includes(
          location.toLowerCase()
        );

        const isBikeIncludedWithinRating = rateFiltering(
          rating,
          selectedRating as string
        );

        const filterStartDate = selectedDates?.[0]?.[0];
        const filterEndDate = selectedDates?.[0]?.[1];

        const dateFilterIsSet = filterStartDate && filterEndDate;

        const isAnyOfTheFiltersSet =
          selectedModels.length > 0 ||
          selectedColors.length > 0 ||
          selectedLocations.length > 0 ||
          selectedRating;

        // when the user has set the dates
        if (dateFilterIsSet) {
          const isBikeIncludedAfterDateFiltering = dateFiltering(
            filterStartDate,
            filterEndDate
          );

          if (isAnyOfTheFiltersSet) {
            if (!selectedRating) {
              return (
                (isBikeIncludedAfterModelFiltering ||
                  isBikeIncludedAfterColorFiltering ||
                  isBikeIncludedAfterLocationFiltering) &&
                isBikeIncludedAfterDateFiltering
              );
            }
            return (
              (isBikeIncludedAfterModelFiltering ||
                isBikeIncludedAfterColorFiltering ||
                isBikeIncludedAfterLocationFiltering ||
                isBikeIncludedWithinRating) &&
              isBikeIncludedAfterDateFiltering
            );
          }

          return isBikeIncludedAfterDateFiltering;
        }

        // when the user is applying filtering without having set any dates
        if (isAnyOfTheFiltersSet) {
          if (!selectedRating) {
            return (
              isBikeIncludedAfterModelFiltering ||
              isBikeIncludedAfterColorFiltering ||
              isBikeIncludedAfterLocationFiltering
            );
          }

          return (
            isBikeIncludedAfterModelFiltering ||
            isBikeIncludedAfterColorFiltering ||
            isBikeIncludedAfterLocationFiltering ||
            isBikeIncludedWithinRating
          );
        }

        return true;
      });
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
