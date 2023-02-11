import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, CircularProgress, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import useAuth from 'src/hooks/useAuth';
//component
import CampaignPost from 'src/sections/post/campaignPost/campaignPostCard/CampignPost';
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
export default function Posts() {
  // tools !
  const { query } = useRouter();
  const theme = useTheme();
  const router = useRouter();
  const userId = router?.query?.userId?.[0];
  const [value, setValue] = React.useState('1');

  // services !

  const [getHomePagePosts, { isLoading: getPostsLoading, data: postsData }] = useLazyGetHomePagePostsQuery();

  // useEffects !
  useEffect(() => {
    getHomePagePosts({ filter: { pageIndex: 0, pageSize: 10, dto: { ownerUserId: userId as string } } });
  }, [getHomePagePosts, userId]);

  const posts = postsData?.getHomePagePosts?.listDto?.items;

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
    <Stack>
      <Stack sx={{ mb: 2, px: 2, pt: 3 }} spacing={2} direction="row" alignItems="center">
        <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
          <ArrowLeft color={theme.palette.text.primary} />
        </IconButton>
        <Typography variant="subtitle1">Posts</Typography>
      </Stack>

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
        <TabPanel value="1">{renderPosts}</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">Item four</TabPanel>
      </TabContext>
    </Stack>
  );
}
