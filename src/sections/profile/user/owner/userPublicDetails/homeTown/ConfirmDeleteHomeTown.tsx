import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { emptyLocation, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';

import { LoadingButton } from '@mui/lab';
import { useSelector } from 'src/redux/store';
import { useDeleteLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deleteLocation.generated';

import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { Icon } from 'src/components/Icon';

function ConfirmDeleteHomeTown() {
  const router = useRouter();
  const theme = useTheme();
  const userCity = useSelector(userLocationSelector);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [deleteUserLocations, { isLoading, data: deleteLocationData }] = useDeleteLocationMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deleteUserLocations({
      filter: {
        dto: {
          id: userCity?.id,
        },
      },
    });
    if (resDataDelete?.data?.deleteLocation?.isSuccess) {
      enqueueSnackbar('The home town has been successfully deleted', { variant: 'success' });
      dispatch(emptyLocation());
    }

    router.push('/profile/public-details');
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete the Home town?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }}>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Home Town
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Link href="/profile/public-details" passHref>
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeleteHomeTown;
