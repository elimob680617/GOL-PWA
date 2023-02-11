import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { GroupCategoryType, GroupCategoryState } from 'src/@types/sections/profile/ngoCategory';
import { AudienceEnum, GroupCategory } from 'src/@types/sections/serverTypes';
import { RootState } from 'src/redux/store';

const initialState: GroupCategoryState = {};

const slice = createSlice({
  name: 'ngoCategory',
  initialState,
  reducers: {
    ngoCategoryUpdated(state, action: PayloadAction<GroupCategoryType>) {
      state.category = { ...state.category, ...action.payload };
    },
    emptyNgoCategory(state) {
      state.category = undefined;
    },
  },
});
export const ngoCategorySelector = (state: RootState) => state.ngoCategory.category;

// Reducer
export default slice.reducer;

// Actions
export const { ngoCategoryUpdated, emptyNgoCategory } = slice.actions;
