import { Box, Stack } from '@mui/material';
import { FC } from 'react';
import MainBottomNavigationBar from 'src/components/botton-bars/MainBottomNavigationBar';
import { bottomNavbar } from 'src/config';
import Layout from 'src/layouts';
import SearchMain from 'src/sections/search/SearchMain';

SearchMainPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="onlyAuthGuard">{page}</Layout>;
};

export default function SearchMainPage() {
  return (
    <Box sx={{ height: '100%' }}>
      <Stack
        sx={{
          bgcolor: 'background.neutral',
          height: '100%',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
      >
        <SearchMain />
      </Stack>
    </Box>
  );
}
