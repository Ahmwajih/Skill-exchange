import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  text: string;
  sender: string;
}

interface ChatState {
  messages: { [conversationId: string]: Message[] }; 
}

const initialState: ChatState = {
  messages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<{ conversationId: string; message: Message }>) {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    
    acceptDeal(state, action: PayloadAction<{ providerEmail: string; providerName: string }>) {
      // Handle the acceptDeal action

    },
  },
});

export const { addMessage, acceptDeal } = chatSlice.actions;

export default chatSlice.reducer;