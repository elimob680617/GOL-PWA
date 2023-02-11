import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from 'src/components/Icon';

function ConfirmDeletePhoneNumber() {
  const router = useRouter();
  const theme = useTheme();

  const handleClickDeleteButton = async () => {
    router.push('/profile/user/contact-info/phone-number/confirm-password');
  };

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
          <Icon name="trash" color="error.main" />
          <Box>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Phone number
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Link href="/profile/user/phone-number/phone-number-form" passHref>
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeletePhoneNumber;
