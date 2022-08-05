import { Box, Button, Heading, Menu } from 'grommet';
import React from 'react';
import { useRouter } from 'next/router';
import { Roles, useAuth } from '../../contexts/auth';

export const TopBar = ({ onClick }: { onClick?: () => void }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <Box
      gridArea="header"
      tag="header"
      direction="row"
      align="center"
      justify="between"
      background="brand"
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      elevation="xsmall"
      style={{ zIndex: '1', cursor: 'pointer' }}
    >
      <Heading level="3" margin="none" as="a" onClick={onClick}>
        Bike Rental{' '}
        {user?.role === Roles.Manager ? 'for Managers' : 'for Everyone'}
      </Heading>
      {(() => {
        if (user?.uid) {
          return <Button label="Sign out" onClick={() => logout()} />;
        }

        return (
          <Menu
            label="Menu"
            items={[
              {
                label: 'sign up',
                onClick: () => {
                  router.push('/signup');
                },
              },
              {
                label: 'log in',
                onClick: () => {
                  router.push('/login');
                },
              },
            ]}
          />
        );
      })()}
    </Box>
  );
};
