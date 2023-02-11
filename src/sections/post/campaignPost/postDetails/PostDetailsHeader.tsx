// @mui
import { useTheme, Stack, Typography, IconButton } from '@mui/material';
import { More } from 'iconsax-react';
interface PostDetailsHeaderTypes {
  title: string
}
function PostDetailsHeader(props: PostDetailsHeaderTypes) {
  const theme = useTheme();
  const { title } = props;
  return (
    <>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems:'center' }}>
        <Typography variant="subtitle1" color={theme.palette.text.primary} fontWeight={'bold'}>
        {title}
        </Typography>
        <IconButton>
          <More color={theme.palette.text.secondary} />
        </IconButton>
      </Stack>
    </>
  );
}

export default PostDetailsHeader;
