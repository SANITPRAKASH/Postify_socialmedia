import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    deleteCommentFromPost: (state, action) => {
      const { postId, commentId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments = state.posts[
          postIndex
        ].comments.filter((c) => c._id !== commentId);
      }

      // if selected post is open (like in modal), update that too
      if (state.selectedPost && state.selectedPost._id === postId) {
        state.selectedPost.comments = state.selectedPost.comments.filter(
          (c) => c._id !== commentId
        );
      }
    },
  },
});
export const { setPosts, setSelectedPost, deleteCommentFromPost  } = postSlice.actions;
export default postSlice.reducer;
