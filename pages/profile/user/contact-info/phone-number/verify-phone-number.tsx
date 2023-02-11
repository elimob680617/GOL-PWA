import { Box } from '@mui/material';
import React from 'react';
import VerifyCodeFormPhoneNumber from 'src/sections/profile/user/owner/userContactInfo/userPhoneNumber/VerifyCodeFormPhoneNumber';

function VerifyCodeForm() {
  return (
    <Box sx={{ backgroundColor: '#E5E5E5', height: '100%' }}>
      <VerifyCodeFormPhoneNumber />
    </Box>
  );
}

export default VerifyCodeForm;
