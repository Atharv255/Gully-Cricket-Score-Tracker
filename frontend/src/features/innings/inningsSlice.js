import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentInnings: null,
  previousInnings: null,
  scorecard: null,
  overSummary: [],
  loading: false,
  error: null,
};

const inningsSlice = createSlice({
  name: "innings",
  initialState,
  reducers: {
    setCurrentInnings: (state, action) => {
      state.currentInnings = action.payload;
    },
    setPreviousInnings: (state, action) => {
      state.previousInnings = action.payload;
    },
    updateInningsData: (state, action) => {
      if (state.currentInnings) {
        state.currentInnings = {
          ...state.currentInnings,
          ...action.payload,
        };
      }
    },
    setScorecard: (state, action) => {
      state.scorecard = action.payload;
    },
    setOverSummary: (state, action) => {
      state.overSummary = action.payload;
    },
    setInningsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInningsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentInnings,
  setPreviousInnings,
  updateInningsData,
  setScorecard,
  setOverSummary,
  setInningsLoading,
  setInningsError,
} = inningsSlice.actions;

export const selectCurrentInnings = (state) => state.innings.currentInnings;
export const selectPreviousInnings = (state) => state.innings.previousInnings;

export default inningsSlice.reducer;