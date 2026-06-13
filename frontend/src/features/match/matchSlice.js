import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matches: [],
  currentMatch: null,
  loading: false,
  error: null,
  filters: {
    status: "",
    page: 1,
    limit: 10,
  },
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
    setCurrentMatch: (state, action) => {
      state.currentMatch = action.payload;
    },
    updateCurrentMatch: (state, action) => {
      if (state.currentMatch) {
        state.currentMatch = { ...state.currentMatch, ...action.payload };
      }
    },
    setMatchLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMatchError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearMatchError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addMatch: (state, action) => {
      state.matches.unshift(action.payload);
    },
    removeMatch: (state, action) => {
      state.matches = state.matches.filter(
        (m) => m._id !== action.payload
      );
    },
  },
});

export const {
  setMatches,
  setCurrentMatch,
  updateCurrentMatch,
  setMatchLoading,
  setMatchError,
  clearMatchError,
  setFilters,
  addMatch,
  removeMatch,
} = matchSlice.actions;

export const selectMatches = (state) => state.match.matches;
export const selectCurrentMatch = (state) => state.match.currentMatch;
export const selectMatchLoading = (state) => state.match.loading;

export default matchSlice.reducer;