import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IAuthResponse} from '@core/interfaces/api/IAuthResponse';
import { ICreateUserPayload, IUser, IUserResponse } from '@core/interfaces/api/IUser';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['user'],
  endpoints: builder => ({
    createUser: builder.mutation<IAuthResponse, {payload: ICreateUserPayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/user/createCustomer`,
        method: 'POST',
        body: mutation.payload,
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('user-create-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    updateUser: builder.mutation<IAuthResponse, {payload: IUser}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/user/update`,
        method: 'POST',
        body: mutation.payload,
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('user-create-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    deleteUser: builder.mutation<IAuthResponse, {id: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/user/delete`,
        method: 'POST',
        body: {
          ItemId: mutation.id,
        },
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('user-delete-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    getUser: builder.query<IUserResponse, {pageNumber: number, pageSize: number, itemId: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/user/get?page=${mutation.pageNumber}&size=${mutation.pageSize}`,
        method: 'GET',
      }),
      providesTags: (_result, _error) => [{type: 'user'}], // Cache by ID
      transformResponse: (response: IUserResponse) => {
        return response;
      },
    })
  }),
});

export const {useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation, useGetUserQuery} = userApi;
