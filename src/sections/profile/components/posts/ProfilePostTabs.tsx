import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import { Add } from 'iconsax-react';
import { default as Link, default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import CampaignPost from 'src/sections/post/campaignPost/campaignPostCard/CampignPost';
//component
import SocialPost from 'src/sections/post/socialPost/socialPostCard/socialPost';
//service
import { useLazyGetHomePagePostsQuery } from 'src/_requests/graphql/post/queries/getHomePagePosts.generated';

// -----------------------------------------------
const RootStyle = styled(Stack)(({ theme }) => ({}));
const LoadMoreStyle = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
}));
// --------------------------------------------------------
// start project
export default function ProfilePostTabs() {
  // tools !
  const { user } = useAuth();
  const [value, setValue] = React.useState('1');
  const theme = useTheme();
  const router = useRouter();
  const { query } = useRouter();

  // services !

  const [getPosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();
  const posts = postsData?.getHomePagePosts?.listDto?.items;
  const count = postsData?.getHomePagePosts?.listDto?.count;
  // useEffects !
  useEffect(() => {
    getPosts({ filter: { pageIndex: 0, pageSize: 1, dto: { ownerUserId: user?.id } } });
  }, [getPosts, user?.id]);
  // useMemo !
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

  // functions !!
  // change tabs
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  // ----------------------------------------------------

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList
          onChange={handleChange}
          aria-label="lab API tabs example"
          sx={{ '&>div>div': { justifyContent: 'space-between' } }}
        >
          <Tab label="Posts" value="1" />
          <Tab label="Fundraisings" value="2" />
          <Tab label="Articles" value="3" />
          <Tab label="Mentioned" value="4" />
        </TabList>
      </Box>
      <TabPanel value="1">
        {getPostsLoading ? (
          <Stack sx={{ py: 6 }} alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {count > 0 ? (
              <>
                {renderPosts}
                {count > 1 && (
                  <Link href={PATH_APP.profile.posts.root + '/' + user?.id} passHref>
                    <LoadMoreStyle>
                      <Typography variant="body2" color={theme.palette.primary.main} sx={{ cursor: 'pointer' }}>
                        See More Post
                      </Typography>
                    </LoadMoreStyle>
                  </Link>
                )}
              </>
            ) : (
              <Stack sx={{ pt: 3, pb: 2 }}>
                <NextLink href={PATH_APP.post.createPost.socialPost.index} passHref>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: (theme) => theme.palette.text.secondary,
                    }}
                    startIcon={<Add color={theme.palette.text.secondary} />}
                  >
                    <Typography color={theme.palette.text.primary}>Add post</Typography>
                  </Button>
                </NextLink>
              </Stack>
            )}
          </>
        )}
      </TabPanel>
      <TabPanel value="2">Item Two</TabPanel>
      <TabPanel value="3">Item Three</TabPanel>
      <TabPanel value="4">Item four</TabPanel>
    </TabContext>
  );
}
