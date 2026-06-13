import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  liveMatches: [],
  upcomingMatches: [],
  completedMatches: [],
  currentLiveScore: null,
  isConnected: false,
  lastUpdated: null,
  loading: false,
  error: null,
};

const liveSlice = createSlice({
  name: "live",
  initialState,
  reducers: {
    setLiveMatches: (state, action) => {
      state.liveMatches = action.payload;
    },
    setUpcomingMatches: (state, action) => {
      state.upcomingMatches = action.payload;
    },
    setCompletedMatches: (state, action) => {
      state.completedMatches = action.payload;
    },
    setCurrentLiveScore: (state, action) => {
      state.currentLiveScore = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateLiveScore: (state, action) => {
      if (state.currentLiveScore) {
        state.currentLiveScore = {
          ...state.currentLiveScore,
          ...action.payload,
        };
        state.lastUpdated = new Date().toISOString();
      }
    },
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setLiveLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLiveError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLiveMatches,
  setUpcomingMatches,
  setCompletedMatches,
  setCurrentLiveScore,
  updateLiveScore,
  setSocketConnected,
  setLiveLoading,
  setLiveError,
} = liveSlice.actions;

export const selectLiveMatches = (state) => state.live.liveMatches;
export const selectCurrentLiveScore = (state) => state.live.currentLiveScore;
export const selectIsConnected = (state) => state.live.isConnected;
export const selectLastUpdated = (state) => state.live.lastUpdated;

export default liveSlice.reducer;