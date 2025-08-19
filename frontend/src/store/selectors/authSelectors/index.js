const selectAuth = (state) => {
  return state.auth;
};
const selectAuthSession = (state) => {
  return state.auth.session;
};
const selectAuthLoading = (state) => {
  return state.auth.loading;
};
const selectAuthError = (state) => {
  return state.auth.error;
};

const authSelectors = {
  selectAuth,
  selectAuthSession,
  selectAuthLoading,
  selectAuthError,
};

export default authSelectors;
