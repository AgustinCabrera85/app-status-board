import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApplicationsWithFeatures } from '../services/api';

export const fetchApplicationsWithFeatures = createAsyncThunk(
  'applications/fetchApplicationsWithFeatures',
  async () => {
    const data = await getApplicationsWithFeatures();
    return data;
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsWithFeatures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicationsWithFeatures.fulfilled, (state, action) => {
        state.applications = action.payload;
        state.loading = false;
      })
      .addCase(fetchApplicationsWithFeatures.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default applicationSlice.reducer;
