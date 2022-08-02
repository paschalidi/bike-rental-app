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
import { Edit, Trash } from 'grommet-icons';
import { useBikes } from '../../contexts/bikes';
import { EditBikeForm } from '../EditBikeForm';

export const BikeTable = () => {
  const { fetchBikes, bikes } = useBikes();
  const [openModalUid, setOpenModalUid] = useState('');

  useEffect(() => {
    fetchBikes?.();
  }, []);

  const handleEditBikeOnModal = (bikeUid: string) => {
    setOpenModalUid(bikeUid);
  };
  const handleCloseModal = () => {
    setOpenModalUid('');
  };

  return (
    <div>
      <Table style={{ marginTop: '40px' }}>
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
                    onClick={() => handleEditBikeOnModal(uid)}
                  />
                  <Trash style={{ cursor: 'pointer' }} />
                </>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {bikes
        .filter((bike) => bike.uid === openModalUid)
        .map(({ model, color, location, rating, available, uid }) => (
          <Layer
            key={uid}
            style={{ width: '50vw' }}
            onEsc={handleCloseModal}
            onClickOutside={handleCloseModal}
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
                <Button label="close" onClick={handleCloseModal} />
              </Box>
            </Box>
          </Layer>
        ))}
    </div>
  );
};
