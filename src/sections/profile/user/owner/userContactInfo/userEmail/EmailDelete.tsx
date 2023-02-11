import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { emptyEmail } from 'src/redux/slices/profile/userEmail-slice';
import { emptySocialMedia } from 'src/redux/slices/profile/userSocialMedia-slice';
import { useDispatch } from 'src/redux/store';

export default function EmailDelete() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

  function handlerDiscardEmail() {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    router.push('/profile/user/contact-info/email/email-form');
  }

  const handleBackRoute = () => {
    dispatch(emptyEmail({ audience: AudienceEnum.Public }));
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push('/profile/user/contact-info/list');
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
          <Icon name="trash" color="error.main" />
          <Link href={'/profile/user/contact-info/email/confirm-password'}>
            <Typography variant="body2" color="error">
              Delete Email
            </Typography>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handlerDiscardEmail}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
