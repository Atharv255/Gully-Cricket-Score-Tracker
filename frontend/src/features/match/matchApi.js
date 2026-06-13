import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchApi = createApi({
  reducerPath: "matchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/matches`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Match"],
  endpoints: (builder) => ({
    getAllMatches: builder.query({
      query: (params = {}) => ({
        url: "/",
        params,
      }),
      providesTags: ["Match"],
    }),
    getMatchById: builder.query({
      query: (matchId) => `/${matchId}`,
      providesTags: (result, error, matchId) => [
        { type: "Match", id: matchId },
      ],
    }),
    createMatch: builder.mutation({
      query: (matchData) => ({
        url: "/",
        method: "POST",
        body: matchData,
      }),
      invalidatesTags: ["Match"],
    }),
    startMatch: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}/start`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Match"],
    }),
    updateMatch: builder.mutation({
      query: ({ matchId, ...body }) => ({
        url: `/${matchId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Match"],
    }),
    deleteMatch: builder.mutation({
      query: (matchId) => ({
        url: `/${matchId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Match"],
    }),
    getCurrentInnings: builder.query({
      query: (matchId) => `/${matchId}/innings/current`,
    }),
    getMatchByShareToken: builder.query({
      query: (token) => `/share/${token}`,
    }),
  }),
});

export const {
  useGetAllMatchesQuery,
  useGetMatchByIdQuery,
  useCreateMatchMutation,
  useStartMatchMutation,
  useUpdateMatchMutation,
  useDeleteMatchMutation,
  useGetCurrentInningsQuery,
  useGetMatchByShareTokenQuery,
} = matchApi;