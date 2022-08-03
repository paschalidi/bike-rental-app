import React from 'react';
import { useRouter } from 'next/router';

import { Box, Button, Nav, Sidebar } from 'grommet';

import { Add, Bike, Group, UserAdd } from 'grommet-icons';

const SidebarButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactElement;
  label: string;
  onClick: () => void;
}) => (
  <Box pad="small">
    <Button
      gap="medium"
      alignSelf="start"
      plain
      icon={icon}
      label={label}
      onClick={onClick}
    />
  </Box>
);

export const SideNav = () => {
  const router = useRouter();

  return (
    <Box direction="row" height={{ min: 'calc(100vh - 60px)' }}>
      <Sidebar
        responsive={false}
        background="light-2"
        pad={{ left: 'medium', right: 'large', vertical: 'medium' }}
      >
        <Nav gap="small" responsive={false}>
          <SidebarButton
            icon={<Add/>}
            label="Add Bikes"
            onClick={() => {
              router.push('/manager/add-bikes');
            }}
          />
          <SidebarButton
            icon={<Bike />}
            label="View & Edit Bikes"
            onClick={() => {
              router.push('/manager/bikes');
            }}
          />
          <hr/>
          <SidebarButton
            icon={<UserAdd />}
            label="Add Accounts"
            onClick={() => {
              router.push('/manager/add-accounts');
            }}
          />
          <SidebarButton
            icon={<Group />}
            label="View & Edit Accounts"
            onClick={() => {
              router.push('/manager/accounts');
            }}
          />
        </Nav>
      </Sidebar>
    </Box>
  );
};
