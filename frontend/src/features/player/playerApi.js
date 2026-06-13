import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const playerApi = createApi({
  reducerPath: "playerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/players`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Player"],
  endpoints: (builder) => ({
    getAllPlayers: builder.query({
      query: (params = {}) => ({ url: "/", params }),
      providesTags: ["Player"],
    }),
    getPlayerById: builder.query({
      query: (playerId) => `/${playerId}`,
    }),
    createPlayer: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", body: data }),
      invalidatesTags: ["Player"],
    }),
    updatePlayer: builder.mutation({
      query: ({ playerId, ...body }) => ({
        url: `/${playerId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Player"],
    }),
    deletePlayer: builder.mutation({
      query: (playerId) => ({ url: `/${playerId}`, method: "DELETE" }),
      invalidatesTags: ["Player"],
    }),
  }),
});

export const {
  useGetAllPlayersQuery,
  useGetPlayerByIdQuery,
  useCreatePlayerMutation,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
} = playerApi;