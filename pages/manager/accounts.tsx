import type { NextPage } from 'next';
import React from 'react';
import { Page, PageContent } from 'grommet';
import { AccountHolderTable } from '../../src/components/AccountHolderTable';
import { ManagerAppGrid } from '../../src/components/ManagerAppGrid';

const ManagerDashboard: NextPage = () => (
  <ManagerAppGrid>
    <Page kind="wide">
      <PageContent>
        <AccountHolderTable />
      </PageContent>
    </Page>
  </ManagerAppGrid>
);

export default ManagerDashboard;
