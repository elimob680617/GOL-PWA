import { Box, Button, IconButton, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Image from 'next/image';

const PostButtonStyle = styled(Button)(() => ({
  width: 120,
}));

const WrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 64,
  borderTop: `1px solid ${theme.palette.grey[100]}`,
  width: '100%',
}));

const CreatePostMainFotter: FC = () => (
  <WrapperStyle direction="row" alignItems="center" justifyContent="space-between" sx={[(theme) => ({})]}>
    <IconButton>
      <Image src="/icons/media/gallery.svg" width={24} height={24} alt="import-image" />
    </IconButton>
    <IconButton>
      <Image src="/icons/gif.svg" width={24} height={24} alt="post-gifs" />
    </IconButton>
    <IconButton>
      <Image src="/icons/location/location.svg" width={24} height={24} alt="post-gifs" />
    </IconButton>
    {/* FIXME add primary variant to button */}
    {/* FIXME fix button styles for overrides */}
    <PostButtonStyle variant="contained">Post</PostButtonStyle>
  </WrapperStyle>
);

export default CreatePostMainFotter;
