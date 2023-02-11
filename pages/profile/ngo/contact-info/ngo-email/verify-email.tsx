import React from 'react';
import { Box } from '@mui/material';
import VerifyCodeForm from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoEmail/VerifyCodeForm';

export default function VerifyNgoEmail() {
  return (
    <Box sx={{ backgroundColor: '#E5E5E5', height: '100%' }}>
      <VerifyCodeForm />
    </Box>
  );
}
