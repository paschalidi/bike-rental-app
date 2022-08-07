import { Box, Spinner, Text } from 'grommet';
import React from 'react';

export const Loading = () => (
  <Box fill>
    <Box margin="large" align="center">
      <Box direction="row" gap="xlarge" pad="small">
        <Spinner animation={{ type: 'pulse', duration: 650, size: 'large' }}>
          <Text size="xlarge">Loading</Text>
        </Spinner>
      </Box>
    </Box>
  </Box>
);
