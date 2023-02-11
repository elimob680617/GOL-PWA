import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { Icon } from 'src/components/Icon';
import { emptyUniversity } from 'src/redux/slices/profile/userUniversity-slice';
import { useDispatch } from 'src/redux/store';

interface UniDiscardProps {
  isValid: boolean;
  onSubmit: () => void;
  loading: boolean;
}

export default function UniDiscard(props: UniDiscardProps) {
  const { isValid, loading, onSubmit } = props;
  const theme = useTheme();
  const router = useRouter();

  //For Redux Tools
  const dispatch = useDispatch();

  const handleDiscard = () => {
    dispatch(emptyUniversity());
    router.back();
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
          loading={loading}
          startIcon={<Icon name="Save" color="grey.700" />}
          variant="text"
          color="inherit"
          onClick={onSubmit}
          sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="text.primary">
            {isValid ? 'Save Change' : 'Continue'}
          </Typography>
        </LoadingButton>
        <Button
          variant="text"
          color="error"
          startIcon={<Icon name="Close-1" color="grey.500" />}
          onClick={handleDiscard}
          sx={{ maxWidth: 99 }}
        >
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}
