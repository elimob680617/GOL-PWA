import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { Icon } from 'src/components/Icon';
import { userWebsiteSelector } from 'src/redux/slices/profile/userWebsite-slice';
import { useDeleteWebSiteMutation } from 'src/_requests/graphql/profile/contactInfo/mutations/deleteWebSite.generated';

function ConfirmDeleteWebsite() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const deleteWebsite = useSelector(userWebsiteSelector);
  const [deletePersonWebsite] = useDeleteWebSiteMutation();

  function handlerDiscardWebsite() {
    router.push('/profile/user/contact-info/list');
  }

  const handleClickDeleteButton = async () => {
    const resDataDelete: any = await deletePersonWebsite({
      filter: {
        dto: {
          id: deleteWebsite?.id,
        },
      },
    });
    if (resDataDelete.data.deleteWebSite?.isSuccess) {
      router.push('/profile/user/contact-info/list');
      enqueueSnackbar('The website has been successfully deleted', { variant: 'success' });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this Website?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }}>
          <Icon name="trash" color="error.main" />
          <Box>
            <Typography variant="body2" color="error" onClick={() => handleClickDeleteButton()}>
              Delete Website
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handlerDiscardWebsite}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ConfirmDeleteWebsite;
