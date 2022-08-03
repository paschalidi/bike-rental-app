import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { Grommet } from 'grommet';
import { AuthContextProvider } from '../src/contexts/auth';
import { BikesContextProvider } from '../src/contexts/bikes';
import { AccountsContextProvider } from '../src/contexts/accounts';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Grommet className="App">
    <AuthContextProvider>
      <BikesContextProvider>
        <AccountsContextProvider>
          <Component {...pageProps} />
        </AccountsContextProvider>
      </BikesContextProvider>
    </AuthContextProvider>
  </Grommet>
);

export default MyApp;
