//mui
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, CircularProgress, Stack, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
//next
import { default as Link } from 'next/link';
import { useRouter } from 'next/router';
import NoPostIcon from 'public/icons/noPost.svg';
//...
import React, { FC, useEffect, useMemo } from 'react';
//routes
import { PATH_APP } from 'src/routes/paths';
import CampaignPost from 'src/sections/post/campaignPost/campaignPostCard/CampignPost';
//components
import SocialPost from 'src/sections/post/socialPost/socialPostCard/socialPost';
//service
import { useLazyGetHomePagePostsQuery } from 'src/_requests/graphql/post/queries/getHomePagePosts.generated';

//..............................................
interface UserPost {
  // ID?: string;
  Name?: string;
}
const LoadMoreStyle = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const PostStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));
const PostStyleNoPost = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 1,
  padding: theme.spacing(2),
}));
const PostView: FC<UserPost> = (props) => {
  const { Name } = props;
  const router = useRouter();
  const { query } = useRouter();
  const [value, setValue] = React.useState('Post');
  const userId = router?.query?.id?.[0];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [getPosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();
  useEffect(() => {
    getPosts({ filter: { pageIndex: 0, pageSize: 1, dto: { ownerUserId: userId } } });
  }, []);

  const posts = postsData?.getHomePagePosts?.listDto?.items;
  const count = postsData?.getHomePagePosts?.listDto?.count;
  //................................................
  const renderPosts = useMemo(
    () => (
      <Stack spacing={2} sx={{ flex: 1 }}>
        {getPostsLoading ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          posts?.map((post) =>
            post.social ? (
              <SocialPost key={post?.social?.id} post={post?.social} />
            ) : (
              <CampaignPost key={post?.campaign?.id} post={post?.campaign} />
            )
          )
        )}
      </Stack>
    ),

    [getPostsLoading, posts]
  );

  //................
  const renderPost = useMemo(
    () => (
      <>
        {count > 0 ? (
          <>
            <PostStyle>{renderPosts}</PostStyle>
            {count > 1 && (
              <>
                <PostStyle>
                  <Link href={PATH_APP.profile.posts.root + '/' + userId} passHref>
                    <LoadMoreStyle>
                      <Typography variant="body2" color={'primary.main'} sx={{ cursor: 'pointer' }}>
                        See More Post
                      </Typography>
                    </LoadMoreStyle>
                  </Link>
                </PostStyle>
              </>
            )}
          </>
        ) : (
          <>
            <PostStyleNoPost direction="column" spacing={3}>
              {/* <Box sx={{ typography: 'body1', display: 'flex', justifyContent: 'space-between' }}></Box> */}
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Image src={NoPostIcon} alt="" />
                <Box sx={{ display: 'flex' }} mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    {Name} has no {value}
                  </Typography>
                </Box>
              </Box>
            </PostStyleNoPost>
          </>
        )}
      </>
    ),

    [count, Name, value]
  );

  //..........................................................
  return (
    <>
      <PostStyle justifyContent="space-between" direction="row">
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                sx={{ '&>div>div': { justifyContent: 'space-around' } }}
              >
                <Tab label="Posts" value="Post" />
                <Tab label="Articles" value="Article" />
                <Tab label="Mentioned" value="Mention" />
              </TabList>
            </Box>
            {posts?.length > 0 && <></>}
            <TabPanel value="Post">{renderPost}</TabPanel>
            <TabPanel value="Article">{renderPost}</TabPanel>
            <TabPanel value="Mention">{renderPost}</TabPanel>
          </TabContext>
        </Box>
      </PostStyle>
    </>
  );
};

export default PostView;
