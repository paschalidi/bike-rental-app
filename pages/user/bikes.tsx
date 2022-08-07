import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Calendar,
  DropButton,
  Grid,
  Heading,
  Page,
  PageContent,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  Tip
} from 'grommet';
import {
  CircleInformation,
  ClearOption,
  FormClose,
  FormSchedule,
  Schedule,
  Star
} from 'grommet-icons';
import { TopBar } from '../../src/components/TopBar';
import { useBikes } from '../../src/contexts/bikes';
import { SubmitBikeRatingFormOnModal } from '../../src/components/SubmitBikeRatingFormOnModal';
import { useFilters } from '../../src/hooks/useFilters';
import { SubmitBikeReservationFormOnModal } from '../../src/components/SubmitBikeReservationFormOnModal';
import { useAuth } from '../../src/contexts/auth';
import { SubmitBikeReservationCancellationFormOnModal } from '../../src/components/SubmitBikeReservationCancellationFormOnModal';
import { deriveCalendarBounds } from '../../src/utils/calendar';

const ratingOptions = [
  { value: 1, text: 'greater than 1' },
  { value: 1.5, text: 'greater than  1.5' },
  { value: 2, text: 'greater than  2' },
  { value: 2.5, text: 'greater than  2.5' },
  { value: 3, text: 'greater than  3' },
  { value: 3.5, text: 'greater than  3.5' },
  { value: 4, text: 'greater than  4' },
  { value: 4.5, text: 'greater than  4.5' },
  { value: 5, text: 'greater than  5' },
];

