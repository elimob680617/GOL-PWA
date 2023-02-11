import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { ProfileFieldEnum } from 'src/@types/sections/serverTypes';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';
import { useUpdateProfileFiledMutation } from 'src/_requests/graphql/profile/mainProfile/mutations/updatePersonProfile.generated';
// types !
interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
  onClose?: () => void;
  onUpload: () => void;
}

// ===================================================
function MainProfileChangePhotoUser(props: MainProfileChangePhotoDialogProps) {
  // props !

  const { isProfilePhoto = false, onClose, onUpload } = props;
  // services !!
  const [updateProfileField, { data, isLoading: isLoadingField }] = useUpdateProfileFiledMutation();
  // tools
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRemove = async () => {
    if (isProfilePhoto) {
      const resAvatarUser: any = await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.AvatarUrl,
            avatarUrl: null,
          },
        },
      });
      if (resAvatarUser?.data?.updateProfileFiled?.isSuccess) {
        enqueueSnackbar('The Profile photo has been successfully deleted', { variant: 'success' });
      } else {
        enqueueSnackbar('It was not successful', { variant: 'error' });
      }
    } else {
      const resCoverUser: any = await updateProfileField({
        filter: {
          dto: {
            field: ProfileFieldEnum.CoverUrl,
            coverUrl: null,
          },
        },
      });
      if (resCoverUser?.data?.updateProfileFiled?.isSuccess) {
        enqueueSnackbar('The Cover photo has been successfully deleted', { variant: 'success' });
      } else {
        enqueueSnackbar('It was not successful', { variant: 'error' });
      }
    }
    initialize();
    onClose();
  };

  function handleUpload() {
    onUpload();
  }

  return (
    <>
      <Stack spacing={2} sx={{ minHeight: '50%', py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              Change {isProfilePhoto ? 'Profile' : 'Cover'} photo
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer', alignItems: 'center' }} onClick={handleUpload}>
            <Image width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />
            <Typography variant="body2">Upload From System</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, cursor: 'pointer' }} onClick={handleRemove}>
            <Image width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />
            <LoadingButton loading={isLoadingField} variant="text" color="error">
              <Typography variant="body2" color="error">
                Remove Photo
              </Typography>
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}

export default MainProfileChangePhotoUser;
