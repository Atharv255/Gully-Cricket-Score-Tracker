import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const liveApi = createApi({
  reducerPath: "liveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
  }),
  tagTypes: ["Live"],
  endpoints: (builder) => ({
    getLiveMatches: builder.query({
      query: () => "/live/matches",
      providesTags: ["Live"],
    }),
    getLiveScore: builder.query({
      query: (matchId) => `/live/${matchId}/score`,
      providesTags: (result, error, matchId) => [
        { type: "Live", id: matchId },
      ],
    }),
    getUpcomingMatches: builder.query({
      query: () => "/live/upcoming",
    }),
    getCompletedMatches: builder.query({
      query: (params = {}) => ({ url: "/live/completed", params }),
    }),
    getMatchCommentary: builder.query({
      query: ({ matchId, page = 1, limit = 20 }) =>
        `/commentary/match/${matchId}?page=${page}&limit=${limit}`,
    }),
  }),
});

export const {
  useGetLiveMatchesQuery,
  useGetLiveScoreQuery,
  useGetUpcomingMatchesQuery,
  useGetCompletedMatchesQuery,
  useGetMatchCommentaryQuery,
} = liveApi;