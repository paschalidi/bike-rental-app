import type { NextPage } from 'next';
import { Heading, Page, PageContent } from 'grommet';
import React from 'react';
import { AddNewAccountForm } from '../../src/components/AddNewAccountForm';
import { ManagerAppGrid } from '../../src/components/ManagerAppGrid';

const ManagerDashboard: NextPage = () => (
  <ManagerAppGrid>
    <Page kind="wide">
      <PageContent>
        <Page kind="wide">
          <PageContent>
            <div style={{ marginTop: '5vh' }}>
              <Heading>Add new account</Heading>
              <AddNewAccountForm redirectAfterCreation={false} />
            </div>
          </PageContent>
        </Page>{' '}
      </PageContent>
    </Page>
  </ManagerAppGrid>
);

export default ManagerDashboard;
