import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { AudienceEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import {
  emptySocialMedia, userSocialMediasSelector
} from 'src/redux/slices/profile/userSocialMedia-slice';
import { useDispatch, useSelector } from 'src/redux/store';
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
    router.push('/profile/user/contact-info/list');
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
      router.push('/profile/user/contact-info/list');
      dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
      enqueueSnackbar('The Social link has been successfully deleted', { variant: 'success' });
    }
  };
  const handleBackRoute = () => {
    dispatch(emptySocialMedia({ audience: AudienceEnum.Public }));
    router.push('/profile/user/contact-info/list');
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
          <Icon name="trash" color="error.main" />
          <Typography variant="body2" color="error" onClick={() => handleDeleteSocialLink()}>
            Delete Social Link
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handlerDiscardSocialLink}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
