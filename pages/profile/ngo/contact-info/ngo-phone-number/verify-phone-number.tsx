import React from 'react';
import { Box } from '@mui/material';
import VerifyCodeForm from 'src/sections/profile/ngo/owner/ngoContactInfo/ngoPhoneNumber/VerifyCodeFormPhoneNumber';

export default function VerifyNgoPhoneNumber() {
  return (
    <Box sx={{ backgroundColor: '#E5E5E5', height: '100%' }}>
      <VerifyCodeForm />
    </Box>
  );
}
