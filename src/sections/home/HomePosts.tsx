import { CircularProgress, Stack, styled, Typography, useTheme } from '@mui/material';
import { Router, useRouter } from 'next/router';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { ICampaign, IPost, ISocial } from 'src/@types/post';
import { FilterByEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import useAuth from 'src/hooks/useAuth';
import {
  addToHomePageUpdatePost,
  getHomeNewAddedPost,
  getHomeScroll,
  getHomeUpdatedPost,
  getPosts,
  getPostsCount,
  insertPosts,
  setHomeScroll,
  setNewPost,
  valuingHomePostCount,
} from 'src/redux/slices/homePage';
import { resetSharedPost } from 'src/redux/slices/post/sharePost';
import { useDispatch, useSelector } from 'src/redux/store';
import { useLazyGetSocialPostQuery } from 'src/_requests/graphql/post/getSocialPost.generated';
import { useLazyGetFundRaisingPostQuery } from 'src/_requests/graphql/post/post-details/queries/getFundRaisingPost.generated';
import { useLazyGetHomePagePostsQuery } from 'src/_requests/graphql/post/queries/getHomePagePosts.generated';
import CampignPost from '../post/campaignPost/campaignPostCard/CampignPost';
import ShareCampaignPostCard from '../post/sharePost/ShareCampaignPostCard';
import ShareSocialPostCard from '../post/sharePost/ShareSocialPostCard';
import SocialPost from '../post/socialPost/socialPostCard/socialPost';
// wizard components
import NgoWizard from '../profile/ngo/wizard/NgoWizard';
import Wizard from '../profile/user/wizard/Wizard';

// ----------------------------
// styles !
const RootStyle = styled('div')(({ theme }) => ({
  marginTop: theme?.spacing(10.5),
  height: 'calc(100% - 84px)',
  overflowY: 'auto',
  overflowX: 'hidden',
}));

const PostTypeStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const HomePosts: FC = () => {
  const { initialize, user } = useAuth();
  const dispatch = useDispatch();
  const [getHomePagePosts, { isLoading: getPostsLoading, data: postsResponse, isFetching: getPostFetching }] =
    useLazyGetHomePagePostsQuery();
  const homePageRef = useRef<HTMLDivElement>(null);
  const homePageScroll = useSelector(getHomeScroll);
  const [getSocialPost] = useLazyGetSocialPostQuery();
  const [getCampaignPost] = useLazyGetFundRaisingPostQuery();
  const { query, push, route } = useRouter();
  const theme = useTheme();
  const changeScroll = () => {
    if (!homePageScroll) return;
    homePageRef.current.scrollTo({ top: homePageScroll, behavior: 'smooth' });
  };
  const posts = useSelector(getPosts);

  const newPost = useSelector(getHomeNewAddedPost);
  const updatePost = useSelector(getHomeUpdatedPost);
  const [hasMorePosts, setHasmorePosts] = useState<boolean>(false);
  const [shareBottomSheet, setShareBottomSheet] = useState<boolean>(false);
  const postCount = useSelector(getPostsCount);
  const pageIndex = useRef<number>(0);
  const pageSize = 10;
  const canLoadMore = useRef<boolean>(false);
  useEffect(() => {
    valuingHasMorePosts();
    if (posts === null) {
      pageIndex.current = 0;
      getHomePagePosts({ filter: { pageIndex: pageIndex.current, pageSize: pageSize } });
    } else {
      const outOfBind = posts.length % pageSize;
      const division = posts.length / pageSize;
      if (outOfBind === 0) {
        pageIndex.current = division - 1;
      } else {
        pageIndex.current = Math.floor(division);
      }
    }
    canLoadMore.current = false;
    setTimeout(() => {
      canLoadMore.current = true;
    }, 100);
  }, [posts]);


  useEffect(() => {
    if (!newPost) return;
    if (newPost.type === 'social') {
      getSocialPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()
        .then((res) => {
          addToHomePageNewPost({ social: res?.getSocialPost?.listDto?.items?.[0] as ISocial });
        });
    }
    if (newPost.type === 'campaign') {
      getCampaignPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()
        .then((res) => {
          addToHomePageNewPost({ campaign: res?.getFundRaisingPost?.listDto?.items?.[0] as ICampaign });
        });
    }
    if (newPost.type === 'share') {
      getSocialPost({ filter: { dto: { id: newPost.id } } })
        .unwrap()
        .then((res) => {
          addToHomePageNewPost({ social: res?.getSocialPost?.listDto?.items?.[0] as ISocial });
          dispatch(resetSharedPost());
        });
    }
  }, [newPost]);

  useEffect(() => {
 
    if (!updatePost) return;
    if (updatePost.type === 'social') {
      getSocialPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()
        .then((res) => {
          dispatch(addToHomePageUpdatePost({ type: 'social', post: {social: res?.getSocialPost?.listDto?.items?.[0]} as IPost }));
        });
    }
    if (updatePost.type === 'campaign') {
      getCampaignPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()
        .then((res) => {
          dispatch(
            addToHomePageUpdatePost({ type: 'campaign', post: {campaign: res?.getFundRaisingPost?.listDto?.items?.[0]} as IPost })
          );
        });
    }
    if (updatePost.type === 'share') {
      getSocialPost({ filter: { dto: { id: updatePost.id } } })
        .unwrap()
        .then((res) => {
          dispatch(addToHomePageUpdatePost({ type: 'social', post: {social: res?.getSocialPost?.listDto?.items?.[0]} as IPost }));
        
        });
    }
   
  }, [updatePost]);

  const valuingHasMorePosts = () => {
    if (postCount === null) return;
    if (postCount < (pageIndex.current + 1) * pageSize) {
      setHasmorePosts(false);
    } else {
      setHasmorePosts(true);
    }
  };

  useEffect(() => {
    valuingHasMorePosts();
  }, [postCount]);

  const loadMore = () => {
    if (getPostFetching || getPostsLoading || !canLoadMore.current) return;
    pageIndex.current = pageIndex.current + 1;
    getHomePagePosts({ filter: { pageIndex: pageIndex.current, pageSize: pageSize } })
      .unwrap()
      .then((res) => {
        if (res.getHomePagePosts.listDto.count < (pageIndex.current + 1) * pageSize) {
          setHasmorePosts(false);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (postsResponse) {
      const newPosts = [...(posts || []), ...(postsResponse?.getHomePagePosts?.listDto?.items || [])];
      dispatch(insertPosts(newPosts));
      dispatch(valuingHomePostCount(postsResponse?.getHomePagePosts?.listDto?.count || 0));
    }
  }, [postsResponse]);

  useEffect(() => {
    changeScroll();
  }, []);

  const addToHomePageNewPost = (newPost: IPost) => {
    dispatch(insertPosts([newPost, ...(posts || [])]));
    dispatch(setNewPost(null));
    dispatch(valuingHomePostCount(postsResponse?.getHomePagePosts?.listDto?.count || 0));
  };

  const handler = (route: string) => {
    dispatch(setHomeScroll(homePageRef.current.scrollTop));
  };
  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    Router.events.on('beforeHistoryChange', handler);

    return () => {
      Router.events.off('beforeHistoryChange', handler);
    };
  }, []);

  const renderPostsMemo = useMemo(
    () =>
      getPostsLoading && !posts ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <InfiniteScroll
          getScrollParent={() => document.getElementById('scrollableDiv')}
          loadMore={loadMore}
          hasMore={hasMorePosts}
          loader={
            <Stack sx={{ marginTop: 1, marginBottom: 1 }} direction="row" justifyContent="center">
              <CircularProgress />
            </Stack>
          }
          useWindow={false}
          threshold={500}
        >
          {/* -----------wizard components -------------*/}
          {user?.userType === UserTypeEnum.Normal ? (
            <Wizard />
          ) : user?.userType === UserTypeEnum.Ngo ? (
            <NgoWizard />
          ) : (
            <></>
          )}
          {posts?.map((post) => {
            if (post?.social?.isSharedSocialPost)
              return <ShareSocialPostCard key={post!.social?.id} post={post?.social} />;
            else if (post?.social?.isSharedCampaignPost)
              return <ShareCampaignPostCard key={post!.social?.id} post={post?.social} />;
            else if (post?.social) return <SocialPost key={post!.social?.id} post={post?.social} />;
            return <CampignPost key={post!.campaign?.id} post={post?.campaign} />;
          })}

        </InfiniteScroll>
      ),
    [getPostsLoading, posts, push, postCount, hasMorePosts, getPostFetching]
  );

  return (
    <Stack
      sx={{
        bgcolor: 'background.neutral',
        maxHeight: 'calc(100% - 110px)',
        minHeight: 'calc(100% - 110px)',
        overflowY: 'hidden',
        overflowX: 'hidden',
      }}
    >
      <Stack
        sx={{
          height: 84,
          px: 2,
          bgcolor: 'background.paper',
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Stack direction="row" spacing={4} sx={{ overflowX: 'auto' }}>
          <Stack sx={{ padding: 1, bgcolor: 'background.default', borderRadius: 1 }}>
            <PostTypeStyle variant="subtitle1">All</PostTypeStyle>
          </Stack>
          {/* <Stack sx={{ padding: 1, borderRadius: 1 }}>
        <PostTypeStyle variant="subtitle1">Campaign</PostTypeStyle>
      </Stack> */}
          <Stack sx={{ padding: 1, borderRadius: 1 }}>
            <PostTypeStyle variant="subtitle1">Social</PostTypeStyle>
          </Stack>
          <Stack sx={{ padding: 1, borderRadius: 1 }}>
            <PostTypeStyle variant="subtitle1">Article</PostTypeStyle>
          </Stack>
        </Stack>
      </Stack>
      {getPostsLoading && !posts && (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      <RootStyle ref={homePageRef} id="scrollableDiv">
        {renderPostsMemo}
      </RootStyle>
    </Stack>
  );
};

export default HomePosts;
