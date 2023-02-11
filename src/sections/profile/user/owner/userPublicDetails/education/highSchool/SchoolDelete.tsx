import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Icon } from 'src/components/Icon';
import { schoolWasEmpty } from 'src/redux/slices/profile/userSchool-slice';
import { useDispatch } from 'src/redux/store';
import { useDeletePersonSchoolMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deletePersonSchool.generated';

interface CollegeDeleteProps {
  id: string;
}

export default function SchoolDelete(props: CollegeDeleteProps) {
  const { id } = props;
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //Mutation
  const [deleteCurrentSchool, { isLoading }] = useDeletePersonSchoolMutation();
  //For Redux
  const dispatch = useDispatch();

  // Functions
  const handleDeleteButton = async () => {
    const response: any = await deleteCurrentSchool({
      filter: {
        dto: {
          id,
        },
      },
    });
    if (response?.data?.deletePersonSchool?.isSuccess) {
      enqueueSnackbar('The school has been successfully deleted', { variant: 'success' });
      dispatch(schoolWasEmpty());
      router.back();
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };
  function handleDiscard() {
    router.back();
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete this High School?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }} onClick={() => handleDeleteButton()}>
            <Typography variant="body2" color="error">
              Delete High School
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }}>
          <Icon name="Close-1" color="grey.500" />
          <Typography variant="body2" color="text.primary" onClick={handleDiscard}>
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
