import { SearchWrapperStyle } from '../SharedStyled';
import HashtagSkelton from '../skelton/HashtagSkelton';
import HashtagItem from './HashtagItem';
import { Box, Stack, styled } from '@mui/material';
import React, { FC } from 'react';
import {
  getSearchLoading,
  getSearchedHashtags,
  getSearchCount,
} from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import HashtagNotFound from '../notFound/HashtagNotFound';
import SearchSeeMore from '../SeeMore';

// import reload from '/public/icons/search/reload.svg';

const ReloadButtonStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

const HashtagSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const hashtags = useSelector(getSearchedHashtags);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <SearchWrapperStyle spacing={2}>
      {hashtags.map((hashtag, index) => (
        <HashtagItem key={hashtag.id} title={hashtag.title} id={hashtag.id} />
      ))}

      {hashtags.length === 0 && loading && (
        <>
          {[...Array(5)].map((i, index) => (
            <HashtagSkelton key={`people-skelton-${index}`} />
          ))}
        </>
      )}

      {hashtags.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <HashtagNotFound />
        </Stack>
      )}
      {!loading && count > hashtags.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </SearchWrapperStyle>
  );
};

export default HashtagSearch;
