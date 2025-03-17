import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import {APP_CONFIG} from '@core/config/config';
import {RootState} from '../store';
import {addLogin, fetchAllLogout} from '../slices/auth.slice';
import {KeyclockHttpService} from '@core/services/kyelock.service';
import {IToken} from '@core/interfaces/auth.model';

// Function to get the current access token
const refreshAccessToken = async (
  refreshToken: string,
): Promise<IToken | null> => {
  const response = await KeyclockHttpService.refreshToken(refreshToken);
  const data = response?.data;
  const token = data
    ? {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
      }
    : null;
  return token;
};

interface ExtraOptions {
  headers?: Record<string, string>; // Define headers as a record of string key-value pairs
}

// Create a custom baseQuery to handle token refresh
const customBaseQuery =
  (
    baseUrl: string,
  ): BaseQueryFn<
    string | FetchArgs, // Request URL or object
    unknown, // Response type (you can change this to match API response)
    FetchBaseQueryError, // Error type
    ExtraOptions, // Extra options type (optional)
    FetchBaseQueryMeta // Meta type (optional)
  > =>
  async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl,
      prepareHeaders: async (headers, {getState}) => {
        const state = getState() as RootState;
        const token = state?.persisted?.auth?.token?.accessToken;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');

        headers.set('Accept-Language', 'de-DE');

        // Add any additional headers from extraOptions
        if (extraOptions && extraOptions['headers']) {
          Object.entries(extraOptions.headers).forEach(([key, value]) => {
            headers.set(key, value as string); // Set custom headers
          });
        }

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
      const refreshToken = state.persisted.auth.token?.refreshToken;
      const newToken = await refreshAccessToken(refreshToken);
      if (newToken) {
        api.dispatch(addLogin(newToken));
        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error('Token refresh failed. Logging out...');
        api.dispatch(fetchAllLogout()); // Dispatch logout action
      }
    }

    return result;
  };

// Export different base queries
export const ApiServiceBaseQuery = customBaseQuery(APP_CONFIG.baseUrl);
// export const identityBaseQuery = customBaseQuery(APP_CONFIG.identityUrl);
