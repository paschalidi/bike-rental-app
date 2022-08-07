import React, { useRef, useState } from 'react';
import { Box, Button, Calendar, Heading, Layer, Text } from 'grommet';
import { format } from 'date-fns';
import { useBikes } from '../../contexts/bikes';
import { useAuth } from '../../contexts/auth';
import { deriveCalendarBounds } from '../../utils/calendar';

export const SubmitBikeReservationFormOnModal = ({
  uid,
  onClose,
  unavailableDates,
  bikeModel,
}: {
  uid: string;
  onClose: () => void;
  unavailableDates: string[];
  bikeModel: string;
}) => {
  const { addBikeReservation } = useBikes();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDates, setSelectedDates] = useState<any>();
  const [activeDate, setActiveDate] = useState<'start' | 'end' | undefined>(
    undefined
  );
  const startDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;
  const endDateButton = useRef() as React.MutableRefObject<HTMLInputElement>;

  const submitBikeReservation = async () => {
    setIsSubmitting(true);
    const startDate = new Date(selectedDates[0][0]);
    const endDate = new Date(selectedDates[0][1]);
    const date = new Date(startDate);

    const dates = [];

    while (date <= endDate) {
      const d = new Date(date);
      dates.push(format(d, 'yyyy/MM/dd'));
      date.setDate(date.getDate() + 1);
    }
    await addBikeReservation({ dates, uid, userUid: user?.uid, bikeModel });
    setIsSubmitting(false);
  };

  console.log(selectedDates && selectedDates[0][1]);
  return (
    <Layer key={uid} onEsc={onClose} onClickOutside={onClose}>
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
            bounds={deriveCalendarBounds()}
            disabled={unavailableDates}
            activeDate={activeDate}
            dates={selectedDates}
            onSelect={(arg) => {
              setSelectedDates(arg);
              setActiveDate('end');
            }}
            range="array"
          />
          <Button
            disabled={
              !selectedDates ||
              (selectedDates && !selectedDates[0][1]) ||
              isSubmitting
            }
            primary
            label="rent bike"
            onClick={submitBikeReservation}
            style={{
              marginTop: '20px',
              marginBottom: '8px',
              width: '100%',
            }}
          />
          <Button label="close" onClick={onClose} />
        </Box>
      </Box>
    </Layer>
  );
};
