import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { Grommet } from 'grommet';
import { AuthContextProvider } from '../contexts/auth';
import { BikesContextProvider } from '../contexts/bikes';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Grommet className="App">
    <AuthContextProvider>
      <BikesContextProvider>
        <Component {...pageProps} />
      </BikesContextProvider>
    </AuthContextProvider>
  </Grommet>
);

export default MyApp;
