import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { ArrowLeft, CloseSquare, Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { ngoPlaceEmpty } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrganizationUserField.generated';

export default function LocationDelete() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const [upsertPlaceNgoUser, { isLoading: isLoading }] = useUpdateOrganizationUserFieldMutation();

  const handleDeleteButton = async () => {
    const response: any = await upsertPlaceNgoUser({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Place,
          address: null,
          googlePlaceId: null,
        },
      },
    });
    if (response?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('The Location has been successfully deleted', { variant: 'success' });
      dispatch(ngoPlaceEmpty());
      router.push(PATH_APP.profile.ngo.publicDetails.list);
    }
  };
  function handleDiscard() {
    dispatch(ngoPlaceEmpty());
    router.push(PATH_APP.profile.ngo.publicDetails.list);
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Do you want to delete Location?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }} onClick={() => handleDeleteButton()}>
            <Typography variant="body2" color="error">
              Delete Location
            </Typography>
          </LoadingButton>
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
