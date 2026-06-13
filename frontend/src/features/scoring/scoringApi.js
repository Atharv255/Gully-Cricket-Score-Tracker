import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scoringApi = createApi({
  reducerPath: "scoringApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/scoring`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    recordBall: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/ball`,
        method: "POST",
        body,
      }),
    }),
    selectBatsman: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/batsman`,
        method: "POST",
        body,
      }),
    }),
    selectBowler: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/bowler`,
        method: "POST",
        body,
      }),
    }),
    undoLastBall: builder.mutation({
      query: (matchId) => ({
        url: `/${matchId}/undo`,
        method: "POST",
      }),
    }),
    endInnings: builder.mutation({
      query: (matchId) => ({
        url: `/${matchId}/end-innings`,
        method: "POST",
      }),
    }),
    startSecondInnings: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/start-second-innings`,
        method: "POST",
        body,
      }),
    }),
    endMatch: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/end-match`,
        method: "POST",
        body,
      }),
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