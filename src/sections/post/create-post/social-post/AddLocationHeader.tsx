import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PATH_APP } from 'src/routes/paths';

const AddLocationHeader: FC = () => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={[
      (theme) => ({
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        height: 56,
      }),
    ]}
  >
    <Stack direction="row" alignItems="center">
      <Link href={PATH_APP.post.createPost.socialPost.index} replace passHref>
        <IconButton sx={{ padding: 0 }}>
          <Image src="/icons/arrow/left-arrow.svg" width={24} height={24} alt="header-left-arrow" />
        </IconButton>
      </Link>

      <Typography
        variant="subtitle1"
        sx={[
          (theme) => ({
            color: theme.palette.grey[800],
            fontWeight: 500,
            marginLeft: '16px',
          }),
        ]}
      >
        Social post
      </Typography>
    </Stack>
  </Stack>
);

export default AddLocationHeader;
