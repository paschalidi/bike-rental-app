import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Layer,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'grommet';
import { FormClose } from 'grommet-icons';
import { useBikes } from '../../contexts/bikes';
import { useAuth } from '../../contexts/auth';

export const SubmitBikeReservationCancellationFormOnModal = ({
  bikeUid,
  model,
  onClose,
}: {
  bikeUid: string;
  model: string;
  onClose: () => void;
}) => {
  const { deleteBikeReservation } = useBikes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleReservationDeletion = async (reservationUid: string) => {
    setIsSubmitting(true);
    await deleteBikeReservation({
      reservationUid,
      bikeUid,
      userUid: user?.uid,
    });
    setIsSubmitting(false);
  };
  return (
    <Layer key={bikeUid} onEsc={onClose} onClickOutside={onClose}>
      <Box pad="medium">
        <Heading margin={{ top: 'small', bottom: 'small' }}>
          Your reservations
        </Heading>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col">
                <Text>Model</Text>
              </TableCell>
              <TableCell scope="col">
                <Text>Dates</Text>
              </TableCell>
              <TableCell scope="col">
                <Text>Actions</Text>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.reservations[bikeUid]?.map(({ dates, reservationUid }) => (
              <TableRow key={reservationUid}>
                <TableCell>
                  <Text>{model}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {dates[0]} – {dates[dates.length - 1]}
                  </Text>
                </TableCell>
                <TableCell>
                  <Button
                    icon={<FormClose color="status-error" />}
                    secondary
                    disabled={isSubmitting}
                    label="cancel"
                    onClick={() => handleReservationDeletion(reservationUid)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          style={{ marginTop: '40px' }}
          onClick={onClose}
          secondary
          label="close"
        />
      </Box>
    </Layer>
  );
};
