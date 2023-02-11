import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Save2, TrushSquare } from 'iconsax-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDeleteProjectMutation } from 'src/_requests/graphql/profile/ngoProject/mutations/deleteProject.generated';

interface ProjectDeleteProps {
  id: string
}

function ProjectDeleteConfirm(props: ProjectDeleteProps) {
  const { id } = props
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();
  const [deleteProject  , {isLoading} ] = useDeleteProjectMutation()

  // functions !
  const deleteHandler = async () => {
    const resDeleteData: any = await deleteProject({
      filter: {
        dto: {
          id,
        },
      },
    });
    console.log()
    if (resDeleteData?.data?.deleteProject?.isSuccess) {
      enqueueSnackbar('The Project has been successfully deleted', { variant: 'success' });
      router.back();
    } else {
      enqueueSnackbar('It was not successful', { variant: 'error' });
    }
  };

  function discardHandler() {
    router.back();
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Are you sure to delete the current Project?
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }}>
          <TrushSquare size="24" color={theme.palette.error.main} variant="Outline" />
          <LoadingButton variant="text" color="error" loading={isLoading} sx={{ p: 0 }}>
            <Typography variant="body2" color="error" onClick={deleteHandler}>
              Delete Current Project
            </Typography>
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', maxWidth: 99 }} onClick={discardHandler}>
          <Save2 fontSize="24" variant="Outline" />
          <Typography variant="body2" color="text.primary">
            Discard
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ProjectDeleteConfirm;
