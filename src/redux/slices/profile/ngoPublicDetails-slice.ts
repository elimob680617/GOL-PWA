import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NGOPublicDetailsState, PlacePayloadType } from 'src/@types/sections/profile/ngoPublicDetails';
import { RootState } from 'src/redux/store';

const initialState: NGOPublicDetailsState = {};

const slice = createSlice({
  name: 'ngoPublicDetails',
  initialState,
  reducers: {
    ngoPlaceUpdated(state, action: PayloadAction<PlacePayloadType>) {
      state.place = { ...state.place, ...action.payload };
    },
    ngoPlaceEmpty(state) {
      state.place = undefined;
    },
  },
});
export const ngoPlaceSelector = (state: RootState) => state.ngoPublicDetails.place;

// Reducer
export default slice.reducer;

// Actions
export const { ngoPlaceUpdated, ngoPlaceEmpty } = slice.actions;
