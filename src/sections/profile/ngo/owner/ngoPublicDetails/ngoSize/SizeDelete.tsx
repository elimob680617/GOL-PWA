import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { OrgUserFieldEnum } from 'src/@types/sections/serverTypes';
import { PATH_APP } from 'src/routes/paths';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoPublicDetails/mutations/updateOrganizationUserField.generated';

export default function SizeDelete() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [updateOrganization, { isLoading, data: resUpdateOrganization }] = useUpdateOrganizationUserFieldMutation();

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await updateOrganization({
      filter: {
        dto: {
          field: OrgUserFieldEnum.Size,
          numberRangeId: null,
        },
      },
    });
    if (resDataDelete?.data?.updateOrganizationUserField?.isSuccess) {
      enqueueSnackbar('The ngo size has been successfully deleted', { variant: 'success' });
    }
    router.push(PATH_APP.profile.ngo.publicDetails.list);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Ngo Size?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }}>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Ngo Size
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Save2 fontSize="24" variant="Outline" />
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
