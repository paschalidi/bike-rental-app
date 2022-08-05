import { Box, Grid } from 'grommet';
import React, { useState } from 'react';
import { TopBar } from '../TopBar';
import { SideNav } from '../SideNav';

export const ManagerAppGrid: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [sidebar, setSidebar] = useState(true);

  return (
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
      <TopBar onClick={() => setSidebar(!sidebar)} />
      {sidebar && <SideNav />}
      <Box gridArea="main" align="center" style={{ overflowX: 'scroll' }}>
        {children}
      </Box>
    </Grid>
  );
};
