import { Box, Stack } from '@mui/material';
import React from 'react';
import { bottomNavbar } from 'src/config';
import Layout from 'src/layouts';
import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';
import NotifSection from 'src/sections/notification';

Notification.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="onlyAuthGuard">{page}</Layout>;
};

function Notification() {
  return (
    <Box sx={{ height: '100%' }}>
      <Stack sx={{ height: `calc(100% - ${bottomNavbar.height}px)`, overflowY: 'auto' }} spacing={0.5}>
        <NotifSection />
      </Stack>
      <Box sx={{ marginTop: '0!important' }}>
        <MainBottomNavigationBar />
      </Box>
    </Box>
  );
}

export default Notification;
