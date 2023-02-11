import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Icon } from 'src/components/Icon';
import { emptyExperience, userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { useDeleteExperienceMutation } from 'src/_requests/graphql/profile/experiences/mutations/updateExperience.generated';

function ExperienceDeleteConfirm() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const userExperience = useSelector(userExperienceSelector);
  const [deleteExperience, { isLoading }] = useDeleteExperienceMutation();

  // functions !
  const deleteHandler = async () => {
    const resDeleteData: any = await deleteExperience({
      filter: {
        dto: {
          id: userExperience?.id,
        },
      },
    });
    if (resDeleteData?.data?.deleteExperience?.isSuccess) {
      enqueueSnackbar('The experience has been successfully deleted', { variant: 'success' });
      dispatch(emptyExperience());
      router.push('/profile/user/experience/list');
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  function discardHandler() {
    router.push('/profile/user/experience/list');
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete the current Experience?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" color="error" loading={isLoading} sx={{ p: 0 }}>
            <Typography variant="body2" color="error" onClick={deleteHandler}>
              Delete Current Experience
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={discardHandler}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ExperienceDeleteConfirm;
