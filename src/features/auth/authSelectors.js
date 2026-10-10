export const selectAuth = (state) => state.auth;

export const selectCurrentUser = (state) => state.auth.user;

export const selectAuthStatus = (state) => state.auth.status;

export const selectAuthError = (state) => state.auth.error;

export const selectIsAuthenticated = (state) =>
  state.auth.status === "authenticated";

export const selectIsAuthLoading = (state) => state.auth.status === "loading";
