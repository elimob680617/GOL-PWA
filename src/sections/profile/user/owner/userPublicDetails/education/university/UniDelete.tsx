import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { emptyUniversity } from 'src/redux/slices/profile/userUniversity-slice';
import { useDispatch } from 'src/redux/store';
import { useDeletePersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deletePersonCollege.generated';

interface UniDeleteProps {
  id: string;
}

export default function UniDelete(props: UniDeleteProps) {
  const { id } = props;
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //Mutation
  const [deleteCurrentUni, { isLoading }] = useDeletePersonCollegeMutation();
  //For Redux
  const dispatch = useDispatch();
  const handleDeleteButton = async () => {
    const resp: any = await deleteCurrentUni({
      filter: {
        dto: {
          id,
          instituteType: InstituteTypeEnum.University,
        },
      },
    });
    if (resp?.data?.deletePersonCollege?.isSuccess) {
      enqueueSnackbar('The university has been successfully deleted', { variant: 'success' });
      dispatch(emptyUniversity());
      router.back();
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };
  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this University?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton sx={{ p: 0 }} loading={isLoading} variant="text">
            <Typography variant="body2" color="error" onClick={() => handleDeleteButton()}>
              Delete University
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={() => router.back()}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
