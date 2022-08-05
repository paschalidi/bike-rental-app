import type { NextPage } from 'next';
import { Button, Heading, Page, PageContent } from 'grommet';
import React from 'react';
import { useRouter } from 'next/router';
import { Roles, useAuth } from '../src/contexts/auth';

import { TopBar } from '../src/components/TopBar';

const Home: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === Roles.User) {
    return (
      <>
        <TopBar />
        <Page kind="narrow">
          <PageContent>
            <Heading>Want to rent some bikes?</Heading>
            <Button
              primary
              label="GO"
              size="large"
              onClick={() => {
                router.push(`/${user?.role}/bikes`);
              }}
            />
          </PageContent>
        </Page>
      </>
    );
  }
  if (user?.role === Roles.Manager) {
    return (
      <>
        <TopBar />
        <Page kind="narrow">
          <PageContent>
            <Heading>Want to view & edit some bikes?</Heading>
            <Button
              primary
              label="GO"
              size="large"
              onClick={() => {
                router.push(`/${user?.role}/bikes`);
              }}
            />
          </PageContent>
        </Page>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Page kind="narrow">
        <PageContent align='center'>
          <Heading style={{marginTop:'10vh'}} >
            Please sign up first
          </Heading>
          <Button
            style={{width:"300px"}}
            primary
            label="SING UP NOW"
            size="large"
            onClick={() => {
              router.push(`/signup`);
            }}
          />
        </PageContent>
      </Page>
    </>
  );
};

export default Home;
