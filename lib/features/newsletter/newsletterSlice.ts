import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const subscribeNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/newsletter', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState: {
    email: '',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.email = action.payload.email;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default newsletterSlice.reducer;
