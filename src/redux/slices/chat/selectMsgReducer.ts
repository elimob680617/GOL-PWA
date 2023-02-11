import { createSlice } from '@reduxjs/toolkit';

interface selectState {
  isSelect: boolean;
}

const initialState: selectState = {
  isSelect: false,
};

export const selectMsgSlice = createSlice({
  name: 'selectMsg',
  initialState,
  reducers: {
    onEnable: (state) => {
      state.isSelect = true;
    },
    onDisable: (state) => {
      state.isSelect = false;
    },
  },
});

export const { onEnable, onDisable } = selectMsgSlice.actions;

export default selectMsgSlice.reducer;
