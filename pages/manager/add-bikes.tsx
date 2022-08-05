import type { NextPage } from 'next';
import { Heading, Page, PageContent } from 'grommet';
import React from 'react';
import { AddNewBikeForm } from '../../src/components/AddNewBikeForm';
import { ManagerAppGrid } from '../../src/components/ManagerAppGrid';

const ManagerDashboard: NextPage = () => (
  <ManagerAppGrid>
    <Page kind="wide">
      <PageContent>
        <div style={{ marginTop: '5vh' }}>
          <Heading>Add new bike</Heading>
          <AddNewBikeForm />
        </div>
      </PageContent>
    </Page>
  </ManagerAppGrid>
);

export default ManagerDashboard;
