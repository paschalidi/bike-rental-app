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
  Text,
} from 'grommet';
import { Edit, Trash } from 'grommet-icons';
import { useBikes } from '../../contexts/bikes';
import { EditBikeForm } from '../EditBikeForm';

export const BikeTable = () => {
  const { fetchBikes, bikes, deleteBike } = useBikes();
  const [openEditorialModalUid, setOpenEditorialModalUid] = useState('');
  const [openDeletionModalUid, setOpenDeletionModalUid] = useState('');

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleOpenEditorialModal = (bikeUid: string) => {
    setOpenEditorialModalUid(bikeUid);
  };

  const handleCloseEditorialModal = () => {
    setOpenEditorialModalUid('');
  };

  const handleOpenDeletionModal = (bikeUid: string) => {
    setOpenDeletionModalUid(bikeUid);
  };

  const handleCloseDeletionModal = () => {
    setOpenDeletionModalUid('');
  };

  const handleDeletionBike = (bikeUid: string) => {
    deleteBike({ uid: bikeUid });
    setOpenDeletionModalUid('');
  };

  return (
    <>
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
              <Text>Available</Text>
            </TableCell>
            <TableCell scope="col">
              <Text>Actions</Text>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bikes.map(({ model, color, location, rating, available, uid }) => (
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
                <Text>{available ? 'Available' : 'Not available'}</Text>
              </TableCell>
              <TableCell>
                <>
                  <Edit
                    style={{ cursor: 'pointer', marginRight: '8px' }}
                    onClick={() => handleOpenEditorialModal(uid)}
                  />
                  <Trash
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenDeletionModal(uid)}
                  />
                </>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {bikes
        .filter((bike) => bike.uid === openEditorialModalUid)
        .map(({ model, color, location, rating, available, uid }) => (
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
                <Heading>Edit bike </Heading>

                <EditBikeForm
                  {...{ model, color, location, rating, available, uid }}
                />
                <Button label="close" onClick={handleCloseEditorialModal} />
              </Box>
            </Box>
          </Layer>
        ))}
      {bikes
        .filter((bike) => bike.uid === openDeletionModalUid)
        .map(({ uid, model }) => (
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
                <Heading style={{ marginTop: 0 }}>
                  Deleting bike: {model}
                </Heading>

                <Box direction="row" align="center" gap="small" pad="xsmall">
                  <Button
                    label="close modal"
                    onClick={handleCloseDeletionModal}
                  />
                  <Button
                    color="status-error"
                    primary
                    icon={<Trash />}
                    label="delete bike"
                    onClick={() => handleDeletionBike(uid)}
                  />
                </Box>
              </Box>
            </Box>
          </Layer>
        ))}
    </>
  );
};
