import type { NextPage } from 'next';
import { Heading, Page, PageContent } from 'grommet';
import React from 'react';
import { TopBar } from '../components/TopBar';

const Home: NextPage = () => (
  <>
    <TopBar />
    <Page kind="narrow">
      <PageContent>
        <Heading> Hello from home</Heading>
      </PageContent>
    </Page>
  </>
);

export default Home;
