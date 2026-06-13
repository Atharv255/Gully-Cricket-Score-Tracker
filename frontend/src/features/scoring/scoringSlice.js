import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRecording: false,
  lastBall: null,
  requireNewBatsman: false,
  requireNewBowler: false,
  inningsComplete: false,
  isOverComplete: false,
  selectedWicketType: "",
  selectedExtraType: "",
  selectedRuns: null,
  error: null,
  pendingAction: null,
};

const scoringSlice = createSlice({
  name: "scoring",
  initialState,
  reducers: {
    setRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setLastBall: (state, action) => {
      state.lastBall = action.payload;
    },
    setRequireNewBatsman: (state, action) => {
      state.requireNewBatsman = action.payload;
    },
    setRequireNewBowler: (state, action) => {
      state.requireNewBowler = action.payload;
    },
    setInningsComplete: (state, action) => {
      state.inningsComplete = action.payload;
    },
    setIsOverComplete: (state, action) => {
      state.isOverComplete = action.payload;
    },
    setSelectedWicketType: (state, action) => {
      state.selectedWicketType = action.payload;
    },
    setSelectedExtraType: (state, action) => {
      state.selectedExtraType = action.payload;
    },
    setSelectedRuns: (state, action) => {
      state.selectedRuns = action.payload;
    },
    setScoringError: (state, action) => {
      state.error = action.payload;
    },
    setPendingAction: (state, action) => {
      state.pendingAction = action.payload;
    },
    resetScoringState: (state) => {
      state.isRecording = false;
      state.requireNewBatsman = false;
      state.requireNewBowler = false;
      state.inningsComplete = false;
      state.isOverComplete = false;
      state.selectedWicketType = "";
      state.selectedExtraType = "";
      state.selectedRuns = null;
      state.error = null;
      state.pendingAction = null;
    },
  },
});

export const {
  setRecording,
  setLastBall,
  setRequireNewBatsman,
  setRequireNewBowler,
  setInningsComplete,
  setIsOverComplete,
  setSelectedWicketType,
  setSelectedExtraType,
  setSelectedRuns,
  setScoringError,
  setPendingAction,
  resetScoringState,
} = scoringSlice.actions;

export const selectScoring = (state) => state.scoring;
export const selectRequireNewBatsman = (state) =>
  state.scoring.requireNewBatsman;
export const selectRequireNewBowler = (state) => state.scoring.requireNewBowler;
export const selectInningsComplete = (state) => state.scoring.inningsComplete;

export default scoringSlice.reducer;