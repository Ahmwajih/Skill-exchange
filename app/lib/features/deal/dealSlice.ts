import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Deal } from '@/types/deal';
import { baseUrl } from '@/config';

// ...existing code...
export const fetchDeals = createAsyncThunk<Deal[], string, { rejectValue: string }>(
  "deals/fetchDeals",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}api/deal/${userId}`);
      const data = await res.json();
      if (res.ok) {
        return data.data;
      } else {
        toast.error(data.error || "Failed to fetch deals");
        return rejectWithValue(data.error || "Failed to fetch deals");
      }
    } catch (error) {
      toast.error("Error fetching deals");
      return rejectWithValue(error.message || "Error fetching deals");
    }
  }
);
// ...existing code...