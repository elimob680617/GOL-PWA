import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { emptySocialMedia, userSocialMediasSelector } from 'src/redux/slices/profile/userSocialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useDeleteUserSocialMediaMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/deleteUserSocialMedia.generated';

export default function SocialLinkDelete() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const personSocialMedia = useSelector(userSocialMediasSelector);
  const [deleteUserSocialMedia, { isLoading }] = useDeleteUserSocialMediaMutation();
  const dispatch = useDispatch();

  function handlerDiscardSocialLink() {
    // dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.ngoSocialLinks);
  }
  const handleDeleteSocialLink = async () => {
    const resDataDelete: any = await deleteUserSocialMedia({
      filter: {
        dto: {
          id: personSocialMedia?.id,
        },
      },
    });

    if (resDataDelete.data.deleteUserSocialMedia?.isSuccess) {
      router.push(PATH_APP.profile.ngo.contactInfo.list);
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      enqueueSnackbar('The Social link has been successfully deleted', { variant: 'success' });
    }
  };
  const handleBackRoute = () => {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push(PATH_APP.profile.ngo.contactInfo.list);
  };
  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Socila Link?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />

          <Typography variant="body2" color="error" onClick={() => handleDeleteSocialLink()}>
            Delete Social Link
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Save2 fontSize="24" variant="Outline" />

          <Typography variant="body2" color="text.primary" onClick={handlerDiscardSocialLink}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
