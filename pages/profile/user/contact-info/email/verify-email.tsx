import { Box } from '@mui/material';
import React from 'react';
import VerifyCodeFormEmail from 'src/sections/profile/user/owner/userContactInfo/userEmail/VerifyCodeForm';

function VerifyCodeForm() {
  return (
    <Box sx={{ backgroundColor: '#E5E5E5', height: '100%' }}>
      <VerifyCodeFormEmail />
    </Box>
  );
}

export default VerifyCodeForm;
