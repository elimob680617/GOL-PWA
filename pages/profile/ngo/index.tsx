import { Box } from '@mui/material';
import React from 'react';
import Layout from 'src/layouts';
import MainNGO from 'src/sections/profile/ngo/owner/ngoMain/MainNGO';

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};

export default function ProfilePage() {
  return (
    <>
      <Box>
        <MainNGO />
      </Box>
    </>
  );
}
