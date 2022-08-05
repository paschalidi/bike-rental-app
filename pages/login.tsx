import type { NextPage } from 'next';
import { Box, Heading } from 'grommet';
import React from 'react';
import { LoginForm } from '../src/components/LoginForm';

const SignUp: NextPage = () => (
  <Box align="center">
    <Box width="medium" margin="large">
      <Heading>login</Heading>
      <LoginForm  />
    </Box>
  </Box>
);

export default SignUp;
