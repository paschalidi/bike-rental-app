import type { NextPage } from 'next';
import React from 'react';
import { Box, Grid, Heading, Page, PageContent } from 'grommet';
import { TopBar } from '../../src/components/TopBar';
import { SideNav } from '../../src/components/SideNav';
import { ReservationsTable } from '../../src/components/ReservationsTable';

const Reservations: NextPage = () => (
  <Grid
    fill
    rows={['auto', 'flex']}
    columns={['auto', 'flex']}
    areas={[
      { name: 'header', start: [0, 0], end: [1, 0] },
      { name: 'sidebar', start: [0, 1], end: [0, 1] },
      { name: 'main', start: [1, 1], end: [1, 1] },
    ]}
  >
    <Box gridArea="header" background="brand">
      <TopBar />
    </Box>
    <Box gridArea="sidebar" background="light-5">
      <SideNav />
    </Box>
    <Box gridArea="main">
      <Page kind="wide">
        <PageContent>
          <div style={{ marginTop: '5vh' }}>
            <Heading>All reservations</Heading>
            <ReservationsTable />
          </div>
        </PageContent>
      </Page>
    </Box>
  </Grid>
);

export default Reservations;
