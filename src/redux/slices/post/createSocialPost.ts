import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Descendant } from 'slate';

// types
import { ICreateSocialPost } from 'src/@types/post';
import { Audience, MediaUrlInputType, PictureUrlInputType, VideoUrlInputType } from 'src/@types/sections/serverTypes';
import { ILocationSelect } from 'src/components/location/LocationSelect';
import { RootState } from 'src/redux/store';

// ----------------------------------------------------------------------
const textValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  } as Descendant,
];
export const initialState: ICreateSocialPost = {
  audience: Audience.Public,
  gifs: '',
  location: null,
  mediaUrls: [],
  text: textValue,
  editMode: false,
  id: '',
  currentPosition: [],
  fileWithError: '',
};

const slice = createSlice({
  name: 'createPost',
  initialState,
  reducers: {
    valuingAll(state, action: PayloadAction<ICreateSocialPost>) {
      state.audience = action.payload.audience;
      state.gifs = action.payload.gifs;
      state.location = action.payload.location;
      state.mediaUrls = action.payload.mediaUrls;
      state.text = action.payload.text;
      state.editMode = action.payload.editMode;
      state.id = action.payload.id;
      state.fileWithError = action.payload.fileWithError;
    },
    setAudience(state, action: PayloadAction<Audience>) {
      state.audience = action.payload;
    },
    setText(state, action: PayloadAction<Descendant[]>) {
      state.text = action.payload;
    },
    setGifs(state, action: PayloadAction<string>) {
      state.gifs = action.payload;
    },
    setMediaUrls(state, action: PayloadAction<MediaUrlInputType[]>) {
      state.mediaUrls = action.payload;
    },
    setLocation(state, action: PayloadAction<ILocationSelect | null>) {
      state.location = action.payload;
    },
    setCurrentPosition(state, action: PayloadAction<number[]>) {
      state.currentPosition = action.payload;
    },
    setFileWithErrorId(state, action: PayloadAction<string>) {
      state.fileWithError = action.payload;
    },
    reset(state) {
      state.audience = initialState.audience;
      state.gifs = initialState.gifs;
      state.location = initialState.location;
      state.mediaUrls = initialState.mediaUrls;
      state.text = initialState.text;
      state.editMode = initialState.editMode;
      state.id = initialState.id;
      state.fileWithError = initialState.fileWithError;
    },
  },
});

export const basicCreateSocialPostSelector = (state: RootState) =>
  <ICreateSocialPost>{
    audience: state.createSocialPost.audience,
    gifs: state.createSocialPost.gifs,
    location: state.createSocialPost.location,
    text: state.createSocialPost.text,
    editMode: state.createSocialPost.editMode,
    id: state.createSocialPost.id,
    currentPosition: state.createSocialPost.currentPosition,
    mediaUrls: state.createSocialPost.mediaUrls,
    fileWithError: state.createSocialPost.fileWithError,
  };

export const richTextEditorSelector = (state: RootState) =>
  <Descendant[]>[
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
      ],
    } as Descendant,
  ];

export const getSocialPostAudience = (state: RootState) => <string>state.createSocialPost.audience;

// Reducer
export default slice.reducer;

// Actions
export const { setAudience, setGifs, setLocation, setMediaUrls, setText, valuingAll, reset, setCurrentPosition,setFileWithErrorId } =
  slice.actions;
