import { Box, Stack } from '@mui/material';
import React, { FC } from 'react';
import {  getSearchedSocialPosts, getSearchLoading, getSearchCount } from 'src/redux/slices/search';
import { useSelector } from 'src/redux/store';
import SocialPost from 'src/sections/post/socialPost/socialPostCard/socialPost';
import PostNotFound from '../notFound/PostNotFound';
import SearchSeeMore from '../SeeMore';
import { SearchWrapperStyle } from '../SharedStyled';
import PostSkelton from '../skelton/PostSkelton';


const PostSearch: FC<{ nextPage }> = ({ nextPage }) => { 
  const posts = useSelector(getSearchedSocialPosts);
  const loading = useSelector(getSearchLoading);
  const count = useSelector(getSearchCount);

  return (
    <SearchWrapperStyle spacing={2} sx={{ p: 0 }}>
      {posts.map((post, index) => (
        <SocialPost key={index} post={post}  />
      ))}

      {posts.length === 0 && loading && (
        <Stack flexWrap="wrap">
          {[...Array(15)].map((i, index) => (
            <Box key={index} sx={{ width: '30rem' }}>
              <PostSkelton key={`post-skelton${index}`} />
            </Box>
          ))}
        </Stack>
      )}

      {posts.length > 0 && count > posts.length && <SearchSeeMore seeMore={() => nextPage()} loading={loading} />}

      {posts.length === 0 && !loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
          <PostNotFound />
        </Stack>
      )}
    </SearchWrapperStyle>
  );
};

export default PostSearch;
