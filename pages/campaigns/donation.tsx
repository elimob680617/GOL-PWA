import { Badge, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import Donations from 'src/sections/campaignLanding/Donations';

export const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));
function Donation() {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.background.neutral,
        minHeight: '100%',
        height: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Donations />
    </Box>
  );
}

export default Donation;
