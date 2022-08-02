import type { NextPage } from 'next';
import React from 'react';
import { TopBar } from '../../src/components/TopBar';
import { SideNav } from '../../src/components/SideNav';

const ManagerDashboard: NextPage = () => (
  <>
    <TopBar />
    <SideNav />
  </>
);

export default ManagerDashboard;
