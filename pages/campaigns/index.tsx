import { Box } from '@mui/material';
import React from 'react';
import CampaignLanding from 'src/sections/campaignLanding';

function Campaign() {
  return (
    <Box 
      sx={{
        bgcolor: (theme) => theme.palette.background.neutral,
        minHeight: '100%',
        height: 'auto',
        overflowX:'hidden'
      }}
    >
      <CampaignLanding />
    </Box>
  );
}

export default Campaign;
