import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await API.post('/auth/logout');
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Login failed' });
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch user' });
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    const res = await API.put('/auth/change-password', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Password change failed' });
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const res = await API.put('/auth/update-profile', profileData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Update failed' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message; })
      .addCase(fetchMe.pending, (s) => { s.loading = true; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; })
      .addCase(fetchMe.rejected, (s) => { s.loading = false; s.user = null; s.token = null; localStorage.removeItem('token'); })
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = { ...s.user, ...a.payload.user }; });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
