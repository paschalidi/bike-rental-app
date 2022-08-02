import type { NextPage } from 'next';
import { Box, Grid, Page, PageContent } from 'grommet';
import React from 'react';
import { TopBar } from '../../components/TopBar';
import { SideNav } from '../../components/SideNav';
import { AddNewBikeForm } from '../../components/AddNewBikeForm';

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
          <AddNewBikeForm />
        </PageContent>
      </Page>
    </Box>
  </Grid>
);

export default ManagerDashboard;
