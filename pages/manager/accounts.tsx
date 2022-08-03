import type { NextPage } from 'next';
import React from 'react';
import { Box, Grid, Page, PageContent } from 'grommet';
import { TopBar } from '../../src/components/TopBar';
import { SideNav } from '../../src/components/SideNav';
import { AccountHolderTable } from '../../src/components/AccountHolderTable';

const ManagerDashboard: NextPage = () => (
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
          <AccountHolderTable />
        </PageContent>
      </Page>
    </Box>
  </Grid>
);

export default ManagerDashboard;