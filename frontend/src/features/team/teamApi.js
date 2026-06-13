import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/teams`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getAllTeams: builder.query({
      query: (params = {}) => ({ url: "/", params }),
      providesTags: ["Team"],
    }),
    getTeamById: builder.query({
      query: (teamId) => `/${teamId}`,
      providesTags: (result, error, teamId) => [{ type: "Team", id: teamId }],
    }),
    createTeam: builder.mutation({
      query: (teamData) => ({
        url: "/",
        method: "POST",
        body: teamData,
      }),
      invalidatesTags: ["Team"],
    }),
    updateTeam: builder.mutation({
      query: ({ teamId, ...body }) => ({
        url: `/${teamId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Team"],
    }),
    deleteTeam: builder.mutation({
      query: (teamId) => ({
        url: `/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetAllTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApi;