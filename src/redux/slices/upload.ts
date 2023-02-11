import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { ICreateSocialPost } from 'src/@types/post';
import { Audience, PictureUrlInputType, VideoUrlInputType } from 'src/@types/sections/serverTypes';
import { RootState } from 'src/redux/store';
import { IUploadingFiles } from 'src/components/upload/GolUploader';

// ----------------------------------------------------------------------

interface IUpload {
  uploadingFiles: IUploadingFiles[];
}

const initialState: IUpload = {
  uploadingFiles: [],
};

const slice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadingFiles(state, action: PayloadAction<IUploadingFiles[]>) {
      state.uploadingFiles = action.payload;
    },
    reset(state) {
      state.uploadingFiles = [];
    },
  },
});

export const getUploadingFiles = (state: RootState) => <IUploadingFiles[]>state.upload.uploadingFiles;

// Reducer
export default slice.reducer;

// Actions
export const { setUploadingFiles, reset } = slice.actions;
