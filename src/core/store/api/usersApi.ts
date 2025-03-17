import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';

// API Service with Empty `baseQuery`
export const usersApi = createApi({
  reducerPath: 'userApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['users'],
  keepUnusedDataFor: 120, //  Keep unused data in cache for 120 seconds (2 mins)
  endpoints: builder => ({
    // GET User List
    getUsers: builder.query<{id: number; name: string}[], void>({
      query: () => ({
        url: 'users', // Specify full URL for GET
      }),
      providesTags: ['users'],
    }),

    // CREATE USER
    createUser: builder.mutation<{success: boolean}, {name: string}>({
      query: body => ({
        url: 'create', // Specify full URL for POST
        method: 'POST',
        body,
      }),
      invalidatesTags: ['users'], // Refetch after creating
    }),

    // UPDATE USER
    updateUser: builder.mutation<
      {success: boolean},
      {id: number; name: string}
    >({
      query: ({id, name}) => ({
        url: 'update', // Specify full URL for PUT
        method: 'PUT',
        body: {id, name},
      }),
      invalidatesTags: ['users'], // Refetch after updating
    }),
  }),
});

// Export hooks
export const {useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation} =
  usersApi;
