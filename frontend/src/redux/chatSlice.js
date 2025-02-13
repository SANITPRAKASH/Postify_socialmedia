import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        messages: [],
        loading: false, // Add loading state for fetching messages
    },
    reducers: {
        // actions
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        appendMessage: (state, action) => {
            // Append new message to the existing messages array
            state.messages.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload; // Set loading state
        },
    },
});

export const { setOnlineUsers, setMessages, appendMessage, setLoading } = chatSlice.actions;

export default chatSlice.reducer;
