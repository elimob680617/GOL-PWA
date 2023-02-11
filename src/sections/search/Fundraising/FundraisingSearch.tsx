import { Stack } from '@mui/material';
import React, { FC } from 'react';
import { getSearchLoading, getSearchCount, getSearchedCampaginPost } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import { SearchWrapperStyle } from '../SharedStyled';
import FundrasingPostSkelton from '../skelton/FundrasingPostSkelton';
import FundrasingNotFound from '../notFound/FundraisingNotFound';
import SearchSeeMore from '../SeeMore';
import CampignPost from 'src/sections/post/campaignPost/campaignPostCard/CampignPost';
import { useAddLastSeenMutation } from 'src/_requests/graphql/search/mutations/addLastSeen.generated';
import { ItemTypeEnum } from 'src/@types/sections/serverTypes';

const FundraisingSearch: FC<{ nextPage }> = ({ nextPage }) => {
  const posts = useSelector(getSearchedCampaginPost);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);
  const [addLastSeenRequest] = useAddLastSeenMutation();
  const addLastSeen = (index:number) => {
    const post = posts[index];
    addLastSeenRequest({ filter: { dto: { itemId: post.id, itemType: ItemTypeEnum.FundRaisingPosts } } });
  };
  return (
    <SearchWrapperStyle spacing={2} sx={{ padding: '0!important', overflowX: 'hidden' }}>
      {posts.map((post, index) => (
        <CampignPost key={index} post={post} />
      ))}

      {posts.length === 0 &&
        loading &&
        [...Array(1)].map((i, index) => <FundrasingPostSkelton key={`campagin-post-${index}`} />)}

      {posts.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <FundrasingNotFound />
        </Stack>
      )}

      {posts.length > 0 && count > posts.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}
    </SearchWrapperStyle>
  );
};

export default FundraisingSearch;
