import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateFollowers: (state, action) => {
      const loggedInUserId = action.payload;
      const followers = state.userProfile?.followers;

      if (!followers) return;

      const isFollowing = followers.includes(loggedInUserId);

      if (isFollowing) {
        state.userProfile.followers = followers.filter(
          (id) => id !== loggedInUserId
        );
      } else {
        state.userProfile.followers.push(loggedInUserId);
      }
    },
    logoutUser: (state) => {
      // Reset the user-related state to null when logging out
      state.user = null;
      state.suggestedUsers = [];
      state.userProfile = null;
      state.selectedUser = null;
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  logoutUser,
  updateFollowers, // Export the logout action
} = authSlice.actions;

export default authSlice.reducer;
