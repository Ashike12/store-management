import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import { APP_CONFIG } from '@core/config/config';
import { persistor, RootState } from '../store';
import { IAuthResponse } from '@core/interfaces/api/IAuthResponse';
import { addLogin, removeLogin } from '../slices/auth.slice';
import { useNavigate } from 'react-router-dom';
import { localStorageService, storagePath } from '@core/services/localStorage.service';
import { set } from 'lodash';

// Function to refresh the token
const refreshAccessToken = async (refreshToken: string): Promise<IAuthResponse | null> => {
  try {
    const response = await fetch(`${APP_CONFIG.businessUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ RefreshToken: refreshToken }),
    });
    if (!response.ok) {
      throw new Error("Failed to refresh tokensss");
    }

    const data = await response.json();
    const updatedTokenData = data as IAuthResponse;
    updatedTokenData.refresh_token = refreshToken; // Preserve the refresh token
    localStorageService.setToken(updatedTokenData.login_token, updatedTokenData.refresh_token);
    return updatedTokenData;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // removeAuthCookieToken(); // Clear tokens if refresh fails
    return null;
  }
};

// Create a custom baseQuery to handle token refresh
const customBaseQuery =
  (
    baseUrl: string,
  ): BaseQueryFn<
    string | FetchArgs, // Request URL or object
    unknown, // Response type (you can change this to match API response)
    FetchBaseQueryError, // Error type
    object, // Extra options type (optional)
    FetchBaseQueryMeta // Meta type (optional)
  > =>
    async (args, api, extraOptions) => {
      const baseQuery = fetchBaseQuery({
        baseUrl,
        prepareHeaders: async (headers) => {
          const token = localStorageService.getItemLocalStore(storagePath.AccessToken);
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');

          return headers;
        },
      });

      let result = await baseQuery(args, api, extraOptions);
      // If Unauthorized (401), attempt to refresh token

      if (
        result.error &&
        (result.error?.status === 401 ||
          (result.error as any)?.originalStatus === 401)
      ) {
        console.warn('Unauthorized! Attempting token refresh...');
        const state = api.getState() as RootState;
        const refreshToken = localStorageService.getItemLocalStore(storagePath.RefreshToken);
        const newToken = await refreshAccessToken(refreshToken);
        if (newToken) {
          api.dispatch(addLogin(newToken));
          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.error('Token refresh failed. Logging out...');
          api.dispatch(removeLogin());
          // persistor.purge(); // Clear all state
          setTimeout(() => {
            window.location.href = '/login';
          }, 300);
          // api.dispatch(fetchAllLogout()); // Dispatch logout action
        }
      }

      return result;
    };

// Export different base queries
export const ApiServiceBaseQuery = customBaseQuery(APP_CONFIG.baseUrl);
// export const identityBaseQuery = customBaseQuery(APP_CONFIG.identityUrl);
