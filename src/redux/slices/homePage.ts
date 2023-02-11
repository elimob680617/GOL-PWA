import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { IPost } from 'src/@types/post';
import { IUpdateCommentCounter } from 'src/@types/sections/homePage';

// types
import { RootState } from 'src/redux/store';

// ----------------------------------------------------------------------

interface IInViewPortVideo {
  positionTop: number;
  link: string;
}

interface INewAddedPost {
  id: string;
  type: 'campaign' | 'social' | 'share';
}
export interface IAppliedPost {
  id: string;
  type: 'campaign' | 'social' | 'share';
}
interface IHomePage {
  inViewPortVideos: IInViewPortVideo[];
  playingVieos: string[];
  posts: IPost[] | null;
  homePostCount: number | null;
  homeScroll: number;
  newPost: INewAddedPost | null;
  updatePost: IAppliedPost | null;
}

const initialState: IHomePage = {
  inViewPortVideos: [],
  playingVieos: [],
  posts: null,
  homePostCount: null,
  homeScroll: 0,
  newPost: null,
  updatePost: null,
};

const removeSamePosts = (posts: IPost[]) => {
  // const ids = posts.map((post) => {
  //   if (post.social) return post.social.id;
  //   if (post.campaign) return post.campaign.id;
  // });
  const uniquePosts = new Set();
  return posts.filter((post) => {
    const isPresentInSet = uniquePosts.has(post.campaign ? post.campaign.id : post.social.id);
    uniquePosts.add(post.campaign ? post.campaign.id : post.social.id);
    return !isPresentInSet;
  });
};

const slice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    addInViewPortVideo(state, action: PayloadAction<IInViewPortVideo>) {
      let newVideos = [...state.inViewPortVideos, action.payload];
      newVideos = newVideos.sort((a, b) => a.positionTop - b.positionTop);
      state.inViewPortVideos = [...newVideos];
    },
    addToHomePageUpdatePost(state, action:PayloadAction<{post:IPost,type:'campaign'|'social'|'share'}>){

    const index = state.posts!.findIndex(i=>i[action.payload.type]?.id === action.payload.post[action.payload.type]?.id)
     const temp = state.posts![index]
     if(action.payload.type === 'social'){
      temp.social = action.payload.post.social
     }  else if (action.payload.type === 'campaign'){
      temp.campaign = action.payload.post.campaign
     }
    console.log('first' , index, current (temp))
      state.posts?.splice(index, 1, temp);
    },
  
    removeInViewPortVideo(state, action: PayloadAction<string>) {
      state.inViewPortVideos = state.inViewPortVideos.filter((i) => i.link !== action.payload);
    },
    setPlayingVideo(state, action: PayloadAction<string>) {
      state.playingVieos = [...state.playingVieos, action.payload];
    },
    removePlayingVideo(state, action: PayloadAction<string>) {
      state.playingVieos = state.playingVieos.filter((i) => i !== action.payload);
    },
    insertPosts(state, action: PayloadAction<IPost[]>) {
      state.posts = [...removeSamePosts(action.payload)];
    },
    valuingHomePostCount(state, action: PayloadAction<number>) {
      state.homePostCount = action.payload;
    },
    setHomeScroll(state, action: PayloadAction<number>) {
      state.homeScroll = action.payload;
    },
    setNewPost(state, action: PayloadAction<INewAddedPost>) {
      state.newPost = action.payload;
    },
    updateSocialPostComment(state, action: PayloadAction<IUpdateCommentCounter>) {
      if (!state.posts) {
        return;
      }
      const index = state.posts?.findIndex((i) => i.social?.id === action.payload.id);

      if (index < 0) {
        return;
      }

      if (!state.posts[index].social) {
        return;
      }
      const temp = state.posts![index];
      if (action.payload.type === 'negative') {
        temp!.social!.countOfComments! = `${Number.parseInt(state!.posts![index]!.social!.countOfComments!) - 1}`;
      } else {
        temp!.social!.countOfComments! = `${Number.parseInt(state!.posts![index]!.social!.countOfComments!) + 1}`;
      }
      state.posts.splice(index, 1, { ...temp });
    },
    updateCampaignPostComment(state, action: PayloadAction<IUpdateCommentCounter>) {
      if (!state.posts) {
        return;
      }
      const index = state.posts?.findIndex((i) => i.campaign?.id === action.payload.id);
      if (index < 0) {
        return;
      }

      if (!state.posts[index].campaign) {
        return;
      }
      const temp = state.posts![index];
      if (action.payload.type === 'negative') {
        temp!.campaign!.countOfComments! = `${Number.parseInt(state!.posts![index]!.campaign!.countOfComments!) - 1}`;
      }else{
        temp!.campaign!.countOfComments! = `${Number.parseInt(state!.posts![index]!.campaign!.countOfComments!) + 1}`;

      }

      state.posts.splice(index, 1, { ...temp });
    },

    setUpdatePost(state, action: PayloadAction<IAppliedPost | null>) {
      state.updatePost = action.payload;
    },
  },
});

export const getInViewPortVideos = (state: RootState) => <IInViewPortVideo[]>state.homePage.inViewPortVideos;
export const getPlayingVideos = (state: RootState) => <string[]>state.homePage.playingVieos;
export const getPosts = (state: RootState) => <IPost[] | null>state.homePage.posts;
export const getPostsCount = (state: RootState) => <number>state.homePage.homePostCount;
export const getHomeScroll = (state: RootState) => <number>state.homePage.homeScroll;
export const getHomeNewAddedPost = (state: RootState) => <INewAddedPost>state.homePage.newPost;
export const getHomeUpdatedPost = (state: RootState) => <IAppliedPost>state.homePage.updatePost;

// Reducer
export default slice.reducer;

// Actions
export const {
  addInViewPortVideo,
  removeInViewPortVideo,
  setPlayingVideo,
  removePlayingVideo,
  insertPosts,
  valuingHomePostCount,
  setHomeScroll,
  setNewPost,
  updateSocialPostComment,
  updateCampaignPostComment,
  setUpdatePost,
  addToHomePageUpdatePost
} = slice.actions;
