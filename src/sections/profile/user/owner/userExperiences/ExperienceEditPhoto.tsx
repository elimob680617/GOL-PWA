import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'src/redux/store';

interface EditPhotoProps {
  onRemove: (value:undefined) => void;
  onUpload: () => void;
}

function ExperienceEditPhoto(props: EditPhotoProps) {
  const { onUpload,  onRemove } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  // function !
  function handleRemove() {
    onRemove(undefined);
  }
  function handleUpload(){
    onUpload()
  }

  function saveHandler() {
    router.push('profile/user/experience/newform');
  }

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            Edit Photo
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ px: 2 }}>
        <LoadingButton
          onClick={handleUpload}
          startIcon={<Image width={20} height={20} src={'/icons/upload_photo.svg'} alt="upload" />}
          variant="text"
          color="inherit"
          sx={{ maxWidth: 250 }}
        >
          <Typography variant="body2" color="text.primary">
            Upload New Photo From System
          </Typography>
        </LoadingButton>

        <Button
          variant="text"
          color="error"
          startIcon={<Image width={20} height={20} src={'/icons/delete_photo.svg'} alt="remove" />}
          onClick={handleRemove}
          sx={{ maxWidth: 140 }}
        >
          <Typography variant="body2" color="error">
            Remove Photo
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default ExperienceEditPhoto;
