import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Update the UserState interface to remove household_id
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
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      state.id = action.payload.id || state.id;
      state.email = action.payload.email || state.email;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
    },
  },
});
