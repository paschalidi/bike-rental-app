import { Box, Spinner, Text } from 'grommet';
import React from 'react';

export const Loading = () => (
  <Box fill>
    <Box margin="large" align="center">
      <Box direction="row" gap="large" pad="small">
        <Spinner
          animation={{ type: 'pulse', duration: 650, size: 'medium' }}
          justify="center"
        >
          <Text margin={{ horizontal: 'small' }}> Loading...</Text>
        </Spinner>
      </Box>
    </Box>
  </Box>
);
