import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { getSearchedSocialPosts, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import SocialPost from 'src/sections/post/socialPost/socialPostCard/socialPost';
import PostNotFound from '../notFound/PostNotFound';

function AllPostSearch() {
  const posts = useSelector(getSearchedSocialPosts);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingX={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Posts
        </Typography>
        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.post}>
            <a>See more</a>
          </Link>
        </Typography>
      </Stack>
      <Box>
        {posts.slice(0, 2).map((post) => (
          <SocialPost  key={post.id} post={post} />
        ))}

        {posts.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {posts.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <PostNotFound />
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export default AllPostSearch;
