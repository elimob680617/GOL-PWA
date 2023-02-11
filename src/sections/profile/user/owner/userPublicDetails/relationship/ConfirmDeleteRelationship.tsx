import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { Icon } from 'src/components/Icon';
import { userRelationShipSelector } from 'src/redux/slices/profile/userRelationShip-slice';
import { useSelector } from 'src/redux/store';
import { useUpdateRelationshipMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/updateRelationship.generated';

function ConfirmDeleteRelationship() {
  const router = useRouter();
  const theme = useTheme();
  const relationShip = useSelector(userRelationShipSelector);
  const { enqueueSnackbar } = useSnackbar();

  const [updateRelationship, { isLoading, data: deleteRelationshipData }] = useUpdateRelationshipMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await updateRelationship({
      filter: {
        dto: {
          relationshipStatusId: null,
        },
      },
    });
    if (resDataDelete?.data?.updateRelationship?.isSuccess) {
      enqueueSnackbar('The relationship has been successfully deleted', { variant: 'success' });
    }
    router.push('/profile/user/public-details/list');
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Relationship Status?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }}>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Relationship Status
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Link href="/profile/user/public-details/list" passHref>
            <Typography variant="body2" color="text.primary">
              Discard
            </Typography>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeleteRelationship;