const UserBikes: NextPage = () => {
  const { user } = useAuth();
  const { bikes, fetchBikes } = useBikes();
  useEffect(() => {
    fetchBikes();
  }, []);

  const {
    selectedRating,
    selectedColors,
    selectedLocations,
    filteredBikes,
    bikeColors,
    bikeLocations,
    setSelectedModels,
    selectedModels,
    setSelectedColors,
    setSelectedLocations,
    setSelectedRating,
    selectedDates,
    setSelectedDates,
    activeDate,
    setActiveDate,
    startDateButton,
    endDateButton,
    bikeModels,
  } = useFilters(bikes);

  const [activeRatingModalUid, setActiveRatingModalUid] = useState<string>('');
  const openBikeRatingModal = (uid: string) => {
    setActiveRatingModalUid(uid);
  };
  const closeBikeRatingModal = () => {
    setActiveRatingModalUid('');
  };

  const [activeBikeSchedulingModalUid, setActiveBikeSchedulingModalUid] =
    useState<string>('');
  const openBikeSchedulingModal = (uid: string) => {
    setActiveBikeSchedulingModalUid(uid);
  };
  const closeBikeSchedulingModal = () => {
    setActiveBikeSchedulingModalUid('');
  };

  const [
    activeBikeCancelReservationModalUid,
    setActiveBikeCancelReservationModalUid,
  ] = useState<string>('');
  const openBikeCancelReservationModal = (uid: string) => {
    setActiveBikeCancelReservationModalUid(uid);
  };
  const closeBikeCancelReservationModal = () => {
    setActiveBikeCancelReservationModalUid('');
  };

  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}
    >
      <Box gridArea="header" background="brand">
        <TopBar />
      </Box>
      <Box gridArea="main">
        <Page kind="wide">
          <PageContent>
            <Box pad={{ bottom: 'medium' }} style={{ marginTop: '5vh' }}>
              <Heading level={2} margin={{ top: 'small', bottom: 'small' }}>
                Select your dates
              </Heading>
              <Box direction="row" gap="large">
                <DropButton
                  icon={<Schedule />}
                  size="large"
                  dropAlign={{ top: 'bottom' }}
                  label="Dates"
                  dropContent={
                    <Box gap="small" pad="small">
                      <Calendar
                        bounds={deriveCalendarBounds()}
                        activeDate={activeDate}
                        dates={selectedDates}
                        onSelect={(arg) => {
                          setSelectedDates(arg as any);
                          setActiveDate('end');
                        }}
                        range="array"
                      />
                    </Box>
                  }
                />
                <Text ref={startDateButton}>
                  <Box>
                    <Text>Starting rental date</Text>
                    <Text color="neutral-2" weight="bolder">
                      {selectedDates &&
                        selectedDates[0][0] &&
                        new Date(selectedDates[0][0]).toDateString()}
                    </Text>
                  </Box>
                </Text>
                <Text ref={endDateButton}>
                  <Box>
                    <Text>Ending rental date</Text>
                    <Text color="neutral-2" weight="bolder">
                      {selectedDates &&
                        selectedDates[0][1] &&
                        new Date(selectedDates[0][1]).toDateString()}
                    </Text>
                  </Box>
                </Text>
                {selectedDates && selectedDates[0][0] && selectedDates[0][1] && (
                  <Button
                    plain
                    onClick={() => {
                      setSelectedDates(undefined);
                      setActiveDate(undefined);
                    }}
                    label="clear dates"
                    icon={<ClearOption color="neutral-4" />}
                  />
                )}
              </Box>
            </Box>

            <Box pad={{ vertical: 'medium' }}>
              <Box direction="row">
                <Heading level={2} margin={{ top: 'small', bottom: 'small' }}>
                  Filters
                </Heading>
                <Tip
                  plain
                  content={
                    <Box
                      pad="small"
                      gap="small"
                      width={{ max: 'small' }}
                      round="small"
                      background="background-front"
                      responsive={false}
                    >
                      <Text weight="bold">Info</Text>
                      <Text size="small">
                        The filters are applied using the Logical OR (||)
                        operator. In other words if you choose a bike with color
                        red and location Berlin, you will see all bikes that are
                        red OR are in Berlin
                      </Text>
                    </Box>
                  }
                  dropProps={{ align: { bottom: 'top' } }}
                >
                  <Button icon={<CircleInformation />} />
                </Tip>
              </Box>
              <Box direction="row" gap="xsmall" align="center">
                <Select
                  clear
                  multiple
                  size="medium"
                  placeholder="filter by model"
                  value={selectedModels}
                  options={bikeModels}
                  onChange={({ value: nextValue }) =>
                    setSelectedModels(nextValue)
                  }
                  closeOnChange={false}
                />
                <Select
                  clear
                  multiple
                  size="medium"
                  placeholder="filter by color"
                  value={selectedColors}
                  options={bikeColors}
                  onChange={({ value: nextValue }) =>
                    setSelectedColors(nextValue)
                  }
                  closeOnChange={false}
                />
                <Select
                  clear
                  multiple
                  size="medium"
                  placeholder="filter by location"
                  value={selectedLocations}
                  options={bikeLocations}
                  onChange={({ value: nextValue }) =>
                    setSelectedLocations(nextValue)
                  }
                  closeOnChange={false}
                />
                <Select
                  clear
                  size="medium"
                  placeholder="rating greater then"
                  value={selectedRating}
                  options={ratingOptions.map(({ value }) => value)}
                  onChange={({ option }) => setSelectedRating(option)}
                />
                {selectedRating ||
                selectedColors.length ||
                selectedLocations.length ||
                selectedModels.length ? (
                  <Button
                    plain
                    onClick={() => {
                      setSelectedRating('');
                      setSelectedLocations([]);
                      setSelectedColors([]);
                      setSelectedModels([]);
                    }}
                    label="clear filters"
                    icon={<ClearOption color="neutral-4" />}
                  />
                ) : null}
              </Box>
            </Box>

            <Heading level={2}>Results</Heading>
            <Box
              direction="row"
              gap="small"
              align="center"
              margin={{ bottom: 'large' }}
            >
              <Table style={{ width: '100%' }}>
                <TableHeader>
                  <TableRow>
                    <TableCell scope="col">
                      <Text>Model</Text>
                    </TableCell>
                    <TableCell scope="col">
                      <Text>Color</Text>
                    </TableCell>
                    <TableCell scope="col">
                      <Text>Location</Text>
                    </TableCell>
                    <TableCell scope="col">
                      <Text>Rating</Text>
                    </TableCell>
                    <TableCell scope="col">
                      <Text>Reserve</Text>
                    </TableCell>
                    <TableCell scope="col">
                      <Text>Rate</Text>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBikes.map(
                    ({ model, color, location, rating, uid }) => (
                      <TableRow key={uid}>
                        <TableCell>
                          <Text>{model}</Text>
                        </TableCell>
                        <TableCell>
                          <Text>{color}</Text>
                        </TableCell>
                        <TableCell>
                          <Text>{location}</Text>
                        </TableCell>
                        <TableCell>
                          <Text>{rating} out of 5</Text>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => openBikeSchedulingModal(uid)}
                            secondary
                            icon={<FormSchedule color="status-ok" />}
                          />
                          {user?.reservations[uid] && (
                            <Button
                              onClick={() =>
                                openBikeCancelReservationModal(uid)
                              }
                              secondary
                              icon={<FormClose color="status-error" />}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => openBikeRatingModal(uid)}
                            icon={<Star color="accent-4" />}
                            secondary
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </Box>
          </PageContent>
        </Page>
      </Box>

      {bikes
        .filter((bike) => bike.uid === activeRatingModalUid)
        .map(({ uid }) => (
          <SubmitBikeRatingFormOnModal
            key={uid}
            onClose={closeBikeRatingModal}
            uid={uid}
          />
        ))}

      {bikes
        .filter((bike) => bike.uid === activeBikeSchedulingModalUid)
        .map(({ uid, unavailableDates, model }) => (
          <SubmitBikeReservationFormOnModal
            unavailableDates={unavailableDates}
            key={uid}
            uid={uid}
            onClose={closeBikeSchedulingModal}
            bikeModel={model}
          />
        ))}

      {bikes
        .filter((bike) => bike.uid === activeBikeCancelReservationModalUid)
        .map(({ uid, model }) => (
          <SubmitBikeReservationCancellationFormOnModal
            model={model}
            key={uid}
            bikeUid={uid}
            onClose={closeBikeCancelReservationModal}
          />
        ))}
    </Grid>
  );
};

export default UserBikes;
