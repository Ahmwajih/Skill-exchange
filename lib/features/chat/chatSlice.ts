import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
    messages: { text: string; sender: string }[]; 
}

const initialState: ChatState = {
    messages: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage(state, action: PayloadAction<{ text: string; sender?: string }>) {
            state.messages.push(action.payload);
        },
        acceptDeal(state, action: PayloadAction<{ providerEmail: string; providerName: string }>) {
            // Handle deal acceptance logic here
        },
    },
});

export const { addMessage, acceptDeal } = chatSlice.actions;

export default chatSlice.reducer;