import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.customer;
      state.status = "authenticated";
      state.error = null;
    },

    clearCredentials: (state) => {
      state.user = null;
      state.status = "unauthenticated";
      state.error = null;
    },

    setAuthLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },

    setAuthError: (state, action) => {
      state.status = "unauthenticated";
      state.error = action.payload;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
