import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
    name:'post',
    initialState:{
        posts:[],
        selectedPost:null,
    },
    reducers:{
        //actions
        setPosts:(state,action) => {
            state.posts = action.payload;
        },
        //action to to setpost from the getallpost hook inside this slice to view it in feed/posts
        setSelectedPost:(state,action) => {
            state.selectedPost = action.payload;
        }
        //action to set the selected post when we click on a post to view it in detail or modify it
    }
});
export const {setPosts, setSelectedPost} = postSlice.actions;
export default postSlice.reducer;