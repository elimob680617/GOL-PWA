import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft, CloseSquare } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'src/redux/store';

interface MainProfileChangePhotoDialogProps {
  isProfilePhoto?: boolean;
  onRemove?: () => void;
  onUpload: () => void;
}

function MainProfileChangePhoto(props: MainProfileChangePhotoDialogProps) {
  const { isProfilePhoto = false, onRemove, onUpload } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  function handleRemove() {
    onRemove();
  }

  function handleUpload() {
    onUpload();
  }

  return (
    <>
      <Stack spacing={2} sx={{ minHeight: '50%', py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <ArrowLeft />
            </IconButton>
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
            <Typography variant="body2" color="error">
              Remove Photo
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}

export default MainProfileChangePhoto;
