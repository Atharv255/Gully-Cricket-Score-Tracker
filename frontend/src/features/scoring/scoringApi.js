import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scoringApi = createApi({
  reducerPath: "scoringApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      import.meta.env.VITE_API_URL ||
      "https://gully-cricket-score-tracker.onrender.com/api"
    }/scoring`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Match", "Innings", "LiveScore"],
  endpoints: (builder) => ({
    recordBall: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/ball`,
        method: "POST",
        body,
      }),
      // Invalidate caches after recording ball
      invalidatesTags: (result, error, { matchId }) => [
        { type: "Match", id: matchId },
        { type: "LiveScore", id: matchId },
      ],
    }),
    selectBatsman: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/batsman`,
        method: "POST",
        body,
      }),
      // Invalidate match cache after selection so it refetches fresh data
      invalidatesTags: (result, error, { matchId }) => [
        { type: "Match", id: matchId },
        { type: "LiveScore", id: matchId },
      ],
    }),
    selectBowler: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/bowler`,
        method: "POST",
        body,
      }),
      // Invalidate match cache after selection
      invalidatesTags: (result, error, { matchId }) => [
        { type: "Match", id: matchId },
        { type: "LiveScore", id: matchId },
      ],
    }),
    undoLastBall: builder.mutation({
      query: (matchId) => ({
        url: `/${matchId}/undo`,
        method: "POST",
      }),
      invalidatesTags: (result, error, matchId) => [
        { type: "Match", id: matchId },
        { type: "LiveScore", id: matchId },
      ],
    }),
    endInnings: builder.mutation({
      query: (matchId) => ({
        url: `/${matchId}/end-innings`,
        method: "POST",
      }),
      invalidatesTags: (result, error, matchId) => [
        { type: "Match", id: matchId },
        { type: "LiveScore", id: matchId },
      ],
    }),
    startSecondInnings: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/start-second-innings`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { matchId }) => [
        { type: "Match", id: matchId },
        { type: "LiveScore", id: matchId },
      ],
    }),
    endMatch: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/end-match`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { matchId }) => [
        { type: "Match", id: matchId },
        { type: "LiveScore", id: matchId },
      ],
    }),
  }),
});

export const {
  useRecordBallMutation,
  useSelectBatsmanMutation,
  useSelectBowlerMutation,
  useUndoLastBallMutation,
  useEndInningsMutation,
  useStartSecondInningsMutation,
  useEndMatchMutation,
} = scoringApi;