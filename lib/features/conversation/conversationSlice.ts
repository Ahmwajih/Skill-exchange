import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const baseUrl = process.env.BASE_URL || "http://localhost:3000/";

interface Conversation {
  _id?: string;
  providerId: string;
  seekerId: string;
  messages: Array<{ senderId: string; content: string; timestamp: Date }>;
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
export const fetchConversations = createAsyncThunk("conversations/fetchConversations", async (userId) => {
  try {
    const res = await fetch(`${baseUrl}/api/conversations/${userId}`);
    const data = await res.json();
    
    if (res.status === 200) {
      return data.data;
    } else {
      toast.error(data.error || "Failed to fetch conversations");
      throw new Error(data.error || "Failed to fetch conversations");
    }
  } catch (error) {
    toast.error("Error fetching conversations");
    throw error;
  }
});

// Create a new conversation
export const createConversation = createAsyncThunk("conversations/createConversation", async (conversationData) => {
  try {
    const res = await fetch(`${baseUrl}/api/conversations`, {
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
      throw new Error(data.error || "Failed to create conversation");
    }
  } catch (error) {
    toast.error("Error creating conversation");
    throw error;
  }
});

// Slice
const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store fetched conversations
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null; // Handle errors
      })
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // Add newly created conversation to state
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null; // Handle errors
      });
  },
});

export default conversationSlice.reducer;
