import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import React from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { emptyEmail } from 'src/redux/slices/profile/userEmail-slice';
import { emptySocialMedia } from 'src/redux/slices/profile/userSocialMedia-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';

export default function EmailDelete() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

  function handlerDiscardEmail() {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.ngoEmail);
  }

  function handleRouting() {
    router.push(PATH_APP.profile.ngo.contactInfo.confirmPasswordEmail);
  }

  const handleBackRoute = () => {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Email?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <Typography variant="body2" color="error" onClick={handleRouting}>
            Delete Email
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Save2 fontSize="24" variant="Outline" />

          <Typography variant="body2" color="text.primary" onClick={handlerDiscardEmail}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
