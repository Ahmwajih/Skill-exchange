import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const baseUrl = process.env.BASE_URL || "http://localhost:3000/";

interface Message {
  senderId: string;
  content: string;
  timestamp: Date;
  _id?: string;
}

interface Conversation {
  _id?: string;
  providerId: string;
  seekerId: string;
  providerName?: string;
  seekerName?: string;
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConversationState {
  data: Conversation[];
  currentConversation?: Conversation | null;
  loading: boolean;
  error?: string | null;
}

const initialState: ConversationState = {
  data: [],
  currentConversation: null,
  loading: false,
};

// Async Thunks

// Fetch conversations for a user
export const fetchConversations = createAsyncThunk<Conversation[], string, { rejectValue: string }>(
  "conversations/fetchConversations",
  async (userId, { rejectWithValue }) => {
    try {
      console.log(`Fetching conversations for userId: ${userId}`);
      const res = await fetch(`${baseUrl}/api/conversation/${userId}`);
      console.log("Response Status:", res.status);

      const data = await res.json();
      console.log("Response Data:", data);

      if (res.status === 200) {
        return data.data;
      } else {
        console.error("Backend Error:", data.error || "Unknown Error");
        toast.error(data.error || "Failed to fetch conversations");
        return rejectWithValue(data.error || "Failed to fetch conversations");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Error fetching conversations");
      return rejectWithValue(error.message || "Error fetching conversations");
    }
  }
);

// Create a new conversation
export const createConversation = createAsyncThunk<Conversation, Conversation, { rejectValue: string }>(
  "conversations/createConversation",
  async (conversationData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/api/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversationData),
      });
      
      const data = await res.json();
      
      if (res.status === 201) {
        toast.success("Conversation created successfully");
        return data.data;
      } else {
        toast.error(data.error || "Failed to create conversation");
        return rejectWithValue(data.error || "Failed to create conversation");
      }
    } catch (error) {
      toast.error("Error creating conversation");
      return rejectWithValue(error.message || "Error creating conversation");
    }
  }
);

// Slice
const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.loading = false;
        state.data = action.payload; // Store fetched conversations
      })
      .addCase(fetchConversations.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload; // Handle errors
      })
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.loading = false;
        state.data.push(action.payload); // Add newly created conversation to state
      })
      .addCase(createConversation.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload; // Handle errors
      });
  },
});

export default conversationSlice.reducer;