import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [],
  currentPlayer: null,
  loading: false,
  error: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    setPlayerLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPlayerError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPlayers,
  setCurrentPlayer,
  setPlayerLoading,
  setPlayerError,
} = playerSlice.actions;

export const selectPlayers = (state) => state.player.players;

export default playerSlice.reducer;