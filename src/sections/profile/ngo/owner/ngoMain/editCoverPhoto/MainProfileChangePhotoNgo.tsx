import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'src/redux/store';
import { useUpdateOrganizationUserFieldMutation } from 'src/_requests/graphql/profile/ngoMainProfile/mutations/updateOrganizationUserField.generated';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
// types !
interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
  onClose?: () => void;
  onUpload: () => void;
}
export enum OrgUserFieldEnum {
  AvatarUrl = 'AVATAR_URL',
  CoverUrl = 'COVER_URL',
}
// ===================================================
function MainProfileChangePhotoNgo(props: MainProfileChangePhotoDialogProps) {
  // props !

  const { isProfilePhoto = false, onClose, onUpload } = props;
  // services !!
  const [updateOrganizationUserField, { isLoading: isLoadingField }] = useUpdateOrganizationUserFieldMutation();
  // tools
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuth();

  const handleRemove = async () => {
    if (isProfilePhoto) {
      const resAvatarNgo: any = await updateOrganizationUserField({
        filter: {
          dto: {
            field: OrgUserFieldEnum.AvatarUrl,
            avatarUrl: null,
          },
        },
      });
      if(resAvatarNgo?.data?.updateOrganizationUserField?.isSuccess){
        enqueueSnackbar('The Profile photo has been successfully deleted', { variant: 'success' });
        initialize()
      }else{
        enqueueSnackbar('It was not successful', { variant: 'error' });
      }
    } else {
      const resCover: any = await updateOrganizationUserField({
        filter: {
          dto: {
            field: OrgUserFieldEnum.CoverUrl,
            coverUrl: null,
          },
        },
      });
      if(resCover?.data?.updateOrganizationUserField?.isSuccess){
        enqueueSnackbar('The Cover photo has been successfully deleted', { variant: 'success' });
      }else{
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
            <LoadingButton loading={isLoadingField} variant="text" color='error'>
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

export default MainProfileChangePhotoNgo;
