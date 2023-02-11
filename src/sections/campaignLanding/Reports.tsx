import { Box } from '@mui/material';
import React from 'react';
import { HeaderCampaignLanding, MenuItemCampaignLanding } from 'src/components/campaignLanding';
import NgoReportMain from '../reports/ngo/NgoReportMain';

function Reports() {
  return (
    <Box>
      <HeaderCampaignLanding title="Campaign Landing" />
      <Box display={'flex'} sx={{ overflow: 'auto' }}>
        <MenuItemCampaignLanding active="reports" />
      </Box>
      <NgoReportMain />
    </Box>
  );
}

export default Reports;
