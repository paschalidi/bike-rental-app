import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { Grommet } from 'grommet';
import { useRouter } from 'next/router';
import { AuthContextProvider, Roles, useAuth } from '../src/contexts/auth';
import { BikesContextProvider } from '../src/contexts/bikes';
import { AccountsContextProvider } from '../src/contexts/accounts';
import Home from './index';

const Authorization = ({ Component, pageProps }: AppProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const role = user?.role;
  let allowed = true;

  if (router.pathname.startsWith('/user') && role !== Roles.User) {
    allowed = false;
  }
  if (router.pathname.startsWith('/manager') && role !== Roles.Manager) {
    allowed = false;
  }

  useEffect(() => {
    if (router.pathname.startsWith('/user') && role !== Roles.User) {
      if (role) {
        router.push(router.pathname.replace('user', role));
      } else {
        router.push("/login");
      }
    }
    if (router.pathname.startsWith('/manager') && role !== Roles.Manager) {
      if (role) {
        router.push(router.pathname.replace('teacher', role));
      } else {
        router.push('/login');
      }
    }
  }, [role, router]);

  const ComponentToRender = allowed ? Component : Home;

  return <ComponentToRender {...pageProps} />;
};
const MyApp = ({ Component, pageProps }: AppProps) => (
  <Grommet className="App">
    <AuthContextProvider>
      <BikesContextProvider>
        <AccountsContextProvider>
          <Authorization {...{ Component, pageProps }} />
        </AccountsContextProvider>
      </BikesContextProvider>
    </AuthContextProvider>
  </Grommet>
);

export default MyApp;
