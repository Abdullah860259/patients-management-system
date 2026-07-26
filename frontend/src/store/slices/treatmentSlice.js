import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';
import { store } from '..';

export const fetchTreatments = createAsyncThunk('treatments/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page);
    query.append('limit', '6');
    let res;
    if (store.getState().auth.user.role == "ceo" || store.getState().auth.user.role == "admin") {
      res = await API.get(`/admin/treatments?${query}`);
    } else {
      res = await API.get(`/patient/treatments?${query}`);
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchTreatmentStats = createAsyncThunk('treatments/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/patient/treatments/stats');
    return res.data.stats;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const treatmentsSlice = createSlice({
  name: 'treatments',
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
    clearTreatmentError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreatments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTreatments.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.treatments;
        s.total = a.payload.total;
        s.totalPages = a.payload.totalPages;
        s.currentPage = a.payload.currentPage;
      })
      .addCase(fetchTreatments.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message; })
      .addCase(fetchTreatmentStats.fulfilled, (s, a) => { s.stats = a.payload; });
  }
});

export const { clearTreatmentError } = treatmentsSlice.actions;
export default treatmentsSlice.reducer;
