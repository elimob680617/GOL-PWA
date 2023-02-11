import { Box, Button, IconButton, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));

const CreatePostMainHeader: FC = () => {
  const { back } = useRouter();

  return (
    <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
      <Typography
        variant="subtitle1"
        sx={{
          color: 'grey.900',
          fontWeight: 500,
        }}
      >
        Social post
      </Typography>
      <IconButton onClick={() => back()} sx={{ padding: 0 }}>
        <Image src="/icons/Close/24/Outline.svg" width={24} height={24} />
      </IconButton>
    </HeaderWrapperStyle>
  );
};

export default CreatePostMainHeader;
