import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from 'src/components/Icon';
import { RelationShipCleared, userRelationShipSelector } from 'src/redux/slices/profile/userRelationShip-slice';
import { useSelector } from 'src/redux/store';
import { useUpdateRelationshipMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updateRelationship.generated';

function CloseRelationship() {
  const [privacy, setPrivacy] = React.useState();
  const router = useRouter();
  const theme = useTheme();
  const relationShip = useSelector(userRelationShipSelector);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!relationShip?.personId;

  const [updateRelationship, { isLoading }] = useUpdateRelationshipMutation();

  const handelSaveChange = async () => {
    const resData: any = await updateRelationship({
      filter: {
        dto: {
          audience: relationShip?.audience,
          relationshipStatusId: relationShip?.relationshipStatus?.id,
        },
      },
    });
    if (resData?.data?.updateRelationship?.isSuccess) {
      dispatch(RelationShipCleared());
      enqueueSnackbar(
        isEdit ? 'The relationship has been successfully edited' : 'The relationship has been successfully added',
        { variant: 'success' }
      );

      router.push('/profile/public-details');
    }
  };
  const handelDiscard = () => {
    dispatch(RelationShipCleared());
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

export default CloseRelationship;
