import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig } from '@/lib/store';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  preferences: {
    currency: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

interface UserState {
  profile: UserProfile | null;
  session: any | null; // We'll keep this as any since it's managed by Supabase
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  session: null,
  status: 'idle',
  error: null
};

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  AsyncThunkConfig
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    // Implement actual API call here
    const response = await fetch('/api/profile');
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    return rejectWithValue('Failed to fetch user profile');
  }
});

export const updateUserProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile>,
  AsyncThunkConfig
>('user/updateProfile', async (updates, { rejectWithValue }) => {
  try {
    // Implement actual API call here
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  } catch (error) {
    return rejectWithValue('Failed to update user profile');
  }
});

export const updateUserPreferences = createAsyncThunk<
  UserProfile['preferences'],
  Partial<UserProfile['preferences']>,
  AsyncThunkConfig
>('user/updatePreferences', async (updates, { rejectWithValue }) => {
  try {
    // Implement actual API call here
    const response = await fetch('/api/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update preferences');
    return await response.json();
  } catch (error) {
    return rejectWithValue('Failed to update user preferences');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.session = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch profile';
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update profile';
      })
      // Update Preferences
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.preferences = action.payload;
        }
      });
  },
});

export const { setSession, clearUser } = userSlice.actions;

export default userSlice.reducer;
