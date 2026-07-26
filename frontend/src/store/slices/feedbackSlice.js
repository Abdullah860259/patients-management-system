import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchFeedbacks = createAsyncThunk('feedback/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page);
    query.append('limit', '5');
    const res = await API.get(`/patient/feedback?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchFeedbackStats = createAsyncThunk('feedback/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/patient/feedback/stats');
    return res.data.stats;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const submitFeedback = createAsyncThunk('feedback/submit', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/patient/feedback', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    items: [],
    stats: null,
    total: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    submitting: false,
    error: null
  },
  reducers: {
    clearFeedbackError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchFeedbacks.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.feedbacks;
        s.total = a.payload.total;
        s.totalPages = a.payload.totalPages;
        s.currentPage = a.payload.currentPage;
      })
      .addCase(fetchFeedbacks.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message; })
      .addCase(fetchFeedbackStats.fulfilled, (s, a) => { s.stats = a.payload; })
      .addCase(submitFeedback.pending, (s) => { s.submitting = true; })
      .addCase(submitFeedback.fulfilled, (s) => { s.submitting = false; })
      .addCase(submitFeedback.rejected, (s) => { s.submitting = false; });
  }
});

export const { clearFeedbackError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
