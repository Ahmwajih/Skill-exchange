import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
    messages: string[];
}

const initialState: ChatState = {
    messages: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<string>) => {
            state.messages.push(action.payload);
        },
        // receiveMessage: (state, action: PayloadAction<string>) => {
        //     state.messages.push(action.payload);
        // }
    },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
