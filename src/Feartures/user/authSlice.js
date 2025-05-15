import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem("accessToken") || null, // Check if accessToken exists in localStorage
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  // authToken: localStorage.getItem("authToken") || null,
  avatar: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Save tokens and user in localStorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },

    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      // state.authToken = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // localStorage.removeItem("authToken");
    },

    setUser(state, action) {
      state.user = action.payload.user;
    },

    updateAvatar(state, action) {
      state.avatar = action.payload;
    },
  },
});

export const { login, logout, setGoogleUser, updateAvatar, setUser } =
  authSlice.actions;
export default authSlice;
