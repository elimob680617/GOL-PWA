import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import React from 'react';

interface DiscardProps {
  isValid: boolean;
  onSubmit: () => void;
}

function EstablishmentDiscard(props: DiscardProps) {
  const { isValid, onSubmit } = props;
  const theme = useTheme();
  const router = useRouter();
  const [privacy, setPrivacy] = React.useState();
  function discardHandler() {
    router.back();
  }

  // click on Save to mutaiation data and from Redux
  const saveHandler = async () => {
    onSubmit();
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Do you want to save changes?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <LoadingButton
          // loading={addLoading || updateLoading}
          startIcon={<Save2 fontSize="24" variant="Outline" />}
          variant="text"
          color="inherit"
          onClick={saveHandler}
          sx={{ justifyContent: 'flex-start' }}
        >
          <Typography variant="body2" color="text.primary">
            {isValid ? 'Save Change' : 'Continue'}
          </Typography>
        </LoadingButton>
        <Button
          variant="text"
          color="error"
          startIcon={<TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />}
          onClick={discardHandler}
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

export default EstablishmentDiscard;
