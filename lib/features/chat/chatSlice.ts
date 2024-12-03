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
    },
});

export const { addMessage } = chatSlice.actions;

export default chatSlice.reducer;