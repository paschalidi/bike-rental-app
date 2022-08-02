import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { Grommet } from 'grommet';
import { AuthContextProvider } from '../contexts/auth';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Grommet className="App">
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  </Grommet>
);

export default MyApp;
