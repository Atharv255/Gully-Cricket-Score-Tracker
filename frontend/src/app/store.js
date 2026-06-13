import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import matchReducer from "../features/match/matchSlice";
import scoringReducer from "../features/scoring/scoringSlice";
import liveReducer from "../features/live/liveSlice";
import socketReducer from "../features/socket/socketSlice";
import teamReducer from "../features/team/teamSlice";
import playerReducer from "../features/player/playerSlice";
import inningsReducer from "../features/innings/inningsSlice";
import { authApi } from "../features/auth/authApi";
import { matchApi } from "../features/match/matchApi";
import { teamApi } from "../features/team/teamApi";
import { playerApi } from "../features/player/playerApi";
import { scoringApi } from "../features/scoring/scoringApi";
import { liveApi } from "../features/live/liveApi";
import { inningsApi } from "../features/innings/inningsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    match: matchReducer,
    scoring: scoringReducer,
    live: liveReducer,
    socket: socketReducer,
    team: teamReducer,
    player: playerReducer,
    innings: inningsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [matchApi.reducerPath]: matchApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [playerApi.reducerPath]: playerApi.reducer,
    [scoringApi.reducerPath]: scoringApi.reducer,
    [liveApi.reducerPath]: liveApi.reducer,
    [inningsApi.reducerPath]: inningsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.instance"],
      },
    }).concat(
      authApi.middleware,
      matchApi.middleware,
      teamApi.middleware,
      playerApi.middleware,
      scoringApi.middleware,
      liveApi.middleware,
      inningsApi.middleware
    ),
});

setupListeners(store.dispatch);