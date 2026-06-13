import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
    setTeamLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTeamError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTeams, setCurrentTeam, setTeamLoading, setTeamError } =
  teamSlice.actions;

export const selectTeams = (state) => state.team.teams;
export const selectCurrentTeam = (state) => state.team.currentTeam;

export default teamSlice.reducer;