import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { emptyLocation, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';

import { useSnackbar } from 'notistack';
import { Icon } from 'src/components/Icon';
import { useDispatch, useSelector } from 'src/redux/store';
import { useDeleteLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deleteLocation.generated';

function ConfirmDeleteCurrentCity() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userCity = useSelector(userLocationSelector);
  const { enqueueSnackbar } = useSnackbar();

  const [deleteUserLocations, { isLoading }] = useDeleteLocationMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deleteUserLocations({
      filter: {
        dto: {
          id: userCity?.id,
        },
      },
    });
    if (resDataDelete?.data?.deleteLocation?.isSuccess) {
      enqueueSnackbar('The current city has been successfully deleted', { variant: 'success' });
      dispatch(emptyLocation());
    }
    //  else {
    //   enqueueSnackbar('current city deleted failed ', { variant: 'error' });
    // }
    router.push('/profile/user/public-details/list');
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete the current city?
          </Typography>
        </Box>
      </Stack>
      <Divider />

      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
            Delete Current City
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeleteCurrentCity;
