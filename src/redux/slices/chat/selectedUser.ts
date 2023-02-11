import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationContactResponseDto } from 'src/@types/sections/serverTypes';

interface allState {
  onChatUser: ConversationContactResponseDto;
}

const initialState: allState = {
  onChatUser: {},
};

export const selectedUserSlice = createSlice({
  name: 'selectedUser',
  initialState,
  reducers: {
    onSelectUser: (state, action: PayloadAction<ConversationContactResponseDto>) => {
      state.onChatUser = action.payload;
    },
    onRestUser: (state) => {
      state.onChatUser = {};
    },
  },
});

export const { onSelectUser, onRestUser } = selectedUserSlice.actions;

export default selectedUserSlice.reducer;
