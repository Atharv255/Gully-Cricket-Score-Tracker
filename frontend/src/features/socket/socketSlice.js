import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  socketId: null,
  currentRoom: null,
  error: null,
  events: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload.connected;
      state.socketId = action.payload.socketId || null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.socketId = null;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    addSocketEvent: (state, action) => {
      state.events.unshift({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
      if (state.events.length > 50) {
        state.events = state.events.slice(0, 50);
      }
    },
    setSocketError: (state, action) => {
      state.error = action.payload;
    },
    clearSocketEvents: (state) => {
      state.events = [];
    },
  },
});

export const {
  setConnected,
  setDisconnected,
  setCurrentRoom,
  addSocketEvent,
  setSocketError,
  clearSocketEvents,
} = socketSlice.actions;

export const selectSocketConnected = (state) => state.socket.isConnected;
export const selectCurrentRoom = (state) => state.socket.currentRoom;

export default socketSlice.reducer;