import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchAdminDashboard = createAsyncThunk('admin/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/admin/dashboard');
    console.log(res.data,"admin dashboard");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchAllTreatments = createAsyncThunk('admin/fetchAllTreatments', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page);
    query.append('limit', '10');
    const res = await API.get(`/admin/treatments?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchAllPayments = createAsyncThunk('admin/fetchAllPayments', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page);
    query.append('limit', '10');
    const res = await API.get(`/admin/payments?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchAllFeedbacks = createAsyncThunk('admin/fetchAllFeedbacks', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page);
    query.append('limit', '10');
    const res = await API.get(`/admin/feedback?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchAllPatients = createAsyncThunk('admin/fetchAllPatients', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page);
    query.append('limit', '10');
    const res = await API.get(`/admin/patients?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchAllAdmins = createAsyncThunk('admin/fetchAllAdmins', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page);
    query.append('limit', '10');
    const res = await API.get(`/admin/admins?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createAdmin = createAsyncThunk('admin/createAdmin', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/admin/admins', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const updateAdmin = createAsyncThunk('admin/updateAdmin', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/admin/admins/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const deleteAdmin = createAsyncThunk('admin/deleteAdmin', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/admin/admins/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async (params, { rejectWithValue }) => {
  try {
    const res = await API.get(`/admin/analytics${params ? `?${params}` : ''}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createPatient = createAsyncThunk('admin/createPatient', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/admin/patients', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createPayment = createAsyncThunk('admin/createPayment', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/admin/payments', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createTreatment = createAsyncThunk('admin/createTreatment', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/admin/treatments', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const updateTreatment = createAsyncThunk('admin/updateTreatment', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/admin/treatments/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const deleteTreatment = createAsyncThunk('admin/deleteTreatment', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/admin/treatments/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const respondToFeedback = createAsyncThunk('admin/respondToFeedback', async ({ id, message }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/admin/feedback/${id}/respond`, { message });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboard: null,
    treatments: { items: [], total: 0, totalPages: 1, currentPage: 1 },
    payments: { items: [], total: 0, totalPages: 1, currentPage: 1 },
    feedbacks: { items: [], total: 0, totalPages: 1, currentPage: 1 },
    patients: { items: [], total: 0, totalPages: 1, currentPage: 1 },
    admins: { items: [], total: 0, totalPages: 1, currentPage: 1 },
    analytics: null,
    loading: false,
    error: null
  },
  reducers: {
    clearAdminError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminDashboard.fulfilled, (s, a) => { s.loading = false; s.dashboard = a.payload; })
      .addCase(fetchAdminDashboard.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message; })
      .addCase(fetchAllTreatments.fulfilled, (s, a) => {
        s.treatments.items = a.payload.treatments;
        s.treatments.total = a.payload.total;
        s.treatments.totalPages = a.payload.totalPages;
        s.treatments.currentPage = a.payload.currentPage;
      })
      .addCase(fetchAllPayments.fulfilled, (s, a) => {
        s.payments.items = a.payload.payments;
        s.payments.total = a.payload.total;
        s.payments.totalPages = a.payload.totalPages;
        s.payments.currentPage = a.payload.currentPage;
      })
      .addCase(fetchAllFeedbacks.fulfilled, (s, a) => {
        s.feedbacks.items = a.payload.feedbacks;
        s.feedbacks.total = a.payload.total;
        s.feedbacks.totalPages = a.payload.totalPages;
        s.feedbacks.currentPage = a.payload.currentPage;
      })
      .addCase(fetchAllPatients.fulfilled, (s, a) => {
        s.patients.items = a.payload.patients;
        s.patients.total = a.payload.total;
        s.patients.totalPages = a.payload.totalPages;
        s.patients.currentPage = a.payload.currentPage;
      })
      .addCase(fetchAllAdmins.fulfilled, (s, a) => {
        s.admins.items = a.payload.admins;
        s.admins.total = a.payload.total;
        s.admins.totalPages = a.payload.totalPages;
        s.admins.currentPage = a.payload.currentPage;
      })
      .addCase(fetchAnalytics.pending, (s) => { s.loading = true; })
      .addCase(fetchAnalytics.fulfilled, (s, a) => { s.loading = false; s.analytics = a.payload.analytics; })
      .addCase(fetchAnalytics.rejected, (s) => { s.loading = false; });
  }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
