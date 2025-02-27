import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectUserId = (state: RootState) => state.user.id;

export interface UserState {
  email: string | null;
  id: string | null;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  unknown,
  RootState,
  Action<string>,
  ReturnType
>;