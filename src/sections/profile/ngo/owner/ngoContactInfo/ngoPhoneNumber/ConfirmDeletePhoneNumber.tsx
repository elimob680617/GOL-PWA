import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import React from 'react';
import { PATH_APP } from 'src/routes/paths';

function ConfirmDeletePhoneNumber() {
  const router = useRouter();
  const theme = useTheme();

  const handleClickDeleteButton = async () => {
    router.push(PATH_APP.profile.ngo.contactInfo.confirmPasswordPhoneNumber);
  };

  function handleDiscard() {
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Phone Number?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <Box>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Phone number
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Save2 fontSize="24" variant="Outline" />

          <Typography variant="body2" color="text.primary" onClick={handleDiscard}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeletePhoneNumber;
