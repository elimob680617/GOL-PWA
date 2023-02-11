import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { InstituteTypeEnum } from 'src/@types/sections/serverTypes';
import { Icon } from 'src/components/Icon';
import { emptyCollege, userCollegesSelector } from 'src/redux/slices/profile/userColleges-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { useDeletePersonCollegeMutation } from 'src/_requests/graphql/profile/publicDetails/mutations/deletePersonCollege.generated';

interface CollegeDeleteProps {
  id: string;
}

export default function CollegeDelete(props: CollegeDeleteProps) {
  const { id } = props;
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  //Mutation
  const [deleteCurrentCollege, { isLoading }] = useDeletePersonCollegeMutation();
  //For Redux
  const dispatch = useDispatch();
  const userColleges = useSelector(userCollegesSelector);
  const handleDeleteButton = async () => {
    const resp: any = await deleteCurrentCollege({
      filter: {
        dto: {
          id,
          instituteType: InstituteTypeEnum.College,
        },
      },
    });
    if (resp?.data?.deletePersonCollege?.isSuccess) {
      enqueueSnackbar('The college has been successfully deleted', { variant: 'success' });
      dispatch(emptyCollege());
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
            Are you sure to delete this College?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <Icon name="trash" color="error.main" />
          <LoadingButton variant="text" loading={isLoading} sx={{ p: 0 }} onClick={() => handleDeleteButton()}>
            <Typography variant="body2" color="error">
              Delete College
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
