import { Box, Divider, IconButton, Stack, Typography, useTheme, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowLeft, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch } from 'react-redux';
import { RelationShipCleared, userRelationShipSelector } from 'src/redux/slices/profile/userRelationShip-slice';
import { useSelector } from 'src/redux/store';
import { useUpdateRelationshipMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updateRelationship.generated';

interface DiscardProps {
  isValid: boolean;
  onSubmit: () => void;
}

export default function SizeCloseDialog(props: DiscardProps) {
  const { isValid, onSubmit } = props;
  const [privacy, setPrivacy] = React.useState();
  const router = useRouter();
  const theme = useTheme();

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
          <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
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
          sx={{ maxWidth: 130, justifyContent: 'flex-start' }}
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
