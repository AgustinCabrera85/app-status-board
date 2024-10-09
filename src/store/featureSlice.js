import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para cargar los features desde la API
export const fetchFeatures = createAsyncThunk('features/fetchFeatures', async () => {
  const response = await axios.get('/features');
  return response.data;
});

const featureSlice = createSlice({
  name: 'features',
  initialState: {
    features: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.features = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default featureSlice.reducer;
