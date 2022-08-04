import React, { useState } from 'react';
import {
  Box,
  Button,
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
                <Text>Delete</Text>
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
                    disabled={isSubmitting}
                    label="delete reservation"
                    onClick={() => handleReservationDeletion(reservationUid)}
                    secondary
                    icon={<FormClose color="status-error" />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Layer>
  );
};
