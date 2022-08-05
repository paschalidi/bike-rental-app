import React, { useEffect, useState } from 'react';
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
import { View } from 'grommet-icons';
import { useAccounts } from '../../contexts/accounts';

export const ReservationsTable = () => {
  const { fetchAccounts, reservations } = useAccounts();
  const [userReservationModalUid, setUserReservationModalUid] = useState('');
  const [activeUserUid, setActiveUserUid] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpenUserReservationsModal = (
    bikeUid: string,
    userUid: string
  ) => {
    setUserReservationModalUid(bikeUid);
    setActiveUserUid(userUid);
  };

  const handleCloseEditorialModal = () => {
    setUserReservationModalUid('');
    setActiveUserUid('');
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col">
              <Text>User email</Text>
            </TableCell>
            <TableCell scope="col">
              <Text>Bike model</Text>
            </TableCell>
            <TableCell scope="col">
              <Text>Reservation period</Text>
            </TableCell>

            <TableCell scope="col">
              <Text>View all reservations made by this user</Text>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations?.map(
            ({
              dates,
              reservationUid,
              uid: userUid,
              email,
              bikeUid,
              bikeModel,
            }) => (
              <TableRow key={reservationUid}>
                <TableCell>
                  <Text>{email}</Text>
                </TableCell>
                <TableCell>
                  <Text>{bikeModel || bikeUid}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {dates[0]} – {dates[dates.length - 1]}
                  </Text>
                </TableCell>
                <TableCell>
                  <Button
                    icon={<View />}
                    label="view all"
                    onClick={() =>
                      handleOpenUserReservationsModal(reservationUid, userUid)
                    }
                    secondary
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      {reservations
        ?.filter(
          (reservation) =>
            reservation.reservationUid === userReservationModalUid
        )
        .map(({ uid, email }) => (
          <Layer
            key={uid}
            style={{ width: '50vw' }}
            onEsc={handleCloseEditorialModal}
            onClickOutside={handleCloseEditorialModal}
          >
            <Box
              direction="column"
              border={{ color: 'brand', size: 'small' }}
              pad="medium"
            >
              <Box pad="small">
                <Heading>All reservations made by {email}</Heading>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell scope="col">
                        <Text>Bike model</Text>
                      </TableCell>
                      <TableCell scope="col">
                        <Text>Reservation period</Text>
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations
                      ?.filter(({ uid: userUid }) => userUid === activeUserUid)
                      .map(({ dates, reservationUid, bikeUid, bikeModel }) => (
                        <TableRow key={reservationUid}>
                          <TableCell>
                            <Text>{bikeModel || bikeUid}</Text>
                          </TableCell>
                          <TableCell>
                            <Text>
                              {dates[0]} – {dates[dates.length - 1]}
                            </Text>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <Button label="close" onClick={handleCloseEditorialModal} />
              </Box>
            </Box>
          </Layer>
        ))}
    </>
  );
};
