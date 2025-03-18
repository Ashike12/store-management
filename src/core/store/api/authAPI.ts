import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IAuthResponse} from '@core/interfaces/api/IAuthResponse';
import { addLogin } from '../slices/auth.slice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['auth'],
  endpoints: builder => ({
    getAuthData: builder.mutation<IAuthResponse, {email: string; password: string}>({
      query: (credentials) => ({
        url: `${APP_CONFIG.businessUrl}/auth/token`,
        method: 'POST',
        body: {
          Email: credentials.email,
          Password: credentials.password,
          GrantType: 'password',
        },
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          dispatch(addLogin(data));
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
  }),
});

export const {useGetAuthDataMutation} = authApi;
