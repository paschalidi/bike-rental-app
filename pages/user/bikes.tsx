import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Calendar,
  DropButton,
  Grid,
  Heading,
  Layer,
  Page,
  PageContent,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from 'grommet';
import { FormSchedule, Star } from 'grommet-icons';
import { TopBar } from '../../src/components/TopBar';
import { useBikes } from '../../src/contexts/bikes';
import { SubmitBikeRatingFormOnModal } from '../../src/components/SubmitBikeRatingFormOnModal';
import { useFilters } from '../../src/hooks/useFilters';

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
    setSelectedColors,
    setSelectedLocations,
    setSelectedRating,
    selectedDates,
    setSelectedDates,
    activeDate,
    setActiveDate,
    startDateButton,
    endDateButton,
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
  const openBikeScheduling = (uid: string) => {
    setActiveBikeSchedulingModalUid(uid);
  };
  const closeBikeSchedulingModal = () => {
    setActiveBikeSchedulingModalUid('');
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
        <Page kind="narrow">
          <PageContent>
            <Box
              gap="small"
              pad={{ vertical: 'small' }}
              style={{ marginTop: '10vh' }}
            >
              <Heading level={2} margin={{ top: 'small', bottom: 'small' }}>
                Filters
              </Heading>
              <Box
                direction="row"
                gap="large"
                pad={{ bottom: 'small' }}
                border={{
                  color: 'brand',
                  size: 'xsmall',
                  side: 'bottom',
                }}
              >
                <Box direction="row" gap="large">
                  <DropButton
                    dropAlign={{ top: 'bottom' }}
                    label="Dates"
                    dropContent={
                      <Box gap="small" pad="small">
                        <Calendar
                          activeDate={activeDate}
                          dates={selectedDates}
                          onSelect={(arg) => {
                            setSelectedDates(arg);
                            setActiveDate('end');
                          }}
                          range="array"
                        />
                      </Box>
                    }
                  />
                  <Text ref={startDateButton}>
                    <Box>
                      <Text>Start date &nbsp;</Text>
                      <Text color="neutral-2" weight="bolder">
                        {selectedDates &&
                          selectedDates[0][0] &&
                          new Date(selectedDates[0][0]).toDateString()}
                      </Text>
                    </Box>
                  </Text>
                  <Text ref={endDateButton}>
                    <Box>
                      <Text>End date &nbsp;</Text>
                      <Text color="neutral-2" weight="bolder">
                        {selectedDates &&
                          selectedDates[0][1] &&
                          new Date(selectedDates[0][1]).toDateString()}
                      </Text>
                    </Box>
                  </Text>
                </Box>
              </Box>

              <Box
                direction="row"
                gap="small"
                pad={{ bottom: 'small' }}
                align="center"
              >
                <Select
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
                  size="medium"
                  placeholder="rating greater then"
                  value={selectedRating}
                  options={ratingOptions.map(({ value }) => value)}
                  onChange={({ option }) => setSelectedRating(option)}
                />
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
                        <TableCell alignSelf="center">
                          <Button
                            onClick={() => openBikeScheduling(uid)}
                            alignSelf="center"
                            secondary
                            icon={<FormSchedule />}
                          />
                        </TableCell>
                        <TableCell alignSelf="center">
                          <Button
                            onClick={() => openBikeRatingModal(uid)}
                            alignSelf="center"
                            icon={<Star />}
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
        .map(({ uid }) => (
          <Layer
            key={uid}
            onEsc={closeBikeSchedulingModal}
            onClickOutside={closeBikeSchedulingModal}
          >
            <Box
              align="center"
              direction="column"
              border={{ color: 'brand', size: 'small' }}
              pad="medium"
            >
              <Box pad="small">
                <Heading>Schedule bike</Heading>

                <Box gap="medium" direction="row" margin={{ bottom: 'medium' }}>
                  <Text ref={startDateButton}>
                    <Box>
                      <Text>Start date &nbsp;</Text>
                      <Text color="neutral-2" weight="bolder">
                        {selectedDates &&
                          selectedDates[0][0] &&
                          new Date(selectedDates[0][0]).toDateString()}
                      </Text>
                    </Box>
                  </Text>
                  <Text ref={endDateButton}>
                    <Box>
                      <Text>End date &nbsp;</Text>
                      <Text color="neutral-2" weight="bolder">
                        {selectedDates &&
                          selectedDates[0][1] &&
                          new Date(selectedDates[0][1]).toDateString()}
                      </Text>
                    </Box>
                  </Text>
                </Box>
                <Calendar
                  activeDate={activeDate}
                  dates={selectedDates}
                  onSelect={(arg) => {
                    setSelectedDates(arg);
                    setActiveDate('end');
                  }}
                  range="array"
                />
                <Button
                  primary
                  label="rent bike"
                  onClick={closeBikeSchedulingModal}
                  style={{
                    marginTop: '20px',
                    marginBottom: '8px',
                    width: '100%',
                  }}
                />
                <Button label="close" onClick={closeBikeSchedulingModal} />
              </Box>
            </Box>
          </Layer>
        ))}
    </Grid>
  );
};

export default UserBikes;
