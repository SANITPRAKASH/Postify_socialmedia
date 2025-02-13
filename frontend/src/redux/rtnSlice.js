import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
        commentNotification: [],
        messageNotification: [], // New state for message notifications
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like') {
                // Avoid duplicates by checking if the user already liked
                if (!state.likeNotification.some(item => item.userId === action.payload.userId)) {
                    state.likeNotification.push(action.payload);
                }
            } else if (action.payload.type === 'dislike') {
                // Remove the notification if the user disliked
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId);
            }
        },
        setCommentNotification: (state, action) => {
            if (action.payload.type === 'comment') {
                // Handle comment notifications similarly if needed
                state.commentNotification.push(action.payload);
            }
        },
        setMessageNotification: (state, action) => {
            if (action.payload.type === 'message') {
                // Handle message notifications
                state.messageNotification.push(action.payload);
            }
        },
    },
});

export const { setLikeNotification, setCommentNotification, setMessageNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
