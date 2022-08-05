import type { NextPage } from 'next';
import React from 'react';
import { Heading, Page, PageContent } from 'grommet';
import { ReservationsTable } from '../../src/components/ReservationsTable';
import { ManagerAppGrid } from '../../src/components/ManagerAppGrid';

const Reservations: NextPage = () => (
  <ManagerAppGrid>
    <Page kind="wide">
      <PageContent>
        <div style={{ marginTop: '5vh' }}>
          <Heading>All reservations</Heading>
          <ReservationsTable />
        </div>
      </PageContent>
    </Page>
  </ManagerAppGrid>
);

export default Reservations;
