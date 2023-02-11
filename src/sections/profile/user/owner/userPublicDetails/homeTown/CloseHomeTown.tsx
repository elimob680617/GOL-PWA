import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'src/components/Icon';
import { emptyLocation, userLocationSelector } from 'src/redux/slices/profile/userLocation-slice';
import { useUpsertLocationMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/addCurrentCity.generated';

function CloseHomeTown() {
  const [privacy, setPrivacy] = React.useState();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const userCity = useSelector(userLocationSelector);
  const isEdit = !!userCity?.id;
  const dispatch = useDispatch();
  const [upsertLocation, { isLoading }] = useUpsertLocationMutation();
  const handelSaveChange = async () => {
    const result: any = await upsertLocation({
      filter: {
        dto: {
          audience: userCity.audience,
          cityId: userCity.cityId,
          id: userCity.id,
          locationType: userCity.locationType,
        },
      },
    });
    if (result?.data?.upsertLocation?.isSuccess) {
      enqueueSnackbar(
        isEdit ? 'The current city has been successfully  edited' : 'The current city has been successfully added',
        { variant: 'success' }
      );
      router.push('/profile/public-details');
      dispatch(emptyLocation());
    }
  };
  const handelDiscard = () => {
    dispatch(emptyLocation());
    router.push('/profile/public-details');
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
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 130 }} onClick={handelSaveChange}>
          <Icon name="Save" color="grey.700" />
          <Typography variant="body2" color="text.primary">
            Save Change
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={handelDiscard}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="error">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default CloseHomeTown;
