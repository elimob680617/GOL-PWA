import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageResponseDto } from 'src/@types/sections/serverTypes';

interface allState {
  allMsg: MessageResponseDto[];
}

const initialState: allState = {
  allMsg: [],
};

export const allMsgSlice = createSlice({
  name: 'allMsg',
  initialState,
  reducers: {
    onGetAllMsg: (state, action: PayloadAction<MessageResponseDto[]>) => {
      state.allMsg = action.payload;
    },
    onUpdateMsg: (state, action: PayloadAction<MessageResponseDto>) => {
      state.allMsg.unshift(action.payload);
    },
    onPaginateMsg: (state, action: PayloadAction<MessageResponseDto[]>) => {
      const temp = [...state.allMsg];
      console.log(action.payload);
      if (action.payload.length) {
        state.allMsg = [...temp, ...action.payload];
      }
    },
  },
});

export const { onGetAllMsg, onUpdateMsg, onPaginateMsg } = allMsgSlice.actions;

export default allMsgSlice.reducer;
