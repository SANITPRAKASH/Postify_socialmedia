// redux/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socketio",
    initialState: {
        isConnected: false, // Connection status
        socketId: null,     // Serializable socket data
    },
    reducers: {
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
        },
        setSocketId: (state, action) => {
            state.socketId = action.payload;
        },
    },
});

export const { setConnectionStatus, setSocketId } = socketSlice.actions;
export default socketSlice.reducer;
