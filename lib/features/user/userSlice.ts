import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string | null;
  email: string | null;
}

const initialState: UserState = {
  id: null,
  email: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; email: string }>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user;
export const selectUserId = (state: { user: UserState }) => state.user.id;
export const selectUserEmail = (state: { user: UserState }) => state.user.email;

export default userSlice.reducer;
