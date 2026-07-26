import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchPayments = createAsyncThunk('payments/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page);
    query.append('limit', '6');
    const res = await API.get(`/patient/payments?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchPaymentStats = createAsyncThunk('payments/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/patient/payments/stats');
    return res.data.stats;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    items: [],
    stats: null,
    total: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null
  },
  reducers: {
    clearPaymentError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPayments.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.payments;
        s.total = a.payload.total;
        s.totalPages = a.payload.totalPages;
        s.currentPage = a.payload.currentPage;
      })
      .addCase(fetchPayments.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message; })
      .addCase(fetchPaymentStats.fulfilled, (s, a) => { s.stats = a.payload; });
  }
});

export const { clearPaymentError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
