import { Box, Spinner, Text } from 'grommet';
import React from 'react';
import { Favorite } from 'grommet-icons';

export const Loading = () => (
  <Box fill>
    <Box margin="large" align="center">
      <Box direction="row" gap="large" pad="small">
        <Spinner
          animation={{ type: 'pulse', duration: 650, size: 'medium' }}
          justify="center"
        >
          <Favorite color="red" size="large" />
        </Spinner>
        <Text margin={{ horizontal: 'small' }}> Loading...</Text>
      </Box>
    </Box>
  </Box>
);
