import { CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { getSearchedHashtags, getSearchLoading } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import HashtagItem from '../hashtag/HashtagItem';
import HashtagNotFound from '../notFound/HashtagNotFound';
import { HorizontalScrollerWithScroll, InlineBlockStyle } from '../SharedStyled';

function AllHashtagSearch() {
  const hashtags = useSelector(getSearchedHashtags);
  const loading = useSelector(getSearchLoading);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Hashtags
        </Typography>
        <Typography variant="button" color="info.main">
          <Link href={PATH_APP.search.hashtag}>
            <a>See more</a>
          </Link>
        </Typography>
      </Stack>
      <HorizontalScrollerWithScroll pb={3}>
        {hashtags.map((hashtag, index) => (
          <InlineBlockStyle key={`all-search-hashtag-${index}`} sx={{ marginRight: 2 }}>
            <HashtagItem title={hashtag.title} />
          </InlineBlockStyle>
        ))}

        {hashtags.length === 0 && loading && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}

        {hashtags.length === 0 && !loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
            <HashtagNotFound />
          </Stack>
        )}
      </HorizontalScrollerWithScroll>
    </Stack>
  );
}

export default AllHashtagSearch;
