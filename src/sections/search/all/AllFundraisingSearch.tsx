import { CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { getSearchedCampaginPost, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import FundrasingNotFound from '../notFound/FundraisingNotFound';
import CampignPost from 'src/sections/post/campaignPost/campaignPostCard/CampignPost';

function AllFundrasingSearch() {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingX={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Fundraising
        </Typography>
        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.fundraising}>
            <a>See more</a>
          </Link>
        </Typography>
      </Stack>
      <Stack spacing={2}>
        {posts.slice(0, 2).map((post, index) => (
          <CampignPost key={post.id} post={post} />
        ))}

        {posts.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {posts.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <FundrasingNotFound />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default AllFundrasingSearch;
