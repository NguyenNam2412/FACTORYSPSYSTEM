const selectFetchData = (state) => {
  return state.fetchData.data
};
const selectFetchLoading = (state) => {
  return  state.fetchData.loading
};
const selectFetchError = (state) => {
  return state.fetchData.error
};

const selectFetch = {
  selectFetchData,
  selectFetchLoading,
  selectFetchError
}

export default selectFetch;
