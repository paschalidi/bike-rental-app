import type { NextPage } from 'next';
import React from 'react';
import { Heading, Page, PageContent } from 'grommet';
import { BikeTable } from '../../src/components/BikeTable';
import { ManagerAppGrid } from '../../src/components/ManagerAppGrid';

const ManagerDashboard: NextPage = () => (
  <ManagerAppGrid>
    <Page kind="wide">
      <PageContent>
        <div style={{ marginTop: '5vh' }}>
          <Heading>List of bikes</Heading>
          <BikeTable />
        </div>
      </PageContent>
    </Page>
  </ManagerAppGrid>
);

export default ManagerDashboard;
