import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Icon } from 'src/components/Icon';
import { userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { useAddExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/addExperience.generated';
import { useUpdateExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/updateExperience.generated';

interface DiscardProps {
  isValid: boolean;
  onSubmit: () => void;
}

function ExperienceDiscard(props: DiscardProps) {
  const { isValid, onSubmit } = props;

  const { enqueueSnackbar } = useSnackbar();
  const userExperience = useSelector(userExperienceSelector);
  const [addExperienceMutate, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperienceMutate, { isLoading: updateLoading }] = useUpdateExperienceMutation();

  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  // function !
  // click on Diskard
  function discardHandler() {
    router.push('/profile/user/experience/list');
  }

  // click on Save to mutaiation data and from Redux
  const saveHandler = async () => {
    onSubmit();
  };

  return (
    <>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Do you want to {isValid ? 'save changes' : 'Continue'}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <LoadingButton
            loading={addLoading || updateLoading}
            startIcon={<Icon name="Save" color="grey.700" />}
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
            startIcon={<Icon name="Close-1" color="grey.500" />}
            onClick={discardHandler}
            sx={{ maxWidth: 99, justifyContent: 'flex-start' }}
          >
            <Typography variant="body2" color="error">
              Discard
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default ExperienceDiscard;
