import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { Icon } from 'src/components/Icon';

interface DisCardCertificateProps {
  onSubmit: () => void;
  isValid: boolean;
}

function DiscardCertificate(props: DisCardCertificateProps) {
  const { onSubmit, isValid } = props;
  const router = useRouter();
  const theme = useTheme();

  // function !
  // click on Discard
  function handleDiscardCertificate() {
    router.back();
  }

  // click on Save to mutation data and from Redux
  const handleSaveOrContinueCertificate = async () => {
    onSubmit();
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Do you want to {isValid ? 'save changes' : 'continue'}?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <LoadingButton
          // loading={isLoading}
          startIcon={<Icon name="Save" color="grey.700" />}
          variant="text"
          color="inherit"
          onClick={handleSaveOrContinueCertificate}
          sx={{ maxWidth: 133, justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="text.primary">
            {isValid ? 'Save Change' : 'Continue'}
          </Typography>
        </LoadingButton>
        <Button
          variant="text"
          color="error"
          startIcon={<Icon name="Close-1" color="grey.500" />}
          onClick={handleDiscardCertificate}
          sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default DiscardCertificate;
