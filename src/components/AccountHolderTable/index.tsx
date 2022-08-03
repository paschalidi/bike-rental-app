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
import { useAccounts } from '../../contexts/accounts';
import { EditAccountForm } from '../EditAccountForm';

export const AccountHolderTable = () => {
  const { fetchAccounts, accounts, deleteAccount } = useAccounts();
  const [openEditorialModalUid, setOpenEditorialModalUid] = useState('');
  const [openDeletionModalUid, setOpenDeletionModalUid] = useState('');

  useEffect(() => {
    fetchAccounts();
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
    deleteAccount({ uid: bikeUid });
    setOpenDeletionModalUid('');
  };

  return (
    <div style={{ marginTop: '5vh' }}>
      <Heading>List of Accounts</Heading>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col">
              <Text>Email</Text>
            </TableCell>
            <TableCell scope="col">
              <Text>Role</Text>
            </TableCell>
            <TableCell scope="col">
              <Text>Actions</Text>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map(({ email, role, uid }) => (
            <TableRow key={uid}>
              <TableCell>
                <Text>{email}</Text>
              </TableCell>
              <TableCell>
                <Text>{role}</Text>
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
      {accounts
        .filter((account) => account.uid === openEditorialModalUid)
        .map(({ email, role, uid }) => (
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

                <EditAccountForm {...{ email, role, uid }} />
                <Button label="close" onClick={handleCloseEditorialModal} />
              </Box>
            </Box>
          </Layer>
        ))}
      {/* {bikes */}
      {/*  .filter((bike) => bike.uid === openDeletionModalUid) */}
      {/*  .map(({ uid, model }) => ( */}
      {/*    <Layer */}
      {/*      key={uid} */}
      {/*      style={{ width: '50vw' }} */}
      {/*      onEsc={handleCloseEditorialModal} */}
      {/*      onClickOutside={handleCloseEditorialModal} */}
      {/*    > */}
      {/*      <Box */}
      {/*        direction="column" */}
      {/*        border={{ color: 'brand', size: 'small' }} */}
      {/*        pad="medium" */}
      {/*      > */}
      {/*        <Box pad="small"> */}
      {/*          <Heading style={{ marginTop: 0 }}> */}
      {/*            Deleting bike: {model} */}
      {/*          </Heading> */}

      {/*          <Box direction="row" align="center" gap="small" pad="xsmall"> */}
      {/*            <Button */}
      {/*              label="close modal" */}
      {/*              onClick={handleCloseDeletionModal} */}
      {/*            /> */}
      {/*            <Button */}
      {/*              color="status-error" */}
      {/*              primary */}
      {/*              icon={<Trash />} */}
      {/*              label="delete bike" */}
      {/*              onClick={() => handleDeletionBike(uid)} */}
      {/*            /> */}
      {/*          </Box> */}
      {/*        </Box> */}
      {/*      </Box> */}
      {/*    </Layer> */}
      {/*  ))} */}
    </div>
  );
};
