import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inningsApi = createApi({
  reducerPath: "inningsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/innings`,
  }),
  endpoints: (builder) => ({
    getInningsById: builder.query({
      query: (inningsId) => `/${inningsId}`,
    }),
    getInningsBalls: builder.query({
      query: ({ inningsId, page = 1, limit = 30 }) =>
        `/${inningsId}/balls?page=${page}&limit=${limit}`,
    }),
    getOverSummary: builder.query({
      query: (inningsId) => `/${inningsId}/overs`,
    }),
    getScorecard: builder.query({
      query: (inningsId) => `/${inningsId}/scorecard`,
    }),
  }),
});

export const {
  useGetInningsByIdQuery,
  useGetInningsBallsQuery,
  useGetOverSummaryQuery,
  useGetScorecardQuery,
} = inningsApi;