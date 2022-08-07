import type { NextPage } from 'next';
import { Box, Heading } from 'grommet';
import React from 'react';
import { AddNewAccountForm } from '../src/components/AddNewAccountForm';
import { auth } from '../src/config/config.firebase';

const SignUp: NextPage = () => (
  <Box align="center">
    <Box width="medium" margin="large">
      <Heading>sign up</Heading>
      <AddNewAccountForm firebaseAuth={auth} />
    </Box>
  </Box>
);

export default SignUp;
